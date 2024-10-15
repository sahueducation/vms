async function selectAll(table) {
  var results = await jsstoreCon.select({
    from: table,
  });

  return { results: results, objstore: table };
}

async function insertInToTable(table, values, returnType = "count") {
  let returnValue = {};
  if (returnType == "count") {
    var insertCount = await jsstoreCon.insert({
      into: table,
      values: values,
    });

    returnValue = {
      message: `${insertCount} rows inserted in ${table} table`,
    };
  } else if (returnType == "results") {
    var insertedRecord = await jsstoreCon.insert({
      into: table,
      values: values,
      return: true,
    });

    returnValue = {
      message: `record inserted successfuly`,
      results: insertedRecord[0],
    };
  }

  returnValue.status = "success";
  returnValue.objstore = table;
  returnValue.operation = "add";
  return returnValue;
}

async function updateTable(table, id = 0, value, returnType = "count") {
  let returnValue = {};
  if (returnType == "count") {
    var rowsUpdated = await jsstoreCon.update({
      in: table,
      where: {
        id: id,
      },
      set: {
        name: value,
      },
    });

    returnValue = {
      message: `${rowsUpdated} record updated successfuly`,
    };
  } else if (returnType == "results") {
    var rowsUpdated = await jsstoreCon.insert({
      into: table,
      values: value,
      return: true,
      upsert: true,
    });

    returnValue = {
      message: `Record updated successfuly`,
      results: rowsUpdated[0],
    };
  }

  returnValue.status = "success";
  returnValue.objstore = table;
  returnValue.operation = "edit";
  return returnValue;
}

async function removeFromTable(table, id, customWhereCluse = {}) {
  let obj = { from: table };

  if (Object.keys(customWhereCluse).length === 0) {
    obj.where = {
      id: id,
    };
  } else {
    obj.where = customWhereCluse;
  }

  var rowsDeleted = await jsstoreCon.remove(obj);

  return {
    status: "success",
    objstore: table,
    id: id,
    message: `${rowsDeleted} record removed successfuly`,
    operation: "remove",
  };
}
