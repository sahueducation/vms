let dbName;
let version;
let footerContain;
let headerContain;

document.getElementById("btnCancel").addEventListener("click", (e) => {
  e.preventDefault();
  window.electronAPI.quiteWindow("y");
});

function populateFild(d) {
  let displayId = d.param.objstore + "List";
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

  let data = {
    name: catName,
    createdDate: ctime,
    createdBy: 1,
    updatedDate: ctime,
    updatedBy: 1,
  };
  let param = {
    operation: "add",
    objstore: objstoreName,
    index: "name",
    data: data,
  };

  let mydb = new idb(dbName, version);
  mydb.openDB(param, messageHandler);

  return false;
}

function messageHandler(m) {
  if (m.status == "success") {
    let storeName = m.param.objstore;
    document.getElementById(storeName).value = "";
    let param = {
      operation: "getAll",
      objstore: storeName,
      index: "name",
    };
    let mydb = new idb(dbName, version);
    mydb.openDB(param, populateFild);
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

  let param = {
    operation: "edit",
    objstore: storeName,
    index: "name",
    key: Number(key),
    value: value,
  };

  let mydb = new idb(dbName, version);
  mydb.openDB(param, messageHandler);
}

function deleteRecord(o) {
  let storeName = o.id.replace("btnDelete", "");
  var key = document.getElementById(storeName + "List").value;

  let param = {
    operation: "delete",
    objstore: storeName,
    index: "name",
    key: Number(key),
  };
  let mydb = new idb(dbName, version);
  mydb.openDB(param, messageHandler);
}

function prepareInt(d) {
  dbName = d.database.dbName;
  version = d.database.version;

  //Retriving all States Names
  let mydb = new idb(dbName, version);
  let param = { operation: "getAll", objstore: "States", index: "name" };
  mydb.openDB(param, populateFild);

  //Retriving all Department Names
  let depdb = new idb(dbName, version);
  let depParam = {
    operation: "getAll",
    objstore: "Departments",
    index: "name",
  };
  depdb.openDB(depParam, populateFild);

  //Retriving all User Category
  let catdb = new idb(dbName, version);
  let catParam = {
    operation: "getAll",
    objstore: "VisitorCategory",
    index: "name",
  };
  catdb.openDB(catParam, populateFild);

  //Retriving all Designations
  let desigdb = new idb(dbName, version);
  let desigdbParam = {
    operation: "getAll",
    objstore: "Designation",
    index: "name",
  };
  desigdb.openDB(desigdbParam, populateFild);

  //Retriving all Designations
  let idproofdb = new idb(dbName, version);
  let idproofParam = {
    operation: "getAll",
    objstore: "IDProof",
    index: "name",
  };
  idproofdb.openDB(idproofParam, populateFild);

  //Populate Header Contents
  populateContent(d);
}

(function () {
  window.electronAPI.readFile().then(({ event, data }) => {
    prepareInt(data);
  });
})();
