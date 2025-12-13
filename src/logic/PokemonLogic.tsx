import { useEffect, useState, } from "react";
import { PokeApi } from "../classes/PokeApi";

const PokemonLogic = () => {
    const [pokemon, setPokemon] = useState<any>(null);
    const [number, setNumber] = useState<number>(Math.floor(Math.random() * 151) + 1);

    
    const pokeApi = new PokeApi();


    useEffect(() => {
        const pokeApi = new PokeApi();
        pokeApi.getPokemonByNumber(number).then(data => {
            setPokemon(data);
            console.log(data);
        });
    }, []);


    return (        
    <>
        <div>
            <h1>Pokemon n°{number}</h1>
            <p>{pokemon?.name}</p>
            <img src={pokemon?.sprites.versions["generation-i"].yellow.front_default} alt="Pokemon Sprite" />
            <p>{pokemon?.types.map((typeInfo: any) => typeInfo.type.name).join(", ")}</p>


        </div>

    </>
    )
}

export default PokemonLogic;