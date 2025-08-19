function getClickedDexFromCookie() {
        const cookieEntry = document.cookie
            .split('; ')
            .find(row => row.startsWith('clickedDex='));
        if (!cookieEntry) return [];

        try {
            const rawValue = decodeURIComponent(cookieEntry.split('=')[1]);
            return rawValue.split(',').filter(id => id && id !== 'undefined');
        } catch (e) {
            return [];
        }
    }

    function setClickedDexToCookie(dexList) {
        // Remove duplicates before saving
        const uniqueList = Array.from(new Set(dexList));
        const value = encodeURIComponent(uniqueList.join(','));
        const maxAge = 60 * 60 * 24 * 365 * 100; // 100 years
        document.cookie = `clickedDex=${value}; max-age=${maxAge}; path=/`;
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
        let clickedList = getClickedDexFromCookie();

        if (img.getAttribute("data-clicked") === "true") {
            // Unselect
            img.setAttribute("data-clicked", "false");
            img.src = getNormalImageUrl(id);
            img.classList.remove("clicked");
            clickedList = clickedList.filter(d => d !== id);

            // Remove individual caught cookie
            document.cookie = `caught_${id}=; max-age=0; path=/`;
        } else {
            // Select
            img.setAttribute("data-clicked", "true");
            img.src = getAlternateImageUrl(id);
            img.classList.add("clicked");
            clickedList.push(id);

            // Set individual caught cookie
            const maxAge = 60 * 60 * 24 * 365 * 100; // 100 years
            document.cookie = `caught_${id}=true; max-age=${maxAge}; path=/`;
        }

        setClickedDexToCookie(clickedList);
    }


    window.onload = function () {
        const clickedList = getClickedDexFromCookie();

        clickedList.forEach(id => {
            const img = document.querySelector(`img[data-id='${id}']`);
            if (img) {
                img.setAttribute("data-clicked", "true");
                img.src = getAlternateImageUrl(id);
                img.classList.add("clicked");
            }
        });
    };