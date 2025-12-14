import { useEffect, useState, } from "react";
import { PokeApi } from "../classes/PokeApi";

const PokemonLogic = () => {
    const [pokemon, setPokemon] = useState<any>(null);
    const [description, setDescription] = useState<any>(null);
    const [number, setNumber] = useState<number>(Math.floor(Math.random() * 151) + 1);
    const [throwNumber, setThrowNumber] = useState<number>(0 | 1 | 2 | 3);
    const [canThrow, setCanThrow] = useState<boolean>(true);
    const [team, setTeam] = useState<any>({});

    const pokeApi = new PokeApi();

    // const throwPokeball = () => {
    //     if (canThrow && throwNumber < 3) {
    //         setThrowNumber(throwNumber + 1); 
    //     }
    //     return throwNumber;
    // }

    const getPokemons = () => {
        const pokemons = localStorage.getItem("pokemons");
        return pokemons ? JSON.parse(pokemons) : { };
    };

    const savePokemons = (pokemons: any) => {
        if (checkIfPokemonInCollection(pokemon.name)) {
            localStorage.setItem("pokemons", JSON.stringify(pokemons));
        }
    };

    const checkIfPokemonInCollection = (pokemonName: string) => {
        const pokemons = getPokemons();
        return true;;
    }

    const addPokemonToCollection = (pokemon: any) => {
        const pokemons = getPokemons();
        pokemons[pokemon.name] = pokemon.id;
        if (Object.keys(pokemons).length > 6) {
            alert("You can only have 6 Pokémon in your collection, you must delete one to add another.");
            return;
        } else {
            savePokemons(pokemons);
            setTeam(pokemons);
        }
    }

    const deletePokemonFromCollection = (pokemonName: string) => {
        const pokemons = getPokemons();
        delete pokemons[pokemonName];
        savePokemons(pokemons);
        setTeam(pokemons);
    }

    const generateRandomNumber = () => {
        const randomNum = Math.floor(Math.random() * 151) + 1;
        return randomNum;
    }

    useEffect(() => {
        const pokeApi = new PokeApi();
        pokeApi.getPokemonByNumber(number).then(data => {
            setPokemon(data);
        });
        pokeApi.getDescriptionByNumber(number).then(data => {
            setDescription(data);
        });
    }, [number]);

    useEffect(() => {
        setTeam(getPokemons());
    }, []);

    

    return (        
    <>
    <div className="game-window">
        <div className="pokemon-card">
            <div className="card-head">
                <p>N°{number} {pokemon?.name.toUpperCase()}</p>
                <div className="types-container">
                {pokemon?.types?.map((typeInfo: any) => {
                    const typeName = typeInfo.type.name as string;
                    const iconSrc = `/types-icons/${typeName}.svg`;
                    return (
                    <span key={typeName} style={{ display: 'inline-flex', alignItems: 'center', marginRight: '8px' }}>
                        <img
                        className="type-icon"
                        src={iconSrc}
                        alt={`${typeName} icon`}
                        width={20}
                        height={20}
                        style={{ marginRight: '4px' }}
                        />
                        {typeName.toUpperCase()}
                    </span>
                    );
                })}
                </div>
            </div>
            <div className="sprite-container">
                <img id="sprite" src={pokemon?.sprites.versions["generation-i"].yellow.front_default} alt="Pokemon Sprite" />
            </div>
            <div className="description-container">
                <p>Description: {description?.flavor_text_entries[2].flavor_text.replaceAll("\n", " ").replaceAll("\f", " ").replaceAll("\r", " ")}</p>
            </div>

            <div className="card-buttons">
                {/* <button 
                    onClick={ throwPokeball()}>Throw Pokeball ({3 - throwNumber} left)
                </button>  */}
                <button 
                    onClick={ () => { addPokemonToCollection(pokemon); } }>Add to Collection
                </button>
                <button
                    onClick={ () => { getPokemons(); console.log(getPokemons()); } }>View Collection
                </button>
                <div className="search-pokemon">
                    <button onClick={() => { setNumber(generateRandomNumber()) }}>Look for another pokemon</button>
                </div>
            </div>

        </div>
        <div className="Team">
            <h2>Your Team</h2>
            {team && Object.keys(team).length > 0 ? (
                <ul>
                    {Object.entries(team).map(([name, id]) => (
                        <li key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                            <span>{(name as string).toUpperCase()} (N°{id as number})</span>
                            <button
                                aria-label={`Remove ${name} from team`}
                                title="Remove"
                                onClick={() => { deletePokemonFromCollection(name as string); }}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    color: '#c00',
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    lineHeight: 1,
                                }}
                            >
                                &times;
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No Pokémon in your collection yet.</p>
            )}
        </div>


    </div>
    </>
    )
}

export default PokemonLogic;