import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { apiConfig } from "../../api-config";
import { OverviewPokemonDto, Pokemon, PokemonDetailsDto } from '../models/pokemon';
import { PokemonsRespone } from '../models/responses/pokemons.response';
import { PokemonTypesResponse } from '../models/responses/pokemon-types.response';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private readonly httpClient = inject(HttpClient);
  private _pokemonTypes: string[] = [];
  private _pokemonCache: Map<string, Pokemon> = new Map();

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate, post-check=0, pre-check=0",
    })
  };

  pokemons(queryParams: any = {}): Observable<PokemonsRespone> {
    return this.httpClient.get<PokemonsRespone>(`${apiConfig.apiBaseUrl}/pokemon`, Object.assign({}, this.httpOptions, { params: { ...queryParams, offeset: 0, limit: 20 } }));
  }

  pokemonById(pokemonId: number) {
    return this.httpClient.get<PokemonDetailsDto>(`${apiConfig.apiBaseUrl}/pokemon/${pokemonId}`)
  }

  pokemonsWithDetils(queryParams: any = {}): Observable<{
    count: number,
    items: OverviewPokemonDto[]
  }> {
    return this.pokemons(queryParams).pipe(
      switchMap(response =>
        forkJoin(response.results.map(item => this.pokemonByUrl(item.url).pipe(
          map((pokemonDetail: Pokemon) => ({
            id: pokemonDetail.id,
            name: pokemonDetail.name,
            types: pokemonDetail.types,
            previewUrl: pokemonDetail.sprites.front_default
          }))
        ))).pipe(
          map(items => ({
            count: response.count,
            items
          }))
        )
      )
    );
  }

  pokemonTypes() {
    if (this._pokemonTypes.length) {
      return of([...this._pokemonTypes])
    }
    return this.httpClient.get<PokemonTypesResponse>(`${apiConfig.apiBaseUrl}/type/`)
      .pipe(
        map((response) => {
          return response.results.map(x => x.name)
        }),
        tap((data) => {
        this._pokemonTypes = [...data]
      }))
  }

  pokemonByType(pokemonType: string) {
    if (this._pokemonCache.get(pokemonType)) {
      return of (this._pokemonCache.get(pokemonType))
    }
    return this.httpClient.get<string[]>(`${apiConfig.apiBaseUrl}/type/${pokemonType}`)
      .pipe(tap((data) => {
        this._pokemonTypes = [...data]
      }))
  }

  private pokemonByUrl(url: string): Observable<Pokemon> {
    return this.httpClient.get<Pokemon>(url, Object.assign({}, this.httpOptions));
  }
}
