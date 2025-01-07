import { Component, inject } from '@angular/core';
import { BehaviorSubject, combineLatest, switchMap } from 'rxjs';
import { OverviewPokemonDto } from '../../models/pokemon';
import { PokemonService } from '../../services/pokemon.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pokemons',
  templateUrl: './pokemons.component.html',
  styleUrl: './pokemons.component.scss',
  standalone: false
})
export class PokemonsComponent {
  private readonly pokemonService = inject(PokemonService)
  private router = inject(Router);
  page = 1;
  private paginationSubject = new BehaviorSubject<{
    itemsPerPage: number,
    page: number
  }>({
    itemsPerPage: 10,
    page: 1
  });
  paginationSubjectAction$ = this.paginationSubject.asObservable();

  private searchSubject = new BehaviorSubject<string>('');
  searchSubjectAction$ = this.searchSubject.asObservable();

  private pokemonTypeSubject = new BehaviorSubject<string>('');
  pokemonTypeSubjectAction$ = this.pokemonTypeSubject.asObservable();


  pokemons$ = combineLatest([
    this.paginationSubjectAction$,
    this.searchSubjectAction$,
    this.pokemonTypeSubjectAction$
  ]).pipe(
    switchMap(([paginationInfo, searchName, pokeMontype]) => {
      console.log(paginationInfo, searchName, pokeMontype)
      return this.pokemonService.pokemonsWithDetils()
    })
  )

  pokemonTypes$ = this.pokemonService.pokemonTypes();
  
  viewDetail(pokemon: OverviewPokemonDto) {
   this.router.navigate(["pokemons/", pokemon.id])
  }

  handlePokemonTypeChange(pokemonType: string) {
    this.pokemonTypeSubject.next(pokemonType)
  }

  handleSearchChange(search: string) {
    this.searchSubject.next(search)
  }

  handlePaginationChange(paginationInfo: { page: number, itemsPerPage: number }) {
    this.paginationSubject.next(paginationInfo)
  }
}
