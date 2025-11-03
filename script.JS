document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('nameInput');
    const saveButton = document.getElementById('namedevice');
    const displayElements = document.querySelectorAll('.displayName');
    function displaySavedName() {
        const savedName = localStorage.getItem('userName');
        if (savedName) {
            displayElements.forEach(element => {
                element.textContent = savedName;
            });
            if (nameInput) {
                nameInput.value = savedName;
            }
        }
    }
    displaySavedName();
    if (saveButton) {
        saveButton.addEventListener('click', (event) => {
            event.preventDefault();
            const name = nameInput.value.trim();
            if (name) {
                localStorage.setItem('userName', name);
                alert('Name saved successfully!');
                window.location.href = 'start 2.html';
            } else {
                alert('Error: Please enter a name.');
            }
        });
    }
});