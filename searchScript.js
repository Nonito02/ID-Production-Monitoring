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

// Live search while typing
document.addEventListener("DOMContentLoaded", function () {
  // Privacy message on load
  const tableBody = document.getElementById("studentTableBody");
  tableBody.innerHTML = `
    <tr><td colspan="3">Student list is hidden for privacy. Use the search bar to find a student.</td></tr>
  `;

  // Show popup
  document.getElementById("popupBanner").style.display = "flex";

  // Handle live search input
  const searchInput = document.getElementById("searchName");
  searchInput.addEventListener("input", function () {
    const keyword = this.value.trim();
    if (keyword === "") {
      tableBody.innerHTML = `
        <tr><td colspan="3">Student list is hidden for privacy. Use the search bar to find a student.</td></tr>
      `;
    } else {
      searchStudents(keyword);
    }
  });

  // Optional: manual search button
  document.getElementById("search").addEventListener("click", function () {
    const keyword = searchInput.value.trim();
    if (keyword === "") {
      tableBody.innerHTML = `
        <tr><td colspan="3">Student list is hidden for privacy. Use the search bar to find a student.</td></tr>
      `;
    } else {
      searchStudents(keyword);
    }
  });
});
