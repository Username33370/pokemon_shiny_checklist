function getClickedDexFromStorage() {
    const rawValue = localStorage.getItem('clickedDex');
    if (!rawValue) return [];
    return rawValue.split(',').filter(id => id && id !== 'undefined');
}

function setClickedDexToStorage(dexList) {
    const uniqueList = Array.from(new Set(dexList));
    localStorage.setItem('clickedDex', uniqueList.join(','));
}

function getNormalImageUrl(id) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;
}

function getAlternateImageUrl(id) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${id}.png`;
}

function swapImage(img) {
    if (img.getAttribute("data-clicked") === "true") return;
    const id = img.getAttribute("data-id");
    img.src = getAlternateImageUrl(id);
}

function restoreImage(img) {
    if (img.getAttribute("data-clicked") === "true") return;
    const id = img.getAttribute("data-id");
    img.src = getNormalImageUrl(id);
}

function toggleImage(img) {
    const id = img.getAttribute("data-id");
    let clickedList = getClickedDexFromStorage();

    if (img.getAttribute("data-clicked") === "true") {
        img.setAttribute("data-clicked", "false");
        img.classList.remove("clicked");
        img.style.display = "";
        clickedList = clickedList.filter(d => d !== id);
    } else {
        img.setAttribute("data-clicked", "true");
        img.classList.add("clicked");
        img.style.display = "none";
        clickedList.push(id);
    }

    setClickedDexToStorage(clickedList);
}

window.onload = function () {
    const clickedList = getClickedDexFromStorage();

    clickedList.forEach(id => {
        const img = document.querySelector(`img[data-id='${id}']`);
        if (img) {
            img.setAttribute("data-clicked", "true");
            img.classList.add("clicked");
            img.style.display = "none";
        }
    });
};
