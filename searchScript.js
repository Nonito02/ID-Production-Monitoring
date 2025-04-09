// Function to display a single student or show message if not found
function displayStudent(student) {
  const tableBody = document.getElementById("studentTableBody");
  tableBody.innerHTML = "";

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
          <img src="path_to_your_image.jpg" alt="Visit Office" style="max-width: 200px; margin-top: 10px;" />
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
    clearTable(); // Show nothing
    return;
  }

  firebase.database().ref("student").once("value")
    .then(snapshot => {
      const students = snapshot.val();
      let exactMatch = null;

      if (students) {
        for (const key in students) {
          const student = students[key];
          if (student.name && student.name.trim().toLowerCase() === name.trim().toLowerCase()) {
            exactMatch = student;
            break;
          }
        }
      }

      displayStudent(exactMatch);
    })
    .catch(error => {
      console.error("Search failed:", error);
      clearTable();
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
