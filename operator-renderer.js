let dbName;
let version;
let jsstoreCon;

document.getElementById("btnCancel").addEventListener("click", (e) => {
  e.preventDefault();
  window.electronAPI.quiteWindow("y");
});

function addOperator() {
  if (!matchPassword()) {
    return false;
  }
  const ctime = new Date().getTime();

  const data = {
    userName: document.getElementById("username").value,
    userPassword: document.getElementById("password").value,
    otherDetails: document.getElementById("other-details").value,
    userRole: "operator",
    passwordUpdatedOn: ctime,
    isLogedIn: "n",
    createdOn: ctime,
    createdBy: 1,
    updatedOn: ctime,
    updatedBy: 1,
  };

  const fetchData = async () => {
    return insert(data);
  };
  fetchData().then((data) => messageHandler(data));

  return false;
}

function matchPassword() {
  let pass = document.getElementById("password").value;
  let conPass = document.getElementById("confirmpassword").value;

  if (pass != conPass) {
    document.getElementById("alertMessage").style.display = "block";
    return false;
  } else {
    document.getElementById("alertMessage").style.display = "none";
    return true;
  }
}

function deletUser(d) {
  if (confirm("Are you sure, want to delete this record?")) {
    let param = {
      operation: "delete",
      objstore: "Users",
      index: "userName",
      key: Number(d),
    };
    let mydb = new idb(dbName, version);
    mydb.openDB(param, messageHandler);
  }
}

function messageHandler(m) {
  if (m.status == "success") {
    if (m.operation == "add") {
      document.getElementById("newOperatorForm").reset();
      populateOperatorDetailsTable(m.results);
    } else if (m.operation == "delete") {
      const element = document.getElementById("row-" + m.key);
      element.remove();
    } else if (m.operation == "edit") {
      document.getElementById("btnCloseEditModal").click();
      populateOperatorDetailsTable(m.results);
    }
  }
  alert(m.message);
}

function updateOperator() {
  const ctime = new Date().getTime();
  const key = document.getElementById("updateOperatorId").value;
  const pass = document.getElementById("updatePassword").value;
  const conPass = document.getElementById("updateConfirmPassword").value;

  if (pass != conPass) {
    alert("Password must match with Confirm Password.");
    return false;
  }

  const data = {
    userName: document.getElementById("updateUsername").value,
    userPassword: pass,
    otherDetails: document.getElementById("updateOtherDetails").value,
    passwordUpdatedOn: ctime,
    updatedOn: ctime,
    updatedBy: 1,
    id: Number(key),
  };

  const updateData = async () => {
    return update(data);
  };
  updateData().then((data) => messageHandler(data));
  return false;
}

function populateModal(d) {
  const userId = d.dataset.id;
  const rowElement = document.getElementById("row-" + userId);
  const rowItems = rowElement.getElementsByTagName("td");

  const userName = rowItems[0].textContent;
  const password = rowItems[1].textContent;
  const otherDetails = rowItems[2].textContent;

  document.getElementById("updateOperatorId").value = userId;
  document.getElementById("updateUsername").value = userName;
  document.getElementById("updatePassword").value = password;
  document.getElementById("updateConfirmPassword").value = password;
  document.getElementById("updateOtherDetails").value = otherDetails;
}

function populateOperatorDetailsTable(d) {
  let table = document.getElementById("operatorDetailsTable");
  let row = document.getElementById("row-" + d.id);
  if (row) {
    row.innerHTML = "";
  } else {
    row = document.createElement("tr");
    row.setAttribute("id", "row-" + d.id);
    const el = table.getElementsByTagName("tbody")[0];
    el.appendChild(row);
  }

  let node = document.createElement("td");
  node.innerText = d.userName;
  row.appendChild(node);

  node = document.createElement("td");
  node.innerText = d.userPassword;
  row.appendChild(node);

  node = document.createElement("td");
  node.innerText = d.otherDetails;
  row.appendChild(node);

  let html = '<i class="bi bi-pencil-square" ';
  html = html + 'data-bs-toggle="modal" data-bs-target="#ExtralargeModal" ';
  html = html + 'data-id="' + d.id + '" ';
  html =
    html +
    'onClick="populateModal(this);" style="cursor: pointer; margin-right:3px;"></i>';
  html =
    html +
    '<i class="bi bi-trash" onclick="deletUser(' +
    d.userId +
    ');" style="cursor: pointer; margin-left:3px;"></i>';
  node = document.createElement("td");
  node.innerHTML = html;
  row.appendChild(node);
}

function initOperatorTable(d) {
  if (Array.isArray(d.results)) {
    const results = d.results;
    results.forEach(populateOperatorDetailsTable);
  }
}

async function selectAll(storeName) {
  var results = await jsstoreCon.select({
    from: storeName,
  });

  return { results: results, objstore: storeName };
}

async function insert(values) {
  var insertedRecord = await jsstoreCon.insert({
    into: "Operators",
    values: [values],
    return: true,
  });

  return {
    status: "success",
    objstore: "Operators",
    message: `record inserted successfuly`,
    results: insertedRecord[0],
    operation: "add",
  };
}

async function update(setValues) {
  var rowsUpdated = await jsstoreCon.insert({
    into: "Operators",
    values: [setValues],
    return: true,
    upsert: true,
  });

  return {
    status: "success",
    objstore: "Operators",
    message: `Record updated successfuly`,
    operation: "edit",
    results: rowsUpdated[0],
  };
}

function prepareInt(d) {
  dbName = d.database.dbName;
  version = d.database.version;

  initDb();
  //Retriving all Staff Details
  const fetchData = async () => {
    return selectAll("Operators");
  };
  fetchData().then((data) => initOperatorTable(data));
}

(function () {
  window.electronAPI.readFile().then(({ event, data }) => {
    prepareInt(data);
  });
})();
