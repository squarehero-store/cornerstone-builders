// ======================================================
//         SquareHero.store Portfolio Spotlight
// ======================================================
(function(window, document) {
    'use strict';

    // Main function to initialize the portfolio
    function initPortfolio() {
        // Check if the feature is enabled
        const metaTag = document.querySelector('meta[squarehero-feature="portfolio"]');
        if (!metaTag || metaTag.getAttribute('enabled') !== 'true') {
            console.log('Portfolio feature is not enabled.');
            return;
        }

        const target = metaTag.getAttribute('target');
        const blogJsonUrl = `/${target}?format=json&nocache=${new Date().getTime()}`;
        console.log('Portfolio JSON URL:', blogJsonUrl);

        var container = document.getElementById('portfolioContainer');

        // Fetch JSON data
        fetch(blogJsonUrl)
            .then(response => response.json())
            .then(data => {
                // Create portfolio structure
                var html = `
                    <div class="header-wrapper">
                        <h1>${data.collection.title}</h1>
                        <div class="filter-item">
                            <span class="filter-label">Category</span>
                            <select id="categoryFilter"></select>
                        </div>
                    </div>
                    <div id="portfolioGrid" class="portfolio-grid"></div>
                `;
                container.innerHTML = html;

                var gridContainer = document.getElementById('portfolioGrid');
                var filterSelect = document.getElementById('categoryFilter');
                var categories = new Set();

                // Create portfolio items
                data.items.forEach(item => {
                    var div = document.createElement('div');
                    var categoryClasses = item.categories ? item.categories.map(cat => cat.replace(/\s+/g, '-').toLowerCase()) : [];
                    div.className = 'portfolio-item mix ' + categoryClasses.join(' ');
                    div.innerHTML = `
                        <a href="${item.fullUrl}">
                            <img src="${item.assetUrl}" alt="${item.title}">
                            <h2>${item.title}</h2>
                        </a>
                    `;
                    gridContainer.appendChild(div);

                    // Collect categories
                    if (item.categories) {
                        item.categories.forEach(cat => categories.add(cat));
                    }
                });

                // Create filter options
                filterSelect.innerHTML = '<option value="all">All</option>';
                categories.forEach(cat => {
                    filterSelect.innerHTML += `<option value=".${cat.replace(/\s+/g, '-').toLowerCase()}">${cat}</option>`;
                });

                // Initialize MixItUp with animations disabled
                var mixer = mixitup(gridContainer, {
                    selectors: {
                        target: '.mix'
                    },
                    animation: {
                        enable: false,
                        duration: 0,
                        nudge: false,
                        reverseOut: false,
                        effects: ''
                    }
                });

                // Add event listener to filter select
                filterSelect.addEventListener('change', function() {
                    var mixer = this.value;
                    mixer.filter(filterValue);
                });
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Run the initialization when the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPortfolio);
    } else {
        initPortfolio();
    }

})(window, document);