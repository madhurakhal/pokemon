import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { setTheme } from 'ngx-bootstrap/utils';
import { NavigationComponent } from "./shared/navigation/navigation.component";
import { PokemonNavLink } from './models/pokemon-nav-link';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  applicationLinks: PokemonNavLink[] = [
    {
      name: 'Pokemons',
      path: 'pokemons'
    }
  ]
  constructor() {
    setTheme("bs5");
  }
}
