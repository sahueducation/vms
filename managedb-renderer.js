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
  const insertingStates = async () => {
    return insertStates(states);
  };
  insertingStates().then((data) => msgHandler(data));

  //Inserting Departments data ...
  const insertingDepartments = async () => {
    return insertDepartments(departments);
  };
  insertingDepartments().then((data) => msgHandler(data));

  //Inserting Categories data ...
  const insertingCategories = async () => {
    return insertCategories(categories);
  };
  insertingCategories().then((data) => msgHandler(data));

  //Inserting Designation data ...
  const insertingDesignation = async () => {
    return insertDesignation(designation);
  };
  insertingDesignation().then((data) => msgHandler(data));

  //Inserting Idproofs data ...
  const insertingIdproofs = async () => {
    return insertIdproofs(idProofs);
  };
  insertingIdproofs().then((data) => msgHandler(data));
}

async function initDb() {
  jsstoreCon = new JsStore.Connection();
  var isDbCreated = await jsstoreCon.initDb(getDbSchema(dbName));
  if (isDbCreated) {
    return {
      status: "success",
      message: `DB ${dbName} is created successfuly.`,
    };
  } else {
    return {
      status: "success",
      message: `DB ${dbName} is opened successfuly.`,
    };
  }
}

async function insertStates(values) {
  var insertCount = await jsstoreCon.insert({
    into: "States",
    values: values,
  });

  return {
    status: "success",
    message: `${insertCount} rows inserted in States table`,
  };
}

async function insertDepartments(values) {
  var insertCount = await jsstoreCon.insert({
    into: "Departments",
    values: values,
  });

  return {
    status: "success",
    message: `${insertCount} rows inserted in Departments table`,
  };
}

async function insertCategories(values) {
  var insertCount = await jsstoreCon.insert({
    into: "VisitorCategory",
    values: values,
  });

  return {
    status: "success",
    message: `${insertCount} rows inserted in VisitorCategory table`,
  };
}

async function insertDesignation(values) {
  var insertCount = await jsstoreCon.insert({
    into: "Designation",
    values: values,
  });

  return {
    status: "success",
    message: `${insertCount} rows inserted in Designation table`,
  };
}

async function insertIdproofs(values) {
  var insertCount = await jsstoreCon.insert({
    into: "IDProof",
    values: values,
  });

  return {
    status: "success",
    message: `${insertCount} rows inserted in IDProof table`,
  };
}

function runScript() {
  var version = 28;
  //createStaffDetails();
  //createDesignation(dbName, version);
  //createStaffDetails(dbName, version);
  //deleteDesignation(dbName, version);
  //deleteStaffDetails(dbName, version);
  //console.log("Started");
  //createIdProof(dbName, version);
}

function deleteStaffDetails(d, v) {
  let param = {
    operation: "deleteStore",
    objstore: "StaffDetails",
  };

  let mydb = new idb(d, v);
  mydb.openDB(param, msgHandler);
}

function createStaffDetails(d, v) {
  const ctime = new Date();
  const data = [
    {
      staffId: 1,
      designationId: 1,
      designation: "Director",
      name: "Mr. Sahu",
      extension: "111",
      phonenumber: "1212121212",
      depId: 1,
      depName: "IT",
      creadedDate: ctime,
      createdBy: 1,
      updatedDate: ctime,
      updatedBy: 1,
    },
  ];

  const indexParam = [
    { indexName: "designationId", unique: false },
    { indexName: "designation", unique: false },
    { indexName: "name", unique: false },
    { indexName: "depId", unique: false },
    { indexName: "depName", unique: false },
    { indexName: "phonenumber", unique: false },
  ];

  const param = {
    operation: "createStore",
    objstore: "StaffDetails",
    keyPath: "staffId",
    autoIncrement: true,
    indexed: indexParam,
    data: data,
  };

  const mydb = new idb(d, v);
  mydb.openDB(param, msgHandler);

  return;
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
