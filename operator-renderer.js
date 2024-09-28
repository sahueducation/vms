let dbName;
let version;

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
    createdDate: ctime,
    createdBy: 1,
    updatedDate: ctime,
    updatedBy: 1,
  };

  const param = {
    operation: "add",
    objstore: "Users",
    index: "userName",
    data: data,
  };

  const mydb = new idb(dbName, version);
  mydb.openDB(param, messageHandler);

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
      m.param.data.userId = m.param.key;
      populateOperatorDetailsTable(m.param.data);
    } else if (m.operation == "delete") {
      const element = document.getElementById("row-" + m.param.key);
      element.remove();
    } else if (m.operation == "edit") {
      document.getElementById("btnCloseEditModal").click();
      populateOperatorDetailsTable(m.param.data);
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
    updatedDate: ctime,
    updatedBy: 1,
  };

  const param = {
    operation: "edit",
    objstore: "Users",
    index: "userName",
    data: data,
    key: Number(key),
  };

  const mydb = new idb(dbName, version);
  mydb.openDB(param, messageHandler);

  return false;
}

function initUpdate() {
  document.getElementById("updateButton").click();
}

function populateModal(d) {
  const userId = d.dataset.userid;
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
  //return false;
  let table = document.getElementById("operatorDetailsTable");
  let row = document.getElementById("row-" + d.userId);
  if (row) {
    row.innerHTML = "";
  } else {
    row = document.createElement("tr");
    row.setAttribute("id", "row-" + d.userId);
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
  html = html + 'data-userId="' + d.userId + '" ';
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

function prepareInt(d) {
  dbName = d.database.dbName;
  version = d.database.version;

  //Retriving all Staff Details
  let staffdb = new idb(dbName, version);
  let staffddbParam = {
    operation: "getAll",
    objstore: "Users",
    index: "userName",
  };
  staffdb.openDB(staffddbParam, initOperatorTable);
}

(function () {
  window.electronAPI.readFile().then(({ event, data }) => {
    prepareInt(data);
  });
})();
