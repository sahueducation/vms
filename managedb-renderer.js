let dbName;
let version;
var jsstoreCon;
/**********************FOR TESTING PURPOSE********************/

/**********************FOR TESTING PURPOSE********************/

document.getElementById("btnCancel").addEventListener("click", (e) => {
  e.preventDefault();
  window.electronAPI.quiteWindow("y");
});

function importData() {
  msgHandler({ status: "success", message: "Performing DB preparation..." });

  const initiatingDb = async () => {
    return initDb();
  };
  initiatingDb().then((data) => msgHandler(data));

  //Inserting States data ...
  insertingDataInToTable("States", states);

  //Inserting Departments data ...
  insertingDataInToTable("Departments", departments);

  //Inserting Categories data ...
  insertingDataInToTable("VisitorCategory", categories);

  //Inserting Designation data ...
  insertingDataInToTable("Designation", designation);

  //Inserting Idproofs data ...
  insertingDataInToTable("IDProof", idProofs);
}

function insertingDataInToTable(table, value) {
  const insertingData = async () => {
    return insertInToTable(table, value);
  };
  insertingData().then((data) => msgHandler(data));
}

function msgHandler(m) {
  const node = document.createElement("p");
  if (m.status == "success") {
    node.setAttribute("style", "color:green;");
  } else if (m.status == "warning") {
    node.setAttribute("style", "color:yellow;");
  } else if (m.status == "info") {
    node.setAttribute("style", "color:white;");
  } else {
    node.setAttribute("style", "color:red;");
  }

  const textnode = document.createTextNode(m.message);
  node.appendChild(textnode);
  const element = document.getElementById("monitor");
  element.appendChild(node);
  node.scrollIntoView(false);
}

function prepareInt(d) {
  dbName = d.database.dbName;
  version = d.database.version;
}

(function () {
  window.electronAPI.readFile().then(({ event, data }) => {
    prepareInt(data);
  });
})();
