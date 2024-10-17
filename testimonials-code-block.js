document.addEventListener('DOMContentLoaded', function() {
    const metaTag = document.querySelector('meta[squarehero-customization="testimonials"]');
    const categoryMetaTag = document.querySelector('meta[squarehero-feature="testimonials"]');
    const container = document.getElementById('sh-testimonials');
    
    if (metaTag && metaTag.getAttribute('enabled') === 'true' && container) {
        const target = metaTag.getAttribute('target');
        const jsonUrl = `/${target}?format=json`;
        const category = categoryMetaTag ? categoryMetaTag.getAttribute('category') : '';
        
        fetch(jsonUrl)
            .then(response => response.json())
            .then(data => {
                let testimonials = data.items.map(item => ({
                    title: item.title,
                    body: stripHtml(item.body),
                    category: item.category // Assuming the category is available in the JSON data
                }));
                
                // Filter testimonials by category if specified
                if (category) {
                    testimonials = testimonials.filter(item => item.category === category);
                }
                
                populateTestimonials(testimonials, container);
                createTestimonialSlider(container);
            })
            .catch(error => console.error('Error fetching testimonials:', error));
    }
});

function stripHtml(html) {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

function populateTestimonials(testimonials, container) {
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
    
    // Initial setup
    showTestimonial(currentIndex);
    
    // Adjust height on window resize
    window.addEventListener('resize', () => adjustContainerHeight(testimonials[currentIndex]));
    
    setInterval(nextTestimonial, 4000);
}