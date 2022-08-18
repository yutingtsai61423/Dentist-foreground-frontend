const member = {};
window.onload = (e) => {
    window.onload = (e) => {
        if (sessionStorage.getItem("token")) {
            window.location.replace("index.html");
        }
    };
    document.getElementById("btn_signup").addEventListener("click", () => {
        const API = YOKULT_URL + MEMBER;
        member["memID"] = document.getElementById("memID").value;
        member["memPassword"] = document.getElementById("memPassword").value;
        member["memEmail"] = document.getElementById("memEmail").value;
        member["memName"] = document.getElementById("memName").value;
        member["memBirth"] = document.getElementById("memBirth").value;
        member["memCellPhone"] = document.getElementById("memCellPhone").value;
        member["memAddress"] = document.getElementById("memAddress").value;
        let memPasswordConfirm =
            document.getElementById("memPasswordConfirm").value;
        let validation = accountValidation(member, memPasswordConfirm);
        if (validation !== "pass") {
            document.getElementById("login-message").innerText = validation;
        } else {
            axios
                .post(API + "/register", member)
                .then((response) => {
                    let msg = registerMsg(response.data.msg);
                    document.getElementById("login-message").innerText = msg;
                })
                .catch((error) => console.log(error));
        }
    });
};
function registerMsg(msg) {
    if (msg === "Invalid member account") {
        return "帳號已被註冊";
    } else if (msg === "Invalid member email") {
        return "Email已被註冊";
    } else if (msg === "success") {
        return "帳號註冊成功，請收信開通。";
    } else {
        return "未知錯誤";
    }
}

//JS regex reference: https://ithelp.ithome.com.tw/articles/10094951
function accountValidation(member, memPasswordConfirm) {
    if (/[(a-zA-Z0-9)]{6,20}/.test(member.memID) === false) {
        return "無效的帳號";
    }
    if (
        member.memPassword == null ||
        member.memPassword == "" ||
        member.memPassword !== memPasswordConfirm
    ) {
        return "輸入密碼錯誤";
    }
    if (
        /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/.test(
            member.memEmail
        ) === false
    ) {
        return "無效的信箱";
    }
    if (/[0-9]{10}/.test(member.memCellPhone) === false) {
        return "手機號碼錯誤";
    }
    return "pass";
}
