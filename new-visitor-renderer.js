let dbName;
let version;
let isBlacklisted = false;
let isReturnedLastPass = false;

document.getElementById("btnClose").addEventListener("click", (e) => {
  e.preventDefault();
  window.electronAPI.quiteWindow("y");
});

document.getElementById("btnCancel").addEventListener("click", (e) => {
  e.preventDefault();
  window.electronAPI.quiteWindow("y");
});

function validateForm(fEl) {
  let isValid = true;
  var e = document.getElementById(fEl).elements;
  for (var i = 0; i < e.length; i++) {
    if (e[i].hasAttribute("required") && e[i].value == "") {
      isValid = false;
    }
  }
  document.getElementById(fEl).classList.remove("was-validated");
  if (!isValid) document.getElementById(fEl).classList.add("was-validated");

  if (fEl == "visitor-details") {
    var photoObj = document.getElementById("canvas");
    if (photoObj.dataset.isCaptured != "y") {
      $("#visitorPhoto").css("background-color", "#f4cfd2");
      isValid = false;
    } else {
      $("#visitorPhoto").css("background-color", "");
    }
  }
  if (fEl == "visiting-details") {
    if ($("#staffId")[0].value == "") {
      $("#wantedToMeetList").css("background-color", "#f4cfd2");
      isValid = false;
    } else {
      $("#wantedToMeetList").css("background-color", "");
    }
  }

  if (isBlacklisted) {
    showModal();
    isValid = false;
  }

  return isValid;
}

function showModal() {
  var message =
    '<i class="bi bi-check-circle me-1"></i> This information has been saved successfully';
  var blacklistedMessage =
    '<h5 class="modal-title bg-danger text-light"><i class="bi bi-exclamation-octagon me-1"></i>';
  blacklistedMessage =
    blacklistedMessage + "This Visitor is Blacklisted !!!</h5>";
  blacklistedMessage =
    blacklistedMessage +
    " Please Consult with Administrator or concern authority for further procedding.";

  var passNotReturnedMessage =
    '<h5 class="modal-title lert-warning bg-warning"><i class="bi bi-exclamation-triangle me-1"></i>';
  passNotReturnedMessage =
    passNotReturnedMessage +
    "This Visitor has not returned the PASS last time.</h5>";
  passNotReturnedMessage =
    passNotReturnedMessage +
    " Please Consult with Administrator or concern authority for further procedding.";

  if (isBlacklisted) {
    message = blacklistedMessage;
  } else if (isReturnedLastPass) {
    message = passNotReturnedMessage;
  }
  $("#messageModal").on("show.bs.modal", function (e) {
    var obj = $(e.currentTarget);
    obj.find(".modal-body").html(message);
  });
  $("#messageModal").on("hidden.bs.modal", function (e) {
    var obj = $(e.currentTarget);
    obj.find(".modal-body").html("");
  });
  $("#messageModal").modal("show");
}

function next(n, fEl = "") {
  if (fEl != "") {
    if (!validateForm(fEl)) return false;
  }

  // This function removes the "active" class of all steps...
  var i,
    x = document.getElementsByClassName("stepIndicator"),
    y = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].classList.remove("active");
    y[i].style.display = "none";
  }
  //... and adds the "active" class on the current step:
  x[n - 1].classList.add("finish");
  x[n].classList.add("active");
  y[n].style.display = "block";
}

function prev(n) {
  // This function removes the "active" class of all steps...
  var i,
    x = document.getElementsByClassName("stepIndicator"),
    y = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].classList.remove("active");
    y[i].style.display = "none";
  }
  //... and adds the "active" class on the current step:
  x[n].classList.remove("finish");
  x[n].classList.add("active");
  y[n].style.display = "block";
}

function getVisitorDetails(e) {
  const keyVal = e.value;
  $("#visitor-details")[0].reset();
  e.value = keyVal;

  let param = {
    operation: "getByIndex",
    objstore: "Visitors",
    index: "phonenumber",
    key: keyVal,
  };
  indb = new idb(dbName, version);
  indb.openDB(param, handleVisitor);
}

function handleVisitor(p) {
  console.log(p);

  if (!p.result) return true;
  const data = p.result;
  document.getElementById("visitorId").value = data.visitorId;
  document.getElementById("IDProof").value = data.iDProofId;
  document.getElementById("id-number").value = data.iDNumber;
  document.getElementById("VisitorCategory").value = data.catId;
  document.getElementById("age").value = data.age;
  document.getElementById("name").value = data.name;
  document.getElementById("fname").value = data.fname;
  document.getElementById("organization").value = data.organization;
  document.getElementById("address").value = data.address;
  document.getElementById("city").value = data.city;
  document.getElementById("district").value = data.district;
  document.getElementById("States").value = data.stateId;

  if (data.isBlacklisted == "y") {
    isBlacklisted = true;
    showModal();
  } else if (data.isReturnedLastPass == "y") {
    isReturnedLastPass = true;
    showModal();
  }
}

function saveVisitor() {
  var visitorId = document.getElementById("visitorId").value;
  var phonenumber = document.getElementById("contactnumber").value;
  var IDProofCombo = document.getElementById("IDProof");
  var iDProofId = IDProofCombo.value;
  var iDProof = IDProofCombo.options[IDProofCombo.selectedIndex].text;
  var iDNumber = document.getElementById("id-number").value;
  var categoryCombo = document.getElementById("VisitorCategory");
  var catId = categoryCombo.value;
  var category = categoryCombo.options[categoryCombo.selectedIndex].text;
  var age = document.getElementById("age").value;
  var name = document.getElementById("name").value;
  var fname = document.getElementById("fname").value;
  var organization = document.getElementById("organization").value;
  var address = document.getElementById("address").value;
  var city = document.getElementById("city").value;
  var stateCombo = document.getElementById("States");
  var stateId = stateCombo.value;
  var state = stateCombo.options[stateCombo.selectedIndex].text;
  var district = document.getElementById("district").value;

  let ctime = new Date().getTime();

  let visitorData = {
    phonenumber: phonenumber,
    iDProofId: iDProofId,
    iDProof: iDProof,
    iDNumber: iDNumber,
    age: age,
    name: name,
    category: category,
    catId: catId,
    fname: fname,
    organization: organization,
    address: address,
    city: city,
    district: district,
    state: state,
    stateId: stateId,
    photo: "",
    isBlacklisted: "n",
    isReturnedLastPass: "n",
    updatedDate: ctime,
    updatedBy: 1,
  };

  if (visitorId == "") {
    visitorData.createdDate = ctime;
    visitorData.createdBy = 1;
  }

  let param = {
    operation: "edit",
    objstore: "Visitors",
    index: "visitorId",
    key: Number(visitorId),
    data: visitorData,
  };
  indb = new idb(dbName, version);
  indb.openDB(param, succ);

  return false;
}

function succ(d) {
  showModal();
}

function saveVisitingDetails(s, f) {
  if (!validateForm(f)) return false;

  //next(s, f);
  var visitorId = document.getElementById("visitorId").value;
  var phonenumber = document.getElementById("contactnumber").value;
  var IDProofCombo = document.getElementById("IDProof");
  var iDProofId = IDProofCombo.value;
  var iDProof = IDProofCombo.options[IDProofCombo.selectedIndex].text;
  var iDNumber = document.getElementById("id-number").value;
  var categoryCombo = document.getElementById("VisitorCategory");
  var catId = categoryCombo.value;
  var category = categoryCombo.options[categoryCombo.selectedIndex].text;
  var age = document.getElementById("age").value;
  var name = document.getElementById("name").value;
  var fname = document.getElementById("fname").value;
  var organization = document.getElementById("organization").value;
  var address = document.getElementById("address").value;
  var city = document.getElementById("city").value;
  var stateCombo = document.getElementById("States");
  var stateId = stateCombo.value;
  var state = stateCombo.options[stateCombo.selectedIndex].text;
  var district = document.getElementById("district").value;
  var photoObj = document.getElementById("canvas");
  var photo = photoObj.toDataURL("image/png");

  var departmentCombo = document.getElementById("Departments");
  var department = departmentCombo.options[departmentCombo.selectedIndex].text;
  var departmentid = departmentCombo.value;
  var purpose = document.getElementById("purpose").value;
  var numperson = document.getElementById("numperson").value;
  var staffid = document.getElementById("staffId").value;
  var toMeet = document.getElementById("staffName").value;
  var designation = document.getElementById("staffDesignation").value;

  let ctime = new Date().getTime();

  let visitorData = {
    visitorId: Number(visitorId),
    phonenumber: phonenumber,
    iDProofId: iDProofId,
    iDProof: iDProof,
    iDNumber: iDNumber,
    age: age,
    name: name,
    category: category,
    catId: catId,
    fname: fname,
    organization: organization,
    address: address,
    city: city,
    district: district,
    state: state,
    stateId: stateId,
    photo: photo,
    totalVisites: 1,
    isBlacklisted: "n",
    isReturnedLastPass: "n",
    updatedDate: ctime,
    updatedBy: 1,
  };

  let visitingData = {
    slipNumber: ctime,
    department: department,
    departmentId: departmentid,
    purpose: purpose,
    numperson: numperson,
    staffId: staffid,
    designation: designation,
    toMeet: toMeet,
    visitingTime: ctime,
    exitTime: "",
    visitPass: "Issued",
  };

  if (visitorId == "") {
    visitorData.createdDate = ctime;
    visitorData.createdBy = 1;
  }

  let param = {
    operation: "createVisites",
    mode: "draft",
    visitorData: visitorData,
    visitesData: visitingData,
    extraData: { nextStep: s },
  };
  indb = new idb(dbName, version);
  indb.openDB(param, messageHandler);

  return false;
}

function messageHandler(d) {
  if (d.operation == "createVisites" && d.status == "success") {
    let dateTime = formatedTime(d.visitesData.visitingTime);
    document.getElementById("printSlipNo").innerText = d.visitesData.slipNumber;
    document.getElementById("printVisitorCat").innerText =
      d.visitesData.category;
    document.getElementById("printVisitorImg").src = d.visitesData.photo;
    document.getElementById("printVisitingDate").innerText = dateTime.date;
    document.getElementById("printVisitingTime").innerText = dateTime.time;
    document.getElementById("printVisitorName").innerText = d.visitesData.name;
    document.getElementById("printVisitorAge").innerText = d.visitesData.age;
    document.getElementById("printVisitorPhone").innerText =
      d.visitesData.phonenumber;
    document.getElementById("printVisitorFname").innerText =
      d.visitesData.fname;
    document.getElementById("printVisitorAddress").innerText =
      d.visitesData.address;
    document.getElementById("printVisitorCity").innerText = d.visitesData.city;
    document.getElementById("printVisitorState").innerText =
      d.visitesData.state;
    document.getElementById("printVisitorDistrict").innerText =
      d.visitesData.district;
    document.getElementById("printVisitorToMeet").innerText =
      d.visitesData.toMeet;
    document.getElementById("printVisitorToMeetSec").innerText =
      d.visitesData.department;
    document.getElementById("printVisitorPurpose").innerText =
      d.visitesData.purpose;
    document.getElementById("printVisitorNoPerson").innerText =
      d.visitesData.numperson;

    next(d.extraData.nextStep);
  }
}

function formatedTime(d) {
  let dateObj = new Date(d);
  let time = dateObj.toLocaleString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  let date = dateObj.toLocaleString([], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return { date: date, time: time };
}

function printPage() {
  document.getElementById("printHeader").innerHTML =
    document.getElementById("previewHeader").innerHTML;
  document.getElementById("printBody").innerHTML =
    document.getElementById("previewBody").innerHTML;
  window.print();
}

function selectWantedToMeet(e) {
  $(".list-group-item").removeClass("active");
  $(e).addClass("active");

  $("#staffId")[0].value = $(e).data("staffid");
  $("#staffName")[0].value = $(e).data("staffname");
  $("#staffDesignation")[0].value = $(e).data("staffdesignation");
  $("#staffPhonenumber")[0].value = $(e).data("staffphone");

  $("#wantedToMeetList").css("background-color", "");

  return false;
}

function getWantedToMeet(v) {
  let param = {
    operation: "getAllByIndex",
    objstore: "StaffDetails",
    index: "depId",
    key: v,
  };
  indb = new idb(dbName, version);
  indb.openDB(param, populateWatantedToMeet);
}

function populateWatantedToMeet(d) {
  const data = d.results;

  if (data) {
    $("#wantedToMeet").html("");
    $("#staffId")[0].value = "";

    jQuery.each(data, function (i, val) {
      var htmlElement = '<a onclick="selectWantedToMeet(this)"';
      htmlElement =
        htmlElement +
        'class="list-group-item list-group-item-action flex-column align-items-start"';
      htmlElement = htmlElement + 'data-staffId="' + val.staffId + '" ';
      htmlElement = htmlElement + 'data-staffName="' + val.name + '" ';
      htmlElement =
        htmlElement + 'data-staffDesignation="' + val.designation + '" ';
      htmlElement = htmlElement + 'data-staffPhone="' + val.phonenumber + '" ';
      htmlElement = htmlElement + 'style="cursor: pointer">';
      htmlElement =
        htmlElement + '<div class="d-flex w-100 justify-content-between">';
      htmlElement =
        htmlElement + '<span style="width: 50%">' + val.name + "</span>";
      htmlElement =
        htmlElement + '<div class="fw-bold">' + val.designation + "</div>";
      htmlElement = htmlElement + "<small>" + val.phonenumber + "</small>";
      htmlElement = htmlElement + "</div></a>";
      $("#wantedToMeet").append(htmlElement);
    });
  }
}

function populateComboField(d) {
  const eId = d.param.objstore;
  const data = d.results;
  //console.log(data);
  var sel = document.getElementById(eId);
  var options = document.querySelectorAll("#" + eId + " option");
  options.forEach((o) => o.remove());
  var opt = document.createElement("option");
  opt.value = "";
  opt.text = "";
  sel.appendChild(opt);
  for (var i in data) {
    var opt = document.createElement("option");

    opt.value = data[i].id;
    opt.text = data[i].name;

    sel.appendChild(opt);
  }
}

function populateHeaderContent(d) {
  //console.log(d);
  document.getElementById("headerText").innerHTML = d.contents.header;
  document.getElementById("footerText").innerHTML = d.contents.footer;
}

function prepareInt(d) {
  dbName = d.database.dbName;
  version = d.database.version;

  //Retriving all Visitor Category
  let idProofDb = new idb(dbName, version);
  let idProofParam = {
    operation: "getAll",
    objstore: "IDProof",
    index: "name",
  };
  idProofDb.openDB(idProofParam, populateComboField);

  //Retriving all Visitor Category
  let catDb = new idb(dbName, version);
  let catParam = {
    operation: "getAll",
    objstore: "VisitorCategory",
    index: "name",
  };
  catDb.openDB(catParam, populateComboField);

  //Retriving all States Names
  let stateDb = new idb(dbName, version);
  let stateParam = { operation: "getAll", objstore: "States", index: "name" };
  stateDb.openDB(stateParam, populateComboField);

  //Retriving all Department Names
  let depdb = new idb(dbName, version);
  let depParam = {
    operation: "getAll",
    objstore: "Departments",
    index: "name",
  };
  depdb.openDB(depParam, populateComboField);

  //Populate Header Contents
  populateHeaderContent(d);
}

(function () {
  window.electronAPI.readFile().then(({ event, data }) => {
    prepareInt(data);
  });
})();

/********** Capturing Image ***************** */
(function () {
  var width = 320;
  var height = 0;

  var streaming = false;

  var video = null;
  var canvas = null;
  var photo = null;
  var startbutton = null;
  var downloadbutton = null;

  function startup() {
    video = document.getElementById("video");
    canvas = document.getElementById("canvas");
    photo = document.getElementById("photo");
    startbutton = document.getElementById("startbutton");
    downloadbutton = document.getElementById("downloadbutton");

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: false,
      })
      .then(function (stream) {
        video.srcObject = stream;
        video.play();
      })
      .catch(function (err) {
        console.log("An error occurred: " + err);
      });

    video.addEventListener(
      "canplay",
      function (ev) {
        if (!streaming) {
          height = video.videoHeight / (video.videoWidth / width);

          if (isNaN(height)) {
            height = width / (4 / 3);
          }

          video.setAttribute("width", width);
          video.setAttribute("height", height);
          canvas.setAttribute("width", width);
          canvas.setAttribute("height", height);
          streaming = true;
        }
      },
      false
    );

    video.addEventListener(
      "loadedmetadata",
      function (e) {
        var width = this.videoWidth;
        var height = this.videoHeight;
      },
      false
    );

    startbutton.addEventListener(
      "click",
      function (ev) {
        //ev.preventDefault();
        var bName = startbutton.innerText;
        let isCaptured = canvas.dataset.isCaptured;
        if (isCaptured == "n") {
          takepicture();
        } else {
          photo.style.display = "none";
          video.style.display = "block";
          startbutton.children[1].innerText = "Capture Photo";
          startbutton.classList.remove("btn-success");
          startbutton.classList.add("btn-info");
          canvas.dataset.isCaptured = "n";
        }
      },
      false
    );

    /*
        downloadbutton.addEventListener('click', function() {
            downloadPhoto();
        });
        */

    clearphoto();
  }

  function clearphoto() {
    var context = canvas.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL("image/png");
    photo.setAttribute("src", data);
    canvas.dataset.isCaptured = "n";
  }

  function takepicture() {
    photo.style.display = "block";

    video.style.display = "none";
    startbutton.classList.remove("btn-info");
    startbutton.classList.add("btn-success");
    startbutton.children[1].innerText = "Retake Photo";
    $("#visitorPhoto").css("background-color", "");

    var context = canvas.getContext("2d");
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);

      var data = canvas.toDataURL("image/png");
      photo.setAttribute("src", data);
      canvas.dataset.isCaptured = "y";
    } else {
      clearphoto();
    }
  }

  function downloadPhoto() {
    var dataUrl = canvas.toDataURL("image/png");

    var a = document.createElement("a");
    a.href = dataUrl;
    a.download = "webcam_photo.png";

    a.click();
  }

  window.addEventListener("load", startup, false);
})();