import { Component, Input } from '@angular/core';
import { PokemonAbility } from '../../models/pokemon';

@Component({
  selector: 'app-ability',
  templateUrl: './ability.component.html',
  styleUrl: './ability.component.scss',
  standalone: false
})
export class AbilityComponent {
  @Input() abilities: PokemonAbility[] = []
}
