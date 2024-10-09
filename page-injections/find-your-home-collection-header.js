// ===================================================================
//   SquareHero Cornerstone Builders: Find Your Home -  Header Script
// ===================================================================
(function() {
    function addPropertyListingsClass() {
        document.body.classList.add('property-listings');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addPropertyListingsClass);
    } else {
        addPropertyListingsClass();
    }
})();