// Array to hold the songs added to the application
const songs = [];
let player; // Variable to hold the YouTube player instance
let currentSong; // To store the song being added to the playlist

// This function is called by the YouTube IFrame API when the API is ready
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: '', // Initially empty
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// This function is called when the player is ready
function onPlayerReady(event) {
    // Player is ready for interaction
}

// This function is called when the player's state changes
function onPlayerStateChange(event) {
    // Handle state changes if needed (e.g., play, pause, end)
}

// Function to play a song using the video ID
function playSong(videoId) {
    player.loadVideoById(videoId); // Load and play the video by its ID
    document.getElementById('player').style.display = 'block'; // Show the player
}

// Function to add a song via YouTube URL
function addSongViaYouTube() {
    const youtubeUrlInput = document.getElementById('youtubeUrl');
    const youtubeUrl = youtubeUrlInput.value; // Get the YouTube URL from input
    const videoId = youtubeUrl.split('v=')[1]?.split('&')[0]; // Extract video ID from URL
    const songName = prompt("Enter the name of the song:"); // Prompt user for song name

    // Check if both video ID and song name are provided
    if (videoId && songName) {
        const newSong = {
            id: songs.length + 1, // Assign a unique ID based on current length
            name: songName, // Store the song name
            mood: "Any", // Default mood for the song
            audioSrc: videoId // Store the video ID for playback
        };

        songs.push(newSong); // Add the new song to the songs array
        displaySongs(); // Refresh the song list in the Available Songs section
        youtubeUrlInput.value = ""; // Clear the input field
    } else {
        alert("Please fill in all fields."); // Alert if fields are empty
    }
}

// Function to display songs in the list
function displaySongs() {
    const songList = document.getElementById('songList');
    songList.innerHTML = ''; // Clear existing songs

    // Loop through each song and create list items
    songs.forEach(song => {
        const li = document.createElement('li');
        li.textContent = song.name; // Set the text content to the song name

        // Create a button to play the song
        const playButton = document.createElement('button');
        playButton.textContent = "Play"; // Button text
        playButton.addEventListener('click', () => playSong(song.audioSrc)); // Play song on click

        // Create a button to add the song to the playlist
        const addToPlaylistButton = document.createElement('button');
        addToPlaylistButton.textContent = "+"; // Change button text to "+"
        addToPlaylistButton.addEventListener('click', () => promptAddToPlaylist(song)); // Prompt for mood

        li.appendChild(playButton); // Add play button to list item
        li.appendChild(addToPlaylistButton); // Add add-to-playlist button to list item
        songList.appendChild(li); // Append the list item to the song list
    });
}

// Function to prompt for mood before adding to playlist
function promptAddToPlaylist(song) {
    currentSong = song; // Store the current song to be added
    document.getElementById('addToPlaylistModal').style.display = 'block'; // Show the modal for mood selection
}

// Function to confirm adding to playlist
document.getElementById('confirmAddToPlaylistBtn').addEventListener('click', () => {
    const mood = document.getElementById('moodSelect').value; // Get selected mood from dropdown

    // Add the song to the playlist based on the selected mood
    addToPlaylist(currentSong, mood);
    document.getElementById('addToPlaylistModal').style.display = 'none'; // Hide the modal
});

// Function to cancel adding to playlist
document.getElementById('cancelAddToPlaylistBtn').addEventListener('click', () => {
    document.getElementById('addToPlaylistModal').style.display = 'none'; // Hide the modal
});

// Function to add a song to the playlist based on mood
function addToPlaylist(song, mood) {
    // Update the song's mood to the selected mood
    song.mood = mood;

    // Get the appropriate playlist container based on the mood
    const playlistContainer = document.getElementById(`${mood}Songs`).getElementsByTagName("ul")[0];
    const newRow = document.createElement("li"); // Create a new list item for the song
    newRow.textContent = song.name; // Set the text content to the song name

    // Create a play button for the song
    const playButton = document.createElement('button');
    playButton.textContent = "Play"; // Button text
    playButton.addEventListener('click', () => playSong(song.audioSrc)); // Play song on click

    // Create a remove button for the song
    const removeButton = document.createElement('button');
    removeButton.textContent = "Remove"; // Button text
    removeButton.addEventListener('click', () => removeFromPlaylist(song, mood)); // Remove song on click

    newRow.appendChild(playButton); // Add play button to the new list item
    newRow.appendChild(removeButton); // Add remove button to the new list item
    playlistContainer.appendChild(newRow); // Append the new song to the appropriate playlist

    // Show the playlist section if it has songs
    togglePlaylistVisibility(mood);
    
    // Show the entire playlist section if any song is added
    document.getElementById('playlistSection').style.display = 'block';
}

// Function to remove a song from the playlist
function removeFromPlaylist(song, mood) {
    // Get the appropriate playlist container based on the mood
    const playlistContainer = document.getElementById(`${mood}Songs`).getElementsByTagName("ul")[0];

    // Find the song in the playlist and remove it
    const songItems = playlistContainer.getElementsByTagName("li");
    for (let i = 0; i < songItems.length; i++) {
        if (songItems[i].textContent.includes(song.name)) {
            playlistContainer.removeChild(songItems[i]); // Remove the song from the playlist
            break; // Exit the loop once the song is found and removed
        }
    }

    // Hide the playlist if it has no songs left
    togglePlaylistVisibility(mood);
}

// Function to play a song using the video ID
function playSong(videoId) {
    console.log(`Playing video with ID: ${videoId}`); // Log the video ID for debugging
    if (player) { // Check if the player is initialized
        player.loadVideoById(videoId); // Load and play the video by its ID
        document.getElementById('player').style.display = 'block'; // Show the player
    } else {
        console.error("YouTube player is not initialized."); // Log an error if player is not ready
    }
}

// Function to show or hide the playlist based on its content
function togglePlaylistVisibility(mood) {
    const playlistContainer = document.getElementById(`${mood}Songs`);
    if (playlistContainer.getElementsByTagName("ul")[0].children.length > 0) {
        playlistContainer.style.display = 'block'; // Show the playlist if it has songs
    } else {
        playlistContainer.style.display = 'none'; // Hide if no songs
    }
}
// Function to filter songs based on user input
function filterSongs() {
    const moodFilter = document.getElementById('mood').value; // Get the selected mood filter
    
    // Filter songs based on the selected mood
    const filteredSongs = songs.filter(song => {
        const moodMatch = moodFilter ? song.mood === moodFilter : true; // Check if mood matches
        return moodMatch; // Return true if it matches or if no filter is selected
    });

    displayFilteredSongs(filteredSongs); // Display the filtered songs
}

// Function to display filtered songs
function displayFilteredSongs(filteredSongs) {
    const songList = document.getElementById('songList');
    songList.innerHTML = ''; // Clear existing songs

    // Loop through each filtered song and create list items
    filteredSongs.forEach(song => {
        const li = document.createElement('li');
        li.textContent = song.name; // Set the text content to the song name

        // Create a button to play the song
        const playButton = document.createElement('button');
        playButton.textContent = "Play"; // Button text
        playButton.addEventListener('click', () => playSong(song.audioSrc)); // Play song on click

        // Create a button to add the song to the playlist
        const addToPlaylistButton = document.createElement('button');
        addToPlaylistButton.textContent = "Add to Playlist"; // Button text
        addToPlaylistButton.addEventListener('click', () => promptAddToPlaylist(song)); // Prompt for mood

        li.appendChild(playButton); // Add play button to list item
        li.appendChild(addToPlaylistButton); // Add add-to-playlist button to list item
        songList.appendChild(li); // Append the list item to the song list
    });
}

// Event listeners for adding songs and filtering
document.getElementById('addSongBtn').addEventListener('click', addSongViaYouTube); // Add song button
document.getElementById('filterToggleBtn').addEventListener('click', () => {
    const filterOptions = document.getElementById('filterOptions');
    const filterText = document.getElementById('filterText');

    // Toggle the display of filter options
    if (filterOptions.style.display === 'none') {
        filterOptions.style.display = 'block'; // Show filter options
        filterText.style.display = 'block'; // Show filter text
    } else {
        filterOptions.style.display = 'none'; // Hide filter options
        filterText.style.display = 'none'; // Hide filter text
    }
});

// Event listener for mood selection change
document.getElementById('mood').addEventListener('change', filterSongs); // Filter songs based on mood