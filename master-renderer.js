let dbName;
let version;
let footerContain;
let headerContain;
let jsstoreCon;

document.getElementById("btnCancel").addEventListener("click", (e) => {
  e.preventDefault();
  window.electronAPI.quiteWindow("y");
});

function populateFild(d) {
  let displayId = d.objstore + "List";
  var sel = document.getElementById(displayId);
  var options = document.querySelectorAll("#" + displayId + " option");
  options.forEach((o) => o.remove());
  let results = d.results;
  for (var i in results) {
    var opt = document.createElement("option");
    opt.value = results[i].id;
    opt.text = results[i].name;

    sel.appendChild(opt);
  }
}

function populateContent(d) {
  document.getElementById("headerContent").innerHTML = d.contents.header;
  document.getElementById("footerContent").innerHTML = d.contents.footer;
  headerContain = new Quill("#headerContent", {
    theme: "snow",
  });
  footerContain = new Quill("#footerContent", {
    theme: "snow",
  });
}

function formSubmit(o) {
  let catName = o[0].value;
  let objstoreName = o[0].id;
  let ctime = new Date().getTime();

  let data = [
    {
      name: catName,
      createdOn: ctime,
      createdBy: 1,
      updatedOn: ctime,
      updatedBy: 1,
    },
  ];

  //Inserting data ...
  const insertingData = async () => {
    return insert(objstoreName, data);
  };
  insertingData().then((data) => messageHandler(data));

  return false;
}

async function selectAll(storeName) {
  var results = await jsstoreCon.select({
    from: storeName,
  });

  return { results: results, objstore: storeName };
}

async function insert(storeName, values) {
  var insertCount = await jsstoreCon.insert({
    into: storeName,
    values: values,
  });

  return {
    status: "success",
    objstore: storeName,
    message: `${insertCount} record inserted successfuly`,
    operation: "add",
  };
}

async function update(storeName, id, value) {
  var rowsUpdated = await jsstoreCon.update({
    in: storeName,
    where: {
      id: id,
    },
    set: {
      name: value,
    },
  });

  return {
    status: "success",
    objstore: storeName,
    message: `${rowsUpdated} record updated successfuly`,
    operation: "edit",
  };
}

async function remove(storeName, id) {
  var rowsDeleted = await jsstoreCon.remove({
    from: storeName,
    where: {
      id: id,
    },
  });

  return {
    status: "success",
    objstore: storeName,
    message: `${rowsDeleted} record removed successfuly`,
    operation: "remove",
  };
}

function messageHandler(m) {
  if (m.status == "success") {
    let storeName = m.objstore;
    document.getElementById(storeName).value = "";

    fetchMasterData(storeName);
    alert(m.message);
    if (m.operation == "edit")
      document.getElementById("btnClose" + storeName).click();
  } else if (m.status == "error") {
    alert(m.message);
  }
}

function submitContents() {
  let contents = {};

  var hContent = headerContain.getSemanticHTML();
  var fContent = footerContain.getSemanticHTML();

  contents.header = hContent;
  contents.footer = fContent;

  window.electronAPI.saveContents(contents);
  return false;
}

function enableEditBtn(o) {
  var listName = o.id;
  let storeName = listName.replace("List", "");

  var e = document.getElementById(listName);
  var disable = true;
  if (e.value) {
    disable = false;
    document.getElementById("edit" + storeName).value =
      e.options[e.selectedIndex].text;
    document.getElementById("edit" + storeName).dataset.keyvalue = e.value;
  } else {
    disable = true;
  }
  document.getElementById("btnEdit" + storeName).disabled = disable;
}

function updateRecord(o) {
  let btnId = o.id;
  let storeName = btnId.replace("btnUpdate", "");
  var value = document.getElementById("edit" + storeName).value;
  var key = document.getElementById("edit" + storeName).dataset.keyvalue;

  const updateData = async () => {
    return update(storeName, Number(key), value);
  };
  updateData().then((data) => messageHandler(data));
}

function deleteRecord(o) {
  let storeName = o.id.replace("btnDelete", "");
  var key = document.getElementById(storeName + "List").value;

  const removeData = async () => {
    return remove(storeName, Number(key));
  };
  removeData().then((data) => messageHandler(data));
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
  //Retriving all States Names
  fetchMasterData("States");

  //Retriving all Department Names
  fetchMasterData("Departments");

  //Retriving all User Category
  fetchMasterData("VisitorCategory");

  //Retriving all Designations
  fetchMasterData("Designation");

  //Retriving all IdProof
  fetchMasterData("IDProof");

  //Populate Header Contents
  populateContent(d);
}

(function () {
  window.electronAPI.readFile().then(({ event, data }) => {
    prepareInt(data);
  });
})();
