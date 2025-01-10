import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, combineLatest, debounceTime, EMPTY, map, switchMap, tap } from 'rxjs';
import { PaginationInfo } from '../../models/pagination-info';
import { OverviewPokemonDto } from '../../models/pokemon';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemons',
  templateUrl: './pokemons.component.html',
  styleUrl: './pokemons.component.scss',
  standalone: false,
})
export class PokemonsComponent {
  private readonly pokemonService = inject(PokemonService);
  private readonly router = inject(Router);

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string>('');
  private readonly paginationSubject = new BehaviorSubject<PaginationInfo>({
    itemsPerPage: 10,
    page: 1,
  });

  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();
  readonly itemsPerPage = 10;

  paginationSubjectAction$ = this.paginationSubject.asObservable();
  private searchSubject = new BehaviorSubject<string>('');
  searchSubjectAction$ = this.searchSubject.asObservable();

  private pokemonTypeSubject = new BehaviorSubject<string>('');
  pokemonTypeSubjectAction$ = this.pokemonTypeSubject.asObservable();

  readonly pokemonTypes$ = this.pokemonService.pokemonTypes();
  page = 1;
  pokemons$ = combineLatest([
    this.paginationSubjectAction$,
    this.pokemonTypeSubjectAction$,
    this.searchSubjectAction$
  ]).pipe(
    debounceTime(100),
    tap(() => {
      this.loadingSubject.next(true)
      this.errorSubject.next('')
    }),
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


  viewDetail(pokemon: OverviewPokemonDto): void {
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
    return paginationInfo.page === 1
      ? 0
      : (paginationInfo.page - 1) * paginationInfo.itemsPerPage + 1;
  }

  private handleError(error: string) {
    this.loadingSubject.next(false);
    this.errorSubject.next(error);
    return EMPTY;
  };

}
