const { contextBridge, ipcRenderer } = require("electron/renderer");

var reportType = "";

contextBridge.exposeInMainWorld("electronAPI", {
  quiteWindow: (b) => ipcRenderer.send("quite-window", b),
  readFile: () => {
    ipcRenderer.send("read-config");
    return new Promise((resolve) =>
      ipcRenderer.once("read-config-success", (event, data) =>
        resolve({ event, data })
      )
    );
  },
});

ipcRenderer.on("report-type", (_event, value) => {
  document.getElementById("report-type").value = value;
});
