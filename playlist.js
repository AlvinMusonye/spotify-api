document.addEventListener("DOMContentLoaded", loadPlaylists);

function addPlaylist() {
    let name = document.getElementById("playlistName").value.trim();
    if (!name) return alert("Playlist name cannot be empty!");
    
    let playlists = JSON.parse(localStorage.getItem("playlists")) || [];
    playlists.push(name);
    localStorage.setItem("playlists", JSON.stringify(playlists));

    document.getElementById("playlistName").value = "";
    loadPlaylists();
}

function editPlaylist(index) {
    let playlists = JSON.parse(localStorage.getItem("playlists")) || [];
    let newName = prompt("Edit playlist name:", playlists[index]);
    if (newName && newName.trim() !== "") {
        playlists[index] = newName.trim();
        localStorage.setItem("playlists", JSON.stringify(playlists));
        loadPlaylists();
    }
}

function deletePlaylist(index) {
    let playlists = JSON.parse(localStorage.getItem("playlists")) || [];
    if (confirm(`Are you sure you want to delete "${playlists[index]}"?`)) {
        playlists.splice(index, 1);
        localStorage.setItem("playlists", JSON.stringify(playlists));
        loadPlaylists();
    }
}

function loadPlaylists() {
    let playlists = JSON.parse(localStorage.getItem("playlists")) || [];
    let list = document.getElementById("playlistList");
    list.innerHTML = "";

    playlists.forEach((playlist, index) => {
        let li = document.createElement("li");
        li.classList.add("flex", "justify-between", "bg-gray-700", "p-2", "rounded-md");

        li.innerHTML = `
            <span>${playlist}</span>
            <div class="space-x-2">
                <button onclick="editPlaylist(${index})" class="text-yellow-400 hover:text-yellow-300">Edit</button>
                <button onclick="deletePlaylist(${index})" class="text-red-400 hover:text-red-300">Delete</button>
            </div>
        `;

        list.appendChild(li);
    });
}