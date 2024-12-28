document.addEventListener('DOMContentLoaded', () => {
    // Create and display loader
    const loaderContainer = document.createElement('div');
    loaderContainer.className = 'loader-container'; // Create a container for the loader and text

    const loader = document.createElement('div');
    loader.className = 'previewloader'; // Add a class for styling

    const loaderText = document.createElement('div');
    loaderText.className = 'loader-text'; // Add a class for styling
    loaderText.innerText = 'Just a moment... Fetching the latest projects'; // Customize the loading text

    loaderContainer.appendChild(loader);
    loaderContainer.appendChild(loaderText);
    document.body.appendChild(loaderContainer); // Append loader container to the body

    const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT_pOFYGEptIP4_cgLmzut__zFz8CQ95Q20kkTtY3RUxseFIjf4_bSkDeAVM8ZEsX4LSZYX5gqWGlg4/pub?gid=1680546202&single=true&output=csv';

    fetch(sheetUrl)
        .then(response => response.text())
        .then(data => {

            const rows = data.split('\n').slice(1); // Skip the header row

            const container = document.getElementById('resourceCardContainer');

            rows.forEach(row => {
                if (row.trim() === '') return; // Skip empty rows

                const columns = parseCSVRow(row);
                if (columns.length < 9) {
                    console.warn("Row with insufficient columns:", row);
                    return;
                }

                const [itemType, itemHeading, itemDescription, scriptLink, botLink, extensionLink, frontendLink, previewLink, getItNowLink] = columns;

                const itemCard = document.createElement('div');
                itemCard.className = 'resource-card';

                itemCard.innerHTML = `
                    <p class="item-type">${itemType}</p>
                    <div class="item-details">
                        <p class="item-heading">${itemHeading}</p>
                        <p class="paragraph-small">${itemDescription}</p>
                    </div>
                    <div class="item-links">
                        ${scriptLink ? `<a class="item-repo-link" href="${scriptLink}" target="_blank" rel="noopener noreferrer" aria-label="Script" title="Script">Script</a>` : ''}
                        ${botLink ? `<a class="item-repo-link" href="${botLink}" target="_blank" rel="noopener noreferrer" aria-label="Bot" title="Bot">Bot</a>` : ''}
                        ${extensionLink ? `<a class="item-repo-link" href="${extensionLink}" target="_blank" rel="noopener noreferrer" aria-label="Extension" title="Extension">Extension</a>` : ''}
                        ${frontendLink ? `<a class="item-repo-link" href="${frontendLink}" target="_blank" rel="noopener noreferrer" aria-label="Frontend" title="Frontend">Frontend</a>` : ''}
                        ${previewLink ? `<a class="item-repo-link" href="${previewLink}" target="_blank" rel="noopener noreferrer" aria-label="Preview" title="Preview">Preview</a>` : ''}
                        ${getItNowLink ? `<a class="item-repo-link" href="${getItNowLink}" target="_blank" rel="noopener noreferrer" aria-label="Get it now" title="Get it now">Get it now</a>` : ''}
                    </div>
                `;

                container.appendChild(itemCard);
            });

            // Hide loader after all cards are displayed
            loader.style.display = 'none'; // Hide the loader
            loaderText.style.display = 'none'; // Hide the loading text
        })
        .catch(error => {
            console.error('Error fetching or processing the data:', error);
            loader.style.display = 'none'; // Hide loader on error
            loaderText.style.display = 'none'; // Hide loading text on error
        });

    // Alternative manual CSV parsing function
    function parseCSVRow(row) {
        const columns = [];
        let currentColumn = "";
        let inQuotes = false;

        for (let i = 0; i < row.length; i++) {
            const char = row[i];

            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                columns.push(currentColumn);
                currentColumn = "";
            } else {
                currentColumn += char;
            }
        }

        columns.push(currentColumn); // Add the last column
        return columns.map(col => col.trim()); // Trim whitespace from each column
    }

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const cards = document.querySelectorAll('.resource-card');
        cards.forEach(card => {
            const itemType = card.querySelector('.item-type').textContent.toLowerCase();
            const itemHeading = card.querySelector('.item-heading').textContent.toLowerCase();
            const itemDescription = card.querySelector('.paragraph-small').textContent.toLowerCase();
            if (itemType.includes(query) || itemHeading.includes(query) || itemDescription.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});
