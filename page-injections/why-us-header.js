// ===================================================================
//   SquareHero Cornerstone Builders: Why Us  -  Header Script
// ===================================================================
// Why Us Timeline
(function() {
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async function initializeTimeline() {
        try {
            // Load GSAP and ScrollTrigger if not already loaded
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js');
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/ScrollTrigger.min.js');

            document.body.classList.add('timeline-page');
            const container = document.querySelector(".user-items-list-item-container");
            if (!container) {
                throw new Error('Timeline container not found');
            }

            // Create the timeline container and append the timeline line
            const timelineContainer = document.createElement('div');
            timelineContainer.classList.add('timeline-container');
            const timeline = document.createElement('div');
            timeline.classList.add('timeline');
            timelineContainer.appendChild(timeline);

            // Get all list items
            const items = container.querySelectorAll('.list-item');
            items.forEach((item, index) => {
                // Wrap each list item in a timeline-item div
                const wrapper = document.createElement('div');
                wrapper.classList.add('timeline-item', 'preFade');
                wrapper.innerHTML = item.innerHTML;
                item.parentNode.replaceChild(wrapper, item);
                timelineContainer.appendChild(wrapper);
            });

            // Replace the original container with the timeline container
            container.parentNode.replaceChild(timelineContainer, container);

            // Adjust the timeline line positioning
            const firstItem = document.querySelector('.timeline-item');
            const lastItem = document.querySelector('.timeline-item:last-child');
            const topOffset = (firstItem.offsetHeight + parseInt(window.getComputedStyle(firstItem).paddingTop) + parseInt(window.getComputedStyle(firstItem).paddingBottom)) / 2;
            const bottomOffset = (lastItem.offsetHeight + parseInt(window.getComputedStyle(lastItem).paddingTop) + parseInt(window.getComputedStyle(lastItem).paddingBottom)) / 2;
            const timelineHeight = timelineContainer.offsetHeight - (topOffset + bottomOffset);
            const timelineLine = document.querySelector('.timeline');
            timelineLine.style.top = `${topOffset}px`;
            timelineLine.style.height = `${timelineHeight}px`;

            // GSAP animations with ScrollTrigger
            gsap.registerPlugin(ScrollTrigger);

            // Animate the timeline line drawing as you scroll
            gsap.fromTo(timelineLine, 
                { height: 0 }, 
                { 
                    height: `${timelineHeight}px`,
                    scrollTrigger: {
                        trigger: timelineContainer,
                        start: 'top 50%',
                        end: 'bottom 50%',
                        scrub: true
                    }
                }
            );

            // Animate the timeline items
            const timelineItems = document.querySelectorAll('.timeline-item');
            timelineItems.forEach((item, index) => {
                let direction = window.innerWidth <= 767 ? '100%' : (index % 2 === 0 ? '100%' : '-100%');
                gsap.fromTo(item, 
                    {
                        x: direction,
                        opacity: 0
                    }, 
                    {
                        x: '0%',
                        opacity: 1,
                        duration: 1,
                        scrollTrigger: {
                            trigger: item,
                            start: 'top 80%',
                            end: 'bottom 60%',
                            scrub: true
                        }
                    }
                );
            });

            // Update animations on window resize
            window.addEventListener('resize', () => {
                ScrollTrigger.refresh();
            });

        } catch (error) {
            console.error('Error initializing timeline:', error.message);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTimeline);
    } else {
        initializeTimeline();
    }
})();