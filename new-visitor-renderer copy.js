let dbName;
let version;

document.getElementById("btnCancel").addEventListener("click", (e) => {
  e.preventDefault();
  window.electronAPI.quiteWindow("y");
});

function back() {
  window.electronAPI.quiteWindow("y");
  //document.getElementById("mainContain").style.display = "block";
  //document.getElementById("printArea").style.display = "none";
}

function printPage() {
  window.print();
}

function populateStates(d) {
  var sel = document.getElementById("state");
  var options = document.querySelectorAll("#state option");
  options.forEach((o) => o.remove());
  var opt = document.createElement("option");
  opt.value = "";
  opt.text = "";
  sel.appendChild(opt);
  for (var i in d) {
    var opt = document.createElement("option");
    opt.value = d[i].stateId;
    opt.text = d[i].name;

    sel.appendChild(opt);
  }
}

function populateDep(d) {
  var sel = document.getElementById("departments");
  var options = document.querySelectorAll("#departments option");
  options.forEach((o) => o.remove());
  var opt = document.createElement("option");
  opt.value = "";
  opt.text = "";
  sel.appendChild(opt);
  for (var i in d) {
    var opt = document.createElement("option");
    opt.value = d[i].depId;
    opt.text = d[i].name;

    sel.appendChild(opt);
  }
}

function populateHeaderContent(d) {
  //console.log(d);
  document.getElementById("headerText").innerHTML = d.header_content;
}

function getVisitorDetails(e) {
  //alert(e.value);
  let param = {
    operation: "getByIndex",
    objstore: "Visitors",
    index: "phonenumber",
    key: e.value,
  };
  indb = new idb(dbName, version);
  indb.openDB(param, handleVisitor);
}

function handleVisitor(p) {
  //console.log(p.result);

  if (!p.result) return true;
  document.getElementById("visitorId").value = p.result.visitorId;
  document.getElementById("age").value = p.result.age;
  document.getElementById("name").value = p.result.name;
  document.getElementById("fname").value = p.result.fname;
  document.getElementById("address").value = p.result.address;
  document.getElementById("city").value = p.result.city;
  document.getElementById("district").value = p.result.district;

  var stateCombo = document.getElementById("state");

  for (i = 0; i < stateCombo.options.length; i++) {
    if (stateCombo.options[i].text == p.result.state)
      stateCombo.options[i].selected = "true";
  }
}

function formSubmit() {
  var visitorId = document.getElementById("visitorId").value;
  var phonenumber = document.getElementById("contactnumber").value;
  var age = document.getElementById("age").value;
  var name = document.getElementById("name").value;
  var fname = document.getElementById("fname").value;
  var address = document.getElementById("address").value;
  var city = document.getElementById("city").value;
  var stateCombo = document.getElementById("state");
  var state = stateCombo.options[stateCombo.selectedIndex].text;
  var district = document.getElementById("district").value;
  var photoObj = document.getElementById("canvas");
  var photo = photoObj.toDataURL("image/png");
  if (photoObj.dataset.isCaptured != "y") {
    document.getElementById("alertCapture").style.visibility = "visible";
    return false;
  }

  var depCombo = document.getElementById("departments");
  var depId = depCombo.value;
  var department = depCombo.options[depCombo.selectedIndex].text;
  var toMeet = document.getElementById("tomeet").value;
  var purpose = document.getElementById("purpose").value;
  var numPerson = document.getElementById("numperson").value;

  let ctime = new Date().getTime();

  let visitorData = {
    visitorId: Number(visitorId),
    phonenumber: phonenumber,
    age: age,
    name: name,
    fname: fname,
    address: address,
    city: city,
    district: district,
    state: state,
    photo: photo,
    createdDate: ctime,
    updatedDate: ctime,
  };
  let visitesData = {
    visiterId: 0,
    depId: depId,
    department: department,
    visitingDate: ctime,
    visitingTime: 680,
    exitTime: "",
    returnedPass: "n",
    toMeet: toMeet,
    purpose: purpose,
    numPerson: numPerson,
  };

  let param = {
    operation: "createVisites",
    objstore: "Visites",
    index: "visiterId",
    visitorData: visitorData,
    visitesData: visitesData,
  };
  indb = new idb(dbName, version);
  indb.openDB(param, succ);

  return false;
}

function succ(m) {
  //Populating print data

  document.getElementById("slipNo").textContent = m.visitesData.visitingDate;
  document.getElementById("imgVisitor").src = m.visitorData.photo;
  document.getElementById("visitingDate").textContent = formatedDate(
    m.visitesData.visitingDate
  );
  document.getElementById("visitingTime").textContent = formatedTime(
    m.visitesData.visitingDate
  );
  document.getElementById("visitorName").textContent = m.visitorData.name;
  document.getElementById("visitorAge").textContent = m.visitorData.age;
  document.getElementById("visitorPhone").textContent =
    m.visitorData.phonenumber;
  document.getElementById("visitorFname").textContent = m.visitorData.fname;
  document.getElementById("visitorAddress").textContent = m.visitorData.address;
  document.getElementById("visitorCity").textContent = m.visitorData.city;
  document.getElementById("visitorDistrict").textContent =
    m.visitorData.district;
  document.getElementById("visitorState").textContent = m.visitorData.state;

  document.getElementById("visitorToMeet").textContent = m.visitesData.toMeet;
  document.getElementById("visitorToMeetSec").textContent =
    m.visitesData.department;
  document.getElementById("visitorPurpose").textContent = m.visitesData.purpose;
  document.getElementById("visitorNoPerson").textContent =
    m.visitesData.numPerson;

  document.getElementById("mainContain").style.display = "none";
  document.getElementById("printArea").style.display = "block";
}

function err(m) {
  console.log("Failed:" + m);
}

function formatedDate(m) {
  let displayDate = new Date(m);
  let date =
    appendZiro(displayDate.getDate()) +
    "/" +
    appendZiro(displayDate.getMonth() + 1) +
    "/" +
    displayDate.getFullYear();
  return date;
}

function formatedTime(m) {
  let displayDate = new Date(m);
  let hour = displayDate.getHours();
  let ampm = "AM";
  if (hour > 12) {
    hour = hour - 12;
    ampm = "PM";
  }

  let time =
    appendZiro(hour) + ":" + appendZiro(displayDate.getMinutes()) + " " + ampm;
  return time;
}

function appendZiro(d) {
  if (d < 10) d = "0" + d;

  return d;
}

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
          console.log("Step 2");
          console.log(width);
          console.log(height);
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
        if (bName == "Capture Photo") {
          takepicture();
        } else {
          photo.style.display = "none";
          video.style.display = "block";
          startbutton.classList.remove("btn-success");
          startbutton.classList.add("btn-secondary");
          startbutton.innerText = "Capture Photo";
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
    startbutton.classList.remove("btn-secondary");
    startbutton.classList.add("btn-success");
    startbutton.innerText = "Retake Photo";

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
});

(function () {
  // Retriving Header Content
  window.electronAPI.readFile().then(({ event, data }) => {
    //var test = "Its the header part";
    //d.header_content
    populateHeaderContent(data);
  });
})();

function check() {
  alert(document.getElementById("video").videoWidth);
}
function prepareInt(d) {
  dbName = d.database.dbName;
  version = d.database.version;

  //Retriving all States Names
  let mydb = new idb(dbName, version);
  let param = { operation: "getAll", objstore: "States", index: "name" };
  mydb.openDB(param, populateStates);

  //Retriving all Department Names
  let depdb = new idb(dbName, version);
  let depParam = {
    operation: "getAll",
    objstore: "Departments",
    index: "name",
  };
  depdb.openDB(depParam, populateDep);

  //Populate Header Contents
  populateHeaderContent(d);
}

(function () {
  window.electronAPI.readFile().then(({ event, data }) => {
    prepareInt(data);
  });
})();
