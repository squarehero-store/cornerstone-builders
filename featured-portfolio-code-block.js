// ======================================================
//         SquareHero.store Featured Portfolio 
// ======================================================
(function() {
    function initFeaturedPortfolio() {
      const enableMetaTag = document.querySelector('meta[squarehero-feature="portfolio"]');
      const featureMetaTag = document.querySelector('meta[squarehero-feature-settings="portfolio"]');
      const targetDiv = document.getElementById('sh-featured-portfolio');
      
      if (enableMetaTag && enableMetaTag.getAttribute('enabled') === 'true' && targetDiv && featureMetaTag) {
        const target = enableMetaTag.getAttribute('target');
        const categoryValue = featureMetaTag.getAttribute('category') || '';
        const itemCount = Math.min(parseInt(featureMetaTag.getAttribute('item-count') || '3', 10), 6);
        const cacheBuster = new Date().getTime();
        const jsonUrl = `/${target}?format=json&_=${cacheBuster}`;
        
        fetch(jsonUrl)
          .then(response => response.json())
          .then(data => {
            let posts = data.items;
            
            // Filter by category if it exists
            if (categoryValue) {
              posts = posts.filter(post => 
                post.categories.includes(categoryValue)
              );
            }
            
            // Limit to specified number of posts (up to 6)
            posts = posts.slice(0, itemCount);
            
            const container = document.createElement('div');
            container.className = 'sh-blog-post-grid';
            
            posts.forEach(post => {
              const postElement = document.createElement('a');
              postElement.href = post.fullUrl;
              postElement.className = 'sh-blog-post-item preFade fadeIn';
              
              const image = document.createElement('div');
              image.className = 'sh-blog-post-image';
              image.style.backgroundImage = `url('${post.assetUrl}')`;
              
              const title = document.createElement('h3');
              title.className = 'sh-blog-post-title';
              title.textContent = post.title;
              
              postElement.appendChild(image);
              postElement.appendChild(title);
              container.appendChild(postElement);
            });
            
            targetDiv.innerHTML = '';
            targetDiv.appendChild(container);
          })
          .catch(error => console.error('Error fetching portfolio items:', error));
      }
    }
  
    // Run the script after DOM content is loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initFeaturedPortfolio);
    } else {
      initFeaturedPortfolio();
    }
  })();