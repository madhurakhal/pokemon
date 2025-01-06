import { Routes } from '@angular/router';

export const routes: Routes = [{
  path: 'pokemons',
  loadChildren: async () => {
    const m = await import("./pokemon/pokemon.module");
    return m.PokemonModule;
  }
}];
