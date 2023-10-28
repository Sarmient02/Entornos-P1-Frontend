var API_URL;

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    API_URL = 'http://localhost:8080';
} else {
    API_URL = 'https://entornos-p1-backend.onrender.com';
}

document.addEventListener('DOMContentLoaded', function() {
    loadUserInfo();
    if (localStorage.getItem("token") != null && localStorage.getItem("token") != undefined) {
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
    request.open(method, API_URL + endPoint);
    request.setRequestHeader("Content-Type", "application/json");
    if(localStorage.getItem("token") != null && localStorage.getItem("token") != undefined){
        request.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem ("token"));
    }
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

function loadUserInfo(){
    if(localStorage.getItem("token") != null && localStorage.getItem("token") != undefined && sessionStorage.getItem("user") == null){
        console.log("xd")
        let request = sendRequest('/api/user/data', 'GET', '')
        request.onload = function(){
            let data = request.response;
            let json = JSON.parse(data);
            sessionStorage.setItem("user", (JSON.stringify(json)))
            console.log(sessionStorage.getItem("user").role)
            var admin = document.getElementById("admin");
            if (json.role != "ROLE_ADMIN") {
                admin.style.display = "none";
            }
        }
    }
}

function logOut() {
    localStorage.clear();
    sessionStorage.clear();
    window.location = 'login.html';
}