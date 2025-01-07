export type PokemonSprite = {
  front_default: string;
  other: {
    "official-artwork": {
      "front_default": string;
    }
  }
}
export type PokemonType = { slot: number, type: { name: string, url: string } };

export type Pokemon = {
  id: string;
  name: string;
  sprites: PokemonSprite,
  types: PokemonType[]
}


export type OverviewPokemonDto = Omit<Pokemon, "sprites"> & {
  previewUrl: string
}
