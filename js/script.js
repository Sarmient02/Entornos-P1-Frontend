const url = "http://localhost:8080"

document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem ("token")) {
        var visit = document.getElementById("visit");
        var user = document.getElementById("user");
        if (user.style.display === "none") {
            user.style.display = "block";
            visit.style.display = "none";
        }
    }
}, false);

function sendRequest(endPoint, method, data) {
    let request = new XMLHttpRequest();
    request.open(method, url + endPoint);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(data));
    return request
}

function addUser() {
    let username = document.getElementById('u-username').value
    let fullName = document.getElementById('u-fullname').value
    let studentCode = document.getElementById('u-code').value
    let email = document.getElementById('u-email').value
    let password = document.getElementById('u-password').value
    let data = {
        'username': username, 'fullName': fullName, 'studentCode': studentCode, 'email': email,
        'password': password
    }

    let request = sendRequest('/api/auth/signup', 'POST', data)

    request.onload = function () {
        let res = request.response;
        let json = JSON.parse(res);
        localStorage.setItem("token", json.token);

        window.location = 'home.html';
    }
    request.onerror = function () {
        alert('Error al registrar usuario.')
    }
}

function validarLogin() {
    var username = document.getElementById('username').value
    var password = document.getElementById('password').value

    console.log(username)
    console.log(password)

    let data = { "username": username, "password": password }

    console.log(data)

    let request = sendRequest('/api/auth/login', "POST", data)

    request.onload = function () {
        let res = request.response;
        let json = JSON.parse(res);
        localStorage.setItem("token", json.token);
        window.location = 'home.html';
    }
    request.onerror = function () {
        alert('Error al iniciar sesion.')
    }
}

function logOut() {
    localStorage.clear();
    window.location = 'login.html';
}
