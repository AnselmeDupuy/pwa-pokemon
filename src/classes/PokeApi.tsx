export class PokeApi {
    
    getPokemonByNumber = async (number: number) => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${number}`);
        const data = await response.json();
        console.log(data);
        return data;
    }

    

}