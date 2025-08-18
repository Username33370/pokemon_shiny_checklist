function changeImage() {
const dexNumber = document.getElementById('dex-input').value;
const image = document.getElementById('pokemon-image');

if (dexNumber > 0 && dexNumber < 1026) {
    image.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${dexNumber}.png`;

    // Load saved values for this Dex number
    const savedResets = getCookie(`resets_${dexNumber}`);
    const savedCharm = getCookie(`shinyCharm_${dexNumber}`);
    const savedCaught = getCookie(`caught_${dexNumber}`);

    document.getElementById('reset-input').value = savedResets || 0;
    document.getElementById('shiny-charm').checked = (savedCharm === 'true');

    // Check if Pokémon is caught either from cookies OR from clickedDex list
    const clickedDex = getCookie('clickedDex')?.split(',') || [];
    const isClickedCaught = clickedDex.includes(dexNumber);

    document.getElementById('caught').checked = (savedCaught === 'true') || isClickedCaught;

    updateOdds();
    if (isClickedCaught && savedCaught !== 'true') {
    setCookie(`caught_${dexNumber}`, true);
}
} else {
    alert("Please enter a valid Dex number.");
}
}


    function randomPokemon() {
        const maxDex = 1025;
        let randomDex;
        let tries = 0;

        do {
            randomDex = Math.floor(Math.random() * maxDex) + 1;
            tries++;
        } while (getCookie(`caught_${randomDex}`) === 'true' && tries < 5000); // Prevent infinite loop

        document.getElementById('dex-input').value = randomDex;
        changeImage();
    }

    function updateOdds() {
const resets = parseInt(document.getElementById('reset-input').value) || 0;
const hasShinyCharm = document.getElementById('shiny-charm').checked;

const baseOdds = hasShinyCharm ? 1 / 1365 : 1 / 4096;
let probability = 1 - Math.pow(1 - baseOdds, resets);

// Cap the probability just below 100% (e.g., 99.99999%)
if (probability >= 0.9999999) {
    probability = 0.9999999;
}

const shinyChance = (probability * 100).toFixed(5);

document.getElementById('odds-output').textContent =
    `Odds of next find being shiny: ~${shinyChance}%`;
}
    function setCookie(name, value) {
        const date = new Date();
        date.setFullYear(date.getFullYear() + 100);
        document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
    }

    function getCookie(name) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [key, val] = cookie.trim().split('=');
            if (key === name) return val;
        }
        return null;
    }

    document.getElementById('reset-input').addEventListener('input', () => {
        const dex = document.getElementById('dex-input').value;
        const val = document.getElementById('reset-input').value;
        setCookie(`resets_${dex}`, val);
        updateOdds();
    });

    document.getElementById('shiny-charm').addEventListener('change', () => {
        const dex = document.getElementById('dex-input').value;
        const checked = document.getElementById('shiny-charm').checked;
        setCookie(`shinyCharm_${dex}`, checked);
        updateOdds();
    });

    document.getElementById('caught').addEventListener('change', () => {
    const dex = document.getElementById('dex-input').value;
    const checked = document.getElementById('caught').checked;
    setCookie(`caught_${dex}`, checked);

    // Update clickedDex cookie used by second site
    const clickedDexRaw = getCookie('clickedDex');
    let clickedDex = clickedDexRaw ? clickedDexRaw.split(',') : [];

    if (checked) {
        if (!clickedDex.includes(dex)) {
            clickedDex.push(dex);
        }
    } else {
        clickedDex = clickedDex.filter(id => id !== dex);
    }

    setCookie('clickedDex', clickedDex.join(','), 100);
});

    window.onload = function () {
        const dexInput = document.getElementById('dex-input');
        dexInput.value = 25; // Default to Pikachu
        changeImage();
    };
function previousPokemon() {
let current = parseInt(document.getElementById('dex-input').value);
if (current > 1) {
    document.getElementById('dex-input').value = current - 1;
    changeImage();
}
}

function nextPokemon() {
let current = parseInt(document.getElementById('dex-input').value);
if (current < 1025) {
    document.getElementById('dex-input').value = current + 1;
    changeImage();
}
}