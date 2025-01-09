import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
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

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string>('');
  error$ = this.errorSubject.asObservable();

  pokemonDetails$ = this.activatedRoute.params.pipe(
    map(params => +params['id']),
    tap(() => {
      this.loadingSubject.next(true);
      this.errorSubject.next('');
    }),
    switchMap(id => this.pokemonService.pokemonById(id).pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError((error: string) => {
        this.loadingSubject.next(false);
        this.errorSubject.next(error ?? 'An error occurred while fetching Pokemon details');
        return EMPTY;
      })
    ))
  );

  handleBackBtn(): void {
    this.router.navigate(['pokemons']);
  }
}
