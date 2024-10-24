// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

const createWindow = (fName) => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 800,
    icon: path.join(__dirname, "assets/img/icons/mac/icon.icns"),
    title: "Visitors",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(fName);

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

ipcMain.on("set-user-credentials", (event, status) => {
  if (status == "success") {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.close();
    createWindow("index.html");
  } else {
    event.reply(
      "error-message",
      "Login Failed, Username and/or Password is invalid"
    );
  }
});

ipcMain.on("set-new-visitor", (event, value) => {
  const webContents = event.sender;
  const pWin = BrowserWindow.fromWebContents(webContents);
  const child = new BrowserWindow({
    parent: pWin,
    modal: true,
    show: false,
    width: 1100,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "new-visitor-preload.js"),
    },
  });
  child.loadFile("new-visitor.html");
  child.once("ready-to-show", () => {
    child.show();
  });

  let wc = child.webContents;
  if (value != "y") {
    wc.send("visiter_phone", value);
  }
  wc.openDevTools({ mode: "undocked" });
});

ipcMain.on("set-conf", (event, data) => {
  if (
    data == "master" ||
    data == "managedb" ||
    data == "staff" ||
    data == "operator" ||
    data == "visitors"
  ) {
    const webContents = event.sender;
    const pWin = BrowserWindow.fromWebContents(webContents);
    const child = new BrowserWindow({
      parent: pWin,
      modal: true,
      show: false,
      width: 1100,
      height: 800,
      webPreferences: {
        preload: path.join(__dirname, data + "-preload.js"),
      },
    });
    child.loadFile(data + ".html");
    child.once("ready-to-show", () => {
      child.show();
    });

    let wc = child.webContents;
    wc.openDevTools({ mode: "undocked" });
  }
});

ipcMain.on("set-reports", (event, data) => {
  const webContents = event.sender;
  const pWin = BrowserWindow.fromWebContents(webContents);
  const child = new BrowserWindow({
    parent: pWin,
    modal: true,
    show: false,
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "reports-preload.js"),
    },
  });
  child.loadFile("reports.html");
  child.once("ready-to-show", () => {
    child.show();
  });

  let wc = child.webContents;
  //wc.openDevTools({ mode: "undocked" });
  wc.send("report-type", data);
});

ipcMain.on("set-logout", (event, data) => {
  if (data == "y") {
    app.quit();
  }
});

ipcMain.on("quite-window", (event, data) => {
  if (data == "y") {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.close();
  } else {
    event.reply("error-message", "Window can't be closed");
  }
});

ipcMain.on("read-config", (event) => {
  let data = readConfData();
  event.sender.send("read-config-success", data);
});

ipcMain.on("save-config", (event, d) => {
  saveConfData("contents", d);
  //event.sender.send("read-config-success", data);
});

function readConfData(p) {
  let res = fs.existsSync("data/config.json");
  let data;

  if (res) {
    let dt = fs.readFileSync("data/config.json");
    data = JSON.parse(dt);
  }
  if (data[p]) {
    data = data[p];
  }
  return data;
}

function saveConfData(p, d) {
  //Read the data
  let res = fs.existsSync("data/config.json");
  let data;

  if (res) {
    let dt = fs.readFileSync("data/config.json");
    data = JSON.parse(dt);
    data[p] = d;
    console.log(data);
  }

  let sData = JSON.stringify(data);
  fs.writeFileSync("data/config.json", sData);
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow("login.html");
  //createWindow("index.html");

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow("index.html");
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
