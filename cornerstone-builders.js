// ======================================================
//   SquareHero.store Cornerstone Builders Template Files 
// ======================================================
(function() {
    // Function to get cache buster
    function getCacheBuster() {
        const now = new Date();
        const hours = now.getUTCHours();
        const minutes = now.getUTCMinutes();
        return `${hours}.${Math.floor(minutes / 1)}`;
    }

    // Function to load script
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Function to load stylesheet
    function loadStylesheet(href) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }

    // Footer copyright functionality
    function updateFooterCopyright() {
        try {
            const siteJsonUrl = `${window.location.origin}/?format=json-pretty`;
            fetch(siteJsonUrl)
                .then(response => response.json())
                .then(data => {
                    const siteTitle = data.website.siteTitle;
                    const siteTitleElement = document.querySelector('.site-title');
                    if (siteTitleElement) {
                        siteTitleElement.textContent = siteTitle;
                    }
                })
                .catch(error => console.error('Error fetching site title:', error));
        } catch (error) {
            console.error("Error in footer copyright functionality:", error);
        }
    }

    // Section classes functionality
    function updateSectionClasses() {
        try {
            const sections = document.querySelectorAll(".page-section");
            sections.forEach(function(section) {
                const savedDiv = section.querySelector('div[data-squarehero="section-name"]');
                if (savedDiv) {
                    const shSectionValue = savedDiv.getAttribute('sh-section');
                    if (shSectionValue) {
                        section.classList.add(shSectionValue);
                    }
                }
            });
        } catch (error) {
            console.error("Error in section classes functionality:", error);
        }
    }

    // Updated form functionality
    function setupFormFunctionality() {
        const formButtons = document.querySelectorAll('a[href*="#form"]');
        formButtons.forEach(function(button) {
            // Remove any existing event listeners
            button.removeEventListener('click', formButtonClickHandler);
            // Add new event listener
            button.addEventListener('click', formButtonClickHandler);
        });
    }

    // Separate function for the click event handler
    function formButtonClickHandler(e) {
        e.preventDefault();
        const ctaForm = document.querySelector('footer .sh-cta-form');
        if (ctaForm) {
            if (!ctaForm.classList.contains('active')) {
                ctaForm.classList.add('active');
                ctaForm.style.display = 'block';
                ctaForm.style.maxHeight = ctaForm.scrollHeight + 'px';
            }
            ctaForm.scrollIntoView({ behavior: 'smooth' });
        } else {
            console.error('CTA form not found in the footer');
        }
    }

    // Header functionality
    function setupHeaderFunctionality() {
        const headerActionsRight = document.querySelector('.header-nav');
        const headerTitle = document.querySelector('.header-display-desktop');
        if (headerActionsRight && headerTitle) {
            headerTitle.appendChild(headerActionsRight);
        }
        document.body.classList.add('cornerstone-header');
    }

    // Dark mode header functionality
    function setupDarkModeHeader() {
        const metaTag = document.querySelector('meta[squarehero-customization="header"]');
        if (metaTag && metaTag.getAttribute('darkmode') === 'true') {
            const header = document.querySelector('#header');
            if (header) {
                header.classList.add('header--dark-mode');
            }
        }
    }

    // License checking functionality
    function checkLicense() {
        const currentUrl = window.location.href;
        const jsonUrl = currentUrl + (currentUrl.includes('?') ? '&' : '?') + 'format=json';

        fetch(jsonUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const websiteId = data.website && data.website.id;
                
                if (!websiteId) {
                    return;
                }

                const cacheBuster = new Date().getTime();
                const csvUrl = `https://docs.google.com/spreadsheets/d/e/2PACX-1vTABxXoUTzl1KE_-WuvseavQ0W18hmEB7ZxWjslopNgxGbQBfFT6Pq4FEZG5bFCH6ODowjwOrd12TgE/pub?output=csv&cacheBuster=${cacheBuster}`;
                
                return fetch(csvUrl)
                    .then(response => response.text())
                    .then(csv => {
                        const rows = csv.split('\n');
                        const ids = rows.slice(1).map(row => row.split(',')[0].trim());
                        
                        if (!ids.includes(websiteId)) {
                            logUnlicensedTemplate(websiteId, currentUrl);
                        }
                    });
            })
            .catch(error => {
                console.error('Error in license check:', error);
            });
    }

    function logUnlicensedTemplate(websiteId, pageUrl) {
        const appsScriptUrl = 'https://script.google.com/macros/s/AKfycby7PQo4fqQM3QeOexCENdwv-Fm65As4vuWMozigAVh3q9ceL-h7CzdKY9dM11AHD3jKRg/exec';
        
        const params = new URLSearchParams({
            websiteId: websiteId,
            pageUrl: pageUrl
        });
        fetch(`${appsScriptUrl}?${params.toString()}`)
            .catch(error => {
                console.error('Error logging unlicensed template:', error);
            });
    }

    // Load and initialize Back to Top plugin
    function loadBackToTopPlugin() {
        const cacheBuster = getCacheBuster();
        return Promise.all([
            loadScript(`https://cdn.jsdelivr.net/gh/squarehero-store/back-to-top@1/back-to-top.min.js?v=${cacheBuster}`),
            loadStylesheet(`https://cdn.jsdelivr.net/gh/squarehero-store/back-to-top@1/back-to-top.min.css?v=${cacheBuster}`)
        ]).then(() => {
            if (typeof initBackToTop === 'function') {
                initBackToTop();
            }
        });
    }

    // Load and initialize Portfolio Overlay plugin
    function loadPortfolioOverlayPlugin() {
        const cacheBuster = getCacheBuster();
        return Promise.all([
            loadScript(`https://cdn.jsdelivr.net/gh/squarehero-store/portfolio-overlay@1/portfolio-overlay.min.js?v=${cacheBuster}`),
            loadStylesheet(`https://cdn.jsdelivr.net/gh/squarehero-store/portfolio-overlay@1/portfolio-overlay.min.css?v=${cacheBuster}`)
        ]).then(() => {
            if (typeof initPortfolioOverlay === 'function') {
                initPortfolioOverlay();
            }
        });
    }

    // Load and initialize List Block plugin
    function loadListBlockPlugin() {
        const cacheBuster = getCacheBuster();
        return Promise.all([
            loadScript(`https://cdn.jsdelivr.net/gh/squarehero-store/list-block@0/list-block.min.js?v=${cacheBuster}`),
            loadStylesheet(`https://cdn.jsdelivr.net/gh/squarehero-store/list-block@0/list-block.min.css?v=${cacheBuster}`)
        ]).then(() => {
            if (typeof initListBlock === 'function') {
                initListBlock();
            }
        });
    }

    // Main setup function
    function setup() {
        updateFooterCopyright();
        updateSectionClasses();
        setupFormFunctionality();
        setupHeaderFunctionality();
        setupDarkModeHeader();
        checkLicense();
        
        // Add a mutation observer to handle dynamically added content
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    setupFormFunctionality();
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        Promise.all([
            loadBackToTopPlugin(),
            loadPortfolioOverlayPlugin(),
            loadListBlockPlugin()
        ]).then(() => {
            console.log('🚀 SquareHero.store Cornerstone Scripts loaded');
        }).catch(error => {
            console.error('Error loading SquareHero.store plugins:', error);
        });
    }

    // Run setup when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setup);
    } else {
        setup();
    }
})();