import { Component, inject } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemons',
  templateUrl: './pokemons.component.html',
  styleUrl: './pokemons.component.scss',
  standalone: false
})
export class PokemonsComponent {

  private readonly pokemonService = inject(PokemonService)
  pokemons$ = this.pokemonService.pokemonsWithDetils();

}
