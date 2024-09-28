let dbName;
let version;

/**********************FOR TESTING PURPOSE********************/

/**********************FOR TESTING PURPOSE********************/

document.getElementById("btnCancel").addEventListener("click", (e) => {
  e.preventDefault();
  window.electronAPI.quiteWindow("y");
});

function runScript() {
  var version = 28;
  //createStaffDetails();
  //createDesignation(dbName, version);
  //createStaffDetails(dbName, version);
  //deleteDesignation(dbName, version);
  //deleteStaffDetails(dbName, version);
  console.log("Started");
  createIdProof(dbName, version);
}

function deleteDesignation(d, v) {
  let param = {
    operation: "deleteStore",
    objstore: "Designation",
  };

  let mydb = new idb(d, v);
  mydb.openDB(param, msgHandler);
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

function createDesignation(db, version) {
  const ctime = new Date();
  const data = [
    {
      designationId: 1,
      name: "Director",
      creadedDate: ctime,
      createdBy: 1,
      updatedDate: ctime,
      updatedBy: 1,
    },
    {
      designationId: 2,
      name: "Manager",
      creadedDate: ctime,
      createdBy: 1,
      updatedDate: ctime,
      updatedBy: 1,
    },
  ];

  const indexParam = [
    { indexName: "designationId", unique: true },
    { indexName: "name", unique: true },
  ];

  const param = {
    operation: "createStore",
    objstore: "Designation",
    keyPath: "designationId",
    autoIncrement: true,
    indexed: indexParam,
    data: data,
  };

  const mydb = new idb(db, version);
  mydb.openDB(param, msgHandler);

  return;
}

function createIdProof(db, version) {
  console.log("In createIdProff function");
  const ctime = new Date();
  const data = [
    {
      id: 1,
      name: "Aadhar Card",
      creadedDate: ctime,
      createdBy: 1,
      updatedDate: ctime,
      updatedBy: 1,
    },
    {
      id: 2,
      name: "Voter Card",
      creadedDate: ctime,
      createdBy: 1,
      updatedDate: ctime,
      updatedBy: 1,
    },
    {
      id: 3,
      name: "PAN Card",
      creadedDate: ctime,
      createdBy: 1,
      updatedDate: ctime,
      updatedBy: 1,
    },
    {
      id: 4,
      name: "Driving License",
      creadedDate: ctime,
      createdBy: 1,
      updatedDate: ctime,
      updatedBy: 1,
    },
  ];

  const indexParam = [
    { indexName: "id", unique: true },
    { indexName: "name", unique: true },
  ];

  const param = {
    operation: "createStore",
    objstore: "IDProof",
    keyPath: "id",
    autoIncrement: true,
    indexed: indexParam,
    data: data,
  };
  console.log(param);
  const mydb = new idb(db, version);
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
