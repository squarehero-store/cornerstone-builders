// ======================================================
//         SquareHero.store Testimonials Feature 
// ======================================================
(function() {
    function initTestimonials() {
        const customizationMetaTag = document.querySelector('meta[squarehero-customization="testimonials"]');
        const featureMetaTag = document.querySelector('meta[squarehero-feature="testimonials"]');
        const container = document.getElementById('sh-testimonials');

        if (customizationMetaTag && customizationMetaTag.getAttribute('enabled') === 'true' && container && featureMetaTag) {
            const target = customizationMetaTag.getAttribute('target');
            const category = featureMetaTag.getAttribute('category') || '';
            const itemCount = Math.min(parseInt(featureMetaTag.getAttribute('item-count') || '3', 10), 6);
            const cacheBuster = new Date().getTime();
            const jsonUrl = `/${target}?format=json&_=${cacheBuster}`;

            fetch(jsonUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (!data || !data.items) {
                        throw new Error('Data or items are undefined');
                    }

                    let testimonials = data.items
                        .filter(item => !category || (item.categories && item.categories.includes(category)))
                        .slice(0, itemCount)
                        .map(item => ({
                            title: item.title,
                            body: stripHtml(item.body)
                        }));

                    if (testimonials.length > 0) {
                        populateTestimonials(testimonials, container);
                        createTestimonialSlider(container);
                    } else {
                        container.innerHTML = '<p>No testimonials available at this time.</p>';
                    }
                })
                .catch(error => {
                    console.error('Error in testimonials script:', error);
                    container.innerHTML = '<p>Unable to load testimonials at this time.</p>';
                });
        }
    }

    function stripHtml(html) {
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    function populateTestimonials(testimonials, container) {
        container.innerHTML = '';
        testimonials.forEach((testimonial, index) => {
            const element = document.createElement('div');
            element.className = 'testimonial';
            element.innerHTML = `
                <p class="testimonial-body">"${testimonial.body.trim()}"</p>
                <h3 class="testimonial-title">– ${testimonial.title}</h3>
            `;
            container.appendChild(element);
        });
    }

    function createTestimonialSlider(container) {
        const testimonials = container.querySelectorAll('.testimonial');
        let currentIndex = 0;
        
        function showTestimonial(index) {
            testimonials.forEach((testimonial, i) => {
                if (i === index) {
                    testimonial.classList.add('active');
                    adjustContainerHeight(testimonial);
                } else {
                    testimonial.classList.remove('active');
                }
            });
        }
        
        function adjustContainerHeight(activeTestimonial) {
            container.style.height = `${activeTestimonial.offsetHeight}px`;
        }
        
        function nextTestimonial() {
            currentIndex = (currentIndex + 1) % testimonials.length;
            showTestimonial(currentIndex);
        }
        
        if (testimonials.length > 0) {
            showTestimonial(currentIndex);
            window.addEventListener('resize', () => adjustContainerHeight(testimonials[currentIndex]));
            setInterval(nextTestimonial, 4000);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTestimonials);
    } else {
        initTestimonials();
    }
})();