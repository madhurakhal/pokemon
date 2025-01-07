import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { LoadingIndicatorComponent } from '../shared/loading-indicator/loading-indicator.component';
import { SearchComponent } from '../shared/search/search.component';
import { SelectComponent } from '../shared/select/select.component';
import { TagComponent } from '../shared/tag/tag.component';
import { PokemonDetailComponent } from './containers/pokemon-detail/pokemon-detail.component';
import { PokemonOverviewComponent } from './containers/pokemon-overview/pokemon-overview.component';
import { PokemonsComponent } from './containers/pokemons/pokemons.component';
import { MapTypePipe } from './pipes/map-type.pipe';
import { PokemonRoutingModule } from './pokemon-routing.module';
import { StatComponent } from './components/stat/stat.component';
import { MoveComponent } from './components/move/move.component';
import { AbilityComponent } from './components/ability/ability.component';


@NgModule({
  declarations: [
    PokemonsComponent,
    PokemonDetailComponent,
    PokemonOverviewComponent,
    MapTypePipe,
    StatComponent,
    MoveComponent,
    AbilityComponent
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
    SelectComponent,
    TabsetComponent,
    TabDirective
  ]
})
export class PokemonModule { }
