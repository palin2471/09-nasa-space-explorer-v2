// NASA API Configuration
const NASA_API_KEY = 'eukws1KQ3h7o1i0VThgU1e2s2KkMJAsmjva8Jvbv'; // Replace with your actual API key from api.nasa.gov
const NASA_API_URL = 'https://api.nasa.gov/planetary/apod';

// Array of fun space facts for beginners
const spaceFacts = [
    "🌌 Did you know? A day on Venus is longer than a year on Venus!",
    "🌠 A light-year is the distance light travels in one year: about 5.88 trillion miles!",
    "🪐 Jupiter is so big that 1,300 Earths could fit inside it!",
    "🌙 The Moon is moving away from Earth at about 1.5 inches per year.",
    "☄️ Asteroids have no gravity strong enough to pull them into a sphere shape.",
    "🌍 Earth is the only planet known to have life on it.",
    "🔭 The Andromeda Galaxy is on a collision course with our Milky Way!",
    "⭐ Some stars are so large that the Sun would look like a grain of sand next to them!",
    "🛸 There are more stars in the universe than grains of sand on all Earth's beaches!",
    "🌑 A black hole's gravity is so strong that not even light can escape it!"
];

// Store the current random fact
let currentFact = '';

// Get HTML elements
const getImagesBtn = document.getElementById('getImagesBtn');
const gallery = document.getElementById('gallery');
const loadingMessage = document.getElementById('loadingMessage');
const funFactContainer = document.getElementById('funFactContainer');
const funFactText = document.getElementById('funFactText');
const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById('closeModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');

// Event listener for "Get Space Images" button
getImagesBtn.addEventListener('click', fetchSpaceImages);

// Event listener to close modal
closeModalBtn.addEventListener('click', closeModal);

// Close modal when clicking outside the modal content
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

// Function to get a random space fact
function getRandomSpaceFact() {
    // Generate a random number between 0 and the length of spaceFacts array
    const randomIndex = Math.floor(Math.random() * spaceFacts.length);
    // Return the space fact at that random index
    return spaceFacts[randomIndex];
}

// Fetch space images from NASA API
async function fetchSpaceImages() {
    try {
        // Get a random space fact and store it
        currentFact = getRandomSpaceFact();

        // Show loading message
        loadingMessage.textContent = '🔄 Loading space photos…';
        loadingMessage.style.display = 'block';
        gallery.innerHTML = '';
        funFactContainer.style.display = 'none';

        // Fetch data from NASA API (get last 10 days of images)
        const params = new URLSearchParams({
            api_key: NASA_API_KEY,
            count: 12 // Get 12 random images
        });

        const response = await fetch(`${NASA_API_URL}?${params}`);
        const data = await response.json();

        // Check if response is an array (multiple images)
        const images = Array.isArray(data) ? data : [data];

        // Hide loading message
        loadingMessage.style.display = 'none';

        // Display gallery
        displayGallery(images);

    } catch (error) {
        // Hide loading message on error
        loadingMessage.style.display = 'none';
        console.error('Error fetching images:', error);
        gallery.innerHTML = `<p style="color: #06b6d4; grid-column: 1/-1; text-align: center;">
            Error loading images. Please try again.
        </p>`;
    }
}

// Display gallery items
function displayGallery(images) {
    // Clear existing gallery
    gallery.innerHTML = '';

    // Create gallery items for each image
    images.forEach((image) => {
        // Only display items that have images (not videos)
        if (image.media_type === 'image') {
            const galleryItem = createGalleryItem(image);
            gallery.appendChild(galleryItem);
        }
    });

    // Display the fun fact after gallery loads
    funFactText.textContent = currentFact;
    funFactContainer.style.display = 'block';
}

// Create individual gallery item
function createGalleryItem(imageData) {
    // Create container for gallery item
    const item = document.createElement('div');
    item.className = 'gallery-item';

    // Format the date
    const date = new Date(imageData.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    // Insert HTML structure with image wrapper for hover effect
    item.innerHTML = `
        <div class="gallery-item-image-wrapper">
            <img src="${imageData.url}" alt="${imageData.title}" loading="lazy" class="gallery-item-image">
        </div>
        <div class="gallery-item-info">
            <div class="gallery-item-title">${imageData.title}</div>
            <div class="gallery-item-date">${date}</div>
        </div>
    `;

    // Add click event to open modal
    item.addEventListener('click', () => {
        openModal(imageData);
    });

    return item;
}

// Open modal with full image details
function openModal(imageData) {
    // Set modal content
    modalImage.src = imageData.url;
    modalTitle.textContent = imageData.title;

    // Format the date
    const date = new Date(imageData.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    modalDate.textContent = `Date: ${date}`;

    // Display explanation text
    modalExplanation.textContent = imageData.explanation;

    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Close modal
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Enable scrolling
}
