// ===================================================================
//   SquareHero Cornerstone Builders: Find Your Home -  Post Script
// ===================================================================
(function() {
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
          
          const headerInner = document.querySelector('.header-inner');
          if (headerInner) {
            const headerHeight = headerInner.offsetHeight;
            banner.style.paddingTop = headerHeight + 'px';
          }
        }
      }
    }
  
    // Related Properties Script
    function setupRelatedProperties() {
      const metaTag = document.querySelector('meta[squarehero-plugin="property-listings"]');
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
  
            const currentProperty = propertyData.find(property => property.urlId === currentUrlId);
            if (currentProperty) {
              insertCurrentPropertyDetails(currentProperty);
            }
  
            const relatedProperties = propertyData
              .filter(property => property.urlId !== currentUrlId)
              .slice(0, 3);
  
            renderRelatedProperties(relatedProperties);
          }).catch(error => console.error('Error fetching data:', error));
        })
        .catch(error => console.error('Error fetching current property data:', error));
    }
  
    // Helper functions for Related Properties Script
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
      const urlMap = new Map(sheetData.map(row => [row.Url.replace(/^\//, ''), row]));
      return blogItems.map(item => {
        const sheetRow = urlMap.get(item.urlId);
        return {
          id: item.id,
          title: item.title,
          location: item.tags && item.tags.length > 0 ? item.tags[0] : '',
          imageUrl: item.assetUrl,
          category: item.categories && item.categories.length > 0 ? item.categories[0] : '',
          price: sheetRow && sheetRow.Price ? parseFloat(sheetRow.Price.replace(/[$,]/g, '')) : null,
          area: sheetRow && sheetRow.Area ? parseInt(sheetRow.Area.replace(/,/g, ''), 10) : null,
          bedrooms: sheetRow && sheetRow.Bedrooms ? parseInt(sheetRow.Bedrooms, 10) : null,
          bathrooms: sheetRow && sheetRow.Bathrooms ? parseFloat(sheetRow.Bathrooms) : null,
          garage: sheetRow && sheetRow.Garage ? sheetRow.Garage : '',
          url: item.fullUrl,
          urlId: item.urlId
        };
      });
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
  
    function createPropertyCard(property) {
      const card = document.createElement('div');
      card.className = 'property-card mix';
  
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
          <a href="${property.url}" class="sh-button">View Home</a>
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
      relatedSection.innerHTML = '<h2>Related Properties</h2>';
  
      const relatedContainer = document.createElement('div');
      relatedContainer.className = 'property-grid';
  
      properties.forEach(property => {
        const card = createPropertyCard(property);
        relatedContainer.appendChild(card);
      });
  
      relatedSection.appendChild(relatedContainer);
      blogItemWrapper.appendChild(relatedSection);
    }
  
    function formatPrice(price) {
      if (price === null) return 'Price TBA';
      return '$' + price.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0});
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
  
    // New initialization function
    function init() {
      centerTallImages();
      moveAndWrapGalleryBlock();
      setupBannerImage();
      setupRelatedProperties();
      addButtonsAndExcerpt();
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
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(centerTallImages, 250);
    });
  
  })();