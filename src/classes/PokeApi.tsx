export class PokeApi {
    
    getPokemonByNumber = async (number: number) => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${number}`);
        const data = await response.json();
        return data;
    }

    getDescriptionByNumber = async (number: number) => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${number}`);
        const data = await response.json();
        return data;
    }

    

}