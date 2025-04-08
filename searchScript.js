// Function to display students
function displayStudents(students) {
  const tableBody = document.getElementById("studentTableBody");
  tableBody.innerHTML = "";

  if (students && Object.keys(students).length > 0) {
    Object.values(students).forEach(student => {
      const row = tableBody.insertRow();
      row.innerHTML = `
        <td>${student.name || "N/A"}</td>
        <td>${student.course || "N/A"}</td>
        <td>${student.status || "Pending"}</td>
      `;
    });
  } else {
    tableBody.innerHTML = `
      <tr><td colspan="3">No student records found.</td></tr>
    `;
  }
}

// Load and display all students
function loadAllStudents() {
  firebase.database().ref("student").once("value")
    .then(snapshot => {
      const students = snapshot.val();
      displayStudents(students);
    })
    .catch(error => {
      console.error("Failed to load students:", error);
    });
}

// Search function (works with any keyword in name or course or status)
function searchStudents(keyword) {
  firebase.database().ref("student").once("value")
    .then(snapshot => {
      const students = snapshot.val();
      const results = {};

      if (students) {
        Object.keys(students).forEach(key => {
          const student = students[key];
          const searchString = `${student.name} ${student.course} ${student.status}`.toLowerCase();
          if (searchString.includes(keyword.toLowerCase())) {
            results[key] = student;
          }
        });
      }

      displayStudents(results);
    })
    .catch(error => {
      console.error("Search failed:", error);
      const tableBody = document.getElementById("studentTableBody");
      tableBody.innerHTML = `
        <tr><td colspan="3">Error loading student data.</td></tr>
      `;
    });
}

// Handle search button click
document.getElementById("search").addEventListener("click", function () {
  const keyword = document.getElementById("searchName").value.trim();

  if (keyword === "") {
    loadAllStudents(); // If empty, load all students
  } else {
    searchStudents(keyword); // Else search
  }
});

// Load all students on page load
window.onload = function () {
  loadAllStudents();
  document.getElementById("popupBanner").style.display = "flex";
};
