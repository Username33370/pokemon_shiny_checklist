function changeImage() {
    const dexNumber = document.getElementById('dex-input').value;
    const image = document.getElementById('pokemon-image');

    if (dexNumber > 0 && dexNumber < 1026) {
        image.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${dexNumber}.png`;

        const savedCharm = localStorage.getItem(`shinyCharm_${dexNumber}`);
        const savedCaught = localStorage.getItem(`caught_${dexNumber}`);

        document.getElementById('chain-input').value = 0;
        document.getElementById('shiny-charm').checked = (savedCharm === 'true');

        const clickedDexRaw = localStorage.getItem('clickedDex');
        const clickedDex = clickedDexRaw ? clickedDexRaw.split(',') : [];
        const isClickedCaught = clickedDex.includes(dexNumber);

        document.getElementById('caught').checked = (savedCaught === 'true') || isClickedCaught;

        updateOdds();

        if (isClickedCaught && savedCaught !== 'true') {
            localStorage.setItem(`caught_${dexNumber}`, 'true');
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
    } while (localStorage.getItem(`caught_${randomDex}`) === 'true' && tries < 5000); // Prevent infinite loop

    document.getElementById('dex-input').value = randomDex;
    changeImage();
}

function updateOdds() {
    const chain = parseInt(document.getElementById('chain-input').value) || 0;
    const hasShinyCharm = document.getElementById('shiny-charm').checked;

    let baseRolls = 1;

    if (chain >= 20) {
        baseRolls = 3;
    } else if (chain >= 10) {
        baseRolls = 2;
    }

    let totalRolls = baseRolls + (hasShinyCharm ? 2 : 0);
    let singleRollOdds = 1 / 4096;

    const failOneRoll = 1 - singleRollOdds;
    const failAllRolls = Math.pow(failOneRoll, totalRolls);

    const encounterShinyChance = 1 - failAllRolls;

    let cumulativeFail = Math.pow(1 - encounterShinyChance, chain);
    let finalShinyProbability = 1 - cumulativeFail;

    if (finalShinyProbability >= 0.9999999) {
        finalShinyProbability = 0.9999999;
    }

    const shinyChance = (finalShinyProbability * 100).toFixed(5);

    document.getElementById('odds-output').textContent =
        `SOS Method: ~${shinyChance}% chance after ${chain} chained encounters`;
}

document.getElementById('chain-input').addEventListener('input', () => {
    let input = document.getElementById('chain-input');
    if (parseInt(input.value) < 0) input.value = 0;
    updateOdds();
});

document.getElementById('shiny-charm').addEventListener('change', () => {
    const dex = document.getElementById('dex-input').value;
    const checked = document.getElementById('shiny-charm').checked;
    localStorage.setItem(`shinyCharm_${dex}`, checked.toString());
    updateOdds();
});

document.getElementById('caught').addEventListener('change', () => {
    const dex = document.getElementById('dex-input').value;
    const checked = document.getElementById('caught').checked;
    localStorage.setItem(`caught_${dex}`, checked.toString());

    const clickedDexRaw = localStorage.getItem('clickedDex');
    let clickedDex = clickedDexRaw ? clickedDexRaw.split(',') : [];

    if (checked) {
        if (!clickedDex.includes(dex)) {
            clickedDex.push(dex);
        }
    } else {
        clickedDex = clickedDex.filter(id => id !== dex);
    }

    localStorage.setItem('clickedDex', clickedDex.join(','));
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
