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

document.querySelectorAll('#sortDropdownContent a').forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    var sortBy = this.getAttribute('data-sort-by');
    console.log(`Sorting notebooks ${sortBy}`);
    sortNotebookList(sortBy);
  });
});

function sortNotebookList(order) {
  var notebooks = Array.from(notebookContainer.getElementsByClassName('notebook'));

  notebooks.sort(function(a, b) {
    var textA = a.querySelector('.notebook-info h2').textContent.toUpperCase();
    var textB = b.querySelector('.notebook-info h2').textContent.toUpperCase();
    console.log(`Comparing ${textA} with ${textB}`);
    if (order === 'a-to-z') {
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    } else {
      return textA > textB ? -1 : textA < textB ? 1 : 0;
    }
  });

  notebookContainer.innerHTML = '';
  notebooks.forEach(function(notebook) {
    notebookContainer.appendChild(notebook);
  });
}

function toggleAddNoteButton() {
  addNoteButton.classList.toggle('active');
  if (addNoteButton.classList.contains('active')) {
    newNotebookModal.style.display = 'block';
    notebookContainer.style.display = 'block'; // Make the container visible
  } else {
    newNotebookModal.style.display = 'none';
  }
}

function closeNewNotebookModal() {
  newNotebookModal.style.display = 'none';
}

function createNotebook() {
  const notebookName = document.getElementById('notebook-name').value.trim();

  // hvvyuy notebook name exceeds 8 characters
  if (notebookName.length > 8) {
    showNotification('Notebook name should not exceed 8 characters.', true);
    return;
  }

  const selectedColorOption = newNotebookModal.querySelector('.color-options .selected');
  const coverColor = selectedColorOption ? selectedColorOption.style.backgroundColor : '#fff';

  if (!notebookName || !coverColor) {
    showNotification('Please enter a notebook name and select a cover color.', true);
    return;
  }

  console.log(`Creating notebook with name: ${notebookName} and color: ${coverColor}`);

  fetch('/notebooks')
    .then(response => {
      console.log('Fetch /notebooks response:', response);
      return response.json();
    })
    .then(data => {
      console.log('Fetched notebooks data:', data);
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
          .then(response => {
            console.log('Fetch /createNotebook response:', response);
            return response.json();
          })
          .then(data => {
            console.log('Notebook creation data:', data);
            if (data.success) {
              addNotebookToContainer(notebookName, coverColor, data.notebookId, data.createdAt, data.email);
              closeNewNotebookModal();
              showNotification('Notebook created successfully.');
              addNoteButton.classList.remove('active'); // Reset the button state
            } else {
              showNotification(data.message, true);
            }
          })
          .catch(error => {
            console.error('Error creating notebook:', error);
            showNotification('Error creating notebook', true);
          });
        }
      } else {
        showNotification('Error fetching notebooks', true);
      }
    })
    .catch(error => {
      console.error('Error fetching notebooks:', error);
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
      <button class="delete-notebook" title="Delete Notebook">
        <i class="fas fa-trash" data-notebook-id="${notebookId}"></i>
      </button>
    </div>
  `;
  newNotebook.style.backgroundColor = coverColor;
  notebookContainer.appendChild(newNotebook);
  newNotebook.style.display = 'block';

  // Add event listener for the notebook div to redirect to the journal page
  newNotebook.addEventListener('click', function() {
    window.location.href = `../journal/journal.html?notebookId=${notebookId}`;
  });

  // Prevent redirection if delete icon is clicked
  newNotebook.querySelector('.delete-notebook').addEventListener('click', function(event) {
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
  const searchTerm = searchBar.value.toLowerCase().trim();
  const notebooks = notebookContainer.querySelectorAll('.notebook');

  notebooks.forEach(notebook => {
    const notebookName = notebook.querySelector('.notebook-info h2').textContent.toLowerCase().trim();

    // Check if the search term is present in the notebook name and if the notebook name is valid (not 'notebook name')
    if (notebookName.includes(searchTerm) && notebookName !== '' && notebookName !== 'notebook name') {
      notebook.style.display = 'block';
    } else {
      notebook.style.display = 'none';
    }
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
  if (confirm('Are you sure you want to log out?')) {
    window.location.href = '../login.html';
  }
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
logoutButton.addEventListener('click', logoutUser);

notebookContainer.addEventListener('click', event => {
  if (event.target.classList.contains('delete-notebook')) {
    const notebookId = event.target.dataset.notebookId;
    const notebookElement = event.target.closest('.notebook');
    deleteNotebook(notebookId, notebookElement);
  }
});
