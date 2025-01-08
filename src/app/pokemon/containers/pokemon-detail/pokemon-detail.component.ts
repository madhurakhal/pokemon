import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
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

  pokemonDetails$ = combineLatest([
    this.activatedRoute.params.pipe(map((params) => +params['id'])),
  ])
    .pipe(
      tap(() => this.loadingSubject.next(true)),
      switchMap((ids) => {
        return this.pokemonService
          .pokemonById(ids[0])
          .pipe(tap(() => this.loadingSubject.next(false)));
      })
    )
    .pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError((err) => {
        this.loadingSubject.next(false);
        this.errorSubject.next(err);
        return EMPTY;
      })
    );

  handleBackBtn() {
    this.router.navigate(['pokemons']);
  }
}
