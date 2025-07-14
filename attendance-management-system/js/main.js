document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for learn more button
    const learnMoreBtn = document.querySelector('.btn-secondary');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('#features').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
});