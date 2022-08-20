$(function () {
  // sessionStorage.setItem("account", "TGA001");
  sessionStorage.setItem("memName", "吳小儒");
  let memIdLogin = sessionStorage.getItem("memID");
  let memName = sessionStorage.getItem("memName");
  let package = {}; //暫時裝資料用的package
  let doctorId = 1; //*************init******************* */
  init();
  $("input#yourname").val(`${memName}`);
  //==取消enter==
  $(document).keydown(function (event) {
    switch (event.keyCode) {
      case 13:
        return false;
    }
  });

  // ====按按鈕切換醫生ID=====
  $("input#nextdr").on("click", function () {
    if (!$("input#nextdr").hasClass("clicked")) {
      doctorId = 2;
      $("input#nextdr").addClass("clicked");
      let str = $("select.selectDate option:selected").text();
      let date1 = str.substring(0, str.indexOf(" "));
      let date2 = str.substring(str.lastIndexOf(" ") + 1);
      ajaxForScheduleDrname(date1, date2);
    } else {
      doctorId = 1;
      $("input#nextdr").removeClass("clicked");
      let str = $("select.selectDate option:selected").text();
      let date1 = str.substring(0, str.indexOf(" "));
      let date2 = str.substring(str.lastIndexOf(" ") + 1);
      ajaxForScheduleDrname(date1, date2);
    }
  });

  //=======用memid查詢身分證===登入狀態 如果幫你填  如果沒來過初診 預設初診===

  //==========初診複診選單==============
  // $("input#double").on("click", function () {
  //   if ($("input#double").prop("checked")) {
  //     $("input#yourname").css("display", "none");
  //     $("input#IDcard").attr("type", "hidden");
  //     $("input#IDcard").val(`${package.patientIdcard}`);
  //     console.log(package.patientIdcard);
  //   } else {
  //     $("input#yourname").css("display", "");
  //     $("input#IDcard").css("display", "");
  //   }
  // });
  // $("input#single").on("click", function () {
  //   if ($("input#single").prop("checked")) {
  //     $("input#yourname").css("display", "");
  //     $("input#yourname").val(`您的會員編號：${memIdLogin}`);
  //     $("input#IDcard").attr("type", "text");
  //     $("input#IDcard").val("");
  //   }
  // });

  function getID(memIdLogin) {
    if (memIdLogin != null) {
      $.ajax({
        url: YOKULT_URL + BOOKING + "/bookingQuery/hasCameHere",
        type: "GET",
        data: {
          memID: memIdLogin,
        },
        dataType: "json",
        success: function (data) {
          console.log("getID");
          console.log(data);
          //=====判斷為初診
          if (data.msg == "you have no booking data") {
            // alert("無就診紀錄，請選擇初診，並填寫身分證字號，感謝您");
            $("input#single").prop("checked", true);
            $("input#double").prop("checked", false);
            $("input#double").prop("disabled", true);
            $("input#yourname").attr("type", "text");
            $("input#IDcard").attr("type", "text");
            $("input#IDcard").attr("readonly", false);
          }
          //=====判斷為複診
          if (data.msg == "booking data sucess") {
            // console.log(data.list[0].patientIdcard);
            let id = data.patientIdcard;
            package.patientIdcard = id;
            $("input#single").prop("checked", false);
            $("input#single").prop("disabled", true);
            $("input#double").prop("checked", true);

            $("input#yourname").attr("type", "hidden");
            $("input#IDcard").attr("type", "hidden");
            $("input#IDcard").val(`${package.patientIdcard}`);
            // $("input#IDcard").attr("readonly", true);
          }
        },
      });
    }
  }
  // console.log("====");
  // console.log(getID(memIdLogin)); //undefined
  // console.log("====");
  getID(memIdLogin);
  //======點擊格子帶入======

  // let memIdLogin = sessionStorage.getItem("account");
  $("div.weekBookingTime a").on("click", function () {
    // console.log(this);
    let getSpan = $(this).closest("div.week").find("div.th span");
    let getYear = $(getSpan).find("input").val();
    let getDate = $(getSpan)
      .text()
      .substring(0, $(getSpan).text().indexOf("("));
    let date = getYear + "/" + getDate.replace(/ /g, "");
    date = date.replace(/\//g, "-");
    let ampm = $(this).text().substring(0, 1);
    //加工日期
    let arr = date.split("-");
    let monthadd;
    let dateadd;
    if (arr[1].length == 1) {
      monthadd = "0" + arr[1];
    } else {
      monthadd = arr[1];
    }
    if (arr[2].length == 1) {
      dateadd = "0" + arr[2];
    } else {
      dateadd = arr[2];
    }
    date = arr[0] + "-" + monthadd + "-" + dateadd;
    console.log(date);
    // console.log(ampm);
    package.bookingDate = date;
    package.amPm = ampm;
    package.doctorId = doctorId;
    package.dorctorName = $("span.drName").text();
    // console.log($("input[name='dr']"));
    $("input[name='dr']").val(`${package.dorctorName}`);
    $("input[name='bookingDate']").val(`${package.bookingDate}`);
    $("input[name='bookingTime']").val(`${package.amPm}`);
  });

  //======彈跳視窗=====
  // 開啟 Modal 彈跳視窗

  $("button.btn_modal").on("click", function () {
    // if ($("*:invalid") == 0) {
    $("div.overlay").fadeIn();

    //發送bookingajax
    ajaxForBooking(package);
    // }
  });

  // 關閉 Modal
  $("button.btn_modal_close").on("click", function (e) {
    $("div.overlay").fadeOut();
  });

  $("div.overlay > article").on("click", function (e) {
    e.stopPropagation();
  });

  // ===============下一周下拉選單==========
  function weekDate(date) {
    let year = date.getFullYear();
    let one_day = 86400000;
    //回傳星期幾
    let day = date.getDay();
    // 設時間為0:0:0
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    //回傳自1970/01/01至今的毫秒數
    let todayMillis = date.getTime();
    let sixDayMillis = 6 * 24 * 60 * 60 * 1000;
    let sevenDayMillis = 7 * 24 * 60 * 60 * 1000;

    let this_week_end = new Date(todayMillis + sixDayMillis);
    let next_week_start = new Date(todayMillis + sevenDayMillis);
    let next_week_end = new Date(next_week_start.getTime() + sixDayMillis);
    let next_2week_start = new Date(next_week_start.getTime() + sevenDayMillis);
    let next_2week_end = new Date(next_2week_start.getTime() + sixDayMillis);

    let next_3week_start = new Date(
      next_2week_start.getTime() + sevenDayMillis
    );
    let next_3week_end = new Date(next_3week_start.getTime() + sixDayMillis);

    let thisWeek = `${date.getFullYear()}/${
      date.getMonth() + 1
    }/${date.getDate()} - ${this_week_end.getFullYear()}/${
      this_week_end.getMonth() + 1
    }/${this_week_end.getDate()}`;

    let nextWeek = `${next_week_start.getFullYear()}/${
      next_week_start.getMonth() + 1
    }/${next_week_start.getDate()} - ${next_week_end.getFullYear()}/${
      next_week_end.getMonth() + 1
    }/${next_week_end.getDate()}`;

    let next2Week = `${next_2week_start.getFullYear()}/${
      next_2week_start.getMonth() + 1
    }/${next_2week_start.getDate()} - ${next_2week_end.getFullYear()}/${
      next_2week_end.getMonth() + 1
    }/${next_2week_end.getDate()}`;

    let next3Week = `${next_3week_start.getFullYear()}/${
      next_3week_start.getMonth() + 1
    }/${next_3week_start.getDate()} - ${next_3week_end.getFullYear()}/${
      next_3week_end.getMonth() + 1
    }/${next_3week_end.getDate()}`;

    var map = new Map();
    map["1"] = thisWeek;
    map["2"] = nextWeek;
    map["3"] = next2Week;
    map["4"] = next3Week;

    return map;
  }

  //===下拉選單填入日期  執行填入===
  const now = new Date();
  let weekMap = weekDate(now);
  $("select.selectDate")
    .children("option")
    .each(function (index, item) {
      $(item).text(weekMap[index + 1]);
    });

  //=============顯示每天日期=========

  //====預設填入本周日期======
  trWriteinit(now);

  //====依據下拉事選單 填入對應日期===
  $("select.selectDate").on("change", function () {
    let dateObjectBaseline;
    let sevenDayMillis = 7 * 24 * 60 * 60 * 1000;
    let sixDayMillis = 6 * 24 * 60 * 60 * 1000;
    if ($("select.selectDate option.week1").prop("selected")) {
      dateObjectBaseline = now;
    } else if ($("select.selectDate option.week2").prop("selected")) {
      dateObjectBaseline = new Date(now.getTime() + sevenDayMillis);
    } else if ($("select.selectDate option.week3").prop("selected")) {
      dateObjectBaseline = new Date(now.getTime() + 2 * sevenDayMillis);
    } else if ($("select.selectDate option.week4").prop("selected")) {
      dateObjectBaseline = new Date(now.getTime() + 3 * sevenDayMillis);
    }
    trWrite(dateObjectBaseline);
    // console.log($("select.selectDate option:selected").text());
    let str = $("select.selectDate option:selected").text();

    let date1 = str.substring(0, str.indexOf(" "));
    let date2 = str.substring(str.lastIndexOf(" ") + 1);
    // console.log(date1);
    // console.log(date2);
    ajaxForScheduleDrname(date1, date2);
  });

  //===========自動填入星期相關方法==============
  //=====預設載入頁面值===
  function trWriteinit(now) {
    trWrite(now);
  }

  //寫入日期標籤
  function trWrite(dateObjectBaseline) {
    let thisWeekDateTextMap = getThisWeekDate(dateObjectBaseline);
    let thisWeekDateObjectMap =
      getThisWeekEverydayDateObject(dateObjectBaseline);
    let thisWeekDateChineseMap = getChineseWeekDay(thisWeekDateObjectMap);

    $("div.week")
      .children("div.th")
      .each(function (index, item) {
        let text = thisWeekDateTextMap[index + 1];
        let text2 = thisWeekDateChineseMap[index + 1];
        $(item).html(`<span>${text}<br>(${text2})</span>`);
        // $(item).after("")
      });

    // $("tr.chineseWeekDay")
    //   .children("th")
    //   .each(function (index, item) {
    //     let text2 = thisWeekDateChineseMap[index + 1];
    //     $(item).html(text2);
    //   });
  }
  // 拿到每天日期字串;
  function getThisWeekDate(date) {
    let thisWeekDateObjectMap = getThisWeekEverydayDateObject(date);
    let thisWeekDateTextMap = getThisWeekEverydayDateText(
      thisWeekDateObjectMap
    );
    return thisWeekDateTextMap;
  }

  //拿到每天日期字串
  function getThisWeekEverydayDateText(thisWeekDateObjectMap) {
    let thisWeekDateTextMap = new Map();
    for (let i = 1; i < 8; i++) {
      let str = `<input type="hidden" value="${thisWeekDateObjectMap[
        i
      ].getFullYear()}">${
        thisWeekDateObjectMap[i].getMonth() + 1
      } / ${thisWeekDateObjectMap[i].getDate()}`;
      thisWeekDateTextMap[i] = str;
      //   console.log(str);
    }
    return thisWeekDateTextMap;
  }

  //拿到本周每日Date物件
  function getThisWeekEverydayDateObject(date) {
    let todayMillis = date.getTime();
    let oneDayMillis = 1 * 24 * 60 * 60 * 1000;
    let thisWeekDateObjectMap = new Map();
    let thisMillis = todayMillis;
    for (let i = 1; i < 8; i++) {
      if (i == 1) {
        thisWeekDateObjectMap[i] = date;
      } else {
        thisMillis += oneDayMillis;
        thisWeekDateObjectMap[i] = new Date(thisMillis);
      }
      //   console.log(thisWeekDateObjectMap[i]);
    }
    return thisWeekDateObjectMap;
  }

  //拿到每天星期字串
  function getChineseWeekDay(thisWeekDateObjectMap) {
    let thisWeekDateChineseMap = new Map();
    for (let i = 1; i < 8; i++) {
      // console.log(thisWeekDateObjectMap[i]);
      let n = thisWeekDateObjectMap[i].getDay();
      switch (n) {
        case 1:
          thisWeekDateChineseMap[i] = "一";
          break;
        case 2:
          thisWeekDateChineseMap[i] = "二";
          break;
        case 3:
          thisWeekDateChineseMap[i] = "三";
          break;
        case 4:
          thisWeekDateChineseMap[i] = "四";
          break;
        case 5:
          thisWeekDateChineseMap[i] = "五";
          break;
        case 6:
          thisWeekDateChineseMap[i] = "六";
          break;
        case 0:
          thisWeekDateChineseMap[i] = "日";
          break;
      }
    }
    return thisWeekDateChineseMap;
  }

  //======init填入醫師看診時段======
  function init() {
    let date = new Date();
    let year = date.getFullYear();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    //回傳自1970/01/01至今的毫秒數
    let todayMillis = date.getTime();
    let sixDayMillis = 6 * 24 * 60 * 60 * 1000;
    let this_week_end = new Date(todayMillis + sixDayMillis);

    let date1 = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    let date2 = `${this_week_end.getFullYear()}-${
      this_week_end.getMonth() + 1
    }-${this_week_end.getDate()}`;

    $("div.weekBookingTime div.week").find("a").addClass("disabled");

    ajaxForScheduleDrname(date1, date2);
  }

  function ajaxForScheduleDrname(date1, date2) {
    $.ajax({
      url: YOKULT_URL + BOOKING + "/drSchedule", // 資料請求的網址
      type: "GET", // GET | POST | PUT | DELETE | PATCH
      data: {
        date1: date1,
        date2: date2,
        doctorId: doctorId,
      }, // 將物件資料(不用雙引號) 傳送到指定的 url
      dataType: "json", // 預期會接收到回傳資料的格式： json | xml | html
      success: function (data) {
        // console.log(data);
        $("span.drName").text(data.schedule.name + "醫師");
        // console.log(data.schedule.photo.length > 0);
        if (data.schedule.photo.length > 0) {
          $("img.drImg").attr(
            "src",
            `data:image/png;base64,${data.schedule.photo}`
          );
        }

        //判斷最後兩個數字
        //歸零
        $("div.weekBookingTime div.week").find("a").addClass("disabled");
        $.each(data.schedule.list, function (i, listitem) {
          //listitem印出{doctorScheduleDate: '2022-07-22', doctorAmpm: '早'}
          $.each(
            $("div.weekBookingTime div.th").children("span"),
            function (index, item) {
              // console.log($(item).text());
              let str =
                $(item)
                  .text()
                  .substring(
                    $(item).text().lastIndexOf(" ") + 1,
                    $(item).text().indexOf("(")
                  ) + "";
              if (str.length == 1) {
                str = "0" + str;
              }
              // console.log("str=", str);
              // console.log("doctorScheduleDate substring",  listitem.doctorScheduleDate.substring(8) );

              if (listitem.doctorScheduleDate.substring(8) == str) {
                let ampm = listitem.doctorAmpm;
                switch (ampm) {
                  case "早":
                    $(item)
                      .closest("div.week")
                      .find("a")
                      .eq(0)
                      .removeClass("disabled");
                    break;
                  case "午":
                    $(item)
                      .closest("div.week")
                      .find("a")
                      .eq(1)
                      .removeClass("disabled");
                    break;
                  case "晚":
                    $(item)
                      .closest("div.week")
                      .find("a")
                      .eq(2)
                      .removeClass("disabled");
                    break;
                }
              }
            }
          );
        });
      },
    });
  }

  //======= Booking的ajax
  function ajaxForBooking() {
    // $("div.overlay").fadeIn();
    $.ajax({
      url: YOKULT_URL + BOOKING + "/receiveBookingRequest", // 資料請求的網址
      type: "POST", // GET | POST | PUT | DELETE | PATCH
      contentType: "application/json",
      data: JSON.stringify({
        memID: memIdLogin,
        patientIdcard: $("input#IDcard").val(),
        bookingDate: package.bookingDate,
        amPm: package.amPm,
        doctorId: package.doctorId,
      }), // 將物件資料(不用雙引號) 傳送到指定的 url
      dataType: "json", // 預期會接收到回傳資料的格式： json | xml | html
      success: function (data) {
        console.log(data.msg);
        if (data.msg == "receiveBookingRequest success") {
          $("div.overlay article")
            .find("p")
            .html(
              `<h3>掛號成功</h3>姓名：${$(
                "input#yourname"
              ).val()}<br>身分證字號：${$("input#IDcard").val()}<br>掛號醫師：${
                package.dorctorName
              }<br>掛號日期：${package.bookingDate}<br>掛號時段：${
                package.amPm
              }<br>就診號碼：${data.bookingNumber}`
            );
        } else if (data.msg == "receiveBookingRequest failure") {
          $("div.overlay article")
            .find("p")
            .html(
              `<h3>掛號失敗 當日重複掛號</h3>身分證字號：${$(
                "input#IDcard"
              ).val()}<br>掛號日期：${package.bookingDate}
                `
            );
        } else if (data.msg == "IDCARD didn't key in") {
          $("div.overlay article")
            .find("p")
            .html(
              `<h3>身分證字號未填寫完成</h3>
                `
            );
        } else if (data.msg == "TIME didn't key in") {
          $("div.overlay article")
            .find("p")
            .html(
              `<h3>掛號日期未選取</h3>
                `
            );
        } else if (data.msg == "PatientIdcard wrong format") {
          $("div.overlay article")
            .find("p")
            .html(
              `<h3>身分證字號格式錯誤</h3>
                `
            );
        }
      },
    });
    return false;
  }
});
