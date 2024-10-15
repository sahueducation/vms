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

function getDbSchema(dbName) {
  var statesTable = statesSchema();
  var departmentsTable = departmentsSchema();
  var categoriesTable = categoriesSchema();
  var designationTable = designationSchema();
  var idProofsTable = idProofsSchema();
  var staffTable = staffSchema();
  var operatorsTable = operatorsSchema();

  var db = {
    name: dbName,
    tables: [
      statesTable,
      departmentsTable,
      categoriesTable,
      designationTable,
      idProofsTable,
      staffTable,
      operatorsTable,
    ],
  };
  return db;
}

function statesSchema() {
  var table = {
    name: "States",
    columns: {
      steteId: {
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        notNull: true,
        dataType: "string",
      },
      createdOn: {
        dataType: "number",
        default: new Date().getTime(),
      },
      createdBy: {
        dataType: "number",
        default: 1,
      },
      updatedOn: {
        dataType: "number",
        default: new Date().getTime(),
      },
      updatedBy: {
        dataType: "number",
        default: 1,
      },
    },
  };

  return table;
}

function departmentsSchema() {
  var table = {
    name: "Departments",
    columns: {
      id: {
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        notNull: true,
        dataType: "string",
      },
      createdOn: {
        dataType: "number",
        default: new Date().getTime(),
      },
      createdBy: {
        dataType: "number",
        default: 1,
      },
      updatedOn: {
        dataType: "number",
        default: new Date().getTime(),
      },
      updatedBy: {
        dataType: "number",
        default: 1,
      },
    },
  };

  return table;
}

function categoriesSchema() {
  var table = {
    name: "VisitorCategory",
    columns: {
      id: {
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        notNull: true,
        dataType: "string",
      },
      createdOn: {
        dataType: "number",
        default: new Date().getTime(),
      },
      createdBy: {
        dataType: "number",
        default: 1,
      },
      updatedOn: {
        dataType: "number",
        default: new Date().getTime(),
      },
      updatedBy: {
        dataType: "number",
        default: 1,
      },
    },
  };

  return table;
}

function designationSchema() {
  var table = {
    name: "Designation",
    columns: {
      id: {
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        notNull: true,
        dataType: "string",
      },
      createdOn: {
        dataType: "number",
        default: new Date().getTime(),
      },
      createdBy: {
        dataType: "number",
        default: 1,
      },
      updatedOn: {
        dataType: "number",
        default: new Date().getTime(),
      },
      updatedBy: {
        dataType: "number",
        default: 1,
      },
    },
  };

  return table;
}

function idProofsSchema() {
  var table = {
    name: "IDProof",
    columns: {
      id: {
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        notNull: true,
        dataType: "string",
      },
      createdOn: {
        dataType: "number",
        default: new Date().getTime(),
      },
      createdBy: {
        dataType: "number",
        default: 1,
      },
      updatedOn: {
        dataType: "number",
        default: new Date().getTime(),
      },
      updatedBy: {
        dataType: "number",
        default: 1,
      },
    },
  };

  return table;
}

function staffSchema() {
  var table = {
    name: "StaffDetails",
    columns: {
      staffId: {
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        notNull: true,
        dataType: "string",
      },

      designationId: {
        notNull: true,
        dataType: "number",
      },
      designation: {
        notNull: true,
        dataType: "string",
      },
      extension: {
        dataType: "string",
      },
      phonenumber: {
        dataType: "string",
      },
      depId: {
        notNull: true,
        dataType: "number",
      },
      depName: {
        notNull: true,
        dataType: "string",
      },
      otherDetails: { dataType: "string" },
      createdOn: {
        dataType: "number",
        default: new Date().getTime(),
      },
      createdBy: {
        dataType: "number",
        default: 1,
      },
      updatedOn: {
        dataType: "number",
        default: new Date().getTime(),
      },
      updatedBy: {
        dataType: "number",
        default: 1,
      },
    },
  };

  return table;
}

function operatorsSchema() {
  var table = {
    name: "Operators",
    columns: {
      id: {
        autoIncrement: true,
        primaryKey: true,
      },
      userName: {
        notNull: true,
        dataType: "string",
      },
      userPassword: {
        notNull: true,
        dataType: "string",
      },
      otherDetails: {
        dataType: "string",
      },
      userRole: {
        dataType: "string",
      },
      passwordUpdatedOn: {
        dataType: "number",
      },
      isLogedIn: {
        dataType: "string",
      },
      createdOn: {
        dataType: "number",
        default: new Date().getTime(),
      },
      createdBy: {
        dataType: "number",
        default: 1,
      },
      updatedOn: {
        dataType: "number",
        default: new Date().getTime(),
      },
      updatedBy: {
        dataType: "number",
        default: 1,
      },
    },
  };

  return table;
}
