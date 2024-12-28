document.addEventListener('DOMContentLoaded', () => {

    // Only execute if 'hero-cards' exists (index.html)
    if (document.getElementById('hero-cards')) {
        // Fetching data for hero cards
        fetch('assets/json/cite.json')
            .then(response => response.json())
            .then(data => {
                const heroCards = document.getElementById('hero-cards');
                const cardsContainer = document.createElement('div');
                cardsContainer.className = 'hero-cards-container';
                heroCards.appendChild(cardsContainer);

                function populateCards() {
                    cardsContainer.innerHTML = ''; // Clear previous cards

                    // Duplicate the data array for continuous loop
                    const duplicatedData = [...data, ...data];

                    duplicatedData.forEach(item => {
                        const card = document.createElement('div');
                        card.className = 'card hero-card';
                        card.innerHTML = `
                        <a href="${item.link}" target="_blank" class="card-link">
                            <div class="cite-profile">
                                <img src="${item.image}" alt="${item.name}">
                                <div class="cite-name">
                                    <h6>${item.name}</h6>
                                    <p>${item.username}</p>
                                </div>
                            </div>
                            <p class="cite-content">${item.content}</p>
                            <p class="timestamp">${item.timestamp}</p>
                        </a>
                    `;
                        cardsContainer.appendChild(card);
                    });
                }

                populateCards();

                // Set animation duration based on the number of cards
                const animationDuration = data.length * 6; // Adjust 4 for desired speed (slower)
                cardsContainer.style.animationDuration = `${animationDuration}s`;
            });
    }

    // Only execute if 'collection' exists (index.html)
    if (document.getElementById('collection')) {
        // Fetching data for collection cards
        fetch('assets/json/collection.json')
            .then(response => response.json())
            .then(data => {
                const collection = document.getElementById('collection');
                data.forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'collection-card';
                    card.innerHTML = `
                    <img src="${item.image}" alt="${item.heading}">
                    <h6>${item.heading}</h6>
                    <p>${item.subtitle}</p>
                `;
                    card.addEventListener('click', () => {
                        window.open(item.link, '_blank');
                    });
                    collection.appendChild(card);
                });
            });
    }

    // Only execute if 'featured-items' exists (index.html)
    if (document.getElementById('featured-items')) {
        // Fetching data for featured items
        fetch('assets/json/featured.json')
            .then(response => response.json())
            .then(data => {
                const featuredItems = document.getElementById('featured-items');
                const featuredImage = document.getElementById('featured-image');
                let activeIndex = 0;
                let animationInterval = null;
                let loaderInterval = null;

                // Display all headings initially
                data.forEach((item, index) => {
                    const heading = document.createElement('div');
                    heading.className = 'featured-heading';
                    heading.innerHTML = `<h6>${item.heading}</h6>`;
                    heading.addEventListener('click', () => {
                        // Clear existing intervals
                        if (animationInterval) clearInterval(animationInterval);
                        if (loaderInterval) clearInterval(loaderInterval);

                        activeIndex = index;
                        updateFeatured(true); // true indicates manual click
                    });
                    featuredItems.appendChild(heading);
                });

                function updateFeatured(isManualClick = false) {
                    const activeItem = data[activeIndex];

                    // Update image and content
                    featuredImage.src = activeItem.image;
                    featuredImage.alt = activeItem.heading;

                    const activeContent = document.createElement('div');
                    activeContent.innerHTML = `
                    <h4>${activeItem.heading}</h4>
                    <p>${activeItem.subtitle}</p>
                    <a href="${activeItem.buttonLink}" target="_blank">${activeItem.buttonLabel}</a>
                `;

                    const activeContainer = document.getElementById('active-content');
                    activeContainer.innerHTML = '';
                    activeContainer.appendChild(activeContent);

                    // Update headings
                    const headings = featuredItems.querySelectorAll('.featured-heading h6');
                    headings.forEach((heading, index) => {
                        if (index === activeIndex) {
                            heading.classList.add('active');
                        } else {
                            heading.classList.remove('active');
                        }
                    });

                    // Create and start loader
                    const loader = document.createElement('div');
                    loader.className = 'loader';
                    activeContainer.appendChild(loader);

                    let progress = 0;

                    // Clear any existing intervals
                    if (loaderInterval) clearInterval(loaderInterval);
                    if (animationInterval) clearInterval(animationInterval);

                    // Start new loader interval
                    loaderInterval = setInterval(() => {
                        progress += 1; // Slower increment for smoother animation
                        loader.style.width = `${progress}%`;

                        if (progress >= 100) {
                            clearInterval(loaderInterval);

                            // Only set up next slide if this wasn't triggered by a manual click
                            if (!isManualClick) {
                                activeIndex = (activeIndex + 1) % data.length;
                                // Use setTimeout to ensure consistent timing between slides
                                animationInterval = setTimeout(() => {
                                    updateFeatured(false);
                                }, 1000);
                            }
                        }
                    }, 40); // 40ms * 100 increments = ~4 seconds total
                }

                // Initial call to start the feature
                updateFeatured(false);
            });
    }

    // Only execute if 'main-item' exists (index.html)
    if (document.getElementById('main-item')) {
        // Fetching data for writings
        fetch('assets/json/blog.json')
            .then(response => response.json())
            .then(data => {
                const mainItemContainer = document.getElementById('main-item');
                const horizontalItemsContainer = document.getElementById('horizontal-items');
                const verticalItemsContainer = document.getElementById('vertical-items');

                const mainCard = data.find(item => item.tag === 'main');
                const horizontalCards = data.filter(item => item.tag === 'horizontal').slice(0, 4);
                const verticalCards = data.filter(item => item.tag === 'vertical');

                // Populate main item
                if (mainCard) {
                    const main = document.createElement('div');
                    main.className = 'main-card';
                    main.innerHTML = `
                    <img src="${mainCard.image}" alt="${mainCard.heading}">
                    <h5>${mainCard.heading}</h5>
                    <p>${mainCard.subtitle}</p>
                    <p class="timestamp">${mainCard.timestamp}</p>
                `;
                    main.addEventListener('click', () => {
                        window.open(mainCard.link, '_blank');
                    });
                    mainItemContainer.appendChild(main);
                }

                // Populate horizontal cards
                horizontalCards.forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'horizontal-card';
                    card.innerHTML = `
                    <img src="${item.image}" alt="${item.heading}">
                    <div class="horizontal-title">
                        <h6>${item.heading}</h6>
                        <p>${item.subtitle}</p>
                        <p class="timestamp">${item.timestamp}</p>
                    </div>
                `;
                    card.addEventListener('click', () => {
                        window.open(item.link, '_blank');
                    });
                    horizontalItemsContainer.appendChild(card);
                });

                // Populate vertical cards
                verticalCards.forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'vertical-card';
                    card.innerHTML = `
                    <img src="${item.image}" alt="${item.heading}">
                    <h6>${item.heading}</h6>
                    <p>${item.subtitle}</p>
                    <p class="timestamp">${item.timestamp}</p>
                `;
                    card.addEventListener('click', () => {
                        window.open(item.link, '_blank');
                    });
                    verticalItemsContainer.appendChild(card);
                });
            });
    }

    // Only execute if 'main-design' exists (index.html)
    if (document.getElementById('main-design')) {
        // Fetching data for designs
        fetch('assets/json/designs.json')
            .then(response => response.json())
            .then(data => {
                const mainDesignContainer = document.getElementById('main-design');
                const verticalDesignsLeftContainer = document.getElementById('vertical-designs-left');
                const verticalDesignsRightContainer = document.getElementById('vertical-designs-right');
                const horizontalDesignsContainer = document.getElementById('horizontal-designs');

                const mainDesign = data.find(item => item.tag === 'main');
                const verticalDesigns = data.filter(item => item.tag === 'vertical');
                const horizontalDesigns = data.filter(item => item.tag === 'horizontal');

                // Populate main design
                if (mainDesign) {
                    const main = document.createElement('a');
                    main.className = 'main-design-card';
                    main.href = mainDesign.link; // Add the link here
                    main.target = '_blank'; // Open in a new tab
                    main.innerHTML = `
                    <img src="${mainDesign.image}" alt="${mainDesign.heading}">
                    <h5>${mainDesign.heading}</h5>
                    <p class="main-p">${mainDesign.subtitle}</p>
                    <p class="tag">${mainDesign.displayTag}</p>
                `;
                    mainDesignContainer.appendChild(main);
                }

                // Populate vertical designs (left)
                verticalDesigns.slice(0, 2).forEach(item => {
                    const card = document.createElement('a');
                    card.className = 'vertical-design-card';
                    card.href = item.link; // Add the link here
                    card.target = '_blank'; // Open in a new tab
                    card.innerHTML = `
                    <img src="${item.image}" alt="${item.heading}">
                    <h6>${item.heading}</h6>
                    <p>${item.subtitle}</p>
                    <p class="tag">${item.displayTag}</p>
                `;
                    verticalDesignsLeftContainer.appendChild(card);
                });

                // Populate vertical designs (right)
                verticalDesigns.slice(2, 4).forEach(item => {
                    const card = document.createElement('a');
                    card.className = 'vertical-design-card';
                    card.href = item.link; // Add the link here
                    card.target = '_blank'; // Open in a new tab
                    card.innerHTML = `
                    <img src="${item.image}" alt="${item.heading}">
                    <h6>${item.heading}</h6>
                    <p>${item.subtitle}</p>
                    <p class="tag">${item.displayTag}</p>
                `;
                    verticalDesignsRightContainer.appendChild(card);
                });

                // Populate horizontal designs
                horizontalDesigns.forEach(item => {
                    const card = document.createElement('a');
                    card.className = 'horizontal-design-card';
                    card.href = item.link; // Add the link here
                    card.target = '_blank'; // Open in a new tab
                    card.innerHTML = `
                    <img src="${item.image}" alt="${item.heading}">
                    <h6>${item.heading}</h6>
                    <p>${item.subtitle}</p>
                    <p class="tag">${item.displayTag}</p>
                `;
                    horizontalDesignsContainer.appendChild(card);
                });
            });
    }

    const hamburger = document.getElementById('hamburger');
    const modal = document.getElementById('modal');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    if (modal) {
        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Only execute if 'blockElement' exists (index.html)
    if (document.getElementById('blockElement')) {
        const element = document.getElementById('blockElement');
        element.addEventListener('contextmenu', (event) => {
            event.preventDefault(); // Block the right-click menu
        });
    }

    // Block right-click functionality
    document.addEventListener('contextmenu', (event) => {
        event.preventDefault(); // Block the right-click menu
    });
});

function updateClock() {
    const now = new Date();
    const hours = now.getHours() % 12 || 12; // Convert to 12-hour format
    const minutes = now.getMinutes();
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    const timeString = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    document.getElementById('clock').textContent = timeString;
}

setInterval(updateClock, 1000);
updateClock(); // Initial call to display the time immediately