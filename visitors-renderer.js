document.getElementById("btnCancel").addEventListener("click", (e) => {
  e.preventDefault();
  window.electronAPI.quiteWindow("y");
});

function openNewVistorWindow(v) {
  window.electronAPI.setNewVisitor(v);
}

function deleteVisite(v) {
  if (confirm("Are you sure, want to delete this record?")) {
    const removedRecord = async () => {
      return removeByCluse({
        from: "Visites",
        where: {
          visitesId: Number(v),
        },
      });
    };
    removedRecord().then((data) => handleRemoveLineItem(data));
  }
}

function handleRemoveLineItem(v) {
  let rowId = "#row-" + v.removeCluses.where.visitesId;
  $(rowId).hide();
}

function viewVisiteDetails(e) {
  let data = $(e).parents("tr").data("data");

  $("#printSlipNo").html(data.slipNumber);
  $("#printVisitorCat").html(data.category);
  $("#printVisitorImg").attr("src", data.photo);
  $("#printVisitingDate").html(formatedTime(data.visitingTime).date);
  $("#printVisitingTime").html(formatedTime(data.visitingTime).time);

  $("#printVisitorName").html("<b>" + data.name + "</b>");
  $("#printVisitorAge").html(data.age);
  $("#printVisitorPhone").html(data.phonenumber);
  $("#printVisitorPhone").html(data.phonenumber);
  $("#printVisitorFname").html(data.fname);
  $("#printVisitorAddress").html(data.address);
  $("#printVisitorCity").html(data.city);
  $("#printVisitorState").html(data.state);
  $("#printVisitorDistrict").html(data.district);

  $("#printVisitorToMeet").html(data.toMeet);
  $("#printVisitorToMeetSec").html(data.department);
  $("#printVisitorPurpose").html(data.purpose);
  $("#printVisitorNoPerson").html(data.numperson);

  $("#headerText").hide();
  $("#footerText").hide();
  $("#btnPrint").hide();

  $("#ExtralargeModal").modal("show");
}

function printPage() {
  window.print();
}

function markPassReturned(e) {
  let dataObj = $(e).parents("tr").data("data");

  let visitesId = dataObj.visitesId;
  let visitorId = dataObj.visitorId;
  let visitesTime = new Date().getTime();
  let timeConsumed = visitesTime - dataObj.visitingTime;

  const data = {
    isReturnedLastPass: "y",
    visitPass: "Returned",
    passReturnedTime: visitesTime,
    timeConsumed: timeConsumed,
  };

  const updateRecord = async () => {
    updateByCluse({
      in: "Visitors",
      where: {
        visitorId: Number(visitorId),
      },
      set: { isReturnedLastPass: "y" },
    });

    return updateByCluse({
      in: "Visites",
      where: {
        visitesId: Number(visitesId),
      },
      set: data,
    });
  };
  updateRecord().then((data) => handlePassReturned(data));
}

function handlePassReturned(d) {
  let tds = $("#row-" + d.updateCluse.where.visitesId).children("td");
  let span = $(tds[4]).find("span");
  $(span[0])
    .removeClass("bg-primary")
    .addClass("bg-success")
    .text(d.updateCluse.set.visitPass);
}

function markAsBlacklisted(e) {
  let dataObj = $(e).parents("tr").data("data");

  let blackListedVal = dataObj.isBlacklisted;
  if (blackListedVal == "n") {
    blackListedVal = "y";
  } else {
    blackListedVal = "n";
  }
  let visitesId = dataObj.visitesId;
  let visitorId = dataObj.visitorId;

  const updateRecord = async () => {
    updateByCluse({
      in: "Visitors",
      where: {
        visitorId: Number(visitorId),
      },
      set: { isBlacklisted: blackListedVal },
    });

    return updateByCluse({
      in: "Visites",
      where: {
        visitesId: Number(visitesId),
      },
      set: { isBlacklisted: blackListedVal },
    });
  };
  updateRecord().then((data) => handleBlacklisted(data));
}

function handleBlacklisted(d) {
  let dataObj = $("#row-" + d.updateCluse.where.visitesId).data("data");
  dataObj.isBlacklisted = d.updateCluse.set.isBlacklisted;
  $("#row-" + d.updateCluse.where.visitesId).data("data", dataObj);

  if (d.updateCluse.set.isBlacklisted == "y") {
    $("#row-" + d.updateCluse.where.visitesId).addClass("table-danger");
  } else {
    $("#row-" + d.updateCluse.where.visitesId).removeClass("table-danger");
  }
  alert("Marked successfuly.");

  return false;
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

function printPreview(e) {
  let data = $(e).parents("tr").data("data");

  $("#printSlipNo").html(data.slipNumber);
  $("#printVisitorCat").html(data.category);
  $("#printVisitorImg").attr("src", data.photo);
  $("#printVisitingDate").html(formatedTime(data.visitingTime).date);
  $("#printVisitingTime").html(formatedTime(data.visitingTime).time);

  $("#printVisitorName").html("<b>" + data.name + "</b>");
  $("#printVisitorAge").html(data.age);
  $("#printVisitorPhone").html(data.phonenumber);
  $("#printVisitorPhone").html(data.phonenumber);
  $("#printVisitorFname").html(data.fname);
  $("#printVisitorAddress").html(data.address);
  $("#printVisitorCity").html(data.city);
  $("#printVisitorState").html(data.state);
  $("#printVisitorDistrict").html(data.district);

  $("#printVisitorToMeet").html(data.toMeet);
  $("#printVisitorToMeetSec").html(data.department);
  $("#printVisitorPurpose").html(data.purpose);
  $("#printVisitorNoPerson").html(data.numperson);

  $("#ExtralargeModal").modal("show");
}

function PopulateRow(d) {
  let table = document.getElementById("visitorsTable");
  let row = document.getElementById("row-" + d.visitesId);
  if (row) {
    row.innerHTML = "";
  } else {
    row = document.createElement("tr");
    row.setAttribute("id", "row-" + d.visitesId);
    row.dataset.data = JSON.stringify(d);
    //class="table-danger" table-warning
    const el = table.getElementsByTagName("tbody")[0];
    el.appendChild(row);
  }

  let node = document.createElement("th");
  node.innerText = "#" + d.slipNumber;
  node.setAttribute("scope", "row");
  row.appendChild(node);

  node = document.createElement("td");
  node.innerText = d.phonenumber;
  row.appendChild(node);

  node = document.createElement("td");
  node.innerText = d.name;
  row.appendChild(node);

  node = document.createElement("td");
  node.innerText = formatedTime(d.visitingTime).time;
  node.setAttribute("style", "text-transform: uppercase;");

  row.appendChild(node);

  node = document.createElement("td");
  node.innerText = d.totalVisites;
  row.appendChild(node);

  node = document.createElement("td");
  if (d.isReturnedLastPass == "y") {
    node.innerHTML =
      '<span class="badge bg-success">' + d.visitPass + "</span>";
  } else {
    node.innerHTML =
      '<span class="badge bg-primary">' + d.visitPass + "</span>";
  }

  //<span class="badge bg-warning text-dark">On Hold</span>
  row.appendChild(node);

  let html = "";

  html = html + '<i class="bi bi-pencil-square me-1" ';
  html = html + 'style="cursor: pointer" ';
  html = html + 'data-bs-toggle="tooltip" ';
  html =
    html +
    'data-bs-placement="top" onClick="openNewVistorWindow(' +
    d.visitorId +
    ')" ';
  html = html + 'data-bs-original-title="Edit"></i>';

  html = html + '<i class="bi bi-trash me-1" ';
  html = html + 'style="cursor: pointer" ';
  html = html + 'data-bs-toggle="tooltip" ';
  html =
    html +
    'data-bs-placement="top" onClick="deleteVisite(' +
    d.visitesId +
    ')" ';
  html = html + 'data-bs-original-title="Delete"></i>';

  html = html + '<a href="#" ';
  html = html + 'onclick="printPreview(this);"> ';
  html = html + '<i class="bi bi-printer me-1" ';
  html = html + 'data-bs-toggle="tooltip" ';
  html = html + 'data-bs-placement="top" ';
  html = html + 'data-bs-original-title="Print Visiting Slip"></i></a>';

  html = html + '<i class="bi bi-eye me-1" ';
  html = html + 'style="cursor: pointer" ';
  html = html + 'data-bs-toggle="tooltip" ';
  html = html + 'data-bs-placement="top" onClick="viewVisiteDetails(this)" ';
  html = html + 'data-bs-original-title="View Details"></i>';

  html = html + '<i class="bi bi-bootstrap-reboot me-1" ';
  html = html + 'style="cursor: pointer; color: darkgoldenrod" ';
  html = html + 'data-bs-toggle="tooltip" ';
  html = html + 'data-bs-placement="top" ';
  html = html + 'data-visites-id="' + d.visitesId + '" ';
  html = html + 'onclick="markPassReturned(this)" ';
  html = html + 'data-bs-original-title="Mark as Pass Returned"></i>';

  html = html + '<i class="bi bi-exclamation-octagon" ';
  html = html + 'style="cursor: pointer; margin-left: 3px; color: crimson" ';
  html = html + 'data-bs-toggle="tooltip" ';
  html = html + 'data-bs-placement="top" ';
  html = html + 'data-phonenumber="' + d.phonenumber + '" ';
  html = html + 'onclick="markAsBlacklisted(this)" ';
  html = html + 'data-bs-original-title="Mark as Blacklisted"></i>';

  node = document.createElement("td");
  node.innerHTML = html;
  row.appendChild(node);
}

function initPopulateList(d) {
  if (Array.isArray(d.results)) {
    const results = d.results;
    results.forEach(PopulateRow);
  }
}

function populatePrintHeaderFooter(c) {
  $("#headerText").html(c.header);
  $("#footerText").html(c.footer);
}

function fetchVisitesData() {
  const fetchData = async () => {
    let dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - 7);
    let sinceYesterday = dateObj.getTime();
    return selectByCluse({
      from: "Visites",
      where: {
        visitingTime: {
          ">": sinceYesterday,
        },
      },
      order: {
        by: "visitingTime",
        type: "desc",
      },
    });
  };
  fetchData().then((data) => initPopulateList(data));
}

function prepareInt(d) {
  G_dbName = d.database.dbName;
  G_version = d.database.version;

  initDb();

  //Retriving all latest Visites
  fetchVisitesData();

  populatePrintHeaderFooter(d.contents);
}

(function () {
  window.electronAPI.readFile().then(({ event, data }) => {
    prepareInt(data);
  });
})();
