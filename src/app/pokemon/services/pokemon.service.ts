import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  catchError,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import {
  OverviewPokemonDto,
  Pokemon,
  PokemonDetailsDto,
} from '../models/pokemon';
import { PokemonTypesResponse } from '../models/responses/pokemon-types.response';
import { PokemonsRespone } from '../models/responses/pokemons.response';
import { PokemonQuery } from '../models/queries/pokemon.query';
import { APICONFIG } from '../../api-config';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiConfig = inject(APICONFIG);

  private _pokemonTypes: string[] = [];
  private _pokemonCache: Map<string, Pokemon> = new Map();

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control':
        'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
    }),
  };

  pokemons(queryParams: PokemonQuery): Observable<PokemonsRespone> {
    return this.httpClient.get<PokemonsRespone>(
      `${this.apiConfig.apiBaseUrl}/pokemon`,
      Object.assign({}, this.httpOptions, {
        params: { ...queryParams },
      })
    );
  }

  pokemonById(pokemonId: number) {
    return this.httpClient
      .get<PokemonDetailsDto>(`${this.apiConfig.apiBaseUrl}/pokemon/${pokemonId}`)
      .pipe(catchError(this.handleError));
  }

  pokemonsWithDetils(queryParams: PokemonQuery): Observable<{
    count: number;
    items: OverviewPokemonDto[];
  }> {
    return this.pokemons(queryParams).pipe(
      switchMap((response) =>
        forkJoin(
          response.results.map((item) =>
            this.pokemonByUrl(item.url).pipe(
              map((pokemonDetail: Pokemon) => ({
                id: pokemonDetail.id,
                name: pokemonDetail.name,
                types: pokemonDetail.types,
                previewUrl: pokemonDetail.sprites.front_default,
              }))
            )
          )
        ).pipe(
          map((items) => ({
            count: response.count,
            items,
          })),
          catchError(this.handleError)
        )
      )
    );
  }

  pokemonTypes() {
    if (this._pokemonTypes.length) {
      return of([...this._pokemonTypes]);
    }
    return this.httpClient
      .get<PokemonTypesResponse>(`${this.apiConfig.apiBaseUrl}/type/`)
      .pipe(
        map((response) => {
          return response.results.map((x) => x.name);
        }),
        tap((data) => {
          this._pokemonTypes = [...data];
        })
      );
  }

  pokemonByType(pokemonType: string) {
    if (this._pokemonCache.get(pokemonType)) {
      return of(this._pokemonCache.get(pokemonType));
    }
    return this.httpClient
      .get<string[]>(`${this.apiConfig.apiBaseUrl}/type/${pokemonType}`)
      .pipe(
        tap((data) => {
          this._pokemonTypes = [...data];
        })
      );
  }

  private pokemonByUrl(url: string): Observable<Pokemon> {
    return this.httpClient.get<Pokemon>(
      url,
      Object.assign({}, this.httpOptions)
    );
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMessage: string;
    if (err.error) {
      errorMessage = err.error;
    } else {
      errorMessage = `Something went wrong`;
    }
    return throwError(() => errorMessage);
  }
}
