const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electronAPI", {
  setLoginCredentials: (credentials) =>
    ipcRenderer.send("set-user-credentials", credentials),
  setNewVisitor: (b) => ipcRenderer.send("set-new-visitor", b),
  setLogout: (b) => ipcRenderer.send("set-logout", b),
  setConf: (b) => ipcRenderer.send("set-conf", b),
  setReports: (b) => ipcRenderer.send("set-reports", b),
  readFile: () => {
    ipcRenderer.send("read-config");
    return new Promise((resolve) =>
      ipcRenderer.once("read-config-success", (event, data) =>
        resolve({ event, data })
      )
    );
  },
});

ipcRenderer.on("error-message", (_event, arg) => {
  document.getElementById("errorMessagePlaceholder").innerText = arg;
  document.getElementById("loginForm").reset();
});
