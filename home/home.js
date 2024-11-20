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

// Function to check if a color is dark
function isColorDark(color) {
  const r = parseInt(color.substring(1, 3), 16);
  const g = parseInt(color.substring(3, 5), 16);
  const b = parseInt(color.substring(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

// Add event listener for the "Name" button
sortDropdownButton.addEventListener('click', () => {
  sortDropdownContent.style.display = sortDropdownContent.style.display === 'block' ? 'none' : 'block';
});

document.querySelectorAll('#sortDropdownContent a').forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    var sortBy = this.getAttribute('data-sort-by');
    sortNotebookList(sortBy);
  });
});

function sortNotebookList(order) {
  var notebooks = Array.from(notebookContainer.getElementsByClassName('notebook'));

  notebooks.sort(function(a, b) {
    var textA = a.querySelector('.notebook-info h2').textContent.toUpperCase();
    var textB = b.querySelector('.notebook-info h2').textContent.toUpperCase();
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

addNoteButton.addEventListener('click', () => {
  newNotebookModal.style.display = 'block';
  notebookContainer.style.display = 'block';
  // Always set the button's text to "+"
  addNoteButton.textContent = "+"; 

  // Toggle the active class
  addNoteButton.classList.toggle('active');
});

// Add event listener for the "Cancel" button
const cancelButton = document.querySelector('.new-notebook-modal .buttons button.cancel');
cancelButton.addEventListener('click', () => {
  newNotebookModal.style.display = 'none';
});

// Add event listener for the "Create" button
createButton.addEventListener('click', () => {
  // Get the selected notebook name
  const notebookName = document.getElementById('notebook-name').value.trim();

  // Prevent creating a notebook without a name
  if (notebookName === '') {
    alert('Please enter a notebook name.');
    return;
  }

  const selectedColorOption = newNotebookModal.querySelector('.color-options .selected');
  const coverColor = selectedColorOption ? selectedColorOption.style.backgroundColor : '#fff';

  // Get the selected page pattern
  const selectedPatternOption = newNotebookModal.querySelector('.pattern-options .selected');
  const pagePattern = selectedPatternOption ? selectedPatternOption.style.backgroundImage : 'none';

  // Get current date and time
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const formattedTime = currentDate.toLocaleTimeString();

  // Create a new notebook element
  const newNotebook = document.createElement('div');
  newNotebook.classList.add('notebook');
  newNotebook.innerHTML = `
    <div class="notebook-content">
      <div class="notebook-info">
        <h2>${notebookName}</h2>
        <p>Created on: ${formattedDate} at ${formattedTime}</p>
      </div>
      <button class="delete-notebook" title="Delete Notebook">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;
  
  // Style the new notebook
  newNotebook.style.backgroundColor = coverColor;
  newNotebook.style.backgroundImage = pagePattern;

  // Adjust trash bin icon color based on cover color
  const trashIcon = newNotebook.querySelector('.delete-notebook i');
  if (isColorDark(coverColor)) {
    trashIcon.style.color = '#fff';  // Change to white if cover is dark
  } else {
    trashIcon.style.color = '#000';  // Change to black if cover is light
  }

  // Append the new notebook to the container
  notebookContainer.appendChild(newNotebook);

  // Make the notebook visible
  newNotebook.style.display = 'block';

  // Reset the modal
  newNotebookModal.style.display = 'none';
});

// Add event listeners for color and pattern options
colorOptions.forEach(option => {
  option.addEventListener('click', () => {
    // Remove the 'selected' class from all color options
    colorOptions.forEach(o => o.classList.remove('selected'));
    // Add the 'selected' class to the clicked option
    option.classList.add('selected');
    // Update the notebook cover color
    notebookCover.style.backgroundColor = option.style.backgroundColor;
  });
});

patternOptions.forEach(option => {
  option.addEventListener('click', () => {
    // Remove the 'selected' class from all pattern options
    patternOptions.forEach(o => o.classList.remove('selected'));
    // Add the 'selected' class to the clicked option
    option.classList.add('selected');
    // Update the notebook cover pattern
    notebookCover.style.backgroundImage = option.style.backgroundImage;
  });
});

// Add event listener for the search bar
searchBar.addEventListener('input', () => {
  const searchTerm = searchBar.value.toLowerCase().trim();
  const notebooks = notebookContainer.querySelectorAll('.notebook'); // Target the container

  notebooks.forEach(notebook => {
    const notebookName = notebook.querySelector('.notebook-info h2').textContent.toLowerCase().trim();
    if (notebookName.includes(searchTerm) && notebookName !== '' && notebookName !== 'notebook name') {
      notebook.style.display = 'block';
    } else {
      notebook.style.display = 'none';
    }
  });
});

// Delete Notebook Functionality
notebookContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('fa-trash')) {
    const notebookToDelete = event.target.closest('.notebook'); 
    if (confirm('Are you sure you want to delete this notebook?')) {
      notebookContainer.removeChild(notebookToDelete); 
    }
  }
});
