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
  var visitorsTable = visitorSchema();
  var visitesTable = visitesSchema();

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
      visitorsTable,
      visitesTable,
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

function visitorSchema() {
  var table = {
    name: "Visitors",
    columns: {
      visitorId: {
        autoIncrement: true,
        primaryKey: true,
      },
      phonenumber: {
        notNull: true,
        dataType: "number",
        unique: true,
      },
      iDProofId: {
        notNull: true,
        dataType: "number",
      },
      iDProof: {
        dataType: "string",
      },
      iDNumber: {
        notNull: true,
        dataType: "string",
      },
      age: {
        dataType: "number",
      },
      name: {
        notNull: true,
        dataType: "string",
      },
      category: {
        notNull: true,
        dataType: "string",
      },
      catId: {
        notNull: true,
        dataType: "number",
      },
      fname: {
        dataType: "string",
      },
      organization: {
        dataType: "string",
      },
      address: {
        dataType: "string",
      },
      city: {
        dataType: "string",
      },
      district: {
        dataType: "string",
      },
      state: {
        dataType: "string",
      },
      stateId: {
        dataType: "number",
      },
      photo: {
        dataType: "string",
      },
      isBlacklisted: {
        dataType: "string",
      },
      isReturnedLastPass: {
        dataType: "string",
      },
      totalVisites: {
        dataType: "number",
        default: 0,
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

function visitesSchema() {
  var table = {
    name: "Visites",
    columns: {
      visitesId: {
        autoIncrement: true,
        primaryKey: true,
      },
      slipNumber: {
        notNull: true,
        dataType: "number",
        unique: true,
      },
      department: {
        notNull: true,
        dataType: "string",
      },
      departmentId: {
        notNull: true,
        dataType: "number",
      },
      purpose: {
        dataType: "string",
      },
      numperson: {
        dataType: "number",
      },
      staffId: {
        notNull: true,
        dataType: "number",
      },
      designation: {
        dataType: "string",
      },
      toMeet: {
        dataType: "string",
      },
      visitingTime: {
        notNull: true,
        dataType: "number",
      },
      exitTime: {
        dataType: "number",
      },
      visitPass: {
        dataType: "string",
      },
      visitorId: {
        notNull: true,
        dataType: "number",
      },
      phonenumber: {
        notNull: true,
        dataType: "number",
      },
      iDProofId: {
        notNull: true,
        dataType: "number",
      },
      iDProof: {
        dataType: "string",
      },
      iDNumber: {
        notNull: true,
        dataType: "string",
      },
      age: {
        dataType: "number",
      },
      name: {
        notNull: true,
        dataType: "string",
      },
      category: {
        notNull: true,
        dataType: "string",
      },
      catId: {
        notNull: true,
        dataType: "number",
      },
      fname: {
        dataType: "string",
      },
      organization: {
        dataType: "string",
      },
      address: {
        dataType: "string",
      },
      city: {
        dataType: "string",
      },
      district: {
        dataType: "string",
      },
      state: {
        dataType: "string",
      },
      stateId: {
        dataType: "number",
      },
      photo: {
        dataType: "string",
      },
      isBlacklisted: {
        dataType: "string",
      },
      isReturnedLastPass: {
        dataType: "string",
      },
      totalVisites: {
        dataType: "number",
        default: 0,
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
