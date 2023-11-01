document.addEventListener('DOMContentLoaded', function() {
    
    if (localStorage.getItem("token") != null && localStorage.getItem("token") != undefined) {
        
        var visit = document.getElementById("visit");
        var user = document.getElementById("user");
        if (user.style.display === "none") {
            user.style.display = "block";
            visit.style.display = "none";
        }
        loadUserInfo();
    }

}, false);

function loadUserInfo(){
    if(sessionStorage.getItem("user") == null){
        let request = sendRequest('/api/user/data', 'GET', '')
        request.onload = function(){
            let data = request.response;
            let json = JSON.parse(data);
            sessionStorage.setItem("user", (JSON.stringify(json)))
            console.log(sessionStorage.getItem("user").role)
            changeToAdmin();
        }
    }
    changeToAdmin();
}

function changeToAdmin() {
    if (JSON.parse(sessionStorage.getItem("user")).role === "ROLE_ADMIN") {
        var admin = document.getElementById("admin");
        if (admin.style.display === "none") {
            admin.style.display = "inline-block";
        }
    }else{
        var admin = document.getElementById("admin");
        if (admin.style.display === "inline-block") {
            admin.style.display = "none";
        }
    }
}