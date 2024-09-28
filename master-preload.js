const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electronAPI", {
  quiteWindow: (b) => ipcRenderer.send("quite-window", b),
  saveContents: (d) => ipcRenderer.send("save-config", d),
  readFile: () => {
    ipcRenderer.send("read-config");
    return new Promise((resolve) =>
      ipcRenderer.once("read-config-success", (event, data) =>
        resolve({ event, data })
      )
    );
  },
});
