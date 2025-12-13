import { useEffect, useState, } from "react";
import { PokeApi } from "../classes/PokeApi";

const PokemonLogic = () => {
    const [pokemon, setPokemon] = useState<any>(null);
    const [number, setNumber] = useState<number>(Math.floor(Math.random() * 151) + 1);
    const [key, setkey] = useState();
    const keyDown = (event) => {
        setkey(event.key)
    }
    
    const pokeApi = new PokeApi();


    useEffect(() => {
        const pokeApi = new PokeApi();
        pokeApi.getPokemonByNumber(number).then(data => {
            setPokemon(data);
        });
    }, []);


    return (        
    <>
        <div>
            <h1>Pokemon n°{number}</h1>
            <p>{pokemon?.name}</p>
            <img src={pokemon?.sprites.versions["generation-i"].yellow.front_default} alt="Pokemon Sprite" />
            <p>{pokemon?.types.map((typeInfo: any) => typeInfo.type.name).join(", ")}</p>

            <h1>GeeksforGeeks</h1>
            {key ? <h2>Pressed Key : {key}</h2> : null}
            <input type='text' onKeyDown={keyDown} placeholder='Press here...' />

        </div>

    </>
    )
}

export default PokemonLogic;