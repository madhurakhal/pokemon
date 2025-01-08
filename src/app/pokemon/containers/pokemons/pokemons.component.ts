import { Component, inject } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, debounceTime, EMPTY, filter, map, pipe, switchMap, tap } from 'rxjs';
import { OverviewPokemonDto } from '../../models/pokemon';
import { PokemonService } from '../../services/pokemon.service';
import { Router } from '@angular/router';
import { PaginationInfo } from '../../models/pagination-info';

@Component({
  selector: 'app-pokemons',
  templateUrl: './pokemons.component.html',
  styleUrl: './pokemons.component.scss',
  standalone: false,
})
export class PokemonsComponent {
  private readonly pokemonService = inject(PokemonService);
  private router = inject(Router);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  itemsPerPage = 10;

  private errorSubject = new BehaviorSubject<string>('');
  error$ = this.errorSubject.asObservable();

  page = 1;
  private paginationSubject = new BehaviorSubject<PaginationInfo>({
    itemsPerPage: 10,
    page: 1,
  });
  paginationSubjectAction$ = this.paginationSubject.asObservable();

  private searchSubject = new BehaviorSubject<string>('');
  searchSubjectAction$ = this.searchSubject.asObservable();

  private pokemonTypeSubject = new BehaviorSubject<string>('');
  pokemonTypeSubjectAction$ = this.pokemonTypeSubject.asObservable();

  pokemons$ = combineLatest([
    this.paginationSubjectAction$,
    this.pokemonTypeSubjectAction$,
    this.searchSubjectAction$
  ]).pipe(
    debounceTime(100),
    tap(() => this.loadingSubject.next(true)),
    switchMap(([paginationInfo, pokemonType, search]) => {
      const params = {
        offset: this.calculateOffset(paginationInfo),
        limit: paginationInfo.itemsPerPage
      };
      const request$ = pokemonType
        ? this.pokemonService.pokemonByType({ ...params, type: pokemonType })
        : this.pokemonService.pokemonsWithDetils(params)
      return request$.pipe(
        map((value) => ({
          ...value,
          items: value.items.filter(pokemon => !search || pokemon.name.includes(search))
        })),
        tap(() => this.loadingSubject.next(false)),
        catchError(this.handleError)
      );
    })
  );

  pokemonTypes$ = this.pokemonService.pokemonTypes();

  viewDetail(pokemon: OverviewPokemonDto) {
    this.router.navigate(['pokemons/', pokemon.id]);
  }

  handlePokemonTypeChange(pokemonType: string) {
    this.paginationSubject.next({ page: 1, itemsPerPage: this.itemsPerPage });
    this.pokemonTypeSubject.next(pokemonType);
  }

  handleSearchChange(search: string) {
    this.searchSubject.next(search);
  }

  handlePaginationChange(paginationInfo: PaginationInfo) {
    this.paginationSubject.next(paginationInfo);
  }

  private calculateOffset(paginationInfo: PaginationInfo): number {
    return paginationInfo.page === 1 ? 0 : (paginationInfo.page - 1) * paginationInfo.itemsPerPage + 1;
  }
  private handleError(error: string) {
    this.loadingSubject.next(false);
    this.errorSubject.next(error);
    return EMPTY;
  };
}
