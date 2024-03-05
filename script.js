const API_URL = `https://api.thecatapi.com/v1/`;
const API_KEY = "live_zpTQefYaaBhOpOCb3H27lzR5Vz5MFJzOP64RqkMp9L0sJdgEfcc4C24ImsXlmFPL";

let currentImageToVoteOn;
let storedBreeds = [];

async function initialLoad() {
    try {
        const breedsResponse = await fetchBreeds();
        storedBreeds = breedsResponse.filter(breed => breed.image);
        populateBreedSelector(storedBreeds);
        showBreedImage(0);
    } catch (error) {
        console.error("Error during initial load:", error);
    }
}

async function fetchBreeds() {
    const response = await fetch(`${API_URL}breeds`, {
        headers: {
            'x-api-key': API_KEY
        }
    });
    const data = await response.json();
    return data;
}

function populateBreedSelector(breeds) {
    const breedSelector = document.getElementById('breed_selector');
    breeds.forEach((breed, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = breed.name;
        breedSelector.appendChild(option);
    });
}

function showBreedImage(index) {
    const breed = storedBreeds[index];
    document.getElementById("breed_image").src = breed.image.url;
    document.getElementById("breed_json").textContent = breed.temperament;
    document.getElementById("wiki_link").href = breed.wikipedia_url;
    document.getElementById("wiki_link").textContent = "More info on Wikipedia";
}

async function fetchImages() {
    const response = await fetch(`${API_URL}images/search?limit=20`, {
        headers: {
            'x-api-key': API_KEY
        }
    });
    const data = await response.json();
    return data;
}

async function showVoteOptions() {
    try {
        document.getElementById("grid").innerHTML = '';
        document.getElementById('vote-options').style.display = 'block';
        document.getElementById('vote-results').style.display = 'none';
        const imageData = await fetchImages();
        currentImageToVoteOn = imageData[0];
        document.getElementById("image-to-vote-on").src = currentImageToVoteOn.url;
    } catch (error) {
        console.error("Error showing vote options:", error);
    }
}

async function vote(value) {
    try {
        const url = `${API_URL}votes/`;
        const body = {
            image_id: currentImageToVoteOn.id,
            value
        };
        await axios.post(url, body, {
            headers: {
                'content-type': 'application/json',
                'x-api-key': API_KEY
            }
        });
        showVoteOptions();
    } catch (error) {
        console.error("Error voting:", error);
    }
}

async function getFavourites() {
    try {
        const response = await axios.get(`${API_URL}favourites`, {
            headers: {
                'x-api-key': API_KEY
            }
        });
        const favourites = response.data;
        const grid = document.getElementById('grid');
        grid.innerHTML = '';
        favourites.forEach(favourite => {
            const image = document.createElement('img');
            image.src = favourite.image.url;
            const col = document.createElement('div');
            col.classList.add('col');
            col.appendChild(image);
            grid.appendChild(col);
        });
    } catch (error) {
        console.error("Error fetching favourites:", error);
    }
}



initialLoad();
