export type PokemonOverviewItem = {
  id: number;
  name: string;
  url: string;
}

export type PokemonsResponse = {
  count: number;
  next: string;
  results: PokemonOverviewItem[]
}
