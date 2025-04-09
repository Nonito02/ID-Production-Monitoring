// Function to display a single student or show "No records found" message with an image
function displayStudent(student) {
  const tableBody = document.getElementById("studentTableBody");
  tableBody.innerHTML = ""; // Clear the table before displaying the result

  if (student) {
    // If a student is found, display their details
    const row = tableBody.insertRow();
    row.innerHTML = `
      <td>${student.name || "N/A"}</td>
      <td>${student.course || "N/A"}</td>
      <td>${student.status || "Pending"}</td>
    `;
  } else {
    // If no student is found, display the "Visit the ID Production" message and show an image
    tableBody.innerHTML = `
      <tr><td colspan="3">
        <p>Visit the ID Production</p>
        <img src="path_to_your_image.jpg" alt="ID Production" style="max-width: 200px; margin-top: 10px;" />
      </td></tr>
    `;
  }
}

// Load and display all students
function loadAllStudents() {
  firebase.database().ref("student").once("value")
    .then(snapshot => {
      const students = snapshot.val();
      displayStudent(null); // Clear display if loading all students (optional)
    })
    .catch(error => {
      console.error("Failed to load students:", error);
    });
}

// Search function (works with any keyword in name, course, or status)
function searchStudents(keyword) {
  firebase.database().ref("student").once("value")
    .then(snapshot => {
      const students = snapshot.val();
      let foundStudent = null; // To store the first matching student

      if (students) {
        // Loop through students and find the first matching one
        Object.keys(students).forEach(key => {
          const student = students[key];
          const searchString = `${student.name} ${student.course} ${student.status}`.toLowerCase();
          if (searchString.includes(keyword.toLowerCase())) {
            foundStudent = student; // Assign the first matching student
          }
        });
      }

      // Display the found student or the "Visit the ID Production" message with the image
      displayStudent(foundStudent);
    })
    .catch(error => {
      console.error("Search failed:", error);
      const tableBody = document.getElementById("studentTableBody");
      tableBody.innerHTML = `
        <tr><td colspan="3">Error loading student data.</td></tr>
      `;
    });
}

// Live search while typing
document.addEventListener("DOMContentLoaded", function () {
  // Display all students on page load (optional)
  loadAllStudents();

  // Show popup
  document.getElementById("popupBanner").style.display = "flex";

  // Handle live search input
  const searchInput = document.getElementById("searchName");
  searchInput.addEventListener("input", function () {
    const keyword = this.value.trim();
    if (keyword === "") {
      displayStudent(null); // If no keyword, clear the display
    } else {
      searchStudents(keyword); // Search and display the result
    }
  });

  // Optional: manual search button
  document.getElementById("search").addEventListener("click", function () {
    const keyword = searchInput.value.trim();
    if (keyword === "") {
      displayStudent(null); // If no keyword, clear the display
    } else {
      searchStudents(keyword); // Search and display the result
    }
  });
});
