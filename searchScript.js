// Function to display a single student or show message if not found
function displayStudent(students) {
  const tableBody = document.getElementById("studentTableBody");
  tableBody.innerHTML = ""; // Clear existing rows

  if (students) {
    const row = tableBody.insertRow();
    row.innerHTML = `
      <td>${students.name || "N/A"}</td>
      <td>${students.course || "N/A"}</td>
      <td>${students.status || "Pending"}</td>
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
  const tableBody = document.getElementById("studentTableBody");
  tableBody.innerHTML = "";
}

// Function to search by exact name only
function searchExactName(name) {
  if (!name.trim()) {
    clearTable(); // Show nothing if input is empty
    return;
  }

  firebase.database().ref("students").once("value")
    .then(snapshot => {
      const studentsList = snapshot.val();
      let exactMatch = null;

      if (studentsList) {
        for (const key in studentsList) {
          const students = studentsList[key];
          // Check for exact match on name (case-insensitive)
          if (students.name && students.name.trim().toLowerCase() === name.trim().toLowerCase()) {
            exactMatch = students; // Set first match
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

  // Live search with exact match
  searchInput.addEventListener("input", function () {
    searchExactName(this.value);
  });

  // Optional manual search button
  document.getElementById("search").addEventListener("click", function () {
    searchExactName(searchInput.value);
  });
});
