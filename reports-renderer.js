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

function displayTable(page) {
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const slicedData = data.slice(startIndex, endIndex);
  const table = document.getElementById("reportTable");
  const el = table.getElementsByTagName("tbody")[0];
  el.innerHTML = "";
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
      displayTable(i);
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
    displayTable(currentPage);
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
