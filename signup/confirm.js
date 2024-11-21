        // Extract the user's name from the URL query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const userName = urlParams.get('name');
        
        // Display the user's name
        if (userName) {
            document.getElementById('welcome-message').textContent = `Welcome, ${decodeURIComponent(userName)}!`;
        }

        document.getElementById('toLogin-button').addEventListener('click', function() {
            window.location.href = 'login.html'; // Redirect to Login page
        });
        