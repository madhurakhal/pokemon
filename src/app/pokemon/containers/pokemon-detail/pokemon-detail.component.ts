import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, filter, map, switchMap } from 'rxjs';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.scss',
  standalone: false,
})
export class PokemonDetailComponent {
  private pokemonService = inject(PokemonService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  pokemonDetails$ = combineLatest([
    this.activatedRoute.params.pipe(map((params) => +params['id'])),
  ]).pipe(
    filter((val) => !Number.isNaN(val[0])),
    switchMap(ids => {
      return this.pokemonService.pokemonById(ids[0])
    })
  )
  handleBackBtn() {
    this.router.navigate(["pokemons"])
  }
}
