window.onload = (e) => {
    if (sessionStorage.getItem("token")) {
        window.location.replace("index.html");
    }
};
function login() {
    let memID = document.getElementById("memID").value;
    let memPassword = document.getElementById("memPassword").value;
    // console.log(memID);
    // console.log(memPassword);
    const loginURL = YOKULT_URL + MEMBER + "/login";
    axios
        .post(loginURL, {
            memID: memID,
            memPassword: memPassword,
        })
        .then((response) => {
            if (response.status === 200) {
                sessionStorage.setItem("token", response.data["msg"]);
                console.log(response.data);
                let jwt = parseJwt(sessionStorage.getItem("token"));
                console.log(jwt);
                sessionStorage.setItem("memID", jwt["sub"]);
                document.getElementById(
                    "login-message"
                ).innerText = `登入成功，${memID}您好。
                `;
                setTimeout(() => {
                    window.location.replace("index.html");
                }, 3000);
            } else {
                document.getElementById(
                    "login-message"
                ).innerText = `登入失敗，請重新登入。
                `;
            }
        })
        .catch((error) => console.log(error));
}
// Referenced:
// https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
        window
            .atob(base64)
            .split("")
            .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
    );

    return JSON.parse(jsonPayload);
}
