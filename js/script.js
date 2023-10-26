const url = "http://localhost:8080"

function sendRequest(endPoint, method, data){
    let request = new XMLHttpRequest();
    request.open(method, url+endPoint);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(data));
    return request
}

function validarLogin(){
    var username = document.getElementById('username').value
    var password = document.getElementById('password').value

    console.log(username)
    console.log(password)
    
    let data = {"username":username, "password":password}

    console.log(data)
    
    sendRequest('/api/auth/login',"POST", data)
}