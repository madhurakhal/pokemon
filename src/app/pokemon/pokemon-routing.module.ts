import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PokemonsComponent } from "./containers/pokemons/pokemons.component";
import { PokemonOverviewComponent } from "./containers/pokemon-overview/pokemon-overview.component";
import { PokemonDetailComponent } from "./containers/pokemon-detail/pokemon-detail.component";

const routes: Routes = [
  {
    path: "",
    component: PokemonOverviewComponent,
    children: [
      {
        path: "",
        component: PokemonsComponent
      },
      {
        path: ":id",
        component: PokemonDetailComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PokemonRoutingModule { }
