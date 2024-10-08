let dbName;
let version;
let data = [];
const rowsPerPage = 10;
let currentPage = 1;

document.getElementById("btnClose").addEventListener("click", (e) => {
  e.preventDefault();
  window.electronAPI.quiteWindow("y");
});

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

function PopulateRow(d) {
  const table = document.getElementById("reportTable");
  const el = table.getElementsByTagName("tbody")[0];

  let row = document.getElementById("row-" + d.visitesId);
  if (row) {
    row.innerHTML = "";
  } else {
    row = document.createElement("tr");
    row.setAttribute("id", "row-" + d.visitesId);
    //row.dataset.data = JSON.stringify(d);
    el.appendChild(row);
  }

  let node = document.createElement("td");
  node.innerText = d.name;
  //node.setAttribute("scope", "row");
  row.appendChild(node);

  node = document.createElement("td");
  node.innerText = d.phonenumber;
  row.appendChild(node);

  node = document.createElement("td");
  node.innerText = d.city;
  row.appendChild(node);

  node = document.createElement("td");
  node.innerText = formatedTime(d.visitingTime).date;
  row.appendChild(node);

  node = document.createElement("td");
  node.innerText = d.department;
  row.appendChild(node);
}

function displayTable(page, records) {
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const slicedData = records.slice(startIndex, endIndex);
  const table = document.getElementById("reportTable");
  const el = table.getElementsByTagName("tbody")[0];
  if (records.length > 0) {
    el.innerHTML = "";
  } else {
    el.innerHTML =
      '<tr class="table-danger"><td scope="row" colspan="5">No Data found.</td></tr>';
  }
  slicedData.forEach(PopulateRow);
  updatePagination(page);
}

function updatePagination(currentPage) {
  const pageCount = Math.ceil(data.length / rowsPerPage);
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  for (let i = 1; i <= pageCount; i++) {
    const pageLink = document.createElement("a");
    pageLink.href = "#";
    pageLink.innerText = i;
    pageLink.onclick = function () {
      displayTable(i, data);
    };
    if (i === currentPage) {
      pageLink.style.fontWeight = "bold";
    }
    pageLink.classList.add("page-link");
    const pageLineItem = document.createElement("li");
    pageLineItem.appendChild(pageLink);
    pageLineItem.classList.add("page-item");
    paginationContainer.appendChild(pageLineItem);
  }
}

function initPopulateList(d) {
  if (Array.isArray(d.results)) {
    data = d.results;
    displayTable(currentPage, data);
  }
}

/*********** Export to CSV ********* */
function exportToCSV() {
  let tableData = document.getElementById("reportTable").outerHTML;
  tableData = tableData.replace(/<A[^>]*>|<\/A>/g, ""); //remove if u want links in your table
  tableData = tableData.replace(/<input[^>]*>|<\/input>/gi, ""); //remove input params

  let a = document.createElement("a");
  a.href = `data:application/vnd.ms-excel, ${encodeURIComponent(tableData)}`;
  a.download = "report.xls";
  a.click();
}

/*********** Export to PDF ********* */
function exportToPDF() {
  let htmlTable = "<table>" + $("#reportTable").html() + "</table>";
  console.log(htmlTable);

  $("#printBody").html(htmlTable);
  $("#ExtralargeModal").css("display", "block");
  $("#mainContain").css("display", "none");
  window.print();
}

/**************** Featch Records *************** */
function featchRecords() {
  let fromDate = $("#from-date").val();
  let toDate = $("#to-date").val();
  let depId = $("#departmentList").val();

  let fromObj = fromDate.split("-");
  let toObj = toDate.split("-");
  let fromTime = 0;
  let toTime = new Date().getTime();

  if (fromObj.length > 1) {
    fromTime = new Date(fromObj[0], fromObj[1] - 1, fromObj[2]).getTime();
  }
  if (toObj.length > 1) {
    toTime = new Date(toObj[0], toObj[1] - 1, toObj[2], 24, 0, 0).getTime();
  }

  //Retriving all latest Visites
  let visitesDb = new idb(dbName, version);
  let visitesParam = {
    operation: "getAll",
    objstore: "Visites",
    index: "name",
    orderBy: "prev",
    extraParam: { from: fromTime, to: toTime, dep: depId },
  };
  visitesDb.openDB(visitesParam, filterList);
}

function filterList(d) {
  data = [];

  console.log(d.param.extraParam.dep);
  for (var i = 0; i < d.results.length; i++) {
    console.log(d.results[i]);
    if (
      d.results[i].visitingTime > d.param.extraParam.from &&
      d.results[i].visitingTime < d.param.extraParam.to
    ) {
      if (
        d.param.extraParam.dep == "All" ||
        d.param.extraParam.dep == d.results[i].departmentId
      ) {
        data.push(d.results[i]);
      }
    }
  }
  displayTable(currentPage, data);
}

function populateDepartmentCombo(d) {
  let displayId = "departmentList";
  var sel = document.getElementById(displayId);
  var options = document.querySelectorAll("#" + displayId + " option");
  options.forEach((o) => o.remove());
  let results = d.results;
  for (var i in results) {
    if (i == 0) {
      var opt = document.createElement("option");
      opt.value = "All";
      opt.text = "Select Department";
      sel.appendChild(opt);
    }
    var opt = document.createElement("option");
    opt.value = results[i].id;
    opt.text = results[i].name;

    sel.appendChild(opt);
  }
}

function prepareInt(d) {
  dbName = d.database.dbName;
  version = d.database.version;

  let reportType = document.getElementById("report-type").value;

  //Retriving all Department Names
  let depdb = new idb(dbName, version);
  let depParam = {
    operation: "getAll",
    objstore: "Departments",
    index: "name",
  };
  depdb.openDB(depParam, populateDepartmentCombo);

  //Retriving all latest Visites
  let visitesDb = new idb(dbName, version);
  let visitesParam = {
    operation: "getAll",
    objstore: "Visites",
    index: "name",
    orderBy: "prev",
  };
  visitesDb.openDB(visitesParam, initPopulateList);
}

(function () {
  window.electronAPI.readFile().then(({ event, data }) => {
    prepareInt(data);
  });
})();
