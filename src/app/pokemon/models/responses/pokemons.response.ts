export type PokemonOverviewItem = {
  id: number;
  name: string;
  url: string;
}

export type PokemonsRespone = {
  count: number;
  next: string;
  results: PokemonOverviewItem[]
}
