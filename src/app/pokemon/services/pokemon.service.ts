import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { apiConfig } from "../../api-config";
import { Pokemon } from '../models/pokemon';
import { PokemonsRespone } from '../models/responses/pokemons.response';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private readonly httpClient = inject(HttpClient);

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate, post-check=0, pre-check=0",
    })
  };

  pokemons(queryParams: any = {}): Observable<PokemonsRespone> {
    return this.httpClient.get<PokemonsRespone>(`${apiConfig.apiBaseUrl}/pokemon`, Object.assign({}, this.httpOptions, { params: { ...queryParams, offeset: 0, limit: 20 } }));
  }

  pokemonByUrl(url: string): Observable<Pokemon> {
    return this.httpClient.get<Pokemon>(url, Object.assign({}, this.httpOptions));
  }

  pokemonsWithDetils(queryParams: any = {}): Observable<any> {
    return this.pokemons(queryParams).pipe(
      switchMap(response =>
        forkJoin(response.results.map(item => this.pokemonByUrl(item.url).pipe(
          map((pokemonDetail: Pokemon) => ({
            id: pokemonDetail.id,
            name: pokemonDetail.name,
            types: pokemonDetail.types,
            image: pokemonDetail.sprites.front_default
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
}
