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

// Add event listener for the "Name" button
sortDropdownButton.addEventListener('click', () => {
  sortDropdownContent.style.display = sortDropdownContent.style.display === 'block' ? 'none' : 'block';
});

// Add event listener for the add button
addNoteButton.addEventListener('click', () => {
  addNoteButton.classList.toggle('active');

  // Change the button's text based on its active state
  if (addNoteButton.classList.contains('active')) {
    addNoteButton.textContent = ""; // Set text to "X"
  } else {
    addNoteButton.textContent = "+"; // Set text back to "+"
  }

  // Show the new notebook modal
  newNotebookModal.style.display = 'block';
  notebookContainer.style.display = 'block'; // Make the container visible
});

// Add event listener for the "Cancel" button
const cancelButton = document.querySelector('.new-notebook-modal .buttons button.cancel');
cancelButton.addEventListener('click', () => {
  newNotebookModal.style.display = 'none';
});

// Add event listener for the "Create" button
createButton.addEventListener('click', () => {
  // Get the selected notebook name
  const notebookName = document.getElementById('notebook-name').value;

  // Get the selected cover color
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
    </div>
    <i class="delete-icon fas fa-trash"></i> 
  `;
  
  // Style the new notebook
  newNotebook.style.backgroundColor = coverColor;
  newNotebook.style.backgroundImage = pagePattern;

  // Append the new notebook to the container
  notebookContainer.appendChild(newNotebook);

  // Make the notebook visible
  newNotebook.style.display = 'block';

  // Reset the modal
  newNotebookModal.style.display = 'none';
});

// Add event listeners for color and pattern options (example)
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
    // Update the notebook cover pattern, sheeesh
    notebookCover.style.backgroundImage = option.style.backgroundImage;
  });
});

// Add event listener for the search bar
searchBar.addEventListener('input', () => {
  const searchTerm = searchBar.value.toLowerCase();
  const notebooks = notebookContainer.querySelectorAll('.notebook'); // Target the container

  notebooks.forEach(notebook => {
    const notebookName = notebook.querySelector('.notebook-info h2').textContent.toLowerCase();
    // Check if the search term is present in the notebook name
    if (notebookName.includes(searchTerm)) {
      notebook.style.display = 'block';
    } else {
      notebook.style.display = 'none';
    }
  });
});

 // Delete Notebook Functionality
notebookContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-icon')) {
    const notebookToDelete = event.target.closest('.notebook'); 
    if (confirm('Are you sure you want to delete this notebook?')) {
      notebookContainer.removeChild(notebookToDelete); 
    }
  }
});