// 1. Wait for the HTML building to finish loading
document.addEventListener('DOMContentLoaded', () => {
    // --- HAMBURGER MENU LOGIC ---
    const hamburger = document.getElementById('hamburger-menu');
    const navLinks = document.getElementById('nav-links');
    const desktopArrow = document.getElementById('desktop-arrow');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active'); // Opens and closes the menu
        
        // This makes the bouncing arrow disappear forever once they click the menu!
        if (desktopArrow) {
            desktopArrow.style.display = 'none';
        }
    });
    
    // 2. Identify the important parts of the building
    const databaseContainer = document.getElementById('database');
    const searchInput = document.getElementById('searchInput');
    const noResultsMessage = document.getElementById('no-results-message');
    let authorData = []; // This empty box will hold our data from the truck

    // 3. The Librarian fetches the data from the truck
    fetch('data/database.json')
        .then(response => response.json())
        .then(data => {
            authorData = data; // Save the data into our box
            displayAuthors(authorData); // Tell the Librarian to put them on the shelves
        })
        .catch(error => console.error('Error loading the database:', error));

    // 4. The function that builds the actual cards on the screen
    function displayAuthors(authors) {
        // Clear the shelves first (except for the no-results message)
        const cards = databaseContainer.querySelectorAll('.author-card');
        cards.forEach(card => card.remove());

        // If the list is empty, show the "crystal ball is cloudy" message
        if (authors.length === 0) {
            noResultsMessage.classList.remove('hidden');
            return;
        } else {
            noResultsMessage.classList.add('hidden');
        }

        // For every author in the list, build their display case
        authors.forEach(author => {
            const card = document.createElement('div');
            card.classList.add('author-card');

            // This injects the HTML for the author's specific data in the NEW order!
            card.innerHTML = `
                <img src="${author.book_cover}" alt="Cover of ${author.book_title}" class="book-cover-image">
                
                <h2>${author.book_title}</h2>
                <h3 class="author-name-tag">By <a href="${author.links.author_website}" target="_blank" class="author-name-link">${author.author_name}</a></h3>
                <p class="synopsis">${author.synopsis}</p>
                <p style="margin-bottom: 20px;"><strong>Genres:</strong> ${author.genres.join(', ')}</p>
                
                <div class="author-action-row">
                    <img src="${author.author_image}" alt="Photo of ${author.author_name}" class="author-bio-diamond">
                    <a href="${author.links.amazon}" target="_blank" class="gold-btn">Let's Read It!</a>
                </div>
            `;
            
            // Put the finished card onto the shelf
            databaseContainer.appendChild(card);
        });
    }

    // 5. The Search Function (The real-time filtering)
    searchInput.addEventListener('input', (e) => {
        const searchString = e.target.value.toLowerCase();
        
        // Filter the books based on what the user types
        const filteredAuthors = authorData.filter(author => {
            return (
                author.author_name.toLowerCase().includes(searchString) ||
                author.book_title.toLowerCase().includes(searchString) ||
                author.genres.join(' ').toLowerCase().includes(searchString) ||
                author.synopsis.toLowerCase().includes(searchString) // <-- THIS MAKES IT SEARCH THE SYNOPSIS!
            );
        });
        
        // Tell the Librarian to display only the filtered results
        displayAuthors(filteredAuthors);
    });

    // 6. Clear Filters Button Logic
    document.getElementById('clearFiltersBtn').addEventListener('click', () => {
        searchInput.value = ''; // Empty the search bar
        displayAuthors(authorData); // Show all books again
    });
});