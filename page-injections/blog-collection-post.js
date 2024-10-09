// =========================================================================
//   SquareHero Cornerstone Builders: Blog Collection  -  Post Script
// =========================================================================
//  Blog Banner Script
(function() {
    function insertBanner() {
        try {
            const ogImage = document.querySelector('meta[property="og:image"]');
            const imageUrl = ogImage ? ogImage.content.replace('http:', 'https:') : '';
            const blogItemTopWrapper = document.querySelector('.blog-item-top-wrapper');
            
            if (!blogItemTopWrapper || !imageUrl) {
                throw new Error('Could not find necessary elements to insert banner');
            }

            const bannerDiv = document.createElement('div');
            bannerDiv.className = 'blog-banner';
            
            const wrapperDiv = document.createElement('div');
            wrapperDiv.className = 'blog-banner-wrapper';
            bannerDiv.appendChild(wrapperDiv);
            
            const imageContainer = document.createElement('div');
            imageContainer.className = 'blog-banner-image';
            
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.alt = 'Blog Banner';
            imageContainer.appendChild(imgElement);
            wrapperDiv.appendChild(imageContainer);
            
            const overlay = document.createElement('div');
            overlay.className = 'banner-overlay';
            
            const existingH1 = blogItemTopWrapper.querySelector('h1');
            if (existingH1) {
                overlay.appendChild(existingH1);
            }
            wrapperDiv.appendChild(overlay);
            
            const article = document.querySelector('article');
            if (article) {
                article.insertAdjacentElement('afterbegin', bannerDiv);
            } else {
                blogItemTopWrapper.parentNode.insertBefore(bannerDiv, blogItemTopWrapper);
            }
            
            if (!blogItemTopWrapper.querySelector('h1')) {
                blogItemTopWrapper.remove();
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
            
            document.body.classList.add('has-blog-banner');
        } catch (error) {
            console.error('Error inserting blog banner:', error.message);
        }
    }

    function initBlogBanner() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', insertBanner);
        } else {
            insertBanner();
        }
    }

    initBlogBanner();
})();