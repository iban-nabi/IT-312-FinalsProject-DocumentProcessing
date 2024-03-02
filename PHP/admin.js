document.addEventListener('DOMContentLoaded', function() {
    fetch('admin.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('content').innerHTML = data; // Insert PHP content into HTML element
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});