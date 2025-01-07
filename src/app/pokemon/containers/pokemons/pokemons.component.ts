import { Component, inject } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, debounceTime, EMPTY, pipe, switchMap, tap } from 'rxjs';
import { OverviewPokemonDto } from '../../models/pokemon';
import { PokemonService } from '../../services/pokemon.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pokemons',
  templateUrl: './pokemons.component.html',
  styleUrl: './pokemons.component.scss',
  standalone: false,
})
export class PokemonsComponent {
  private readonly pokemonService = inject(PokemonService);
  private router = inject(Router);
  loading = false;
  errorMessage = '';
  page = 1;
  private paginationSubject = new BehaviorSubject<{
    itemsPerPage: number;
    page: number;
  }>({
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
    this.searchSubjectAction$,
    this.pokemonTypeSubjectAction$,
  ]).pipe(
    debounceTime(100),
    tap(() => this.loading = true),
    switchMap(([paginationInfo, searchName, pokeMontype]) => {
      console.log(paginationInfo, searchName, pokeMontype);
      return this.pokemonService.pokemonsWithDetils({
        offset: paginationInfo.page == 1 ? 0 : (paginationInfo.page - 1) * paginationInfo.itemsPerPage + 1,
        limit: paginationInfo.itemsPerPage
      }).pipe(
        tap(() => this.loading = false)
      );
    })
  ).pipe(
    catchError((errorMsg) => {
      this.loading = false;
      this.errorMessage = errorMsg;
      return EMPTY;
    })
  );

  pokemonTypes$ = this.pokemonService.pokemonTypes();

  viewDetail(pokemon: OverviewPokemonDto) {
    this.router.navigate(['pokemons/', pokemon.id]);
  }

  handlePokemonTypeChange(pokemonType: string) {
    this.pokemonTypeSubject.next(pokemonType);
  }

  handleSearchChange(search: string) {
    this.searchSubject.next(search);
  }

  handlePaginationChange(paginationInfo: {
    page: number;
    itemsPerPage: number;
  }) {
    this.paginationSubject.next(paginationInfo);
  }
}
