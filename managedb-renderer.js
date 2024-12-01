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
  insertingDataInToTable("States", defaultStates);

  //Inserting Departments data ...
  insertingDataInToTable("Departments", defaultDepartments);

  //Inserting Categories data ...
  insertingDataInToTable("VisitorCategory", defaultCategories);

  //Inserting Designation data ...
  insertingDataInToTable("Designation", defaultDesignation);

  //Inserting Idproofs data ...
  insertingDataInToTable("IDProof", defaultIdProofs);

  //Inserting Staff data ...
  insertingDataInToTable("StaffDetails", staffsDumyData);

  //Inserting Operators data ...
  insertingDataInToTable("Operators", operatorsDumyData);
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
  G_dbName = d.database.dbName;
  G_version = d.database.version;
}

(function () {
  window.electronAPI.readFile().then(({ event, data }) => {
    prepareInt(data);
  });
})();
