// =========================================================================
//   SquareHero Cornerstone Builders: Blog Collection  -  Header Script
// =========================================================================
(function() {
    function addBlogPageClass() {
        document.body.classList.add('blog-page');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addBlogPageClass);
    } else {
        addBlogPageClass();
    }
})();