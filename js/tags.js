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
    let request = sendRequest('/api/tag/all', 'GET', '')

    let table = document.getElementById('tags-table');
    table.innerHTML = "";
    request.onload = function () {
        if (request.status == 403 || JSON.parse(sessionStorage.getItem("user")).role != 'ROLE_ADMIN') {
            window.location = 'home.html';
            alert('No tiene permisos para acceder a esta página.')
        }
        let data = request.response;
        let json = JSON.parse(data);
        localStorage.setItem("tags", (data))
        json.forEach((element, index) => {
            table.innerHTML += `
                <tr>
                    <th class="text-center">${element.id}</th>
                    <th>${element.name}</th>
                    <td style="display: flex; justify-content: space-evenly;">
                        <button type="button" class="btn btn-info" style="display: flex; align-items: center; justify-content: center;" onclick='window.location = 
                        "form_tags.html?id=${element.id}"'><span class="material-symbols-outlined">edit</span></button>
                        <button type="button" class="btn btn-danger" style="display: flex; align-items: center; justify-content: center;" onclick=deleteTagById(${(element.id)},${(element.userId)})><span class="material-symbols-outlined">delete</span></button>
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

function saveTag() {
    let name = document.getElementById('t-name').value
    let data = {
        'name': name
    }

    let request = sendRequest('/api/tag/new', 'POST', data)

    request.onload = function () {
        window.location = 'tags.html';
    }
    request.onerror = function () {
        alert('Error al crear etiqueta.')
    }
}

function updateTag() {
    let id = document.getElementById('id').value
    let name = document.getElementById('name').value

    let data = {
        'id': id, 'name': name
    }

    let request = sendRequest('/api/tag/edit', 'PUT', data)

    request.onload = function () {
        window.location = 'tags.html';
    }
    request.onerror = function () {
        alert('Error al registrar etiqueta.')
    }
}

function deleteTagById(id) {
    let request = sendRequest('/api/tag?tagId='+id, 'DELETE', '')
    request.onload = function () {
        window.location = 'tags.html';
    }
    request.onerror = function () {
        alert('Error al guardar los cambios.')
    }
}

function logOut() {
    localStorage.clear();
    window.location = 'login.html';
}