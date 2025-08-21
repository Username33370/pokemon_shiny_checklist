function setStorage(key, value) {
    localStorage.setItem(key, value);
}

function getStorage(key) {
    return localStorage.getItem(key);
}

function changeImage() {
    const dexNumber = document.getElementById('dex-input').value;
    const image = document.getElementById('pokemon-image');

    if (dexNumber > 0 && dexNumber < 1026) {
        image.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${dexNumber}.png`;

        const savedResets = getStorage(`resets_${dexNumber}`);
        const savedCharm = getStorage(`shinyCharm_${dexNumber}`);
        const savedCaught = getStorage(`caught_${dexNumber}`);

        document.getElementById('reset-input').value = savedResets || 0;
        document.getElementById('shiny-charm').checked = (savedCharm === 'true');

        const clickedDexRaw = getStorage('clickedDex');
        const clickedDex = clickedDexRaw ? clickedDexRaw.split(',') : [];
        const isClickedCaught = clickedDex.includes(dexNumber);

        document.getElementById('caught').checked = (savedCaught === 'true') || isClickedCaught;

        updateOdds();

        if (isClickedCaught && savedCaught !== 'true') {
            setStorage(`caught_${dexNumber}`, 'true');
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
    } while (getStorage(`caught_${randomDex}`) === 'true' && tries < 5000);

    document.getElementById('dex-input').value = randomDex;
    changeImage();
}

function updateOdds() {
    const resets = parseInt(document.getElementById('reset-input').value) || 0;
    const hasShinyCharm = document.getElementById('shiny-charm').checked;

    const baseOdds = hasShinyCharm ? 1 / 1365 : 1 / 4096;
    let probability = 1 - Math.pow(1 - baseOdds, resets);

    if (probability >= 0.9999999) {
        probability = 0.9999999;
    }

    const shinyChance = (probability * 100).toFixed(5);

    document.getElementById('odds-output').textContent =
        `Odds of next find being shiny: ~${shinyChance}%`;
}

document.getElementById('reset-input').addEventListener('input', () => {
    const dex = document.getElementById('dex-input').value;
    const val = document.getElementById('reset-input').value;
    setStorage(`resets_${dex}`, val);
    updateOdds();
});

document.getElementById('shiny-charm').addEventListener('change', () => {
    const dex = document.getElementById('dex-input').value;
    const checked = document.getElementById('shiny-charm').checked;
    setStorage(`shinyCharm_${dex}`, checked);
    updateOdds();
});

document.getElementById('caught').addEventListener('change', () => {
    const dex = document.getElementById('dex-input').value;
    const checked = document.getElementById('caught').checked;
    setStorage(`caught_${dex}`, checked ? 'true' : 'false');

    const clickedDexRaw = getStorage('clickedDex');
    let clickedDex = clickedDexRaw ? clickedDexRaw.split(',') : [];

    if (checked) {
        if (!clickedDex.includes(dex)) {
            clickedDex.push(dex);
        }
    } else {
        clickedDex = clickedDex.filter(id => id !== dex);
    }

    setStorage('clickedDex', clickedDex.join(','));
});

window.onload = function () {
    const dexInput = document.getElementById('dex-input');
    dexInput.value = 25;
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