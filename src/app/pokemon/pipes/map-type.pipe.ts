import { Pipe, PipeTransform } from '@angular/core';
import { PokemonType } from '../models/pokemon';

@Pipe({
  name: 'mapType',
  standalone: false
})
export class MapTypePipe implements PipeTransform {

  transform(value: PokemonType[] = []): string[] {
    return value.map(x => x.type.name);
  }

}
