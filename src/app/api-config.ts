import { InjectionToken } from "@angular/core";
const apiConfig = {
  apiBaseUrl: 'https://pokeapi.co/api/v2'
}

export const  APICONFIG = new InjectionToken("Apiconfig", {
  factory: () => apiConfig,
});




