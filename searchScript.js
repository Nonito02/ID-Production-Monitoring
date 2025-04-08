// Function to display students
function displayStudents(students) {
    const tableBody = document.getElementById("studentTableBody");
    tableBody.innerHTML = ""; // Clear previous results
  
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
  
  // Function to load and display all students
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
  
  // Search function
  document.getElementById("search").addEventListener("click", function () {
    const searchName = document.getElementById("searchName").value.trim().toLowerCase();
  
    if (searchName === "") {
      loadAllStudents(); // Load all if search is empty
      return;
    }
  
    firebase.database().ref("student").once("value")
      .then(snapshot => {
        const students = snapshot.val();
        const filtered = {};
  
        if (students) {
          for (let id in students) {
            const student = students[id];
            if (student.name && student.name.toLowerCase().includes(searchName)) {
              filtered[id] = student;
            }
          }
        }
  
        displayStudents(filtered);
  
        if (Object.keys(filtered).length === 0) {
          document.getElementById("studentTableBody").innerHTML = `
            <tr><td colspan="3">No results found for: <b>${searchName}</b></td></tr>
          `;
        }
      })
      .catch(error => {
        console.error("Search failed:", error);
      });
  });
  
  // Load all students on initial page load
  window.addEventListener("DOMContentLoaded", loadAllStudents);
  