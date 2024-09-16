// =================================================
//   SquareHero Cornerstone Builders Template Files 
// =================================================
(function() {
    // Function to get 60-minute cache buster
    function getCacheBuster() {
        const now = new Date();
        const hours = now.getUTCHours();
        const minutes = now.getUTCMinutes();
        return `${hours}.${Math.floor(minutes / 60)}`;
    }

    // Function to load a script
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Function to load a stylesheet
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

    // Load Cornerstone Builders main stylesheet
    function loadCornerstoneBuildersCss() {
        const cacheBuster = getCacheBuster();
        return loadStylesheet(`https://cdn.jsdelivr.net/gh/squarehero-store/cornerstone-builders@0/cornerstone-builders.min.css?v=${cacheBuster}`);
    }

    // Load and initialize List Block plugin
    function loadListBlockPlugin() {
        const cacheBuster = getCacheBuster();
        return Promise.all([
            loadStylesheet(`https://cdn.jsdelivr.net/gh/squarehero-store/list-block@0/list-block.min.css?v=${cacheBuster}`),
            loadScript(`https://cdn.jsdelivr.net/gh/squarehero-store/list-block@0/list-block.min.js?v=${cacheBuster}`)
        ]);
    }

    // Load and initialize Portfolio Overlay plugin
    function loadPortfolioOverlayPlugin() {
        const cacheBuster = getCacheBuster();
        return Promise.all([
            loadStylesheet(`https://cdn.jsdelivr.net/gh/squarehero-store/portfolio-overlay@0/portfolio-overlay.min.css?v=${cacheBuster}`),
            loadScript(`https://cdn.jsdelivr.net/gh/squarehero-store/portfolio-overlay@0/portfolio-overlay.min.js?v=${cacheBuster}`)
        ]);
    }

    // Load and initialize Back to Top plugin
    function loadBackToTopPlugin() {
        const cacheBuster = getCacheBuster();
        return Promise.all([
            loadStylesheet(`https://cdn.jsdelivr.net/gh/squarehero-store/back-to-top@1/back-to-top.min.css?v=${cacheBuster}`),
            loadScript(`https://cdn.jsdelivr.net/gh/squarehero-store/back-to-top@1/back-to-top.min.js?v=${cacheBuster}`)
        ]);
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

    // License checking functionality
    function checkLicense() {
        const currentUrl = window.location.href;
        const jsonUrl = currentUrl + (currentUrl.includes('?') ? '&' : '?') + 'format=json';

        fetch(jsonUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(text => {
                let data;
                try {
                    data = JSON.parse(text);
                } catch (error) {
                    throw error;
                }

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

    // Form section functionality
    function setupFormFunctionality() {
        console.log('Setting up form functionality');
        
        const formButtons = document.querySelectorAll('a[href*="#form"]');
        console.log('Form buttons found:', formButtons.length);
        formButtons.forEach(function(button) {
            console.log('Adding click event listener to button:', button);
            
            button.addEventListener('click', function(e) {
                console.log('Button clicked:', this);
                e.preventDefault();
                console.log('Default action prevented');
                
                const ctaForm = document.querySelector('footer .sh-cta-form');
                console.log('CTA Form found on click:', ctaForm);
                if (ctaForm) {
                    if (!ctaForm.classList.contains('active')) {
                        console.log('Opening form');
                        ctaForm.classList.add('active');
                        ctaForm.style.display = 'block';
                        ctaForm.style.maxHeight = ctaForm.scrollHeight + 'px';
                        console.log('Form display set to block, maxHeight set to', ctaForm.scrollHeight + 'px');
                    } else {
                        console.log('Form is already open');
                    }
                    ctaForm.scrollIntoView({ behavior: 'smooth' });
                    console.log('Scrolling to form');
                } else {
                    console.error('Form not found in footer');
                }
            });
        });
    }

    // Header functionality
    function setupHeaderFunctionality() {
        console.log('Setting up header functionality');
        const headerActionsRight = document.querySelector('.header-nav');
        const headerTitle = document.querySelector('.header-display-desktop');
        if (headerActionsRight && headerTitle) {
            headerTitle.appendChild(headerActionsRight);
            console.log('Header nav moved successfully');
        } else {
            console.log('Header elements not found');
        }
    }

    // Dark mode header functionality
    function setupDarkModeHeader() {
        console.log('Setting up dark mode header');
        const metaTag = document.querySelector('meta[squarehero-feature="header"][darkmode="true"]');
        
        if (metaTag) {
            const header = document.querySelector('#header');
            if (header) {
                header.classList.add('header--dark-mode');
                console.log('Dark mode applied to header');
            } else {
                console.log('Header element not found');
            }
        } else {
            console.log('Dark mode meta tag not found');
        }
    }

    // Function to run all setup functions
    function runSetup() {
        Promise.all([
            loadCornerstoneBuildersCss(),
            loadListBlockPlugin(),
            loadPortfolioOverlayPlugin(),
            loadBackToTopPlugin()
        ]).then(() => {
            console.log('All resources loaded successfully');
            updateFooterCopyright();
            updateSectionClasses();
            checkLicense();
            setupFormFunctionality();
            setupHeaderFunctionality();
            setupDarkModeHeader();
        }).catch(error => {
            console.error('Error loading resources:', error);
        });
    }

    // Run setup when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runSetup);
    } else {
        runSetup();
    }

    // Run setup again after a short delay (in case of any dynamic content loading)
    setTimeout(runSetup, 1000);

})();