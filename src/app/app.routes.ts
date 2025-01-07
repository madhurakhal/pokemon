import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'pokemons',
    loadChildren: async () => {
      const m = await import('./pokemon/pokemon.module');
      return m.PokemonModule;
    },
  },
  {
    path: '*',
    redirectTo: '',
    pathMatch: "full"
  },
];
