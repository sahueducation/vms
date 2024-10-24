const { contextBridge, ipcRenderer } = require("electron/renderer");

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

ipcRenderer.on("visiter_phone", (_event, value) => {
  document.getElementById("visitorId").value = value;
});
