// SquareHero: Combined Portfolio Functionality Script
(function() {
    // Portfolio Banner Function
    function insertPortfolioBanner() {
        const ogImage = document.querySelector('meta[property="og:image"]');
        const imageUrl = ogImage ? ogImage.content.replace('http:', 'https:') : '';
        
        if (imageUrl) {
            const bannerDiv = document.createElement('div');
            bannerDiv.className = 'portfolio-banner';
            
            const wrapperDiv = document.createElement('div');
            wrapperDiv.className = 'portfolio-banner-wrapper';
            bannerDiv.appendChild(wrapperDiv);
            
            const imageContainer = document.createElement('div');
            imageContainer.className = 'portfolio-banner-image';
            
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.alt = 'Portfolio Banner';
            imageContainer.appendChild(imgElement);
            wrapperDiv.appendChild(imageContainer);
            
            const header = document.getElementById('header');
            if (header) {
                header.insertAdjacentElement('afterend', bannerDiv);
            } else {
                document.body.insertAdjacentElement('afterbegin', bannerDiv);
            }
            
            const firstSection = document.querySelector('article section:first-of-type');
            if (firstSection) {
                firstSection.style.paddingTop = '0px';
            }
            
            function setBannerPadding() {
                const header = document.getElementById('header');
                if (header && bannerDiv) {
                    const headerHeight = header.offsetHeight;
                    bannerDiv.style.paddingTop = `${headerHeight}px`;
                }
            }
            
            setTimeout(setBannerPadding, 100);
            
            window.addEventListener('resize', setBannerPadding);
            
            document.body.classList.add('has-portfolio-banner');
        } else {
            console.error('Could not find og:image meta tag for portfolio banner');
        }
    }

    // Move Content Wrapper Function
    function moveContentWrapper() {
        const topWrapper = document.querySelector('.blog-item-top-wrapper');
        const contentWrapper = document.querySelector('.blog-item-content-wrapper');
        
        if (topWrapper && contentWrapper) {
            topWrapper.appendChild(contentWrapper);
        }
    }

    // Related Projects Functions
    function initRelatedProjects() {
        const metaTag = document.querySelector('meta[squarehero-customization="portfolio"]');
        if (!metaTag || metaTag.getAttribute('enabled') !== 'true') {
            console.log('Portfolio feature is not enabled.');
            return;
        }

        const target = metaTag.getAttribute('target');
        const currentPageUrl = window.location.pathname + '?format=json';
        const allProjectsUrl = `/${target}?format=json&nocache=${new Date().getTime()}`;

        console.log('Current Page URL:', currentPageUrl);
        console.log('All Projects URL:', allProjectsUrl);

        fetch(currentPageUrl)
            .then(response => response.json())
            .then(currentPageData => {
                console.log('Current Page Data:', currentPageData);
                const currentCategory = currentPageData.item.categories[0];
                console.log('Current Category:', currentCategory);
                
                return fetch(allProjectsUrl)
                    .then(response => response.json())
                    .then(allProjectsData => {
                        console.log('All Projects Data:', allProjectsData);
                        const relatedProjects = allProjectsData.items
                            .filter(project => project.categories.includes(currentCategory) && project.id !== currentPageData.item.id)
                            .slice(0, 3);

                        console.log('Related Projects:', relatedProjects);

                        if (relatedProjects.length === 0) {
                            console.log('No related projects found.');
                            return;
                        }

                        renderRelatedProjects(relatedProjects);
                    });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    function renderRelatedProjects(projects) {
        const blogItemWrapper = document.querySelector('.blog-item-wrapper');
        if (!blogItemWrapper) {
            console.error('Blog item wrapper not found');
            return;
        }

        const relatedSection = document.createElement('div');
        relatedSection.className = 'sh-related-projects';
        relatedSection.innerHTML = '<h2>Related Projects</h2>';

        const portfolioContainer = document.createElement('div');
        portfolioContainer.id = 'portfolioContainer';
        portfolioContainer.className = 'related-projects';

        const portfolioGrid = document.createElement('div');
        portfolioGrid.className = 'portfolio-grid';

        projects.forEach(project => {
            const projectCard = createProjectCard(project);
            portfolioGrid.appendChild(projectCard);
        });

        portfolioContainer.appendChild(portfolioGrid);
        relatedSection.appendChild(portfolioContainer);
        blogItemWrapper.appendChild(relatedSection);

        console.log('Related projects rendered');
    }

    function createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'portfolio-item';

        card.innerHTML = `
            <a href="${project.fullUrl}">
                <img src="${project.assetUrl}" alt="${project.title}">
                <h2>${project.title}</h2>
            </a>
        `;

        return card;
    }

    // Main initialization function
    function initPortfolioFunctionality() {
        insertPortfolioBanner();
        moveContentWrapper();
        initRelatedProjects();
    }

    // Run the initialization when the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPortfolioFunctionality);
    } else {
        initPortfolioFunctionality();
    }
})();