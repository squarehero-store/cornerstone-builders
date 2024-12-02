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

  // BANNER IMAGE SCRIPT
  function setupBannerImage() {
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      const imageUrl = ogImage.content.replace('http:', 'https:');

      const banner = document.createElement('div');
      banner.className = 'blog-banner';

      const img = document.createElement('img');
      img.className = 'blog-banner-image';
      img.src = imageUrl;

      banner.appendChild(img);

      const header = document.getElementById('header');
      if (header && header.nextSibling) {
        header.parentNode.insertBefore(banner, header.nextSibling);
      }
    }
  }

  // Helper functions for Property Data
  function parseCSV(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    return lines.slice(1).map(line => {
      const values = [];
      let currentValue = '';
      let withinQuotes = false;

      for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') {
          withinQuotes = !withinQuotes;
        } else if (line[i] === ',' && !withinQuotes) {
          values.push(currentValue.trim());
          currentValue = '';
        } else {
          currentValue += line[i];
        }
      }
      values.push(currentValue.trim());

      return headers.reduce((obj, header, index) => {
        obj[header] = values[index] ? values[index].replace(/^"|"$/g, '') : '';
        return obj;
      }, {});
    });
  }

  function processPropertyData(sheetData, blogItems) {
    const urlMap = new Map(sheetData.map(row => {
      const url = row.Url.replace(/^\//, '').trim().toLowerCase();
      const regexPattern = new RegExp('^' + url.replace(/\*/g, '.*') + '$');
      return [regexPattern, row];
    }));

    return blogItems.map(item => {
      const urlId = item.urlId.toLowerCase();

      const sheetRow = Array.from(urlMap.entries()).find(([regexPattern, value]) => regexPattern.test(urlId));

      if (!sheetRow) {
        console.warn(`No matching sheet data found for blog item: ${item.urlId}`);
      }

      return {
        id: item.id,
        title: item.title,
        location: item.tags && item.tags.length > 0 ? item.tags[0] : '',
        imageUrl: item.assetUrl,
        category: item.categories && item.categories.length > 0 ? item.categories[0] : '',
        price: sheetRow && sheetRow[1].Price ? parseFloat(sheetRow[1].Price.replace(/[$,]/g, '')) : null,
        area: sheetRow && sheetRow[1].Area ? parseInt(sheetRow[1].Area.replace(/,/g, ''), 10) : null,
        bedrooms: sheetRow && sheetRow[1].Bedrooms ? parseInt(sheetRow[1].Bedrooms, 10) : null,
        bathrooms: sheetRow && sheetRow[1].Bathrooms ? parseFloat(sheetRow[1].Bathrooms) : null,
        garage: sheetRow && sheetRow[1].Garage ? sheetRow[1].Garage : '',
        url: item.fullUrl,
        urlId: item.urlId
      };
    });
  }

  function formatPrice(price) {
    if (price === null) return 'Price TBA';
    return '$' + price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  // Current Property Details Script
  function setupCurrentPropertyDetails() {
    const metaTag = document.querySelector('meta[squarehero-plugin="real-estate-listings"]');
    if (!metaTag || metaTag.getAttribute('enabled') !== 'true') return;

    const sheetUrl = metaTag.getAttribute('sheet-url');
    const currentPropertyJsonUrl = `${window.location.pathname}?format=json`;

    Promise.all([
      fetch(sheetUrl).then(response => response.text()),
      fetch(currentPropertyJsonUrl).then(response => response.json())
    ]).then(([csvData, currentPropertyData]) => {
      const sheetData = parseCSV(csvData);
      const currentUrlId = currentPropertyData.item.urlId;
      const propertyData = processPropertyData(sheetData, [currentPropertyData.item]);
      const currentProperty = propertyData[0];

      if (currentProperty) {
        insertCurrentPropertyDetails(currentProperty);
      }
    }).catch(error => console.error('Error fetching property data:', error));
  }

  function insertCurrentPropertyDetails(property) {
    const entryTitle = document.querySelector('.entry-title');
    if (!entryTitle) {
      console.error('Entry title element not found');
      return;
    }

    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'current-property-details';

    let detailsContent = `
      <div class="listing-content">
        ${property.location ? `<p class="property-location">${property.location}</p>` : ''}
        <p class="property-price ${property.price === null ? 'no-price' : ''}">${formatPrice(property.price)}</p>
        <div class="property-details">
          ${property.area ? `<span class="details-icon"><img src="https://cdn.jsdelivr.net/gh/squarehero-store/property-listings@main/Icons/Icon-Set_Size.svg" alt="Area"> ${property.area.toLocaleString()} sq ft</span>` : ''}
          ${property.bedrooms ? `<span class="details-icon"><img src="https://cdn.jsdelivr.net/gh/squarehero-store/property-listings@main/Icons/Icon-Set_Bedroom.svg" alt="Bedrooms"> ${property.bedrooms}</span>` : ''}
          ${property.bathrooms ? `<span class="details-icon"><img src="https://cdn.jsdelivr.net/gh/squarehero-store/property-listings@main/Icons/Icon-Set_Bathroom.svg" alt="Bathrooms"> ${property.bathrooms}</span>` : ''}
          ${property.garage ? `<span class="details-icon"><img src="https://cdn.jsdelivr.net/gh/squarehero-store/property-listings@main/Icons/Icon-Set_Garage.svg" alt="Garage"> ${property.garage}</span>` : ''}
        </div>
      </div>
    `;

    detailsContainer.innerHTML = detailsContent;
    entryTitle.insertAdjacentElement('afterend', detailsContainer);
  }

  // Function to add 'Enquire Now' button, move tertiary buttons, and add excerpt
  async function addButtonsAndExcerpt() {
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

    try {
      const timestamp = new Date().getTime();
      const currentPropertyJsonUrl = `${window.location.pathname}?format=json&_=${timestamp}`;
      const response = await fetch(currentPropertyJsonUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();

      if (jsonData && jsonData.item && jsonData.item.excerpt) {
        const excerptDiv = document.createElement('div');
        excerptDiv.className = 'item-excerpt';
        excerptDiv.innerHTML = jsonData.item.excerpt;

        const lastButton = tertiaryButtons.length > 0 ? tertiaryButtons[tertiaryButtons.length - 1] : enquireButton;
        lastButton.parentNode.insertBefore(excerptDiv, lastButton.nextSibling);
      } else {
        console.error('Excerpt not found in JSON data');
      }
    } catch (error) {
      console.error("Could not fetch or add excerpt:", error);
    }
  }

  // Related Properties Script
  function setupRelatedProperties() {
    const metaTag = document.querySelector('meta[squarehero-plugin="real-estate-listings"]');
    if (!metaTag || metaTag.getAttribute('enabled') !== 'true') return;

    const sheetUrl = metaTag.getAttribute('sheet-url');
    const target = metaTag.getAttribute('target');
    const allPropertiesJsonUrl = `/${target}?format=json&nocache=${new Date().getTime()}`;
    const currentPropertyJsonUrl = `${window.location.pathname}?format=json`;

    fetch(currentPropertyJsonUrl)
      .then(response => response.json())
      .then(currentPropertyData => {
        const currentUrlId = currentPropertyData.item.urlId;

        Promise.all([
          fetch(sheetUrl).then(response => response.text()),
          fetch(allPropertiesJsonUrl).then(response => response.json())
        ]).then(([csvData, allPropertiesData]) => {
          const sheetData = parseCSV(csvData);
          const propertyData = processPropertyData(sheetData, allPropertiesData.items);

          const relatedProperties = propertyData
            .filter(property => property.urlId !== currentUrlId)
            .slice(0, 3);

          renderRelatedProperties(relatedProperties);
        }).catch(error => console.error('Error fetching data:', error));
      })
      .catch(error => console.error('Error fetching current property data:', error));
  }

  function createPropertyCard(property) {
    const card = document.createElement('a');
    card.className = 'property-card';
    card.href = property.url;

    let cardContent = `
      <div class="property-image">
        <img src="${property.imageUrl}" alt="${property.title}">
        ${property.category ? `<span class="property-category">${property.category}</span>` : ''}
      </div>
      <div class="listing-content">
        <h3 class="property-title">${property.title}</h3>
        ${property.location ? `<p class="property-location">${property.location}</p>` : ''}
        <p class="property-price ${property.price === null ? 'no-price' : ''}">${formatPrice(property.price)}</p>
        <div class="property-details">
          ${property.area ? `<span class="details-icon"><img src="https://cdn.jsdelivr.net/gh/squarehero-store/property-listings@main/Icons/Icon-Set_Size.svg" alt="Area"> ${property.area.toLocaleString()} sq ft</span>` : ''}
          ${property.bedrooms ? `<span class="details-icon"><img src="https://cdn.jsdelivr.net/gh/squarehero-store/property-listings@main/Icons/Icon-Set_Bedroom.svg" alt="Bedrooms"> ${property.bedrooms}</span>` : ''}
          ${property.bathrooms ? `<span class="details-icon"><img src="https://cdn.jsdelivr.net/gh/squarehero-store/property-listings@main/Icons/Icon-Set_Bathroom.svg" alt="Bathrooms"> ${property.bathrooms}</span>` : ''}
          ${property.garage ? `<span class="details-icon"><img src="https://cdn.jsdelivr.net/gh/squarehero-store/property-listings@main/Icons/Icon-Set_Garage.svg" alt="Garage"> ${property.garage}</span>` : ''}
        </div>
        <div class="sh-button">View Home</div>
      </div>
    `;

    card.innerHTML = cardContent;
    return card;
  }

  function renderRelatedProperties(properties) {
    const blogItemWrapper = document.querySelector('.blog-item-wrapper');
    if (!blogItemWrapper) {
      console.error('Blog item wrapper not found');
      return;
    }

    const relatedSection = document.createElement('div');
    relatedSection.className = 'related-properties-section';
    relatedSection.innerHTML = '<h2>More Properties</h2>';

    const relatedContainer = document.createElement('div');
    relatedContainer.className = 'property-grid';

    properties.forEach(property => {
      const card = createPropertyCard(property);
      relatedContainer.appendChild(card);
    });

    relatedSection.appendChild(relatedContainer);
    blogItemWrapper.appendChild(relatedSection);
  }

  // New initialization function
  function init() {
    centerTallImages();
    moveAndWrapGalleryBlock();
    setupBannerImage();
    setupCurrentPropertyDetails();
    addButtonsAndExcerpt();
    setupRelatedProperties();
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