// Extract the notebookId from the URL query parameters
const urlParams = new URLSearchParams(window.location.search);
const notebookId = urlParams.get('notebookId');

// Function to load the notebook content
function loadNotebookContent(notebookId) {
    fetch(`/getNotebookContent?notebookId=${notebookId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Notebook content fetched:', data.notebook); // Debug log
                // Populate the notebook content on the page
                document.getElementById('noteText').value = data.notebook.content;
                document.getElementById('colorPicker').value = data.notebook.background_color || '#ffffff';
                document.getElementById('paper').style.backgroundColor = data.notebook.background_color || '#ffffff';
            } else {
                console.error('Error fetching notebook content:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Load the notebook content on page load
document.addEventListener('DOMContentLoaded', function() {
    if (notebookId) {
        loadNotebookContent(notebookId);
    } else {
        console.error('No notebook ID provided in URL');
    }
});

// Apply selected color to the background of the paper
document.getElementById("colorPicker").addEventListener("input", function() {
    const customColor = document.getElementById("colorPicker").value;
    const paperElement = document.getElementById("paper");
    paperElement.style.backgroundColor = customColor;
});

// Clear the text area when the Clear button is clicked
document.getElementById("clearButton").addEventListener("click", function() {
    document.getElementById("noteText").value = "";
});

// Save the text content to a .txt file
document.getElementById("saveButton").addEventListener("click", function() {
    const textContent = document.getElementById("noteText").value;
    const blob = new Blob([textContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'note.txt';
    link.click();
});

// Save progress button
document.getElementById("saveProgressButton").addEventListener("click", function() {
    const textContent = document.getElementById("noteText").value;
    const backgroundColor = document.getElementById("paper").style.backgroundColor;
    const notebookId = new URLSearchParams(window.location.search).get('notebookId');
    
    if (notebookId) {
        fetch('/saveProgress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ notebookId, content: textContent, backgroundColor })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Progress saved successfully');
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error saving progress');
        });
    } else {
        alert('Notebook ID is missing');
    }
});

// Load saved progress from localStorage
window.addEventListener("load", function() {
    const savedText = localStorage.getItem("noteText");
    const savedColor = localStorage.getItem("backgroundColor");

    if (savedText) {
        document.getElementById("noteText").value = savedText;
    }

    if (savedColor) {
        document.getElementById("paper").style.backgroundColor = savedColor;
    }
});