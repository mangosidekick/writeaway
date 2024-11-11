const sortDropdownButton = document.getElementById('sortDropdownButton');
const sortDropdownContent = document.getElementById('sortDropdownContent');
const addNoteButton = document.querySelector('.add-note-button'); 
const addContent = document.querySelector('.add-content');
const newNotebookModal = document.querySelector('.new-notebook-modal');
const newNotebookButton = document.querySelector('.add-content button:first-child'); 
const colorOptions = newNotebookModal.querySelectorAll('.color-options div'); 
const notebookCover = document.querySelector('.notebook-preview .notebook-cover');
const patternOptions = newNotebookModal.querySelectorAll('.pattern-options div');
const notebook = document.querySelector('.notebook');
const createButton = document.querySelector('.new-notebook-modal .buttons button.create');
const searchBar = document.getElementById('search-bar');

// Add event listener for the "Name" button
sortDropdownButton.addEventListener('click', () => {
  sortDropdownContent.style.display = sortDropdownContent.style.display === 'block' ? 'none' : 'block';
});

// Add event listener for the add button
addNoteButton.addEventListener('click', () => {
  addNoteButton.classList.toggle('active');
  addContent.style.display = addContent.style.display === 'block' ? 'none' : 'block';

  // Change the button's text based on its active state
  if (addNoteButton.classList.contains('active')) {
    addNoteButton.textContent = ""; // Set text to "X"
  } else {
    addNoteButton.textContent = "+"; // Set text back to "+"
  }
});

// Add event listener for the "New notebook" button
newNotebookButton.addEventListener('click', () => {
  newNotebookModal.style.display = 'block';
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

  // Set the notebook's content
  notebook.style.backgroundColor = coverColor;
  notebook.style.backgroundImage = pagePattern;

  // Add the notebook name and creation date
  notebook.innerHTML += `
    <div class="notebook-content">
      <div class="notebook-info">
        <h2>${notebookName}</h2>
        <p>Created on: ${formattedDate} at ${formattedTime}</p>
      </div>
    </div>
    <div class="notebook-bookmark"></div>
  `;

  // Make the notebook visible
  notebook.style.display = 'block';

  // Reset the modal
  newNotebookModal.style.display = 'none';
});
// masakit na ang likod -ereka
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
  const notebooks = notebook.querySelectorAll('.notebook-content');

  notebooks.forEach(notebook => {
    const notebookName = notebook.querySelector('h2').textContent.toLowerCase();
    // Check if the search term is present in the notebook name
    if (notebookName.includes(searchTerm)) {
      notebook.style.display = 'block';
    } else {
      notebook.style.display = 'none';
    }
  });
});