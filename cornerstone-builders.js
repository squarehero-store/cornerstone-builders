
// ==================================================
//   SquareHero Cornerstone Builders Template Files 
// ==================================================
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

    // Automatic mobile hamburger script
    try {
        function debounce(func, wait) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        }

        function checkHeaderNavWrap() {
            const headerNavWrapper = document.querySelector('.header-nav-wrapper');
            const headerNavList = document.querySelector('.header-nav-list');
            const body = document.body;

            if (headerNavWrapper && headerNavList) {
                // Temporarily remove the class to get accurate measurements
                const hadClass = body.classList.contains('release-the-burger');
                body.classList.remove('release-the-burger');

                // Delay measurement to allow layout to update
                setTimeout(() => {
                    const wrapperWidth = headerNavWrapper.offsetWidth;
                    const navItems = headerNavList.children;
                    let totalChildrenWidth = 0;

                    for (let item of navItems) {
                        const style = window.getComputedStyle(item);
                        const marginLeft = parseFloat(style.marginLeft);
                        const marginRight = parseFloat(style.marginRight);
                        totalChildrenWidth += item.offsetWidth + marginLeft + marginRight;
                    }

                    if (totalChildrenWidth > wrapperWidth) {
                        body.classList.add('release-the-burger');
                    } else if (hadClass) {
                        // Double-check if we still need the class
                        if (totalChildrenWidth <= wrapperWidth) {
                            body.classList.remove('release-the-burger');
                        } else {
                            body.classList.add('release-the-burger');
                        }
                    }
                }, 0);
            }
        }

        const debouncedCheck = debounce(checkHeaderNavWrap, 250);

        // Check on load
        window.addEventListener('load', checkHeaderNavWrap);

        // Check on resize, using the debounced function
        window.addEventListener('resize', debouncedCheck);

        // Initial check
        checkHeaderNavWrap();
    } catch (error) {
        console.error("Error in mobile hamburger script:", error);
    }
})();