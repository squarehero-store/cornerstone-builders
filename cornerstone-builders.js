// =================================================
//   SquareHero Cornerstone Builders Template Files 
// =================================================
(function() {
    // Helper function to load external script
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Helper function to load external stylesheet
    function loadStylesheet(href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }

    // Function to get cache buster
    function getCacheBuster() {
        return new Date().getTime();
    }

    // Load stylesheets
    loadStylesheet(`https://cdn.jsdelivr.net/gh/squarehero-store/cornerstone-builders@0/cornerstone-builders.min.css?v=${getCacheBuster()}`);
    loadStylesheet(`https://cdn.jsdelivr.net/gh/squarehero-store/list-block@0/list-block.min.css?v=${getCacheBuster()}`);
    loadStylesheet(`https://cdn.jsdelivr.net/gh/squarehero-store/portfolio-overlay@0/portfolio-overlay.min.css?v=${getCacheBuster()}`);
    loadStylesheet(`https://cdn.jsdelivr.net/gh/squarehero-store/back-to-top@1/back-to-top.min.css?v=${getCacheBuster()}`);

    // Load external scripts
    Promise.all([
        loadScript(`https://cdn.jsdelivr.net/gh/squarehero-store/list-block@0/list-block.min.js?v=${getCacheBuster()}`),
        loadScript(`https://cdn.jsdelivr.net/gh/squarehero-store/portfolio-overlay@0/portfolio-overlay.min.js?v=${getCacheBuster()}`),
        loadScript(`https://cdn.jsdelivr.net/gh/squarehero-store/back-to-top@1/back-to-top.min.js?v=${getCacheBuster()}`)
    ]).then(() => {
        console.log('All external scripts loaded successfully');
    }).catch(error => {
        console.error('Error loading external scripts:', error);
    });

    // Footer copyright functionality
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

    // Section classes functionality
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

    // Run license check when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', checkLicense);

    // Form section functionality
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM fully loaded and parsed');
        
        // Select all buttons with '#form' in their href
        var formButtons = document.querySelectorAll('a[href*="#form"]');
        console.log('Form buttons found:', formButtons.length);
        formButtons.forEach(function(button) {
            console.log('Adding click event listener to button:', button);
            
            button.addEventListener('click', function(e) {
                console.log('Button clicked:', this);
                e.preventDefault();
                console.log('Default action prevented');
                
                // Look for the form in the footer
                var ctaForm = document.querySelector('footer .sh-cta-form');
                console.log('CTA Form found on click:', ctaForm);
                if (ctaForm) {
                    if (!ctaForm.classList.contains('active')) {
                        console.log('Opening form');
                        ctaForm.classList.add('active');
                        ctaForm.style.display = 'block';
                        // Force a reflow
                        ctaForm.offsetHeight;
                        ctaForm.style.maxHeight = ctaForm.scrollHeight + 'px';
                        console.log('Form display set to block, maxHeight set to', ctaForm.scrollHeight + 'px');
                    } else {
                        console.log('Form is already open');
                    }
                    // Scroll to the form regardless of whether it was just opened or was already open
                    ctaForm.scrollIntoView({ behavior: 'smooth' });
                    console.log('Scrolling to form');
                } else {
                    console.error('Form not found in footer');
                }
            });
        });
    });
    console.log('Site-wide form reveal script loaded and executed');

    // Header functionality
    document.addEventListener('DOMContentLoaded', function() {
        // Select the .header-actions--right element
        const headerActionsRight = document.querySelector('.header-nav');
        const headerTitle = document.querySelector('.header-display-desktop');
        if (headerActionsRight && headerTitle) {
            // Move the .header-actions--right to be the last child of .header-title
            headerTitle.appendChild(headerActionsRight);
        }
    });

    // Dark mode header functionality
    document.addEventListener("DOMContentLoaded", function() {
        const metaTag = document.querySelector('meta[squarehero-feature="header"][darkmode="true"]');
        
        if (metaTag) {
            const header = document.querySelector('#header');
            if (header) {
                header.classList.add('header--dark-mode');
            }
        }
    });
})();