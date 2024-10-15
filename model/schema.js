function getDbSchema(dbName) {
  var statesTable = statesSchema();
  var departmentsTable = departmentsSchema();
  var categoriesTable = categoriesSchema();
  var designationTable = designationSchema();
  var idProofsTable = idProofsSchema();

  var db = {
    name: dbName,
    tables: [
      statesTable,
      departmentsTable,
      categoriesTable,
      designationTable,
      idProofsTable,
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
        notNull: true,
        dataType: "number",
        default: new Date().getTime(),
      },
      createdBy: {
        notNull: true,
        dataType: "number",
        default: 1,
      },
      updatedOn: {
        notNull: true,
        dataType: "number",
        default: new Date().getTime(),
      },
      updatedBy: {
        notNull: true,
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
        notNull: true,
        dataType: "number",
        default: new Date().getTime(),
      },
      createdBy: {
        notNull: true,
        dataType: "number",
        default: 1,
      },
      updatedOn: {
        notNull: true,
        dataType: "number",
        default: new Date().getTime(),
      },
      updatedBy: {
        notNull: true,
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
        notNull: true,
        dataType: "number",
        default: new Date().getTime(),
      },
      createdBy: {
        notNull: true,
        dataType: "number",
        default: 1,
      },
      updatedOn: {
        notNull: true,
        dataType: "number",
        default: new Date().getTime(),
      },
      updatedBy: {
        notNull: true,
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
        notNull: true,
        dataType: "number",
        default: new Date().getTime(),
      },
      createdBy: {
        notNull: true,
        dataType: "number",
        default: 1,
      },
      updatedOn: {
        notNull: true,
        dataType: "number",
        default: new Date().getTime(),
      },
      updatedBy: {
        notNull: true,
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
        notNull: true,
        dataType: "number",
        default: new Date().getTime(),
      },
      createdBy: {
        notNull: true,
        dataType: "number",
        default: 1,
      },
      updatedOn: {
        notNull: true,
        dataType: "number",
        default: new Date().getTime(),
      },
      updatedBy: {
        notNull: true,
        dataType: "number",
        default: 1,
      },
    },
  };

  return table;
}
