// DOM Elements
const sortDropdownButton = document.getElementById('sortDropdownButton');
const sortDropdownContent = document.getElementById('sortDropdownContent');
const addNoteButton = document.querySelector('.add-note-button'); 
const newNotebookModal = document.querySelector('.new-notebook-modal');
const colorOptions = newNotebookModal.querySelectorAll('.color-options div'); 
const notebookCover = document.querySelector('.notebook-preview .notebook-cover');
const patternOptions = newNotebookModal.querySelectorAll('.pattern-options div');
const notebookContainer = document.querySelector('.notebook-container'); // Target the container
const createButton = document.querySelector('.new-notebook-modal .buttons button.create');
const searchBar = document.getElementById('search-bar');
const cancelButton = document.querySelector('.new-notebook-modal .buttons button.cancel');
const logoutButton = document.getElementById('logout-button'); // Update the logout button ID

// Functions
function toggleDropdown() {
  sortDropdownContent.style.display = sortDropdownContent.style.display === 'block' ? 'none' : 'block';
}

function toggleAddNoteButton() {
  addNoteButton.classList.toggle('active');
  addNoteButton.textContent = addNoteButton.classList.contains('active') ? "" : "+";
  newNotebookModal.style.display = 'block';
  notebookContainer.style.display = 'block'; // Make the container visible
}

function closeNewNotebookModal() {
  newNotebookModal.style.display = 'none';
}

function createNotebook() {
  const notebookName = document.getElementById('notebook-name').value;
  const selectedColorOption = newNotebookModal.querySelector('.color-options .selected');
  const coverColor = selectedColorOption ? selectedColorOption.style.backgroundColor : '#fff';

  if (!notebookName || !coverColor) {
      showNotification('Please enter a notebook name and select a cover color.', true);
      return;
  }

  fetch('/notebooks')
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              const notebookTitles = data.notebooks.map(notebook => notebook.title.toLowerCase());
              if (notebookTitles.includes(notebookName.toLowerCase())) {
                  showNotification('Title already exists. Please choose a different title.', true);
              } else {
                  fetch('/createNotebook', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({ title: notebookName, coverColor: coverColor })
                  })
                  .then(response => response.json())
                  .then(data => {
                      if (data.success) {
                          addNotebookToContainer(notebookName, coverColor, data.notebookId, data.createdAt, data.email);
                          closeNewNotebookModal();
                          showNotification('Notebook created successfully.');
                      } else {
                          showNotification(data.message, true);
                      }
                  })
                  .catch(error => {
                      console.error('Error:', error);
                      showNotification('Error creating notebook', true);
                  });
              }
          } else {
              showNotification('Error fetching notebooks', true);
          }
      })
      .catch(error => {
          console.error('Error:', error);
          showNotification('Error fetching notebooks', true);
      });
}

function addNotebookToContainer(notebookName, coverColor, notebookId, createdAt, email) {
    const newNotebook = document.createElement('div');
    newNotebook.classList.add('notebook');

    const formattedDate = new Date(createdAt).toLocaleDateString();
    const formattedTime = new Date(createdAt).toLocaleTimeString();

    newNotebook.innerHTML = `
        <div class="notebook-content">
            <div class="notebook-info">
                <h2>${notebookName}</h2>
                <p>Email: ${email}</p>
                <p>Notebook ID: ${notebookId}</p>
                <p>Created on: ${formattedDate} at ${formattedTime}</p>
            </div>
        </div>
        <i class="delete-icon fas fa-trash" data-notebook-id="${notebookId}"></i> 
    `;
    newNotebook.style.backgroundColor = coverColor;
    notebookContainer.appendChild(newNotebook);
    newNotebook.style.display = 'block';

    // Add event listener for the notebook div to redirect to the journal page
    newNotebook.addEventListener('click', function() {
        window.location.href = `../journal/journal.html?notebookId=${notebookId}`;
    });

    // Prevent redirection if delete icon is clicked
    newNotebook.querySelector('.delete-icon').addEventListener('click', function(event) {
        event.stopPropagation();
        deleteNotebook(notebookId, newNotebook);
    });
}

function deleteNotebook(notebookId, notebookElement) {
    if (confirm('Are you sure you want to delete this notebook?')) {
        fetch(`/deleteNotebook?notebookId=${notebookId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                notebookContainer.removeChild(notebookElement);
                showNotification('Notebook deleted successfully.');
            } else {
                showNotification('Failed to delete notebook: ' + data.message, true);
            }
        })
        .catch(error => {
            console.error('Error deleting notebook:', error);
            showNotification('Error deleting notebook', true);
        });
    }
}

function loadUserNotebooks() {
    fetch('/notebooks')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                data.notebooks.forEach(notebook => {
                    addNotebookToContainer(notebook.title, notebook.cover_color, notebook.id, notebook.created_at, notebook.email);
                });
            } else {
                console.error('Error fetching notebooks:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function handleColorSelection(event) {
  colorOptions.forEach(option => option.classList.remove('selected'));
  event.target.classList.add('selected');
  notebookCover.style.backgroundColor = event.target.style.backgroundColor;
}

function handlePatternSelection(event) {
  patternOptions.forEach(option => option.classList.remove('selected'));
  event.target.classList.add('selected');
  notebookCover.style.backgroundImage = event.target.style.backgroundImage;
}

function filterNotebooks() {
  const searchTerm = searchBar.value.toLowerCase();
  const notebooks = notebookContainer.querySelectorAll('.notebook');

  notebooks.forEach(notebook => {
    const notebookName = notebook.querySelector('.notebook-info h2').textContent.toLowerCase();
    notebook.style.display = notebookName.includes(searchTerm) ? 'block' : 'none';
  });
}

function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = 'notification';
    if (isError) {
        notification.classList.add('error');
    }
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Add the logout function
function logoutUser(event) {
    event.preventDefault(); // Prevents the default action of the link
    
    // Display confirmation dialog
    if (confirm('Are you sure you want to log out?')) {
        // If the user clicks "OK", redirect to Login.html
        // Perform any necessary cleanup actions here (like ending sessions)
        window.location.href = '../login.html';
    }
    // If the user clicks "Cancel", nothing happens
}

// Load user's notebooks when the page loads
document.addEventListener('DOMContentLoaded', loadUserNotebooks);

// Event Listeners
sortDropdownButton.addEventListener('click', toggleDropdown);
addNoteButton.addEventListener('click', toggleAddNoteButton);
cancelButton.addEventListener('click', closeNewNotebookModal);
createButton.addEventListener('click', createNotebook);
colorOptions.forEach(option => option.addEventListener('click', handleColorSelection));
patternOptions.forEach(option => option.addEventListener('click', handlePatternSelection));
searchBar.addEventListener('input', filterNotebooks);
logoutButton.addEventListener('click', logoutUser); // Add the event listener for logout

notebookContainer.addEventListener('click', event => {
  if (event.target.classList.contains('delete-icon')) {
    const notebookId = event.target.dataset.notebookId;
    const notebookElement = event.target.closest('.notebook');
    deleteNotebook(notebookId, notebookElement);
  }
});