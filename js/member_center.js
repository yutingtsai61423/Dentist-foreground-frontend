window.onload = () => {
    const APIURL = YOKULT_URL + MEMBER;
    const memID = sessionStorage.getItem("memID");
    const token = sessionStorage.getItem("token");
    console.log(token);
    if (token === null) {
        window.location.replace("index.html");
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios.defaults.headers.post["Content-Type"] =
        "application/json;charse=UTF-8";
    axios
        .get(APIURL + `/${memID}`)
        .then((response) => {
            console.log(response.data);
            member = response.data;
            console.log(member);
            addList(member);
        })
        .catch(function (error) {
            console.log("Error:");
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });

    $("#memberInfo").on("click", "#btn_modify_member", (e) => {
        let member = {};
        member["memID"] = document.getElementById("mem_id").value;
        member["memName"] = document.getElementById("mem_name").value;
        member["memEmail"] = document.getElementById("mem_email").value;
        member["memCellPhone"] = document.getElementById("mem_cellphone").value;
        member["memBirth"] = document.getElementById("mem_birth").value;
        member["memAddress"] = document.getElementById("mem_address").value;
        axios.put(APIURL + "/modify", member).then((response) => {
            let msg = response.data["msg"];
            if (msg === "success") {
                document.getElementById(
                    "login-message"
                ).innerText = `修改成功。`;
            }
        });
    });
};
function addList(member) {
    let list = `
<label for="mem_id" class="form-label">帳號</label>
    <div class="input-group mb-3">
        <input type="text" id="mem_id" class="form-control" value="${
            member["memID"] ?? ""
        }" disabled/>
    </div>
    <label for="mem_name" class="form-label">姓名</label>
    <div class="input-group mb-3">
        <input type="text" id="mem_name" class="form-control" placeholder="請輸入姓名" value="${
            member["memName"] ?? ""
        }"/>
        <div class="input-group-append">
            <div class="input-group-text" style="height: 100%">
                <span class="fas fa-user"></span>
            </div>
        </div>
    </div>
    <label for="mem_email" class="form-label">信箱</label>
    <div class="input-group mb-3">
        <input type="email" id="mem_email" class="form-control" placeholder="請輸入信箱" value="${
            member["memEmail"] ?? ""
        }"/>
    <div class="input-group-append">
        <div class="input-group-text" style="height: 100%">
            <span class="fa fa-envelope-open"></span>
        </div>
    </div>
</div>

<label for="mem_cellphone" class="form-label">手機號碼</label>
<div class="input-group mb-3">
    <input type="text" id="mem_cellphone" class="form-control" placeholder="手機號碼" value="${
        member["memCellPhone"] ?? ""
    }"/>
    <div class="input-group-append">
        <div class="input-group-text" style="height: 100%">
            <span class="fa fa-phone-alt"></span>
        </div>
    </div>
</div>
<label for="mem_birth" class="form-label">出生日期</label>
<div class="input-group mb-3">
    <input type="date" id="mem_birth" class="form-control" placeholder="出生日期" value="${
        member["memBirth"] ?? ""
    }"/>
    <div class="input-group-append">
        <div class="input-group-text" style="height: 100%">
            <span><i class="fa fa-calendar"></i></span>
        </div>
    </div>
</div>

<label for="mem_address" class="form-label">居住地址</label>
<div class="input-group mb-3">
    <input type="text" id="mem_address" class="form-control" placeholder="居住地址" value="${
        member["memAddress"] ?? ""
    }"/>
    <div class="input-group-append">
        <div class="input-group-text" style="height: 100%">
            <span class="bi-geo-alt"></span>
        </div>
    </div>
</div>
<button type="button" class="btn btn-primary" data-bs-toggle="modal"
data-bs-target="#searchModal" id="btn_modify_member">修改</button>`;
    $("#memberInfo").append(list);
}
