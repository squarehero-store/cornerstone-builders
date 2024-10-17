// ======================================================
//         SquareHero.store Testimonials Feature 
// ======================================================
(function() {
    function initTestimonials() {
        const enableMetaTag = document.querySelector('meta[squarehero-customization="testimonials"]');
        const featureMetaTag = document.querySelector('meta[squarehero-feature="testimonials"]');
        const targetDiv = document.getElementById('sh-testimonials');
        
        if (enableMetaTag && enableMetaTag.getAttribute('enabled') === 'true' && targetDiv && featureMetaTag) {
            const target = enableMetaTag.getAttribute('target');
            const category = featureMetaTag.getAttribute('category') || '';
            const cacheBuster = new Date().getTime();
            const jsonUrl = `/${target}?format=json&_=${cacheBuster}`;
            
            fetch(jsonUrl)
                .then(response => response.json())
                .then(data => {
                    let testimonials = data.items;
                    
                    // Filter by category if it exists
                    if (category) {
                        testimonials = testimonials.filter(item => 
                            item.category === category
                        );
                    }
                    
                    populateTestimonials(testimonials, targetDiv);
                    createTestimonialSlider(targetDiv);
                })
                .catch(error => console.error('Error fetching testimonials:', error));
        }
    }

    function stripHtml(html) {
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    function populateTestimonials(testimonials, container) {
        container.innerHTML = ''; // Clear existing content
        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'sh-testimonial-slider';
        
        testimonials.forEach((testimonial, index) => {
            const element = document.createElement('div');
            element.className = 'sh-testimonial-item';
            element.innerHTML = `
                <p class="sh-testimonial-body">"${stripHtml(testimonial.body).trim()}"</p>
                <h3 class="sh-testimonial-title">– ${testimonial.title}</h3>
            `;
            sliderContainer.appendChild(element);
        });
        
        container.appendChild(sliderContainer);
    }

    function createTestimonialSlider(container) {
        const testimonials = container.querySelectorAll('.sh-testimonial-item');
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
        
        showTestimonial(currentIndex);
        
        window.addEventListener('resize', () => adjustContainerHeight(testimonials[currentIndex]));
        
        setInterval(nextTestimonial, 4000);
    }

    // Run the script after DOM content is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTestimonials);
    } else {
        initTestimonials();
    }
})();