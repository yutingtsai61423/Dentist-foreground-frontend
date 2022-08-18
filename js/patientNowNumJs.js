$(function () {
  let doctorId1 = 1;
  let doctorId2 = 2;

  function init() {
    $.ajax({
      url: YOKULT_URL + BOOKING + "/nowNum", // 資料請求的網址
      type: "POST", // GET | POST | PUT | DELETE | PATCH
      contentType: "application/json",
      data: JSON.stringify({
        doctorId: doctorId1,
      }), // 將物件資料(不用雙引號) 傳送到指定的 url
      dataType: "json", // 預期會接收到回傳資料的格式： json | xml | html
      success: function (data) {
        console.log(data.msg);
        if (data.msg == "nowNum success") {
          $("td.drNum1").text(data.checkinVO.bookingNumber);
        } else if (data.msg == "no nowNum") {
          $("td.drNum1").text("--");
        }
      },
    });
    $.ajax({
      url: YOKULT_URL + BOOKING + "/nowNum", // 資料請求的網址
      type: "POST", // GET | POST | PUT | DELETE | PATCH
      contentType: "application/json",
      data: JSON.stringify({
        doctorId: doctorId2,
      }), // 將物件資料(不用雙引號) 傳送到指定的 url
      dataType: "json", // 預期會接收到回傳資料的格式： json | xml | html
      success: function (data) {
        console.log(data.msg);
        if (data.msg == "nowNum success") {
          $("td.drNum2").text(data.checkinVO.bookingNumber);
        } else if (data.msg == "no nowNum") {
          $("td.drNum2").text("--");
        }
      },
    });
  }

  function getDrName() {
    $.ajax({
      url: YOKULT_URL + DOCTOR + "/loadDr", // 資料請求的網址
      type: "POST", // GET | POST | PUT | DELETE | PATCH
      contentType: "application/json",
      data: JSON.stringify({
        doctorId: doctorId1,
      }), // 將物件資料(不用雙引號) 傳送到指定的 url
      dataType: "json", // 預期會接收到回傳資料的格式： json | xml | html
      success: function (data) {
        console.log(data.msg);
        if (!!data.doctor.doctorName) {
          $("td.drName1").text(data.doctor.doctorName);
        }
      },
    });
    $.ajax({
      url: YOKULT_URL + DOCTOR + "/loadDr", // 資料請求的網址
      type: "POST", // GET | POST | PUT | DELETE | PATCH
      contentType: "application/json",
      data: JSON.stringify({
        doctorId: doctorId2,
      }), // 將物件資料(不用雙引號) 傳送到指定的 url
      dataType: "json", // 預期會接收到回傳資料的格式： json | xml | html
      success: function (data) {
        console.log(data.msg);
        if (!!data.doctor.doctorName) {
          $("td.drName2").text(data.doctor.doctorName);
        }
      },
    });
  }

  init();
  getDrName();

  setInterval(function () {
    // 現在日期時間
    var now = new Date();
    var dateString = `${now.getFullYear()}/${
      now.getMonth() + 1
    }/${now.getDate()}<br>${now.getHours()}: ${now.getMinutes()}: ${now.getSeconds()}`;

    $("#time").html(dateString);
  }, 1000);
});
