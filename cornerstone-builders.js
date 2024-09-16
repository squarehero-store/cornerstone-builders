// =================================================
//   SquareHero Cornerstone Builders Template Files 
// =================================================
(function() {
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

    // Form section functionality
    function setupFormFunctionality() {
        console.log('SH: Setting up form functionality');
        
        const formButtons = document.querySelectorAll('a[href*="#form"]');
        console.log('SH: Form buttons found:', formButtons.length);
        formButtons.forEach(function(button) {
            button.addEventListener('click', function(e) {
                console.log('SH: Form button clicked');
                e.preventDefault();
                
                const ctaForm = document.querySelector('footer .sh-cta-form');
                if (ctaForm) {
                    if (!ctaForm.classList.contains('active')) {
                        ctaForm.classList.add('active');
                        ctaForm.style.display = 'block';
                        ctaForm.style.maxHeight = ctaForm.scrollHeight + 'px';
                        console.log('SH: Form opened');
                    } else {
                        console.log('SH: Form is already open');
                    }
                    ctaForm.scrollIntoView({ behavior: 'smooth' });
                    console.log('SH: Scrolled to form');
                } else {
                    console.error('SH: Form not found in footer');
                }
            });
        });
    }

    // Header functionality
    function setupHeaderFunctionality() {
        console.log('SH: Setting up header functionality');
        const headerActionsRight = document.querySelector('.header-nav');
        const headerTitle = document.querySelector('.header-display-desktop');
        if (headerActionsRight && headerTitle) {
            headerTitle.appendChild(headerActionsRight);
            console.log('SH: Header nav moved successfully');
        } else {
            console.log('SH: Header elements not found');
        }
    }

    // Dark mode header functionality
    function setupDarkModeHeader() {
        console.log('SH: Setting up dark mode header');
        const metaTag = document.querySelector('meta[squarehero-feature="header"][darkmode="true"]');
        
        if (metaTag) {
            const header = document.querySelector('#header');
            if (header) {
                header.classList.add('header--dark-mode');
                console.log('SH: Dark mode applied to header');
            } else {
                console.log('SH: Header element not found');
            }
        } else {
            console.log('SH: Dark mode meta tag not found');
        }
    }

    ///// License checking functionality ////
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

    // Integrated Back to Top Plugin with 60-minute cache buster
    (function(){
        function getCacheBuster() {
            const now = new Date();
            const hours = now.getUTCHours();
            const minutes = now.getUTCMinutes();
            return `${hours}.${Math.floor(minutes / 60)}`;
        }

        const cacheBuster = getCacheBuster();

        const script = document.createElement('script');
        script.src = `https://cdn.jsdelivr.net/gh/squarehero-store/back-to-top@1/back-to-top.min.js?v=${cacheBuster}`;
        document.head.appendChild(script);

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = `https://cdn.jsdelivr.net/gh/squarehero-store/back-to-top@1/back-to-top.min.css?v=${cacheBuster}`;
        document.head.appendChild(link);
    })();

    // Run setup when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setupFormFunctionality();
            setupHeaderFunctionality();
            setupDarkModeHeader();
        });
    } else {
        setupFormFunctionality();
        setupHeaderFunctionality();
        setupDarkModeHeader();
    }
})();