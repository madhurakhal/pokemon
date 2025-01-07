import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  combineLatest,
  EMPTY,
  filter,
  map,
  switchMap,
  tap
} from 'rxjs';
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

  isLoading = false;
  errorMessage: string = '';

  pokemonDetails$ = combineLatest([
    this.activatedRoute.params.pipe(map((params) => +params['id'])),
  ])
    .pipe(
      filter((val) => !Number.isNaN(val[0])),
      tap(() => (this.isLoading = true)),
      switchMap((ids) => {
        return this.pokemonService
          .pokemonById(ids[0])
          .pipe(tap(() => (this.isLoading = false)));
      })
    )
    .pipe(
      catchError((err) => {
        this.isLoading = false;
        this.errorMessage = err;
        return EMPTY;
      })
    );
  handleBackBtn() {
    this.router.navigate(['pokemons']);
  }
}
