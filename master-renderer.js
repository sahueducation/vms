let footerContain;
let headerContain;

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
    return insertInToTable(objstoreName, data);
  };
  insertingData().then((data) => messageHandler(data));

  return false;
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
    return updateTable(storeName, Number(key), value);
  };
  updateData().then((data) => messageHandler(data));
}

function deleteRecord(o) {
  let storeName = o.id.replace("btnDelete", "");
  var key = document.getElementById(storeName + "List").value;

  const removeData = async () => {
    return removeFromTable(storeName, Number(key));
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
  G_dbName = d.database.dbName;
  G_version = d.database.version;

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
