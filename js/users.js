const url = "http://localhost:8080"

document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem ("token")) {
        var visit = document.getElementById("visit");
        var user = document.getElementById("user");
        user.style.display = "block";
        visit.style.display = "none";
    }
}, false);

function sendRequest(endPoint, method, data) {
    let request = new XMLHttpRequest();
    request.open(method, url + endPoint);
    request.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem ("token"));
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(data));
    return request
}

function loadData(){
    let request = sendRequest('/api/user/all', 'GET', '')
    let table = document.getElementById('users-table');
    table.innerHTML = "";
    request.onload = function(){
        let data = request.response;
        let json = JSON.parse(data);
        json.forEach((element, index) => {
            table.innerHTML += `
                <tr>
                    <th>${element.username}</th>
                    <td>${element.fullName}</td>
                    <td>${element.studentCode}</td>
                    <td>${element.email}</td>
                    <td>
                        <button type="button" class="btn btn-primary" onclick='window.location = 
                        "form_users.html?id=${element.id}&username=${element.username}&fullName=${element.fullName}&studentCode=${element.studentCode}&email=${element.email}&role=${element.role}"'>Ver</button>
                    </td>
                </tr>
                `
        });
    }
    request.onerror = function(){
        table.innerHTML = `
            <tr>
                <td colspan="5">Error al recuperar los datos.</td>
            </tr>
        `;
    }
}

function loadUser(id,username,fullName,studentCode,email,role) {
    let f_id = document.getElementById('id')
    let f_username = document.getElementById('username')
    let f_fullName = document.getElementById('fullName')
    let f_studentCode = document.getElementById('studentCode')
    let f_email = document.getElementById('email')
    let f_role = document.getElementById('role')
        
	f_id.value = id
    f_username.value = username
    f_fullName.value = fullName
    f_studentCode.value = studentCode
    f_email.value = email
    f_role.value = role
}

function saveUser(){
    let username = document.getElementById('username').value
    let fullName = document.getElementById('fullName').value
    let studentCode = document.getElementById('studentCode').value
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
    let data = {
        'username': username, 'fullName': fullName, 'studentCode': studentCode, 'email': email,
        'password': password
    }

    let request = sendRequest('/api/user/new', 'POST', data)

    request.onload = function () {
        window.location = 'users.html';
    }
    request.onerror = function () {
        alert('Error al registrar usuario.')
    }
}

function updateUser(){
    let id = document.getElementById('id').value
    let username = document.getElementById('username').value
    let fullName = document.getElementById('fullName').value
    let studentCode = document.getElementById('studentCode').value
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
    let role = document.getElementById('role').value

    let data = {
        'id':id, 'username': username, 'fullName': fullName, 'studentCode': studentCode, 'email': email,
        'password': password, 'role': role
    }

    let request = sendRequest('/api/user', 'PUT', data)

    request.onload = function () {
        window.location = 'users.html';
    }
    request.onerror = function () {
        alert('Error al registrar usuario.')
    }
}

function deleteUser(){
    let id = document.getElementById('id').value
    let request = sendRequest('/api/user/'+ id, 'DELETE', '')
    request.onload = function(){
        window.location = 'users.html';
    }
    request.onerror = function(){
        alert('Error al guardar los cambios.')
    }
}

function logOut() {
    localStorage.clear();
    window.location = 'login.html';
}