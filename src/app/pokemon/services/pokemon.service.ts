import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon } from '../models/pokemon';
import { apiConfig } from "../../api-config";
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
    return this.httpClient.get<PokemonsRespone>(`${apiConfig.apiBaseUrl}/pokemon`, Object.assign({}, this.httpOptions, { params: {...queryParams, offeset: 0, limit: 50} }));
  }
}
