document.addEventListener("DOMContentLoaded", function() {
    const navLinkContainer = document.getElementById('nav-links')
    const links = navLinkContainer.querySelectorAll('a')

    function updateActiveClass() {
        const currentPath = window.location.pathname;
        links.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        })
    }

    updateActiveClass();
})