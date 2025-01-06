import { Component, Input } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { PokemonNavLink } from '../../models/pokemon-nav-link';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  @Input({ required: true }) links: PokemonNavLink[] = []
}
