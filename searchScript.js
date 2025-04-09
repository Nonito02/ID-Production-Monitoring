// Function to show/hide the loader
function toggleLoader(show) {
  const loader = document.getElementById("loader");
  loader.style.display = show ? "block" : "none";
}

// Function to display students (only course and status for privacy)
function displayStudents(students) {
  const tableBody = document.getElementById("studentTableBody");
  tableBody.innerHTML = "";

  if (students && Object.keys(students).length > 0) {
    Object.values(students).forEach(student => {
      const row = tableBody.insertRow();
      row.innerHTML = `
        <td>${student.course || "N/A"}</td>
        <td>${student.status || "Pending"}</td>
      `;
    });
  } else {
    tableBody.innerHTML = `
      <tr><td colspan="2">No student records found.</td></tr>
    `;
  }
}

// Search function
function searchStudents(keyword) {
  toggleLoader(true);
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
      toggleLoader(false);
    })
    .catch(error => {
      console.error("Search failed:", error);
      const tableBody = document.getElementById("studentTableBody");
      tableBody.innerHTML = `
        <tr><td colspan="2">Error loading student data.</td></tr>
      `;
      toggleLoader(false);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.getElementById("studentTableBody");
  const searchInput = document.getElementById("searchName");
  const clearButton = document.getElementById("clear");
  
  // Privacy message on load
  tableBody.innerHTML = `
    <tr><td colspan="2">Student list is hidden for privacy. Use the search bar to find a student.</td></tr>
  `;

  // Show popup
  document.getElementById("popupBanner").style.display = "flex";

  // Live search
  searchInput.addEventListener("input", function () {
    const keyword = this.value.trim();
    if (keyword === "") {
      tableBody.innerHTML = `
        <tr><td colspan="2">Student list is hidden for privacy. Use the search bar to find a student.</td></tr>
      `;
    } else {
      searchStudents(keyword);
    }
  });

  // Manual search
  document.getElementById("search").addEventListener("click", function () {
    const keyword = searchInput.value.trim();
    if (keyword === "") {
      tableBody.innerHTML = `
        <tr><td colspan="2">Student list is hidden for privacy. Use the search bar to find a student.</td></tr>
      `;
    } else {
      searchStudents(keyword);
    }
  });

  // Clear button
  clearButton.addEventListener("click", function () {
    searchInput.value = "";
    tableBody.innerHTML = `
      <tr><td colspan="2">Student list is hidden for privacy. Use the search bar to find a student.</td></tr>
    `;
  });
});
