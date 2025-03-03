document.addEventListener("DOMContentLoaded", () => {
    const apiURL = "https://de1.api.radio-browser.info/json/stations/search?limit=10";
    const stationList = document.getElementById("stationList");
    const audioPlayer = document.getElementById("audioPlayer");
    const nowPlaying = document.getElementById("nowPlaying");

    
    async function fetchRadioStations() {
        try {
            const response = await fetch(apiURL);
            const stations = await response.json();

            stationList.innerHTML = ""; 

            stations.slice(0, 10).forEach(station => { 
                const stationItem = document.createElement("div");
                stationItem.classList = "flex justify-between items-center bg-gray-800 text-white p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition";
                
                stationItem.innerHTML = `
                    <div>
                        <h3 class="text-lg font-semibold">${station.name}</h3>
                        <p class="text-sm text-gray-400">${station.country}</p>
                    </div>
                    <button class="bg-blue-500 text-white px-4 py-2 rounded play-btn" data-url="${station.url_resolved}">Play</button>
                `;

                stationList.appendChild(stationItem);
            });

        
            document.querySelectorAll(".play-btn").forEach(button => {
                button.addEventListener("click", (e) => {
                    const streamURL = e.target.getAttribute("data-url");
                    playRadio(streamURL, e.target);
                });
            });

        } catch (error) {
            console.error("Error fetching radio stations:", error);
            stationList.innerHTML = "<p class='text-red-500'>Failed to load stations</p>";
        }
    }

    function playRadio(streamURL, button) {
        if (audioPlayer.src === streamURL && !audioPlayer.paused) {
            audioPlayer.pause();
            button.textContent = "Play";
            nowPlaying.textContent = "Paused";
        } else {
            audioPlayer.src = streamURL;
            audioPlayer.play();
            document.querySelectorAll(".play-btn").forEach(btn => btn.textContent = "Play");
            button.textContent = "Pause";
            nowPlaying.textContent = `Now Playing: ${button.previousElementSibling.children[0].textContent}`;
        }
    }

  
    fetchRadioStations();
});
