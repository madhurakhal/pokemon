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
  retry
} from 'rxjs';
import { APICONFIG } from '../../api-config';
import {
  OverviewPokemonDto,
  Pokemon,
} from '../models/pokemon';
import { PokemonTypeResponse } from '../models/pokemon-type.data';
import { PokemonQuery } from '../models/queries/pokemon.query';
import { PokemonTypesResponse } from '../models/responses/pokemon-types.response';
import { PokemonsResponse } from '../models/responses/pokemons.response';




const API_ENDPOINTS = {
  POKEMON: 'pokemon',
  TYPE: 'type',
} as const;

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiConfig = inject(APICONFIG);

  private _pokemonTypes: string[] = [];
  private _pokemonsCache: Map<string, Pokemon> = new Map();

  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control':
        'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
    }),
  };

  pokemons(queryParams: PokemonQuery): Observable<PokemonsResponse> {
    return this.httpClient
      .get<PokemonsResponse>(
        `${this.apiConfig.apiBaseUrl}/${API_ENDPOINTS.POKEMON}`,
        this.getHttpOptions(queryParams)
      )
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  pokemonById(pokemonId: number): Observable<Pokemon> {
    const url = `${this.apiConfig.apiBaseUrl}/${API_ENDPOINTS.POKEMON}/${pokemonId}`;
    return this.pokemonByUrl(url);
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
              map(this.transformToPokemonOverview)
            )
          )
        ).pipe(
          map((items) => ({
            count: response.count,
            items,
          }))
        )
      ),
      catchError(this.handleError)
    );
  }

  pokemonTypes(): Observable<string[]> {
    if (this._pokemonTypes.length) {
      return of([...this._pokemonTypes]);
    }

    return this.httpClient
      .get<PokemonTypesResponse>(`${this.apiConfig.apiBaseUrl}/${API_ENDPOINTS.TYPE}`)
      .pipe(
        retry(3),
        map((response) => response.results.map((x) => x.name)),
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
      .get<PokemonTypeResponse>(
        `${this.apiConfig.apiBaseUrl}/${API_ENDPOINTS.TYPE}/${pokemonTypeQuery.type}`,
        this.getHttpOptions(pokemonTypeQuery)
      )
      .pipe(
        retry(3),
        switchMap((response) =>
          forkJoin(
            response.pokemon.map((data) =>
              this.pokemonByUrl(data.pokemon.url).pipe(
                map(this.transformToPokemonOverview)
              )
            )
          ).pipe(
            map((items) => ({
              count: response.pokemon.length,
              items: items.slice(
                pokemonTypeQuery.offset,
                pokemonTypeQuery.offset + pokemonTypeQuery.limit
              ),
            }))
          )
        ),
        catchError(this.handleError)
      );
  }

  private getHttpOptions(params?: Record<string, any>) {
    return Object.assign({}, this.httpOptions, params ? { params } : {});
  }

  private pokemonByUrl(url: string): Observable<Pokemon> {
    if (this._pokemonsCache.has(url)) {
      return of(this._pokemonsCache.get(url)!);
    }

    return this.httpClient
      .get<Pokemon>(url, this.httpOptions)
      .pipe(
        retry(3),
        tap(pokemon => this._pokemonsCache.set(url, pokemon)),
        catchError(this.handleError)
      );
  }

  private transformToPokemonOverview(pokemonDetail: Pokemon): OverviewPokemonDto {
    return {
      id: pokemonDetail.id,
      name: pokemonDetail.name,
      types: pokemonDetail.types,
      previewUrl: pokemonDetail.sprites.front_default,
    };
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = error.error?.message || error.message || 'Something went wrong';
    return throwError(() => new Error(errorMessage));
  }
}
