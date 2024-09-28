let dbName;
let version;

document.getElementById("btnCancel").addEventListener("click", (e) => {
  e.preventDefault();
  window.electronAPI.quiteWindow("y");
});

function printPage() {
  window.print();
}

function markPassReturned(e) {
  let dataObj = $(e).parents("tr").data("data");

  let visitesId = dataObj.visitesId;

  const data = { isReturnedLastPass: "y", visitPass: "Returned" };
  let visitesDb = new idb(dbName, version);
  let visitesParam = {
    operation: "edit",
    objstore: "Visites",
    key: Number(visitesId),
    data: data,
  };
  visitesDb.openDB(visitesParam, handlePassReturned);
}

function handlePassReturned(d) {
  if (d.status == "success" && d.param.objstore == "Visites") {
    let tds = $("#row-" + d.param.key).children("td");
    let span = $(tds[4]).find("span");
    $(span[0])
      .removeClass("bg-primary")
      .addClass("bg-success")
      .text(d.param.data.visitPass);
    const data = { isReturnedLastPass: "y" };
    let visitesDb = new idb(dbName, version);
    let visitesParam = {
      operation: "edit",
      objstore: "Visitors",
      key: Number(d.param.data.visitorId),
      data: data,
    };
    visitesDb.openDB(visitesParam, handlePassReturned);
  } else if (d.status == "success" && d.param.objstore == "Visitors") {
    alert(d.message);
  }
}

function markAsBlacklisted(e) {
  let dataObj = $(e).parents("tr").data("data");
  console.log(dataObj);
  let phonenumber = $(e).data("phonenumber");

  let visitesDb = new idb(dbName, version);
  let visitesParam = {
    operation: "getByIndex",
    objstore: "Visitors",
    index: "phonenumber",
    key: String(phonenumber),
    visitesId: dataObj.visitesId,
  };
  visitesDb.openDB(visitesParam, handleBlacklisted);
}

function handleBlacklisted(d) {
  console.log(d);

  if (d.status == "success" && d.param.operation == "getByIndex") {
    if (!d.result) return false;
    let blackListed = "y";
    if (d.result.isBlacklisted == "y") {
      blackListed = "n";
    }

    const data = { isBlacklisted: blackListed };
    let visitesDb = new idb(dbName, version);
    let visitesParam = {
      operation: "edit",
      objstore: "Visitors",
      key: Number(d.result.visitorId),
      data: data,
      visitesId: d.param.visitesId,
    };
    visitesDb.openDB(visitesParam, handleBlacklisted);
  } else if (d.status == "success" && d.param.operation == "edit") {
    alert(d.message);
    if (d.param.data.isBlacklisted == "y") {
      $("#row-" + d.param.visitesId).addClass("table-danger");
    } else {
      $("#row-" + d.param.visitesId).removeClass("table-danger");
    }
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

function printPreview(e) {
  let data = $(e).parents("tr").data("data");
  //const data = $("#" + rowid).data("data");
  //console.log(data);
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

  /*
  <i
                          class="bi bi-pencil-square me-1"
                          style="cursor: pointer"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          data-bs-original-title="Edit"
                        ></i>
                        <i
                          class="bi bi-trash me-1"
                          style="cursor: pointer"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          data-bs-original-title="Delete"
                        ></i>
                        <i
                          class="bi bi-printer me-1"
                          style="cursor: pointer"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          data-bs-original-title="Print Visiting Slip"
                        ></i>
                        <i
                          class="bi bi-eye me-1"
                          style="cursor: pointer"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          data-bs-original-title="View Details"
                        ></i>
                        <i
                          class="bi bi-bootstrap-reboot me-1"
                          style="cursor: pointer; color: darkgoldenrod"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          data-bs-original-title="Toggle Return Visiting Pass"
                        ></i>
                        <i
                          class="bi bi-exclamation-octagon"
                          style="
                            cursor: pointer;
                            margin-left: 3px;
                            color: crimson;
                          "
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          data-bs-original-title="Black List Visiter"
                        ></i>
  */

  let html = "";
  /*
  html = html + '<i class="bi bi-pencil-square me-1" ';
  html = html + 'style="cursor: pointer" ';
  html = html + 'data-bs-toggle="tooltip" ';
  html = html + 'data-bs-placement="top" ';
  html = html + 'data-bs-original-title="Edit"></i>';

  html = html + '<i class="bi bi-trash me-1" ';
  html = html + 'style="cursor: pointer" ';
  html = html + 'data-bs-toggle="tooltip" ';
  html = html + 'data-bs-placement="top" ';
  html = html + 'data-bs-original-title="Delete"></i>';
*/
  html = html + '<a href="#" ';
  html = html + 'onclick="printPreview(this);"> ';
  html = html + '<i class="bi bi-printer me-1" ';
  html = html + 'data-bs-toggle="tooltip" ';
  html = html + 'data-bs-placement="top" ';
  html = html + 'data-bs-original-title="Print Visiting Slip"></i></a>';

  html = html + '<i class="bi bi-eye me-1" ';
  html = html + 'style="cursor: pointer" ';
  html = html + 'data-bs-toggle="tooltip" ';
  html = html + 'data-bs-placement="top" ';
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

function prepareInt(d) {
  dbName = d.database.dbName;
  version = d.database.version;

  //Retriving all latest Visites
  let visitesDb = new idb(dbName, version);
  let visitesParam = {
    operation: "getAll",
    objstore: "Visites",
    index: "name",
    orderBy: "prev",
  };
  visitesDb.openDB(visitesParam, initPopulateList);

  populatePrintHeaderFooter(d.contents);
}

(function () {
  window.electronAPI.readFile().then(({ event, data }) => {
    prepareInt(data);
  });
})();
