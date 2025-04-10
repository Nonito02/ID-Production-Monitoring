// Function to display a single student or show message if not found
function displayStudent(student) {
  const tableBody = document.getElementById("studentsTableBody");
  
  if (!tableBody) {
    console.error("Table body element not found!");
    return; // Exit if the table body doesn't exist
  }

  tableBody.innerHTML = ""; // Clear existing rows

  if (student) {
    const row = tableBody.insertRow();
    row.innerHTML = `
      <td>${student.name || "N/A"}</td>
      <td>${student.course || "N/A"}</td>
      <td>${student.status || "Pending"}</td>
    `;
  } else {
    tableBody.innerHTML = `
      <tr>
        <td colspan="3" style="text-align: center;">
          <p>Visit the ID Production</p>
          <img src="steps.png" alt="Visit Office" style="max-width: 200px; margin-top: 10px;" />
        </td>
      </tr>
    `;
  }
}

// Clear table content
function clearTable() {
  const tableBody = document.getElementById("studentsTableBody");
  if (tableBody) {
    tableBody.innerHTML = ""; // Clear content if tableBody exists
  } else {
    console.error("Table body element not found!");
  }
}

// Function to search by exact name only
function searchExactName(name) {
  if (!name.trim()) {
    clearTable(); // Show nothing if input is empty
    return;
  }

  firebase.database().ref("students").once("value")
    .then(snapshot => {
      const students = snapshot.val();
      let exactMatch = null;

      if (students) {
        for (const key in students) {
          const student = students[key]; // Changed variable name to 'student' (not 'students')
          // Check for exact match on name (case-insensitive)
          if (student.name && student.name.trim().toLowerCase() === name.trim().toLowerCase()) {
            exactMatch = student; // Set first match
            break; // Stop after the first match
          }
        }
      }

      displayStudent(exactMatch); // Display the first student found or null if not found
    })
    .catch(error => {
      console.error("Search failed:", error);
      clearTable(); // Clear table on error
    });
}

// DOM ready
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchName");
  
  if (!searchInput) {
    console.error("Search input element not found!");
    return;
  }

  // Live search with exact match
  searchInput.addEventListener("input", function () {
    searchExactName(this.value);
  });

  // Optional manual search button
  const searchButton = document.getElementById("search");
  if (searchButton) {
    searchButton.addEventListener("click", function () {
      searchExactName(searchInput.value);
    });
  } else {
    console.error("Search button element not found!");
  }
});
