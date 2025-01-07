import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { PokemonsComponent } from './containers/pokemons/pokemons.component';
import { PokemonRoutingModule } from './pokemon-routing.module';
import { RouterOutlet } from '@angular/router';
import { PokemonDetailComponent } from './containers/pokemon-detail/pokemon-detail.component';
import { PokemonOverviewComponent } from './containers/pokemon-overview/pokemon-overview.component';


@NgModule({
  declarations: [
    PokemonsComponent,
    PokemonDetailComponent,
    PokemonOverviewComponent
  ],
  imports: [
    CommonModule,
    PokemonRoutingModule,
    RouterOutlet,
    NgOptimizedImage
  ]
})
export class PokemonModule { }
