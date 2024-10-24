const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electronAPI", {
  quiteWindow: (b) => ipcRenderer.send("quite-window", b),
  setNewVisitor: (b) => ipcRenderer.send("set-new-visitor", b),
  readFile: () => {
    ipcRenderer.send("read-config");
    return new Promise((resolve) =>
      ipcRenderer.once("read-config-success", (event, data) =>
        resolve({ event, data })
      )
    );
  },
});
