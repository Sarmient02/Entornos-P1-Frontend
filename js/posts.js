var API_URL;

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    API_URL = 'http://localhost:8080';
} else {
    API_URL = 'https://entornos-p1-backend.onrender.com';
}

function sendRequest(endPoint, method, data) {
    let request = new XMLHttpRequest();
    request.open(method, API_URL + endPoint);
    request.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("token"));
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(data));
    return request
}

function getFriendlyRole(role) {
    switch (role) {
        case 'ROLE_USER':
            return 'Usuario';
        case 'ROLE_ADMIN':
            return 'Administrador';
        default:
            return role;
    }
}

function loadData() {
    if (localStorage.getItem("token") == null || localStorage.getItem("token") == undefined) {
        window.location = 'login.html';
        alert('No tiene permisos para acceder a esta página.')
    }
    let request = sendRequest('/api/post/all', 'GET', '')

    let table = document.getElementById('posts-table');
    table.innerHTML = "";
    request.onload = function () {
        if (request.status == 403 || JSON.parse(sessionStorage.getItem("user")).role != 'ROLE_ADMIN') {
            window.location = 'home.html';
            alert('No tiene permisos para acceder a esta página.')
        }
        let data = request.response;
        let json = JSON.parse(data);
        localStorage.setItem("posts", (data))
        json.forEach((element, index) => {
            table.innerHTML += `
                <tr>
                    <th class="text-center">${element.id}</th>
                    <th>${element.title}</th>
                    <td>${element.description}</td>
                    <td>${element.createdAt}</td>
                    <td>${element.username}</td>
                    <td style="display: flex; justify-content: space-evenly;">
                        <a type="button" target='_blank' href="${(element.accessUrl)}" class="btn btn-success" style="display: flex; align-items: center; justify-content: center;"><span class="material-symbols-outlined">download</span></a>
                        <button type="button" class="btn btn-info" style="display: flex; align-items: center; justify-content: center;" onclick='window.location = 
                        "form_posts.html?id=${element.id}"'><span class="material-symbols-outlined">edit</span></button>
                        <button type="button" class="btn btn-danger" style="display: flex; align-items: center; justify-content: center;" onclick=deletePostById(${(element.id)},${(element.userId)})><span class="material-symbols-outlined">delete</span></button>
                    </td>
                    
                </tr>
                `
        });
    }
    request.onerror = function () {
        table.innerHTML = `
            <tr>
                <td colspan="5">Error al recuperar los datos.</td>
            </tr>
        `;
    }
}

function savePost() {
    let accessUrl = document.getElementById('p-accessUrl').value
    let title = document.getElementById('p-title').value
    let description = document.getElementById('p-description').value
    let userId = JSON.parse(sessionStorage.getItem("user")).id
    let data = {
        'accessUrl': accessUrl, 'title': title, 'description': description, 'userId': userId, 'subjectId': 1
    }

    let request = sendRequest('/api/post', 'POST', data)

    request.onload = function () {
        window.location = 'posts.html';
    }
    request.onerror = function () {
        alert('Error al crear publicacion.')
    }
}

function updatePost() {
    let id = document.getElementById('id').value
    let userId= document.getElementById('userId').value
    let title = document.getElementById('title').value
    let description = document.getElementById('description').value
    let accessUrl = document.getElementById('accessUrl').value
    let date = new Date();

    let data = {
        'id': id, 'userId': userId, 'title':title, 'description':description, 'accessUrl':accessUrl, "subjectId": 1, "createdAt": date
    }

    let request = sendRequest('/api/post', 'PUT', data)

    request.onload = function () {
        window.location = 'posts.html';
    }
    request.onerror = function () {
        alert('Error al registrar publicacion.')
    }
}

function deletePostById(id, userId) {
    let request = sendRequest('/api/post?id='+id+'&userId='+userId, 'DELETE', '')
    request.onload = function () {
        window.location = 'posts.html';
    }
    request.onerror = function () {
        alert('Error al guardar los cambios.')
    }
}

function logOut() {
    localStorage.clear();
    sessionStorage.clear();
    window.location = 'login.html';
}