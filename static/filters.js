document.addEventListener('DOMContentLoaded', function() {
    const colorCheckboxes = document.querySelectorAll('input[name="color"]');
    const rarityCheckboxes = document.querySelectorAll('input[name="rarity"]');
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const cardsContainer = document.getElementById('cards-container');

    function filterCards(sortOrder = 'asc') {
        const selectedColors = Array.from(colorCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        const selectedRarities = Array.from(rarityCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        const searchTerm = searchInput.value.toLowerCase();

        fetch('/filter_cards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                release_date: sortSelect.value,
                colors: selectedColors,
                rarities: selectedRarities,
                searchTerm: searchTerm,
                sortOrder: sortOrder
            })
        })
        .then(response => response.json())
        .then(filteredCards => {
            cardsContainer.innerHTML = '';
            filteredCards.forEach(card => {
                const cardElement = document.createElement('div');
                cardElement.classList.add('card');
                cardElement.dataset.colors = card.colors ? card.colors.join(' ') : '';
                cardElement.dataset.rarity = card.rarity || '';
                cardElement.dataset.name = card.name || '';
                cardElement.innerHTML = `
                    <img src="/static/card_images/${card.set_name}/${card.scryfall_id}" alt="${card.name}">
                    <h3>${card.name}</h3>
                    <p>Set: ${card.set_name}</p>
                    <p>Price: ${card.prices.usd}</p>
                `;
                cardsContainer.appendChild(cardElement);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    colorCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => filterCards(sortSelect.value));
    });

    rarityCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => filterCards(sortSelect.value));
    });

    searchInput.addEventListener('input', () => filterCards(sortSelect.value));
    sortSelect.addEventListener('change', () => filterCards(sortSelect.value));
});
