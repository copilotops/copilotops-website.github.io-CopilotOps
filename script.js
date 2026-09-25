document.addEventListener('DOMContentLoaded', () => {
    // Select ALL toggle buttons on the page
    const toggleButtons = document.querySelectorAll('.toggle-arch-btn');

    // Loop through each button and add a safe, bulletproof click listener
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', (event) => {
            // 1. Find the specific card that contains the clicked button
            const card = event.target.closest('.agent-card');
            
            // 2. Safety check: if no card found, do nothing (prevents crash)
            if (!card) return;

            // 3. Find the architecture container inside THIS specific card
            const archContainer = card.querySelector('.arch-container');
            
            // 4. Safety check: if no container found, do nothing
            if (!archContainer) return;

            // 5. Toggle the display based on current state
            const isHidden = archContainer.style.display === 'none' || !archContainer.style.display;

            if (isHidden) {
                archContainer.style.display = 'block';
                event.target.textContent = 'Hide architecture';
            } else {
                archContainer.style.display = 'none';
                event.target.textContent = 'Show architecture';
            }
        });
    });
});
