// =========================================================================
//   SquareHero Cornerstone Builders: Portfolio Collection  -  Header Script
// =========================================================================
(function() {
    function addPortfolioClass() {
        document.body.classList.add('portfolio-page');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addPortfolioClass);
    } else {
        addPortfolioClass();
    }
})();