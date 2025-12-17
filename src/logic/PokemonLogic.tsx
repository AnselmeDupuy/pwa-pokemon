import { useEffect, useState, } from "react";
import { PokeApi } from "../classes/PokeApi";
import { Push } from "../classes/Push";

const PokemonLogic = () => {
    const [pokemon, setPokemon] = useState<any>(null);
    const [description, setDescription] = useState<any>(null);
    const [number, setNumber] = useState<number>(Math.floor(Math.random() * 151) + 1);
    const [throwNumber, setThrowNumber] = useState<0 | 1 | 2 | 3>(0);
    const [canThrow, setCanThrow] = useState<boolean>(true);
    const [team, setTeam] = useState<any>({});
    const [favorites, setFavorites] = useState<any>({});
    const [pokedex, setPokedex] = useState<any[]>([]);
    const [isShiny, setIsShiny] = useState(false);
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(Notification.permission);

    const notif = new Push();

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
                setNumber(generateRandomNumber());
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
        notif.askPermission();
        const pokemons = getPokemons();
        pokemons[pokemon.id] = { name: pokemon.name, isShiny: isShiny };
        if (Object.keys(pokemons).length > 6) {
            alert("You can only have 6 Pokémon in your collection, too bad! the pokemon flees.");
            return;
        } else {
            savePokemons(pokemons);
            setTeam(pokemons);
            if (isShiny) {
                notif.sendNotification(
                    "Shiny Pokémon Caught!",
                    `You have successfully caught a shiny ${pokemon.name.toUpperCase()}! ✨`,
                    `shiny-catch-${pokemon.id}`
                );
            } else  {
                notif.sendNotification(
                "Pokémon Caught!",
                `You have successfully caught ${pokemon.name.toUpperCase()}!`,
                `catch-${pokemon.id}`
                );
            }

        }
        addPokemonToPokedex(pokemon.name);
    }

    const deletePokemonFromCollection = (pokemonName: string) => {
        const pokemons = getPokemons();
        delete pokemons[pokemonName];
        savePokemons(pokemons);
        setTeam(pokemons);
    }

    const getFavorites = () => {
        const favorites = localStorage.getItem("favorites");
        return favorites ? JSON.parse(favorites) : [];
    };

    const addPokemonToFavorites = (pokemonName: string) => {
        const favorites = localStorage.getItem("favorites");
        let favoritesArray = favorites ? JSON.parse(favorites) : [];
        if (!favoritesArray.includes(pokemonName)) {
            alert(`${pokemonName.toUpperCase()} has been added to favorites.`);
            favoritesArray.push(pokemonName);
            localStorage.setItem("favorites", JSON.stringify(favoritesArray));
            setFavorites(favoritesArray);
        } else if (favoritesArray.includes(pokemonName)) {
            alert(`${pokemonName.toUpperCase()} has been removed from favorites.`);
            favoritesArray = favoritesArray.filter((name: string) => name !== pokemonName);
            localStorage.setItem("favorites", JSON.stringify(favoritesArray));
            setFavorites(favoritesArray);
        }
    }

    const deletePokemonFromFavorites = (pokemonName: string) => {
        const favoritesArray: string[] = getFavorites();
        const next = favoritesArray.filter((name: string) => name !== pokemonName);
        localStorage.setItem("favorites", JSON.stringify(next));
        setFavorites(next);
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

            const shiny = shinyAppearance();
            setIsShiny(shiny);
        
            if (shiny) {
                notif.sendNotification(
                    "A wild Shiny Pokémon appeared!",
                    `A shiny ${data.name.toUpperCase()} has appeared! ✨`,
                    `shiny-appear-${number}`
                );
            }
        });
        pokeApi.getDescriptionByNumber(number).then(data => {
            setDescription(data);
        });
        setCanThrow(true);
        setThrowNumber(0);
    }, [number]);

    useEffect(() => {
        setTeam(getPokemons());
        setFavorites(getFavorites());
        setPokedex(getPokedex());
    }, []);

    

    return (        
    <>
    <div className="game-window">
        <div className="pokemon-card">
            <div className="card-head">
                <p>N°{number} {pokemon?.name.toUpperCase()}</p>
                { isShiny && (<span className="shiny-badge">✨ Shiny ✨</span>) }
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
        {Object.entries(team).map(([id, data]: [string, any]) => (
            <li key={id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <span>
                    {data.name.toUpperCase()} (N°{id})
                    {data.isShiny && ' ✨'}
                </span>
                <div>
                    <button 
                        aria-label={`Add ${data.name} to favorites`}
                        title="Add to Favorites"
                        onClick={() => { addPokemonToFavorites(data.name); }}
                        >Fav</button>
                    <button
                        aria-label={`Remove ${data.name} from team`}
                        title="Remove"
                        onClick={() => { deletePokemonFromCollection(id); }}
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
                </div>
            </li>
        ))}
    </ul>
) : (
    <p>No Pokémon in your collection yet.</p>
)}
            <h2>Your Favorites</h2>
            {Array.isArray(favorites) && favorites.length > 0 ? (
                <ul>
                    {favorites.map((name: string) => (
                        <li key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span>{name.toUpperCase()}</span>
                            <div>
                                <button
                                    aria-label={`Remove ${name} from favorites`}
                                    title="Remove"
                                    onClick={() => { deletePokemonFromFavorites(name); }}
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
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No Pokémon in your Favorites yet.</p>
            )}
        </div>


    </div>
    </>
    )
}

export default PokemonLogic;