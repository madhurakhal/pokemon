import { Component, Input } from '@angular/core';
import { PokemonStat } from '../../models/pokemon';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrl: './stat.component.scss',
  standalone: false
})
export class StatComponent {
  @Input({required: true}) stats: PokemonStat[] = [];
}
