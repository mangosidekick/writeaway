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

// Save progress (text and color) to localStorage
document.getElementById("saveProgressButton").addEventListener("click", function() {
    const textContent = document.getElementById("noteText").value;
    const backgroundColor = document.getElementById("paper").style.backgroundColor;
    localStorage.setItem("noteText", textContent);
    localStorage.setItem("backgroundColor", backgroundColor);
    alert("Progress saved!");
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
