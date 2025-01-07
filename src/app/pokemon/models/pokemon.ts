import { pokemon } from './data';

export type Pokemon = typeof pokemon;
export type PokemonSprite = Pokemon['sprites']
export type PokemonType =  Pokemon['types'][0]
export type OverviewPokemonDto = Pick<Pokemon, 'name' | "id" | "types"> & {
  previewUrl: string;
};
export type PokemonAbility = Pokemon['abilities'][0]
export type PokemonDetailsDto = Pokemon;
export type PokemonStat = Pokemon['stats'][0]
export type PokemonMove = Pokemon['moves'][0]

