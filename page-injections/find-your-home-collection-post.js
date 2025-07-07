// ===================================================================
//   SquareHero Cornerstone Builders: Find Your Home -  Post Script
// ===================================================================
(function () {
  // Function to center tall images
  function centerTallImages() {
    const images = document.querySelectorAll('.thumb-image');

    images.forEach(img => {
      const parent = img.parentElement;
      const parentHeight = parent.offsetHeight;
      const imgHeight = img.naturalHeight;
      const imgWidth = img.naturalWidth;
      const aspectRatio = imgWidth / imgHeight;

      const displayedHeight = img.offsetWidth / aspectRatio;

      if (displayedHeight > parentHeight) {
        const topOffset = (displayedHeight - parentHeight) / 2;
        img.style.position = 'relative';
        img.style.top = `-${topOffset}px`;
      } else {
        img.style.position = '';
        img.style.top = '';
      }
    });
  }

  // Function to move .gallery-block after article.entry and wrap it in a section
  function moveAndWrapGalleryBlock() {
    const galleryBlock = document.querySelector('.gallery-block');
    const articleEntry = document.querySelector('article.entry');

    if (galleryBlock && articleEntry) {
      const gallerySection = document.createElement('section');
      gallerySection.className = 'gallery-section';

      galleryBlock.parentNode.insertBefore(gallerySection, galleryBlock);
      gallerySection.appendChild(galleryBlock);

      articleEntry.after(gallerySection);
    }
  }



  // Load external property listings plugin
  function loadPropertyListingsPlugin() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/squarehero-store/property-listings@1/property-listing.min.js?v=' + new Date().getTime();
    document.head.appendChild(script);
  }

  // Function to add 'Enquire Now' button and move tertiary buttons
  async function addButtonsOnly() {
    const article = document.querySelector('article.entry');
    if (!article) {
      console.error('Article element not found');
      return;
    }

    const blogTitle = article.querySelector('.blog-item-title');
    if (!blogTitle) {
      console.error('Blog title element not found');
      return;
    }

    const enquireButton = document.createElement('a');
    enquireButton.href = '#form';
    enquireButton.className = 'sh-button';
    enquireButton.textContent = 'Enquire Now';

    blogTitle.parentNode.insertBefore(enquireButton, blogTitle.nextSibling);

    const tertiaryButtons = article.querySelectorAll('[data-button-type="tertiary"]');
    tertiaryButtons.forEach(button => {
      enquireButton.parentNode.insertBefore(button, enquireButton.nextSibling);
    });
  }

  // New initialization function
  function init() {
    centerTallImages();
    moveAndWrapGalleryBlock();
    addButtonsOnly();
    loadPropertyListingsPlugin();
  }

  // Function to check if DOM is already loaded
  function domReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
      setTimeout(fn, 1);
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  // Run init() when DOM is ready
  domReady(init);

  // Also run centerTallImages when all images are loaded
  window.addEventListener('load', centerTallImages);

  // Existing window resize listener
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(centerTallImages, 250);
  });

})();