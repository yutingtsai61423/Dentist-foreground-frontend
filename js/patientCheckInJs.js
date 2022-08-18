$(function () {
  sessionStorage.setItem("account", "TGA001");
  sessionStorage.setItem("memName", "吳小儒");
  let memIdLogin = sessionStorage.getItem("account");
  let memName = sessionStorage.getItem("memName");
  //==取消enter==
  $(document).keydown(function (event) {
    switch (event.keyCode) {
      case 13:
        return false;
    }
  });
  // 當天才報到!!
  $("a.checkIn").on("click", function () {
    let inputID = $("input.Idcard").val();
    console.log(inputID);
    $("div.overlay").fadeIn();
    if (inputID == "") {
      $("div.overlay article").find("p").html(`<h3>未輸入身分證字號</h3>`);
    } else {
      $.ajax({
        url: YOKULT_URL + BOOKING + "/patientCheckin", // 資料請求的網址
        type: "POST", // GET | POST | PUT | DELETE | PATCH
        contentType: "application/json",
        data: JSON.stringify({
          patientIdcard: inputID,
          memID: memIdLogin,
        }), // 將物件資料(不用雙引號) 傳送到指定的 url
        dataType: "json", // 預期會接收到回傳資料的格式： json | xml | html
        success: function (data) {
          console.log(data.msg);

          if (data.msg == "checkin success") {
            $("div.overlay article")
              .find("p")
              .html(
                `<h3>${memName}報到成功</h3>
                `
              );
          } else if (data.msg == "you have no booking today") {
            $("div.overlay article")
              .find("p")
              .html(
                `<h3>報到失敗 查無當日掛號紀錄</h3>
                `
              );
          } else if (data.msg == "not correct IDcard") {
            $("div.overlay article")
              .find("p")
              .html(
                `<h3>輸入錯誤</h3><h3>非${memName}身分證字號</h3>
                `
              );
          }
        },
      });
    }
  });

  // 關閉 Modal
  $("button.btn_modal_close").on("click", function (e) {
    $("div.overlay").fadeOut();
  });

  $("div.overlay > article").on("click", function (e) {
    e.stopPropagation();
  });
});
