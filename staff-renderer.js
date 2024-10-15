let dbName;
let version;
let jsstoreCon;

document.getElementById("btnCancel").addEventListener("click", (e) => {
  e.preventDefault();
  window.electronAPI.quiteWindow("y");
});

function addStaff() {
  const designationSelectElement = document.getElementById("Designation");
  const departmentsSelectElement = document.getElementById("Departments");

  const ctime = new Date().getTime();

  const data = {
    designationId: Number(designationSelectElement.value),
    designation:
      designationSelectElement.options[designationSelectElement.selectedIndex]
        .text,
    name: document.getElementById("name").value,
    extension: document.getElementById("extension").value,
    phonenumber: document.getElementById("phone-number").value,
    depId: Number(departmentsSelectElement.value),
    depName:
      departmentsSelectElement.options[departmentsSelectElement.selectedIndex]
        .text,
    otherDetails: document.getElementById("other-details").value,
    createdOn: ctime,
    createdBy: 1,
    updatedOn: ctime,
    updatedBy: 1,
  };

  const insertingData = async () => {
    return insert(data);
  };
  insertingData().then((data) => messageHandler(data));

  return false;
}

function deletStaff(d) {
  if (confirm("Are you sure, want to delete this record?")) {
    const removeData = async () => {
      return remove("StaffDetails", Number(d));
    };
    removeData().then((data) => messageHandler(data));
  }
}

function messageHandler(m) {
  if (m.status == "success") {
    if (m.operation == "add") {
      document.getElementById("newStaffForm").reset();
      populateStaffDetailsTable(m.data);
    } else if (m.operation == "delete") {
      const element = document.getElementById("row-" + m.id);
      element.remove();
    } else if (m.operation == "edit") {
      document.getElementById("btnCloseEditModal").click();
      populateStaffDetailsTable(m.data);
    }
  }
  alert(m.message);
}

function populateFild(d) {
  let placeholderId = d.objstore;
  var selectElement = document.getElementById(placeholderId);
  var options = document.querySelectorAll("#" + placeholderId + " option");
  options.forEach((o) => o.remove());
  let results = d.results;
  for (var i in results) {
    var opt = document.createElement("option");
    opt.value = results[i].id;
    opt.text = results[i].name;

    selectElement.appendChild(opt);
  }
}

function updateStaff() {
  const ctime = new Date().getTime();
  const designationSelectElement = document.getElementById("updateDesignation");
  const departmentsSelectElement = document.getElementById("updateDepartments");

  const name = document.getElementById("updateName").value;
  const DesignationId = designationSelectElement.value;
  const DepartmentsId = departmentsSelectElement.value;
  const Designation =
    designationSelectElement.options[designationSelectElement.selectedIndex]
      .text;
  const Departments =
    departmentsSelectElement.options[departmentsSelectElement.selectedIndex]
      .text;
  const PhoneNumber = document.getElementById("updatePhoneNumber").value;
  const Extension = document.getElementById("updateExtension").value;
  const OtherDetails = document.getElementById("updateOtherDetails").value;
  const key = document.getElementById("updateStaffId").value;

  const data = {
    staffId: Number(key),
    designationId: Number(DesignationId),
    designation: Designation,
    name: name,
    extension: Extension,
    phonenumber: PhoneNumber,
    depId: Number(DepartmentsId),
    depName: Departments,
    otherDetails: OtherDetails,
    updatedOn: ctime,
    updatedBy: 1,
  };

  const updateData = async () => {
    return update("StaffDetails", data);
  };
  updateData().then((data) => messageHandler(data));

  return false;
}

function populateModal(d) {
  const staffId = d.dataset.staffid;
  const rowElement = document.getElementById("row-" + staffId);
  const rowItems = rowElement.getElementsByTagName("td");

  const name = rowItems[0].textContent;
  const designationId = d.dataset.designationid;
  const depId = d.dataset.depid;
  const phonenumber = rowItems[3].textContent;
  const extension = rowItems[4].textContent;
  const otherDetails = rowItems[5].textContent;

  document.getElementById("updateStaffId").value = staffId;
  document.getElementById("updateName").value = name;
  document.getElementById("updateDesignation").innerHTML =
    document.getElementById("Designation").innerHTML;
  document.getElementById("updateDepartments").innerHTML =
    document.getElementById("Departments").innerHTML;
  document.getElementById("updateDesignation").value = designationId;
  document.getElementById("updateDepartments").value = depId;

  document.getElementById("updatePhoneNumber").value = phonenumber;
  document.getElementById("updateExtension").value = extension;
  document.getElementById("updateOtherDetails").value = otherDetails;
}

function populateStaffDetailsTable(d) {
  let table = document.getElementById("staffDetailsTable");
  let row = document.getElementById("row-" + d.staffId);
  if (row) {
    row.innerHTML = "";
  } else {
    row = document.createElement("tr");
    row.setAttribute("id", "row-" + d.staffId);
    const el = table.getElementsByTagName("tbody")[0];
    el.appendChild(row);
  }

  let node = document.createElement("td");
  node.innerText = d.name;
  row.appendChild(node);

  node = document.createElement("td");
  node.innerText = d.designation;
  row.appendChild(node);

  node = document.createElement("td");
  node.innerText = d.depName;
  row.appendChild(node);

  node = document.createElement("td");
  node.innerText = d.phonenumber;
  row.appendChild(node);

  node = document.createElement("td");
  node.innerText = d.extension;
  row.appendChild(node);

  node = document.createElement("td");
  node.innerText = d.otherDetails;
  row.appendChild(node);

  let html = '<i class="bi bi-pencil-square" ';
  html = html + 'data-bs-toggle="modal" data-bs-target="#ExtralargeModal" ';
  html = html + 'data-depId="' + d.depId + '" ';
  html = html + 'data-designationId="' + d.designationId + '" ';
  html = html + 'data-staffId="' + d.staffId + '" ';
  html =
    html +
    'onClick="populateModal(this);" style="cursor: pointer; margin-right:3px;"></i>';
  html =
    html +
    '<i class="bi bi-trash" onclick="deletStaff(' +
    d.staffId +
    ');" style="cursor: pointer; margin-left:3px;"></i>';
  node = document.createElement("td");
  node.innerHTML = html;
  row.appendChild(node);
}

function initStaffTable(d) {
  if (Array.isArray(d.results)) {
    const results = d.results;
    results.forEach(populateStaffDetailsTable);
  }
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

async function selectAll(storeName) {
  var results = await jsstoreCon.select({
    from: storeName,
  });

  return { results: results, objstore: storeName };
}

async function insert(values) {
  var insertedRecord = await jsstoreCon.insert({
    into: "StaffDetails",
    values: [values],
    return: true,
  });

  return {
    status: "success",
    objstore: "StaffDetails",
    message: `record inserted successfuly`,
    data: insertedRecord[0],
    operation: "add",
  };
}

async function update(storeName, setValues) {
  var rowsUpdated = await jsstoreCon.insert({
    into: storeName,
    values: [setValues],
    return: true,
    upsert: true,
  });

  return {
    status: "success",
    objstore: storeName,
    message: `Record updated successfuly`,
    operation: "edit",
    data: rowsUpdated[0],
  };
}

async function remove(storeName, id) {
  var rowsDeleted = await jsstoreCon.remove({
    from: storeName,
    where: {
      staffId: id,
    },
  });

  return {
    status: "success",
    id: id,
    message: `${rowsDeleted} record removed successfuly`,
    operation: "delete",
  };
}

function fetchMasterData(table) {
  const fetchData = async () => {
    return selectAll(table);
  };
  fetchData().then((data) => populateFild(data));
}

function prepareInt(d) {
  dbName = d.database.dbName;
  version = d.database.version;

  initDb();

  //Retriving all Department Names
  fetchMasterData("Departments");

  //Retriving all Designations
  fetchMasterData("Designation");

  //Retriving all Staff Details
  const fetchData = async () => {
    return selectAll("StaffDetails");
  };
  fetchData().then((data) => initStaffTable(data));
}

(function () {
  window.electronAPI.readFile().then(({ event, data }) => {
    prepareInt(data);
  });
})();
