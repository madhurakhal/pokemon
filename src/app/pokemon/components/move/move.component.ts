import { Component, Input } from '@angular/core';
import { PokemonMove } from '../../models/pokemon';

@Component({
  selector: 'app-move',
  templateUrl: './move.component.html',
  styleUrl: './move.component.scss',
  standalone: false
})
export class MoveComponent {
  @Input() moves: PokemonMove[] = [];
}
