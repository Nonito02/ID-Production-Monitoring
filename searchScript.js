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
  const searchName = document.getElementById("searchName").value.toLowerCase();
  const tableBody = document.getElementById("studentTableBody");
  tableBody.innerHTML = "";

  if (searchName === "") {
    alert("Please enter a full name.");
    return;
  }

  firebase.database().ref("students").once("value", function (snapshot) {
    let found = false;
    snapshot.forEach(function (childSnapshot) {
      const student = childSnapshot.val();
      const fullName = student.name.toLowerCase();

      if (fullName.includes(searchName)) {
        found = true;
        const row = `
          <tr>
            <td>${student.name}</td>
            <td>${student.course}</td>
            <td>${student.status}</td>
          </tr>`;
        tableBody.innerHTML += row;
      }
    });

    if (!found) {
      tableBody.innerHTML = `<tr><td colspan="3">No results found.</td></tr>`;
    }
  });
});
