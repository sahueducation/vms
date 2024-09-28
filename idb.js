//export default class idb
class idb {
  constructor(dbName, version) {
    this.db;
    this.dbName = dbName;
    this.version = version;
  }

  openDB(param, callback = () => {}) {
    this.param = param;
    this.storeName = param.objstore;
    this.index = param.index;

    if (!window.indexedDB) {
      callback({ status: "error", message: "Unsupported indexedDB" });
    }
    let request = window.indexedDB.open(this.dbName, this.version);
    request.onsuccess = (event) => {
      this.db = event.target.result;
      if (this.param.operation == "getAll") {
        this.getAll(callback);
      }

      if (this.param.operation == "add") {
        this.add(callback);
      }

      if (this.param.operation == "delete") {
        this.delete(callback);
      }

      if (this.param.operation == "edit") {
        this.edit(callback);
      }

      if (this.param.operation == "getByIndex") {
        this.getByIndex(callback);
      }
      if (this.param.operation == "createVisites") {
        this.createVisites(callback);
      }
      if (this.param.operation == "count") {
        this.count(callback);
      }
      if (this.param.operation == "getVisitesByDep") {
        this.getVisitesByDep(callback);
      }
      if (this.param.operation == "getAllByIndex") {
        this.getAllByIndex(callback);
      }
    };

    request.onerror = (event) => {
      callback({ status: "error", message: event.target.error });
    };

    request.onupgradeneeded = (event) => {
      this.db = event.target.result;
      callback({ status: "info", message: "Db successfully opened." });

      if (this.param.operation == "createStore") {
        this.createStore(callback);
      }

      if (this.param.operation == "deleteStore") {
        this.deleteStore(callback);
      }

      // transaction.oncomplete = function () {
      //   this.db.close();
      // };

      return false;
      /* Create Staff Details Stores and entering domy data */
      //Domy Data

      /* Create User Activities Stores and entering domy data */
      //Domy Data
      const userActivityData = [
        {
          userId: 3,
          userName: "operator",
          terminal: "T1",
          activity: "logedin",
          dateTime: ctime,
        },
      ];
      let userActStore = this.db.createObjectStore("UserActivities", {
        keyPath: "userActvityId",
        autoIncrement: true,
      });
      userActStore.createIndex("userName", "userName", {
        unique: false,
      });
      userActStore.createIndex("terminal", "terminal", {
        unique: false,
      });
      userActStore.createIndex("activity", "activity", {
        unique: false,
      });
      userActStore.transaction.oncomplete = (event) => {
        var userActObjectStore = this.db
          .transaction("UserActivities", "readwrite")
          .objectStore("UserActivities");
        userActivityData.forEach(function (user) {
          userActObjectStore.add(user);
        });
      };

      /* Create Users Stores and entering domy data */
      //Domy Data
      const userData = [
        {
          userName: "superadmin",
          userPassword: "superadmin",
          passwordUpdatedOn: ctime,
          userRole: "superadmin",
          islogedIn: "n",
          creadedDate: ctime,
          createdBy: 1,
          updatedDate: ctime,
          updatedBy: 1,
        },
        {
          userName: "admin",
          userPassword: "admin",
          passwordUpdatedOn: ctime,
          userRole: "admin",
          islogedIn: "n",
          creadedDate: ctime,
          createdBy: 1,
          updatedDate: ctime,
          updatedBy: 1,
        },
        {
          userName: "operator",
          userPassword: "operator",
          passwordUpdatedOn: ctime,
          userRole: {},
          islogedIn: "n",
          creadedDate: ctime,
          createdBy: 1,
          updatedDate: ctime,
          updatedBy: 1,
        },
      ];
      let userStore = this.db.createObjectStore("Users", {
        keyPath: "userId",
        autoIncrement: true,
      });
      userStore.createIndex("userName", "userName", {
        unique: true,
      });
      userStore.transaction.oncomplete = (event) => {
        var userObjectStore = this.db
          .transaction("Users", "readwrite")
          .objectStore("Users");
        userData.forEach(function (user) {
          userObjectStore.add(user);
        });
      };

      /* Create Visitor Category Stores and entering domy data */
      //Domy Data
      const visitorCatData = [
        {
          name: "General Public",
          creadedDate: ctime,
          createdBy: 1,
          updatedDate: ctime,
          updatedBy: 1,
        },
        {
          name: "Gov. Official",
          creadedDate: ctime,
          createdBy: 1,
          updatedDate: ctime,
          updatedBy: 1,
        },
        {
          name: "Private Official",
          creadedDate: ctime,
          createdBy: 1,
          updatedDate: ctime,
          updatedBy: 1,
        },
        {
          name: "Defense Personal",
          creadedDate: ctime,
          createdBy: 1,
          updatedDate: ctime,
          updatedBy: 1,
        },
      ];
      let visitorCatStore = this.db.createObjectStore("VisitorCategory", {
        keyPath: "catId",
        autoIncrement: true,
      });
      visitorCatStore.createIndex("name", "name", {
        unique: true,
      });
      visitorCatStore.transaction.oncomplete = (event) => {
        var visitorObjectStore = this.db
          .transaction("VisitorCategory", "readwrite")
          .objectStore("VisitorCategory");
        visitorCatData.forEach(function (visitor) {
          visitorObjectStore.add(visitor);
        });
      };

      /* Create Visitor Stores and entering domy data */
      //Domy Data
      const visitorsData = [
        {
          phonenumber: "123456789",
          name: "Jason",
          fname: "Gobind",
          age: "43",
          address: "SCO11, Lake View Complex",
          city: "Zirakpur",
          district: "Mohali",
          state: "Punjab",
          photo: "",
          createdate: ctime,
          updateddate: ctime,
        },
        {
          phonenumber: "123456788",
          name: "Lokesh",
          fname: "Ram Kumar",
          age: "34",
          address: "CSCO11, Lake View Complex",
          city: "Zirakpur",
          district: "Mohali",
          state: "Punjab",
          photo: "",
          createdate: ctime,
          updateddate: ctime,
        },
        {
          phonenumber: "123456787",
          name: "Tarun",
          fname: "Sohan",
          age: "52",
          address: "SCO11, Lake View Complex",
          city: "Zirakpur",
          district: "Mohali",
          state: "Punjab",
          photo: "",
          createdate: ctime,
          updateddate: ctime,
        },
        {
          phonenumber: "123456786",
          name: "Pranith",
          fname: "Rana",
          age: "24",
          address: "SCO11, Lake View Complex",
          city: "Zirakpur",
          district: "Mohali",
          state: "Punjab",
          photo: "",
          createdate: ctime,
          updateddate: ctime,
        },
      ];
      let visitorStore = this.db.createObjectStore("Visitors", {
        keyPath: "visitorId",
        autoIncrement: true,
      });
      visitorStore.createIndex("phonenumber", "phonenumber", {
        unique: true,
      });
      visitorStore.createIndex("name", "name", {
        unique: false,
      });
      visitorStore.transaction.oncomplete = (event) => {
        var visitorObjectStore = this.db
          .transaction("Visitors", "readwrite")
          .objectStore("Visitors");
        visitorsData.forEach(function (visitor) {
          visitorObjectStore.add(visitor);
        });
      };

      /* Create States Stores and entering domy data */
      //Domy Data
      const statesData = [
        {
          name: "Himachal Pradesh",
          createdate: ctime,
          updateddate: ctime,
        },
        {
          name: "Chandigarh",
          createdate: ctime,
          updateddate: ctime,
        },
        {
          name: "Haryana",
          createdate: ctime,
          updateddate: ctime,
        },
        {
          name: "Punjab",
          createdate: ctime,
          updateddate: ctime,
        },
      ];
      let stateStore = this.db.createObjectStore("States", {
        keyPath: "stateId",
        autoIncrement: true,
      });
      stateStore.createIndex("name", "name", {
        unique: true,
      });
      stateStore.transaction.oncomplete = (event) => {
        var stateObjectStore = this.db
          .transaction("States", "readwrite")
          .objectStore("States");
        statesData.forEach(function (state) {
          stateObjectStore.add(state);
        });
      };

      /* Create Department Stores and entering domy data */
      //Dumy Data
      const depData = [
        {
          name: "IT",
          createdate: ctime,
          updateddate: ctime,
        },
        {
          name: "Accounts",
          createdate: ctime,
          updateddate: ctime,
        },
        {
          name: "Civil",
          createdate: ctime,
          updateddate: ctime,
        },
        {
          name: "Sales",
          createdate: ctime,
          updateddate: ctime,
        },
      ];
      let depStore = this.db.createObjectStore("Departments", {
        keyPath: "depId",
        autoIncrement: true,
      });
      depStore.createIndex("name", "name", {
        unique: true,
      });
      depStore.transaction.oncomplete = (event) => {
        var objectStore = this.db
          .transaction("Departments", "readwrite")
          .objectStore("Departments");
        depData.forEach(function (dep) {
          objectStore.add(dep);
        });
      };

      /* Create Visites Stores and entering domy data */
      const visitesData = [
        {
          visiterId: 1,
          depId: 1,
          visitingDate: ctime,
          visitingTime: 680,
          exitTime: 790,
          returnedPass: "y",
        },
        {
          visiterId: 2,
          depId: 1,
          visitingDate: ctime,
          visitingTime: 780,
          exitTime: 890,
          returnedPass: "y",
        },
        {
          visiterId: 2,
          depId: 3,
          visitingDate: ctime,
          visitingTime: 680,
          exitTime: 820,
          returnedPass: "y",
        },
      ];
      let visiteStore = this.db.createObjectStore("Visites", {
        keyPath: "visitesId",
        autoIncrement: true,
      });
      visiteStore.createIndex("visiterId", "visiterId", {
        unique: false,
      });
      visiteStore.createIndex("depId", "depId", {
        unique: false,
      });
      visiteStore.createIndex("visitingDate", "visitingDate", {
        unique: false,
      });
      visiteStore.createIndex("visitingTime", "visitingTime", {
        unique: false,
      });
      visiteStore.createIndex("exitTime", "exitTime", {
        unique: false,
      });
    };
  }

  deleteDB() {
    if (window.indexedDB) {
      window.indexedDB.deleteDatabase(this.dbName);
    }
  }

  createStore(callback = () => {}) {
    callback({
      status: "info",
      message: "Preparing to create fresh Object Store.",
    });

    let indexparam = this.param.indexed;
    let defaultData = this.param.data;

    let store = this.db.createObjectStore(this.storeName, {
      keyPath: this.param.keyPath,
      autoIncrement: this.param.autoIncrement,
    });

    indexparam.forEach(function (param) {
      store.createIndex(param.indexName, param.indexName, {
        unique: param.unique,
      });
    });

    store.transaction.onabort = (e) => {
      callback({
        status: "error",
        message: "Error occured on transaction onabourt.",
        info: e.target.error,
      });
    };

    store.transaction.onerror = (e) => {
      callback({
        status: "error",
        message: "Error occured on transaction onerror.",
        info: e.target.error,
      });
    };

    store.transaction.oncomplete = (e) => {
      callback({
        status: "success",
        message: "Object Store Created successful.",
        info: e.target.result,
      });

      let objStore = this.db
        .transaction(this.storeName, "readwrite")
        .objectStore(this.storeName);

      callback({
        status: "info",
        message: "Initiating to add default data.",
      });
      let transactionRequest;
      defaultData.forEach(function (data) {
        transactionRequest = objStore.add(data);
      });

      transactionRequest.onerror = (e) =>
        callback({
          status: "error",
          operation: "add",
          message: "Addition Failed",
          info: e.target.erro,
          param: this.param,
        });
      transactionRequest.onsuccess = (e) => {
        callback({
          status: "success",
          operation: "add",
          message: "Added Successfuly.",
          param: this.param,
        });
      };
    };
  }

  deleteStore(callback = () => {}) {
    if (this.db) {
      let objectstore = this.db.deleteObjectStore(this.storeName);
      callback({
        status: "success",
        message: "The store is deleted successfuly.",
      });
      this.db.oncomplete = (e) => {
        console.log(e);
        callback({ status: "success", message: "Deletion completed." });
      };
      this.db.onabort = (e) => {
        callback({ status: "error", message: e.target.error });
      };
    }
  }

  add(callback = () => {}) {
    let data = this.param.data;
    if (this.db && data) {
      let transaction = this.db.transaction(this.storeName, "readwrite");
      transaction.onabort = (e) => {};
      transaction.onerror = (e) => {};
      let request = transaction.objectStore(this.storeName);
      let objectStoreRequest;
      if (Array.isArray(data)) {
        data.forEach(function (visitor) {
          objectStoreRequest = request.add(visitor);
        });
      } else {
        objectStoreRequest = request.add(data);
      }

      objectStoreRequest.onerror = (e) =>
        callback({
          status: "error",
          operation: "add",
          message: "Addition Failed",
          info: e.target.erro,
          param: this.param,
        });
      objectStoreRequest.onsuccess = (e) => {
        this.param.key = e.target.result;
        console.log("added successfuly.");
        callback({
          status: "success",
          operation: "add",
          message: "Added Successfuly.",
          param: this.param,
        });
      };

      transaction.oncomplete = function () {
        this.db.close();
      };
    }
  }

  createVisites(callback = () => {}) {
    let visitorData = this.param.visitorData;
    let visitesData = this.param.visitesData;
    let visitorId = this.param.visitorData.visitorId;

    if (visitorId == 0) delete visitorData.visitorId;

    if (this.db && visitorData) {
      let transaction = this.db.transaction(
        ["Visitors", "Visites"],
        "readwrite"
      );

      let visitorsObject = transaction.objectStore("Visitors");
      let visitesObject = transaction.objectStore("Visites");

      let visitorGetRequest = visitorsObject.get(visitorId);
      visitorGetRequest.onsuccess = () => {
        let visitor = visitorGetRequest.result;
        let updatedRequest;
        let updatedVisitesReq;

        if (visitor) {
          let totalVisites = Number(visitor.totalVisites);
          visitorData.totalVisites =
            1 + (isNaN(totalVisites) ? 0 : totalVisites);
          let skip = ["phonenumber"];
          Object.entries(visitorData).forEach(([key, value]) => {
            if (skip.includes(key)) return;
            visitor[key] = value;
          });
        } else {
          visitor = visitorData;
        }
        updatedRequest = visitorsObject.put(visitor);
        updatedRequest.onsuccess = () => {
          let skip = [
            "isBlacklisted",
            "updatedDate",
            "updatedBy",
            "createdDate",
            "createdBy",
          ];
          Object.entries(visitorData).forEach(([key, value]) => {
            if (skip.includes(key)) return;
            visitesData[key] = value;
          });
          visitesData.visiterId = updatedRequest.result;
          updatedVisitesReq = visitesObject.put(visitesData);
          updatedVisitesReq.onsuccess = (e) => {
            callback({
              status: "success",
              operation: "createVisites",
              message: "Added Successfuly.",
              extraData: this.param.extraData,
              visitorData: visitor,
              visitesData: visitesData,
            });
          };
        };

        updatedRequest.onerror = (e) => {
          console.log(e.target.error);
        };
      };
      visitorGetRequest.onerror = (e) => {
        console.log(e.target.error);
      };

      transaction.onerror = (e) => {
        console.log(e.target.error);
      };

      transaction.oncomplete = function () {
        this.db.close();
      };
    }
  }

  edit(callback = () => {}) {
    const objectStore = this.db
      .transaction(this.storeName, "readwrite")
      .objectStore(this.storeName);

    const request = objectStore.get(this.param.key);
    request.onsuccess = () => {
      let record = request.result;
      if (!record) record = {};
      //console.log(record);
      if (this.param.value) {
        record.name = this.param.value;
      } else {
        let data = this.param.data;
        Object.entries(data).forEach(([key, value]) => {
          var k = key;
          var v = value;
          record[k] = v;
        });
        this.param.data = record;
      }

      const updateRequest = objectStore.put(record);

      updateRequest.onsuccess = () => {
        //console.log("tested");
        callback({
          status: "success",
          operation: "edit",
          message: "Updated Successfuly.",
          param: this.param,
        });
      };
    };
  }

  getByIndex(callback = () => {}) {
    let key = this.param.key;
    if (this.db && key) {
      let request = this.db
        .transaction(this.storeName)
        .objectStore(this.storeName)
        .index(this.index)
        .get(key);
      request.onerror = (e) =>
        callback({
          status: "error",
          operation: "get",
          message: "Operation Failed",
          info: e.target.error,
        });
      request.onsuccess = (e) => {
        callback({
          status: "success",
          operation: "get",
          message: "Retrived Successfuly.",
          result: request.result,
          param: this.param,
        });
      };
    }
  }

  getAll(callback = () => {}) {
    if (this.db) {
      let orderBy = IDBCursor.NEXT;
      if (this.param.orderBy) {
        orderBy = this.param.orderBy;
      }
      let request = this.db
        .transaction(this.storeName)
        .objectStore(this.storeName)
        .openCursor(null, orderBy);
      let results = [];
      request.onsuccess = (e) => {
        let cursor = e.target.result;
        //console.log(cursor.value);
        if (cursor) {
          //console.log("Key:" + cursor.key + " Value:" + cursor.value.name);
          cursor.value.id = cursor.key;
          results.push(cursor.value);
          cursor.continue();
        } else {
          let returnResult = { results: results, param: this.param };
          callback(returnResult);
        }
      };
      request.onerror = (e) => callback(e.target.error);
    }
  }

  getAllByIndex(callback = () => {}) {
    let keyRng = null;
    if (this.param.key) {
      keyRng = IDBKeyRange.only(this.param.key);
    }
    if (this.db) {
      let request = this.db
        .transaction(this.storeName)
        .objectStore(this.storeName)
        .index(this.index)
        .openCursor(keyRng, IDBCursor.NEXT);
      let results = [];
      request.onsuccess = (e) => {
        let cursor = e.target.result;

        if (cursor) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          let returnResult = { results: results, param: this.param };
          callback(returnResult);
        }
      };
      request.onerror = (e) => callback(e.target.error);
    }
  }

  delete(callback = () => {}) {
    let key = this.param.key;

    if (this.db) {
      let request = this.db
        .transaction(this.storeName, "readwrite")
        .objectStore(this.storeName)
        .delete(key);
      request.onerror = (e) =>
        callback({
          status: "error",
          operation: "delete",
          message: "Deletion Failed.",
          info: e.target.erro,
        });

      request.onsuccess = (e) =>
        callback({
          status: "success",
          operation: "delete",
          message: "Deleted Successfuly.",
          info: e.target.erro,
          param: this.param,
        });
    }
  }

  clear(storeName, callback = () => {}) {
    if (this.db) {
      let request = this.db
        .transaction([storeName], IDBTransaction.READ_WRITE)
        .objectStore(storeName)
        .clear();
      request.onerror = (e) => callback(e.target.error);
      request.onsuccess = (e) => callback(e.target.result);
    }
  }

  count(callback = () => {}) {
    if (this.db) {
      let objectStore = this.db
        .transaction([this.storeName])
        .objectStore(this.storeName);
      const index = objectStore.index(this.index);
      const countRequest = index.count(this.param.keyrange);

      countRequest.onerror = (e) => callback(e.target.error);
      countRequest.onsuccess = (e) => callback(e.target.result);
    }
  }

  getVisitesByDep(callback = () => {}) {
    let depObj = this.param.departmentParam;

    if (this.db) {
      let request = this.db
        .transaction(this.storeName)
        .objectStore(this.storeName)
        .openCursor(null, IDBCursor.NEXT);
      let results = [];
      request.onsuccess = (e) => {
        let cursor = e.target.result;

        if (cursor) {
          depObj[cursor.value.depId].value =
            depObj[cursor.value.depId].value + 1;

          cursor.continue();
        } else {
          callback(depObj);
        }
      };
      request.onerror = (e) => callback(e.target.error);
    }
  }
}

(function () {
  // check for IndexedDB support
  if (!window.indexedDB) {
    console.log(`Your browser doesn't support IndexedDB`);
    return;
  }

  // open the CRM database with the version 1
  const request = indexedDB.open("CRM", 12);

  // create the Contacts object store and indexes
  request.onupgradeneeded = (event) => {
    let db = event.target.result;

    // create the Contacts object store
    // with auto-increment id
    let store = db.createObjectStore("States", {
      autoIncrement: true,
    });

    // create an index on the email property
    let index = store.createIndex("name", "name", {
      unique: true,
    });
  };

  // handle the error event
  request.onerror = (event) => {
    console.error("Database error: ");
  };

  // handle the success event
  request.onsuccess = (event) => {
    const db = event.target.result;

    //insert contacts
    insertContact(db, {
      name: "Punjab",
      creadedDate: Date.now(),
      updatedDate: Date.now(),
    });
    insertContact(db, {
      name: "Haryana",
      creadedDate: Date.now(),
      updatedDate: Date.now(),
    });
    insertContact(db, {
      name: "Chandigarh",
      creadedDate: Date.now(),
      updatedDate: Date.now(),
    });

    // insertContact(db, {
    //     email: 'jane.doe@gmail.com',
    //     firstName: 'Jane',
    //     lastName: 'Doe'
    // });

    // get contact by id 1
    // getContactById(db, 1);

    // get contact by email
    // getContactByEmail(db, 'jane.doe@gmail.com');

    // get all contacts
    // getAllContacts(db);

    //deleteContact(db, 1);
  };

  function insertContact(db, contact) {
    // create a new transaction
    const txn = db.transaction("States", "readwrite");

    // get the Contacts object store
    const store = txn.objectStore("States");
    //
    let query = store.put(contact);

    // handle success case
    query.onsuccess = function (event) {
      console.log("Successful insert");
    };

    // handle the error case
    query.onerror = function (event) {
      console.log("Could not insert");
    };

    // close the database once the
    // transaction completes
    txn.oncomplete = function () {
      db.close();
    };
  }

  function getContactById(db, id) {
    const txn = db.transaction("Visitors", "readonly");
    const store = txn.objectStore("Visitors");

    let query = store.get(id);

    query.onsuccess = (event) => {
      if (!event.target.result) {
        console.log(`The contact with ${id} not found`);
      } else {
        console.table(event.target.result);
      }
    };

    query.onerror = (event) => {
      console.log(event.target.errorCode);
    };

    txn.oncomplete = function () {
      db.close();
    };
  }

  function getContactByEmail(db, email) {
    const txn = db.transaction("Visitors", "readonly");
    const store = txn.objectStore("Visitors");

    // get the index from the Object Store
    const index = store.index("email");
    // query by indexes
    let query = index.get(email);

    // return the result object on success
    query.onsuccess = (event) => {
      console.table(query.result); // result objects
    };

    query.onerror = (event) => {
      console.log(event.target.errorCode);
    };

    // close the database connection
    txn.oncomplete = function () {
      db.close();
    };
  }

  function getAllContacts(db) {
    const txn = db.transaction("Visitors", "readonly");
    const objectStore = txn.objectStore("Visitors");

    objectStore.openCursor().onsuccess = (event) => {
      let cursor = event.target.result;
      if (cursor) {
        let contact = cursor.value;
        console.log(contact);
        // continue next record
        cursor.continue();
      }
    };
    // close the database connection
    txn.oncomplete = function () {
      db.close();
    };
  }

  function deleteContact(db, id) {
    // create a new transaction
    const txn = db.transaction("Visitors", "readwrite");

    // get the Contacts object store
    const store = txn.objectStore("Visitors");
    //
    let query = store.delete(id);

    // handle the success case
    query.onsuccess = function (event) {
      console.log(event);
    };

    // handle the error case
    query.onerror = function (event) {
      console.log(event.target.errorCode);
    };

    // close the database once the
    // transaction completes
    txn.oncomplete = function () {
      db.close();
    };
  }
});

// Searching Example
// https://itnext.io/searching-in-your-indexeddb-database-d7cbf202a17
//https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
// https://www.raymondcamden.com/2012/08/10/Searching-for-array-elements-in-IndexedDB
