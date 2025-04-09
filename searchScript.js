// Function to display one student or show "Visit the ID Production" with image
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

// Clear the student table (used when input is cleared)
function clearTable() {
  const tableBody = document.getElementById("studentTableBody");
  tableBody.innerHTML = "";
}

// Search and display only one matched student
function searchStudents(keyword) {
  if (!keyword.trim()) {
    clearTable(); // Don't show anything if input is empty
    return;
  }

  firebase.database().ref("student").once("value")
    .then(snapshot => {
      const students = snapshot.val();
      let foundStudent = null;

      if (students) {
        for (const key in students) {
          const student = students[key];
          const searchString = `${student.name} ${student.course} ${student.status}`.toLowerCase();
          if (searchString.includes(keyword.toLowerCase())) {
            foundStudent = student;
            break;
          }
        }
      }

      displayStudent(foundStudent);
    })
    .catch(error => {
      console.error("Search failed:", error);
      const tableBody = document.getElementById("studentTableBody");
      tableBody.innerHTML = `<tr><td colspan="3">Error loading student data.</td></tr>`;
    });
}

// DOM ready
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchName");

  // Live search
  searchInput.addEventListener("input", function () {
    searchStudents(this.value.trim());
  });

  // Manual search button (optional)
  document.getElementById("search").addEventListener("click", function () {
    searchStudents(searchInput.value.trim());
  });
});
