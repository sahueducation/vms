let G_data = [];
let G_reportType;
let G_currentPage = 1;
const G_rowsPerPage = 10;

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

  let pattern = /00:\d\d pm/i;
  if (time.match(pattern)) {
    time = time.replace(/00:/gi, "12:");
  }
  time = time.toUpperCase();
  return { date: date, time: time };
}

function populateRowForReportTable(d) {
  PopulateRow(d, "reportTable");
}

function populateRowForExportTable(d) {
  PopulateRow(d, "exportTable");
}

function PopulateRow(d, tableId) {
  let table = document.getElementById(tableId);
  let el = table.getElementsByTagName("tbody")[0];

  row = document.createElement("tr");
  el.appendChild(row);

  let node = document.createElement("td");
  node.innerText = d.name;
  row.appendChild(node);

  node = document.createElement("td");
  node.innerText = d.phonenumber;
  row.appendChild(node);

  node = document.createElement("td");
  node.innerText = d.organization + ", " + d.city;
  row.appendChild(node);

  node = document.createElement("td");
  let dateObj = formatedTime(d.visitingTime);
  node.innerText = dateObj.date + " " + dateObj.time;
  row.appendChild(node);

  node = document.createElement("td");
  node.innerText = d.purpose;
  row.appendChild(node);

  node = document.createElement("td");
  node.innerText = d.department;
  row.appendChild(node);

  node = document.createElement("td");
  node.innerText = d.toMeet + " (" + d.designation + ")";
  row.appendChild(node);
}

function displayTable(page, records) {
  let startIndex = (page - 1) * G_rowsPerPage;
  let endIndex = startIndex + G_rowsPerPage;
  let slicedData = records.slice(startIndex, endIndex);
  let table = document.getElementById("reportTable");
  let el = table.getElementsByTagName("tbody")[0];
  if (records.length > 0) {
    el.innerHTML = "";
  } else {
    el.innerHTML =
      '<tr class="table-danger"><td scope="row" colspan="7">No records found.</td></tr>';
  }
  slicedData.forEach(populateRowForReportTable);

  updatePagination(page);
}

function updatePagination(currentPage) {
  const pageCount = Math.ceil(G_data.length / G_rowsPerPage);
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  for (let i = 1; i <= pageCount; i++) {
    const pageLink = document.createElement("a");
    pageLink.href = "#";
    pageLink.innerText = i;
    pageLink.onclick = function () {
      displayTable(i, G_data);
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
    G_data = d.results;
    displayTable(G_currentPage, G_data);
  }
}

function populateExportTable() {
  $("#exportTable thead").html($("#reportTable thead").html());
  $("#exportTable tbody").html("");
  G_data.forEach(populateRowForExportTable);
}

/*********** Export to CSV ********* */
function exportToCSV() {
  populateExportTable();

  let tableData = document.getElementById("exportTable").outerHTML;
  //tableData = tableData.replace(/<A[^>]*>|<\/A>/g, ""); //remove if u want links in your table
  //tableData = tableData.replace(/<input[^>]*>|<\/input>/gi, ""); //remove input params

  let a = document.createElement("a");
  a.href = `data:application/vnd.ms-excel, ${encodeURIComponent(tableData)}`;
  a.download = "report.xls";
  a.click();
}

/*********** Export to PDF ********* */
function exportToPDF() {
  populateExportTable();
  window.print();
}

/**************** Featch Records *************** */
function featchRecords() {
  let fromDate = $("#from-date").val();
  let toDate = $("#to-date").val();
  let filterKey = $("#filterList").val();

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
  const extraParam = { from: fromTime, to: toTime, filterKey: filterKey };
  const fetchData = async () => {
    return selectByCluse({
      from: "Visites",
      order: {
        by: "visitingTime",
        type: "desc",
      },
    });
  };
  fetchData().then((data) => filterList(data, extraParam));
}

function filterList(d, e) {
  G_data = [];
  let compareKey = "";

  for (var i = 0; i < d.results.length; i++) {
    switch (G_reportType) {
      case "dep":
        compareKey = d.results[i].departmentId;
        break;
      case "stf":
        compareKey = d.results[i].staffId;
        break;
    }

    if (
      d.results[i].visitingTime > e.from &&
      d.results[i].visitingTime < e.to
    ) {
      if (e.filterKey == "All" || e.filterKey == compareKey) {
        G_data.push(d.results[i]);
      }
    }
  }
  displayTable(G_currentPage, G_data);
}

function populateFilterCombo(d, optionText) {
  let displayId = "filterList";
  var sel = document.getElementById(displayId);
  var options = document.querySelectorAll("#" + displayId + " option");
  options.forEach((o) => o.remove());
  let results = d.results;
  for (var i in results) {
    if (i == 0) {
      var opt = document.createElement("option");
      opt.value = "All";
      opt.text = optionText;

      sel.appendChild(opt);
    }
    var opt = document.createElement("option");
    opt.value = results[i].id;
    if (G_reportType == "stf") {
      opt.text =
        results[i].name +
        " [" +
        results[i].designation +
        " in " +
        results[i].depName +
        "]";
    } else {
      opt.text = results[i].name;
    }

    sel.appendChild(opt);
  }
}

function configureReportByType(type) {
  let title = "Report";
  let Selectcluse = {};
  let selectFieldInitialOption = "";

  if (type == "dep") {
    title = title + " : Department Wise";
    Selectcluse.from = "Departments";
    selectFieldInitialOption = "Select Department";
  } else if (type == "stf") {
    title = title + " : Staff Wise";
    Selectcluse.from = "StaffDetails";
    selectFieldInitialOption = "Select Staff Name";
  }

  $("#report-title").html(title);

  const fetchData = async () => {
    return selectByCluse(Selectcluse);
  };
  fetchData().then((data) =>
    populateFilterCombo(data, selectFieldInitialOption)
  );
}

function fetchLatestVisites() {
  const fetchData = async () => {
    return selectByCluse({
      from: "Visites",
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

  G_reportType = document.getElementById("report-type").value;

  initDb();

  //Configure report by type
  configureReportByType(G_reportType);

  //Retriving all latest Visites
  fetchLatestVisites();
}

(function () {
  window.electronAPI.readFile().then(({ event, data }) => {
    prepareInt(data);
  });
})();
