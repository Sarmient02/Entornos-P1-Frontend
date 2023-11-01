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

window.onload = function () {
    loadData();
}

function loadData() {
    let request = sendRequest('/api/post/all', 'GET', '')

    let table = document.getElementById('documentos');
    request.onload = function () {
        
        let data = request.response;
        let json = JSON.parse(data);
        localStorage.setItem("posts", (data))
        json.forEach((element, index) => {
            table.innerHTML += `
            <div class="col" *ngFor="let documento of documentos">
                    <div class="card border-0 h-100">
                        <div class="card-body d-flex flex-column justify-content-between p-4">
                            <div class="d-flex flex-column"> <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/833px-PDF_file_icon.svg.png"
                                    alt="Image description"></div>
                            <div>
                                <h6 class="fw-bold text-muted">${(element.title)}</h6>
                                <p>${(element.description)}</p>
                            </div><a class="btn btn-primary" role="button" href="${(element.accessUrl)}">Descargar</a>
                        </div>
                    </div>
            </div>
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

function searchDocumentos(){
    let search = document.getElementById('search').value;
    let request = sendRequest('/api/post/getByTitle?title='+search, 'GET', '')

    localStorage.removeItem("posts");

    let table = document.getElementById('documentos');
    request.onload = function () {
        
        let data = request.response;
        let json = JSON.parse(data);
        localStorage.setItem("posts", (data))
        table.innerHTML = "";
        json.forEach((element, index) => {
            table.innerHTML += `
            <div class="col" *ngFor="let documento of documentos">
                    <div class="card border-0 h-100">
                        <div class="card-body d-flex flex-column justify-content-between p-4">
                            <div class="d-flex flex-column"> <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/833px-PDF_file_icon.svg.png"
                                    alt="Image description"></div>
                            <div>
                                <h6 class="fw-bold text-muted">${(element.title)}</h6>
                                <p>${(element.description)}</p>
                            </div><a class="btn btn-primary" role="button" href="${(element.accessUrl)}">Descargar</a>
                        </div>
                    </div>
            </div>
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