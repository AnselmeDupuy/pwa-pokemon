import { useEffect, useState, } from "react";
import { PokeApi } from "../classes/PokeApi";

const PokemonLogic = () => {
    const [pokemon, setPokemon] = useState<any>(null);
    const [description, setDescription] = useState<any>(null);
    const [number, setNumber] = useState<number>(Math.floor(Math.random() * 151) + 1);
    const [throwNumber, setThrowNumber] = useState<0 | 1 | 2 | 3>(0);
    const [canThrow, setCanThrow] = useState<boolean>(true);
    const [team, setTeam] = useState<any>({});
    const [pokedex, setPokedex] = useState<any[]>([]);
    const [isShiny, setIsShiny] = useState(false);

    const pokeApi = new PokeApi();

    const capturePokemon = () => {
        if (throwNumber < 3 && canThrow) {
            if (checkIfPokemonInCollection(pokemon.name) === true) {
                alert(`You already have ${pokemon.name.toUpperCase()} in your collection!`);
                return;
            }
            const success = Math.random() < 0.15;
            setThrowNumber(prev => (prev + 1) as 0 | 1 | 2 | 3);
            if (success) {
                alert(`Congratulations! You caught ${pokemon.name.toUpperCase()}!`);
                addPokemonToCollection(pokemon);
                setThrowNumber(0);
            } else {
                alert(`${pokemon.name.toUpperCase()} escaped! Try again.`);
            }
        } else if (throwNumber === 3) {    
            alert("The pokemon flee!");
            setNumber(generateRandomNumber());
            setThrowNumber(0);
        }
    }

    const getPokemons = () => {
        const pokemons = localStorage.getItem("pokemons");
        return pokemons ? JSON.parse(pokemons) : { };
    };

    const getPokedex = () => {
        const pokedex = localStorage.getItem("pokedex");
        return pokedex ? JSON.parse(pokedex) : [ ];
    }

    const savePokedex = (pokedex: any) => {
        localStorage.setItem("pokedex", JSON.stringify(pokedex));
    }

    const savePokemons = (pokemons: any) => {
            localStorage.setItem("pokemons", JSON.stringify(pokemons));
    };

    const addPokemonToPokedex = (pokemonName: string) => {
        const pokedex = getPokedex();
        if (!pokedex.includes(pokemonName)) {
            pokedex.push(pokemonName);
            savePokedex(pokedex);
            setPokedex(pokedex);
        }
    }

    const checkIfPokemonInCollection = (pokemonName: string) => {
        const pokemons = getPokemons();
        if (pokemons.hasOwnProperty(pokemonName)) {
            return true;
        }
        return false;
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
        addPokemonToPokedex(pokemon.name);
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

    const shinyAppearance = () => {
        const isShiny = Math.random() < 0.001953125;
        return isShiny;
    }

    useEffect(() => {
        const pokeApi = new PokeApi();
        pokeApi.getPokemonByNumber(number).then(data => {
            setPokemon(data);
            addPokemonToPokedex(data.name);
        });
        pokeApi.getDescriptionByNumber(number).then(data => {
            setDescription(data);
        });
        setIsShiny(shinyAppearance());
        setCanThrow(true);
        setThrowNumber(0);
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
                <img id="sprite" src={isShiny ? pokemon?.sprites.versions["generation-ii"].gold.front_shiny : pokemon?.sprites.versions["generation-ii"].gold.front_default} alt="Pokemon Sprite" />
            </div>
            <div className="description-container">
                <p>Description: {description?.flavor_text_entries[2].flavor_text.replaceAll("\n", " ").replaceAll("\f", " ").replaceAll("\r", " ")}</p>
            </div>

            <div className="card-buttons">
                <button 
                    onClick={ () => { capturePokemon() } }>Throw Pokeball
                </button> 
                <div className="search-pokemon">
                    <button onClick={() => { setNumber(generateRandomNumber()) }}>Flee</button>
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