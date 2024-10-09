let dbName;
let version;

document.getElementById("newVisitor").addEventListener("click", (e) => {
  e.preventDefault();
  window.electronAPI.setNewVisitor("y");
});

document.getElementById("visitors").addEventListener("click", (e) => {
  e.preventDefault();
  window.electronAPI.setConf("visitors");
});

document.getElementById("logout").addEventListener("click", (e) => {
  e.preventDefault();
  window.electronAPI.setLogout("y");
});

document.getElementById("manageOperator").addEventListener("click", (e) => {
  e.preventDefault();
  window.electronAPI.setConf("operator");
});

document.getElementById("manageStaff").addEventListener("click", (e) => {
  e.preventDefault();
  window.electronAPI.setConf("staff");
});

document.getElementById("manageMaster").addEventListener("click", (e) => {
  e.preventDefault();
  window.electronAPI.setConf("master");
});

document.getElementById("manageDB").addEventListener("click", (e) => {
  e.preventDefault();
  window.electronAPI.setConf("managedb");
});

document.getElementById("departmentReports").addEventListener("click", (e) => {
  e.preventDefault();
  window.electronAPI.setReports("dep");
});

document.getElementById("staffReports").addEventListener("click", (e) => {
  e.preventDefault();
  window.electronAPI.setReports("stf");
});

function populateCounts(d) {
  document.getElementById("todayCounts").innerHTML = "<h6>" + d + "</h6>";
  document.getElementById("todayCounts").dataset.count = d;

  console.log(d);

  var ct = new Date();
  ct.setDate(ct.getDate() - 1);
  ct.setHours(23, 59, 59);
  let today = ct.getTime();

  var yt = new Date();
  yt.setDate(yt.getDate() - 2);
  yt.setHours(23, 59, 59);
  let yesterday = yt.getTime();

  let countYesterdayParam = {
    operation: "count",
    objstore: "Visites",
    index: "visitingDate",
    keyrange: IDBKeyRange.bound(yesterday, today, true, true),
  };

  let mydb = new idb(dbName, version);
  mydb.openDB(countYesterdayParam, calculatePercentate);
}

function calculatePercentate(d) {
  var count = document.getElementById("todayCounts").dataset.count;
  var c = Number(count);

  if (c < d) {
    var percentage = Math.round(((d - c) / c) * 100);
    var html =
      '<span class="text-danger small pt-1 fw-bold">' +
      percentage +
      '%</span> <span class="text-muted small pt-2 ps-1">decrease</span>';
  } else {
    var percentage = Math.round(((c - d) / c) * 100);
    var html =
      '<span class="text-success small pt-1 fw-bold">' +
      percentage +
      '%</span> <span class="text-muted small pt-2 ps-1">increase</span>';
  }

  var content = document.getElementById("todayCounts").innerHTML;
  document.getElementById("todayCounts").innerHTML = content + html;
}

function count() {
  alert("test");
}

function prepareVisitorChart() {
  let depdb = new idb(dbName, version);
  let depParam = {
    operation: "getAll",
    objstore: "Departments",
    index: "name",
  };
  depdb.openDB(depParam, getVisitesByDep);
}

function getVisitesByDep(d) {
  let newObj = {};
  let result = d.results;

  result.forEach((e) => {
    newObj[e.depId] = { name: e.name, value: 0 };
  });

  let depdb = new idb(dbName, version);
  let depParam = {
    operation: "getVisitesByDep",
    objstore: "Visites",
    index: "visitingDate",
    departmentParam: newObj,
  };
  //depdb.openDB(depParam, visitesByDep);
}

function visitesByDep(d) {
  let visitorChartData = [];
  Object.keys(d).forEach((k) => {
    visitorChartData.push({ name: d[k].name, value: d[k].value });
  });
  populateVisitorChart(visitorChartData);
}

function prepareInt(d) {
  dbName = d.database.dbName;
  version = d.database.version;

  var ct = new Date();
  ct.setDate(ct.getDate() - 1);
  ct.setHours(23, 59, 59);
  let today = ct.getTime();

  let countTodayParam = {
    operation: "count",
    objstore: "Visites",
    index: "visitingDate",
    keyrange: IDBKeyRange.lowerBound(today),
  };

  let mydb = new idb(dbName, version);
  mydb.openDB(countTodayParam, populateCounts);
  prepareVisitorChart();
  populateReportChart();
}

function populateVisitorChart(data) {
  echarts.init(document.querySelector("#visitorsChart")).setOption({
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: "5%",
      left: "center",
    },
    series: [
      {
        name: "Visitors to",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "18",
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: data,
      },
    ],
  });
}

function populateReportChart() {
  new ApexCharts(document.querySelector("#reportsChart"), {
    series: [
      {
        name: "IT",
        data: [31, 40, 28, 51, 42, 82, 56],
      },
      {
        name: "Account",
        data: [11, 32, 45, 32, 34, 52, 41],
      },
      {
        name: "Civil",
        data: [15, 11, 32, 18, 9, 24, 11],
      },
      {
        name: "Sales",
        data: [20, 23, 32, 18, 7, 30, 8],
      },
    ],
    chart: {
      height: 350,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    markers: {
      size: 4,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.4,
        stops: [0, 90, 100],
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      type: "datetime",
      categories: [
        "2024-02-19",
        "2024-02-20",
        "2024-02-21",
        "2024-02-22",
        "2024-02-23",
        "2024-02-24",
        "2024-02-25",
      ],
    },
    tooltip: {
      x: {
        format: "dd/MM/yy",
      },
    },
  }).render();
}

(function () {
  window.electronAPI.readFile().then(({ event, data }) => {
    prepareInt(data);
  });
})();
