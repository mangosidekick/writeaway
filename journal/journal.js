// Apply a solid color based on the color picker input
document.getElementById("colorPicker").addEventListener("input", function() {
    const customColor = document.getElementById("colorPicker").value;  // Get the selected color from color picker
    const paperElement = document.getElementById("paper");
    
    // Apply the selected color directly as a solid background
    paperElement.style.backgroundColor = customColor;
});

// Clear the text area when the Clear button is clicked
document.getElementById("clearButton").addEventListener("click", function() {
    document.getElementById("noteText").value = "";  // Clear text
});

// Save the text content to a .txt file when the Save button is clicked
document.getElementById("saveButton").addEventListener("click", function() {
    const textContent = document.getElementById("noteText").value;
    const blob = new Blob([textContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'note.txt';
    link.click();  // Trigger download
});
