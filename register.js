let currentUserId = null; // Variable to store the currently editing user's ID

// Handle form submission for both register and edit actions
document.getElementById('registrationForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = {
    fullname: formData.get('fullname'),
    email: formData.get('email'),
    password: formData.get('password'),
    dob: formData.get('dob'),
    gender: formData.get('gender'),
    languages: Array.from(formData.getAll('languages')),
    qualification: formData.get('qualification'),
    college: formData.get('college'),
  };

  // Check if the form is in edit mode (i.e., if currentUserId is set)
  if (currentUserId === null) {
    // New user registration
    fetch('http://localhost:4000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(function (response) {
        if (response.ok) {
          alert('User registered successfully!');
          loadUsers(); // Reload the table
        } else {
          alert('Error registering user');
        }
      })
      .catch(function (error) {
        console.error('Error:', error);
      });
  } else {
    // Editing an existing user
    fetch(`http://localhost:4000/users/${currentUserId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(function (response) {
        if (response.ok) {
          alert('User updated successfully!');
          loadUsers(); // Reload the table
          currentUserId = null; // Reset the currentUserId after update
        } else {
          alert('Error updating user');
        }
      })
      .catch(function (error) {
        console.error('Error:', error);
      });
  }
});

// Function to load and display users in the table
function loadUsers() {
  fetch('http://localhost:4000/users')
    .then(function (response) {
      return response.json();
    })
    .then(function (users) {
      const tableBody = document.querySelector('#registrationTable tbody');
      tableBody.innerHTML = ''; // Clear the table before loading new data

      users.forEach(function (user) {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.fullname}</td>
          <td>${user.email}</td>
          <td>${user.password}</td>
          <td>${user.dob}</td>
          <td>${user.gender}</td>
          <td>${user.languages.join(', ')}</td>
          <td>${user.qualification}</td>
          <td>${user.college}</td>
          <td>
            <button onclick="editUser(${user.id})">Edit</button>
            <button onclick="deleteUser(${user.id})">Delete</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch(function (error) {
      console.error('Error:', error);
    });
}

// Function to edit a user
function editUser(id) {
  currentUserId = id; // Store the ID of the user being edited
  console.log("clicked", id);

  fetch(`http://localhost:4000/users1/${id}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (user) {
      function formatDate(date) {
        const d = new Date(date);
        if (!isNaN(d.getTime())) {
          return d.toISOString().split('T')[0]; // 'yyyy-MM-dd'
        }
        return ''; 
      }

      // Populate the form with the current user's data
      document.getElementById('fullname').value = user[0].fullname;
      document.getElementById('email').value = user[0].email;
      document.getElementById('password').value = user[0].password;
      document.getElementById('dob').value = formatDate(user[0].dob);

      const genderRadio = document.querySelector(`input[name="gender"][value="${user[0].gender}"]`);
      if (genderRadio) genderRadio.checked = true;

      if (Array.isArray(user[0].languages)) {
        user[0].languages.forEach(function (lang) {
          const languageCheckbox = document.querySelector(`input[name="languages"][value="${lang}"]`);
          if (languageCheckbox) languageCheckbox.checked = true;
        });
      }

      document.getElementById('qualification').value = user[0].qualification;
      document.getElementById('college').value = user[0].college;
    })
    .catch(function (error) {
      console.error('Error:', error);
    });
}

// Function to delete a user
function deleteUser(id) {
  if (confirm('Are you sure you want to delete this user?')) {
    fetch(`http://localhost:4000/users/${id}`, {
      method: 'DELETE',
    })
      .then(function (response) {
        alert('User deleted successfully!');
        loadUsers(); // Reload the table
      })
      .catch(function (error) {
        console.error('Error:', error);
      });
  }
}

// Load users when the page is loaded
loadUsers();
