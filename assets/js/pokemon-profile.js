// Mapa de tradução
const translationMap = {
    overgrow: "Supercrescimento",
    chlorophyll: "Clorofila",
    monster: "Monstro",
    plant: "Planta",

};

function translateTerm(term) {
    return translationMap[term] || term;
}

const pokemonBody = document.querySelector('body')
let pokemonContent = document.querySelector('.content')
let pokemonClick = document.querySelector('#click')
const pokemonHeader = document.querySelector('header')

function getEvolutionChain(evolutionChainUrl) {
    return fetch(evolutionChainUrl)
        .then((response) => response.json())
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function convertEvolutionChain(evolutionChain) {
    let evolutions = [];
    let currentEvolution = evolutionChain.chain;

    do {
        let evolutionDetails = currentEvolution['evolution_details'][0];
        evolutions.push({
            species_name: capitalize(currentEvolution.species.name),
            min_level: !evolutionDetails ? 1 : evolutionDetails.min_level,
            trigger_name: !evolutionDetails ? null : evolutionDetails.trigger.name,
            item: !evolutionDetails ? null : evolutionDetails.item
        });

        currentEvolution = currentEvolution['evolves_to'][0];
    } while (!!currentEvolution && currentEvolution.hasOwnProperty('evolves_to'));

    return evolutions;
}


let fillGeneral = () => {
    pokeApi.getPokemonGeneral()
    .then((pokemon) => {
        pokemonClick.innerHTML = `
        <ol>
            <li class="list">
                <span class="txt-${pokemon.types[0]} bold">Peso</span>
                <span class="txt-light-gray">${pokemon.weight}</span>
            </li>
            <li class="list">
                <span class="txt-${pokemon.types[0]} bold">Altura</span>
                <span class="txt-light-gray">${pokemon.height}</span>
            </li>
            <li class="list">
                <span class="txt-${pokemon.types[0]} bold">Habilidades</span>
                ${pokemon.abilities.map((ability) => `<span class="txt-light-gray">${translateTerm(ability)}</span>`).join('')}
            </li>
        </ol>
        <h3 class="txt-dark-gray">Criação</h3>
        <ol>
            <li class="list">
                <span class="txt-${pokemon.types[0]} bold">Gênero</span>
                <span class="txt-dark-gray bold">Macho: <span class="txt-light-gray">${pokemon.gender.male}</span></span>
                <span class="txt-dark-gray bold">Fêmea: <span class="txt-light-gray">${pokemon.gender.female}</span></span>
            </li>
            <li class="list">
                <span class="txt-${pokemon.types[0]} bold">Grupo Reprodutivo</span>
                ${pokemon.eggGroups.map((eggGroup) => `<span class="txt-light-gray">${translateTerm(eggGroup)}</span>`).join('')}
            </li>
            <li class="list">
                <span class="txt-${pokemon.types[0]} bold">Ciclo de Eclosão</span>
                <span class="txt-light-gray">${pokemon.eggCycle}</span>
            </li>
        </ol>`

    const buttonActived = document.querySelector(".active")
    buttonActived.classList.remove("active", "border-radius", "txt-dark-gray", `${pokemon.types[0]}`)
    buttonActived.classList.add(`txt-${pokemon.types[0]}`)

    const buttonSelected = document.querySelector("#general")
    buttonSelected.classList.add("active", "border-radius", "txt-dark-gray", `${pokemon.types[0]}`)
    buttonSelected.classList.remove(`txt-${pokemon.types[0]}`)})
}

let fillStats = () => {
    pokeApi.getPokemonStats()
    .then((pokemon) => {
        pokemonClick.innerHTML = `<ol>
            <li class="d-flex stat">
                <span class="stat-span txt-${pokemon.types[0]} bold">HP</span>
                <span class="txt-light-gray">${pokemon.stats[0]}</span>
                <div class="progress-bar-hp border-radius"></div>
            </li>
            <li class="d-flex stat"">
                <span class="stat-span txt-${pokemon.types[0]} bold">ATK</span>
                <span class="txt-light-gray">${pokemon.stats[1]}</span>
                <div class="progress-bar-atk border-radius"></div>
            </li>
            <li class="d-flex stat"">
                <span class="stat-span txt-${pokemon.types[0]} bold">DEF</span>
                <span class="txt-light-gray">${pokemon.stats[2]}</span>
                <div class="progress-bar-def border-radius"></div>
            </li>
            <li class="d-flex stat"">
                <span class="stat-span txt-${pokemon.types[0]} bold">SATK</span>
                <span class="txt-light-gray">${pokemon.stats[3]}</span>
                <div class="progress-bar-satk border-radius"></div>
            </li>
            <li class="d-flex stat"">
                <span class="stat-span txt-${pokemon.types[0]} bold">SDEF</span>
                <span class="txt-light-gray">${pokemon.stats[4]}</span>
                <div class="progress-bar-sdef border-radius"></div>
            </li>
            <li class="d-flex stat"">
                <span class="stat-span txt-${pokemon.types[0]} bold">SPD</span>
                <span class="txt-light-gray">${pokemon.stats[4]}</span>
                <div class="progress-bar-spd border-radius"></div>
            </li>
        </ol>`
    
    document.documentElement.style.setProperty('--progress-hp', `${pokemon.stats[0]}`);
    document.documentElement.style.setProperty('--progress-atk', `${pokemon.stats[1]}`);
    document.documentElement.style.setProperty('--progress-def', `${pokemon.stats[2]}`);
    document.documentElement.style.setProperty('--progress-satk', `${pokemon.stats[3]}`);
    document.documentElement.style.setProperty('--progress-sdef', `${pokemon.stats[4]}`);
    document.documentElement.style.setProperty('--progress-spd', `${pokemon.stats[5]}`);
    
    
    const buttonActived = document.querySelector(".active")
    buttonActived.classList.remove("active", "border-radius", "txt-dark-gray", `${pokemon.types[0]}`)
    buttonActived.classList.add(`txt-${pokemon.types[0]}`)

    const buttonSelected = document.querySelector("#stats")
    buttonSelected.classList.add("active", "border-radius", `${pokemon.types[0]}`)
    buttonSelected.classList.remove(`txt-${pokemon.types[0]}`)
    })
}

let fillEvolutions = () => {
    pokeApi.getPokemonGeneral()
        .then((pokemon) => {
            const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemon.number}/`;
            return fetch(url)
                .then((response) => response.json())
                .then((species) => getEvolutionChain(species.evolution_chain.url))
                .then((evolutionChain) => {
                    let evolutions = convertEvolutionChain(evolutionChain);
                    pokemonClick.innerHTML = evolutions.map((evolution) => `
                        <ol>
                            <h3 class="txt-dark-gray">${evolution.species_name}</h3>
                            <li class="list">
                                <span class="txt-${pokemon.types[0]} bold">Nível Mínimo</span>
                                <span class="txt-light-gray">${evolution.min_level !== null ? evolution.min_level : 'Desconhecido'}</span>
                            </li>
                            <li class="list">
                                <span class="txt-${pokemon.types[0]} bold">Trigger de Evolução</span>
                                <span class="txt-light-gray">${evolution.trigger_name !== null ? translateTerm(evolution.trigger_name) : 'Desconhecido'}</span>
                            </li>
                            <li class="list">
                                <span class="txt-${pokemon.types[0]} bold">Item</span>
                                <span class="txt-light-gray">${evolution.item !== null ? translateTerm(evolution.item) : 'Nenhum'}</span>
                            </li>
                        </ol>
                    `).join('');

                    const buttonActived = document.querySelector(".active");
                    buttonActived.classList.remove("active", "border-radius", "txt-dark-gray", `${pokemon.types[0]}`);
                    buttonActived.classList.add(`txt-${pokemon.types[0]}`);

                    const buttonSelected = document.querySelector("#evolutions");
                    buttonSelected.classList.add("active", "border-radius", "txt-dark-gray", `${pokemon.types[0]}`);
                    buttonSelected.classList.remove(`txt-${pokemon.types[0]}`);
                });
        });
};



let loadPokemonProfile = () => {
    pokeApi.getPokemonGeneral()
    .then((pokemon) => {
        pokemonBody.classList.add(`bg-${pokemon.types[0]}`)
        pokemonContent.innerHTML = `
            <img src="${pokemon.photo}" alt="" class="img-pokemon">
            <div class="pokemon-info txt-center">
                <ol class="types">
                    <li class="name txt-dark-gray"><h1>${pokemon.name}</h1></li>
                    <div class="d-flex-center">
                        ${pokemon.types.map((type) => `<li class="padding type name ${pokemon.types[0]} border-radius txt-white">${type}</li>`).join('')}
                    </div>
                </ol>
                <p class="txt-light-gray">Descubra os poderes baseados em ${pokemon.types[0]} do <span class="name">${pokemon.name}</span> e junte-se à sua emocionante jornada no mundo dos Pokémon!</p>
            </div>
            <ol class="d-flex padding">
                <li>
                    <button id="general" class="active padding ${pokemon.types[0]} border-radius" onclick="fillGeneral()">Geral</button>
                </li>
                <li>
                    <button id="stats" class="padding txt-${pokemon.types[0]}" onclick="fillStats()">Estatísticas</button>
                </li>
                <li>
                    <button id="evolutions" class="padding txt-${pokemon.types[0]}" onclick="fillEvolutions()">Evoluções</button> 
                </li>  
            </ol>`
        pokemonClick.innerHTML = `
        <ol>
            <li class="list">
                <span class="txt-${pokemon.types[0]} bold">Peso</span>
                <span class="txt-light-gray">${pokemon.weight}</span>
            </li>
            <li class="list">
                <span class="txt-${pokemon.types[0]} bold">Altura</span>
                <span class="txt-light-gray">${pokemon.height}</span>
            </li>
            <li class="list">
                <span class="txt-${pokemon.types[0]} bold">Habilidades</span>
                ${pokemon.abilities.map((ability) => `<span class="txt-light-gray">${translateTerm(ability)}</span>`).join('')}
            </li>
        </ol>
        <h3 class="txt-dark-gray">Criação</h3>
        <ol>
            <li class="list">
                <span class="txt-${pokemon.types[0]} bold">Gênero</span>
                <span class="txt-dark-gray bold">Macho: <span class="txt-light-gray">${pokemon.gender.male}</span></span>
                <span class="txt-dark-gray bold">Fêmea: <span class="txt-light-gray">${pokemon.gender.female}</span></span>
            </li>
            <li class="list">
                <span class="txt-${pokemon.types[0]} bold">Grupo Reprodutivo</span>
                ${pokemon.eggGroups.map((eggGroup) => `<span class="txt-light-gray">${translateTerm(eggGroup)}</span>`).join('')}
            </li>
            <li class="list">
                <span class="txt-${pokemon.types[0]} bold">Ciclo de Eclosão</span>
                <span class="txt-light-gray">${pokemon.eggCycle}</span>
            </li>
        </ol>`
    })
}

loadPokemonProfile()
