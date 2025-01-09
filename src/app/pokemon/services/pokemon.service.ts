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
import { PokemonTypeResponse } from '../models/pokemon-type.data';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiConfig = inject(APICONFIG);

  private _pokemonTypes: string[] = [];
  private _pokemonTypeCache: Map<string, PokemonTypeResponse> = new Map();
  private _pokemonsCache: Map<string, Pokemon> = new Map();

  private readonly httpOptions = {
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
    const url = `${this.apiConfig.apiBaseUrl}/pokemon/${pokemonId}`;
    return this.pokemonByUrl(url)
      .pipe(
        catchError(this.handleError)
      )
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
        }),
        catchError(this.handleError)
      );
  }

  pokemonByType(pokemonTypeQuery: PokemonQuery): Observable<{
    count: number;
    items: OverviewPokemonDto[];
  }> {
    return this.httpClient
      .get<PokemonTypeResponse>(`${this.apiConfig.apiBaseUrl}/type/${pokemonTypeQuery.type}`, Object.assign({}, this.httpOptions, {
        params: { ...pokemonTypeQuery },
      }))
      .pipe(
        switchMap((response) =>
          forkJoin(
            response.pokemon.map((data) =>
              this.pokemonByUrl(data.pokemon.url).pipe(
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
              count: response.pokemon.length,
              items: items.slice(pokemonTypeQuery.offset, pokemonTypeQuery.offset + pokemonTypeQuery.limit),
            })),
            catchError(this.handleError)
          )
        )
      );
  }

  private pokemonByUrl(url: string): Observable<Pokemon> {
    if (this._pokemonsCache.has(url)) {
      return of(this._pokemonsCache.get(url)!);
    }
    return this.httpClient.get<Pokemon>(
      url,
      Object.assign({}, this.httpOptions)
    ).pipe(
      tap(pokemon => this._pokemonsCache.set(url, pokemon)),
      catchError(this.handleError)
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
