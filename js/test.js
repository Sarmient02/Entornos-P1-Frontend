// URL of the API
const apiURL = 'https://entornos-p1-backend.onrender.com';

// Function to fetch data from the API
async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Function to display user data
function displayData(users) {
    const userInfoDiv = document.getElementById('user-info');
    users.forEach(user => {
        userInfoDiv.innerHTML += `<p>ID: ${user.id}<br>Name: ${user.name}<br>Email: ${user.email}</p>`;
    });
}

// Fetch and display the data
fetchData(apiURL+"/api/prueba/datos").then(users => displayData(users));
