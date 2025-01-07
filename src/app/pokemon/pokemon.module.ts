import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { PokemonsComponent } from './containers/pokemons/pokemons.component';
import { PokemonRoutingModule } from './pokemon-routing.module';
import { RouterOutlet } from '@angular/router';
import { PokemonDetailComponent } from './containers/pokemon-detail/pokemon-detail.component';
import { PokemonOverviewComponent } from './containers/pokemon-overview/pokemon-overview.component';
import { LoadingIndicatorComponent } from '../shared/loading-indicator/loading-indicator.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { TagComponent } from '../shared/tag/tag.component';
import { MapTypePipe } from './pipes/map-type.pipe';
import { SearchComponent } from '../shared/search/search.component';
import { SelectComponent } from '../shared/select/select.component';


@NgModule({
  declarations: [
    PokemonsComponent,
    PokemonDetailComponent,
    PokemonOverviewComponent,
    MapTypePipe
  ],
  imports: [
    CommonModule,
    PokemonRoutingModule,
    RouterOutlet,
    NgOptimizedImage,
    LoadingIndicatorComponent,
    TagComponent,
    PaginationModule,
    FormsModule,
    SearchComponent,
    SelectComponent
  ]
})
export class PokemonModule { }
