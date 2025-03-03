const clientId = '471b927dedf643118a9821513d83ca58';  
const clientSecret = '8310b0c3fb3e4599adab85652d2da2af';

const searchBox = document.getElementById("searchBox");
const searchBtn = document.getElementById("searchBtn"); 
const songList = document.getElementById("songResults");

async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    if (!data.access_token) {
        alert("Failed to get access token. Check your credentials.");
        return null;
    }
    return data.access_token;
}

async function searchSpotifySongs(query) {
    const accessToken = await getAccessToken();
    if (!accessToken) return;

    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + accessToken }
    });

    const data = await response.json();
    displaySongs(data.tracks.items);
}

function displaySongs(songs) {
    const songContainer = document.querySelector('.menu_song');
    songContainer.innerHTML = '';  
    songContainer.classList.add('flex', 'flex-wrap', 'gap-4'); 

    songs.forEach((song) => {
        let spotifyUrl = song.external_urls.spotify; 

        let songCard = document.createElement('div');
        songCard.classList.add('bg-gray-800', 'text-white', 'p-4', 'rounded-lg', 'w-48', 'shadow-lg', 'hover:bg-gray-700', 'transition');

        songCard.innerHTML = `
            <img src="${song.album.images[0]?.url || 'default.jpg'}" alt="${song.name}" class="w-full h-32 object-cover rounded-md">
            <h5 class="mt-2 text-sm font-semibold">${song.name}</h5>
            <p class="text-xs text-gray-400">${song.artists.map(artist => artist.name).join(', ')}</p>
            <button onclick="playSong('${spotifyUrl}')" class="mt-2 bg-blue-500 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-400">
               Play Song
            </button>
        `;

        songContainer.appendChild(songCard);
    });
}

function playSong(url) {
    console.log("Opening Spotify:", url);
    window.open(url, '_blank'); 
}

searchBtn.addEventListener("click", () => {
    let query = searchBox.value.trim();
    if (query) {
        searchSpotifySongs(query);
    } else {
        alert("Please enter a song name!");
    }
});
const audioPlayer = document.getElementById("audioPlayer");
const progressBar = document.getElementById("progressBar");
const currentTimeDisplay = document.getElementById("currentTime");
const totalTimeDisplay = document.getElementById("totalTime");
const playPauseBtn = document.getElementById("playPauseBtn");

let isPlaying = false;

function formatTime(seconds) {
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}


audioPlayer.addEventListener("timeupdate", () => {
    progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
});


audioPlayer.addEventListener("loadedmetadata", () => {
    totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
});


progressBar.addEventListener("input", () => {
    audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
});


playPauseBtn.addEventListener("click", () => {
    if (isPlaying) {
        audioPlayer.pause();
        playPauseBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
    } else {
        audioPlayer.play();
        playPauseBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
    }
    isPlaying = !isPlaying;
});

document.getElementById("playBtn").addEventListener("click", function () {
    let audio = document.getElementById("audioPlayer");
    if (audio.paused) {
        audio.play().catch(error => console.error("Playback failed:", error));
    } else {
        audio.pause();
    }
});

