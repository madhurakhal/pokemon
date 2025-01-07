import { Component, inject } from '@angular/core';
import { BehaviorSubject, combineLatest, switchMap } from 'rxjs';
import { OverviewPokemonDto } from '../../models/pokemon';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemons',
  templateUrl: './pokemons.component.html',
  styleUrl: './pokemons.component.scss',
  standalone: false
})
export class PokemonsComponent {
  page = 1;
  private paginationSubject = new BehaviorSubject<{
    itemsPerPage: number,
    page: number
  }>({
    itemsPerPage: 10,
    page: 0
  });
  paginationSubjectAction$ = this.paginationSubject.asObservable();

  private searchSubject = new BehaviorSubject<string>('');
  searchSubjectAction$ = this.searchSubject.asObservable();

  private pokemonTypeSubject = new BehaviorSubject<string>('');
  pokemonTypeSubjectAction$ = this.pokemonTypeSubject.asObservable();


  private readonly pokemonService = inject(PokemonService)
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
    console.log("viewing", pokemon)
  }

  handlePokemonTypeChange(pokemonType: string) {
    console.log(pokemonType)
  }

  handleSearchChange(search: string) {
    console.log(search)
  }

  handlePaginationChange(paginationInfo: { page: number, itemsPerPage: number }) {
    this.paginationSubject.next(paginationInfo)
  }
}
