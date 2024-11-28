document.addEventListener('DOMContentLoaded', () => {
  const alumniForm = document.getElementById('alumniForm');

  // Fetch all alumni on page load
  fetchAlumni();
  fetchadmin();
  alumniForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(alumniForm);
    const alumniData = {};
    formData.forEach((value, key) => {
      alumniData[key] = value;
    });

    // Determine whether to add or update alumni based on the presence of an id field
    const idField = formData.get('id');
    if (idField) {
      // If id field is present, update the alumni
      await updateAlumni(alumniData);
    } else {
      // If id field is not present, add new alumni
      await addAlumni(alumniData);
    }

    // Clear the form
    alumniForm.reset();

    // Remove the hidden id field
    const hiddenIdField = document.querySelector('input[name="id"]');
    if (hiddenIdField) {
      hiddenIdField.remove();
    }
  });

  function fetchAlumni() {
    fetch('/api/alumni')
      .then((response) => response.json())
      .then((alumni) => {
        displayAlumni(alumni);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  async function addAlumni(alumniData) {
    try {
      const result = await postData('/api/alumni', 'POST', alumniData);
      console.log(result.message);
      fetchAlumni(); // Refresh alumni list after adding
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function updateAlumni(alumniData) {
    try {
      const result = await postData(`/api/alumni/${alumniData.id}`, 'PUT', alumniData);
      console.log(result.message);
      fetchAlumni(); // Refresh alumni list after updating
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function displayAlumni(alumni) {
    const alumniList = document.getElementById('alumniList');
    alumniList.innerHTML = '';

    alumni.forEach((alum) => {
      const alumniItem = document.createElement('div');
      alumniItem.classList.add('alumni-item');
      alumniItem.setAttribute('data-id', alum.id);
      alumniItem.innerHTML = `
        <strong>${alum.user_id}</strong> - ${alum.name} - ${alum.email} - ${alum.verification_status}
        <br><button onclick="editAlumni(${alum.user_id})">Edit</button>
        <button onclick="deleteAlumni(${alum.id})">Delete</button>`;
      alumniList.appendChild(alumniItem);
    });
  }
});
function deleteAlumni(userId) {
  fetch(`/api/alumni/${userId}`, {
    method: 'DELETE',
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // If the delete request is successful, remove the alumni from the DOM
    const alumniItem = document.querySelector(`.alumni-item[data-id='${userId}']`);
    if (alumniItem) {
      alumniItem.remove();
    }
  })
  .catch((error) => console.log('Error:', error));
}
async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

async function postData(url, method, data) {
  const response = await fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

async function editAlumni(userId) {
  try {
    const alum = await fetchData(`/api/alumni/${userId}`);
    const alumniForm = document.getElementById('alumniForm');
    alumniForm.elements['name'].value = alum.name;
    alumniForm.elements['email'].value = alum.email;

    // Add a hidden field to store the alumni id for updating
    const idField = document.createElement('input');
    idField.type = 'hidden';
    idField.name = 'id';
    idField.value = userId;
    alumniForm.appendChild(idField);
  } catch (error) {
    console.error('Error:', error);
  }
}

document.getElementById("alumniForm").addEventListener("submit", async function(event) {
  event.preventDefault(); // Prevent default form submission
  const formData = new FormData(this);
  const data = {};
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }
  updateAlumni(data); // You can now handle the form data as needed (e.g., send it to the server)
});



// Admin

async function fetchadmin() {
  try {
    const alumni = await fetchData('/api/admin');
    displayadmin(alumni);
  } catch (error) {
    console.error('Error:', error);
  }
}

function displayadmin(alumni) {
  const alumniList = document.getElementById('adminList');
  alumniList.innerHTML = '';

  alumni.forEach((alum) => {
    const alumniItem = document.createElement('div');
    alumniItem.classList.add('alumni-item');
    alumniItem.setAttribute('data-id', alum.Admin_id);
    alumniItem.innerHTML = `
      <strong>Username : ${alum.Admin_id}</strong> <br> Name:  ${alum.Name} <br> Institute:  ${alum.Inst_id} <br> Email:  ${alum.Email}<br><br>`;
    alumniList.appendChild(alumniItem);
  });
}

async function verifyAlumni(userId) {
  try {
    const response = await fetch(`/verify-alumni/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to verify alumni');
    }
    const data = await response.json();
    console.log(data.message); // Output the response message
    // Refresh the alumni list after verification
    fetchadmin(); // Call the function to refresh the alumni list
  } catch (error) {
    console.error('Error:', error);
  }
}
