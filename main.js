"use strict";

// Import parts of electron to use
const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const { download } = require("electron-dl");
// const messages = require("./messages.json");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, studentInfoWindow, loginWindow;

// Keep a reference for dev mode
let dev = false;

// Broken:
// if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
//   dev = true
// }

if (
  process.env.NODE_ENV !== undefined &&
  process.env.NODE_ENV === "development"
) {
  dev = true;
}

// Temporary fix broken high-dpi scale factor on Windows (125% scaling)
// info: https://github.com/electron/electron/issues/9691
// if (process.platform === "win32") {
//   app.commandLine.appendSwitch("high-dpi-support", "true");
//   app.commandLine.appendSwitch("force-device-scale-factor", "1");
// }

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    minWidth: 1280,
    minHeight: 720,
    fullscreenable: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar: true,
  });
  loginWindow = new BrowserWindow({
    minWidth: 600,
    minHeight: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar: true,
  });
  // and load the index.html of the app.
  let indexPath, studentInfoPath, loginPath;

  if (dev && process.argv.indexOf("--noDevServer") === -1) {
    indexPath = url.format({
      protocol: "http:",
      host: "localhost:8080",
      pathname: "index.html",
      slashes: true,
    });
    loginPath = url.format({
      protocol: "http:",
      host: "localhost:8080",
      pathname: "index.html",
      hash: "#login",
      slashes: true,
    });
  } else {
    indexPath = url.format({
      protocol: "file:",
      pathname: path.join(__dirname, "dist", "index.html"),
      slashes: true,
    });
    loginPath = url.format({
      protocol: "file:",
      pathname: path.join(__dirname, "dist", "index.html"),
      hash: "#login",
      slashes: true,
    });
  }

  loginWindow.loadURL(loginPath);
  mainWindow.loadURL(indexPath);

  // Don't show until we are ready and loaded
  mainWindow.once("ready-to-show", () => {
    loginWindow.show();

    // const template = [
    //   {
    //     label: "demo",
    //     submenu: [
    //       {
    //         label: "demo1",
    //       },
    //     ],
    //   },
    // ];
    // const menu = Menu.buildFromTemplate(template);
    // Menu.setApplicationMenu(false);
    // Menu.setApplicationMenu(menu);
    // Open the DevTools automatically if developing
    if (dev) {
      const {
        default: installExtension,
        REACT_DEVELOPER_TOOLS,
      } = require("electron-devtools-installer");

      installExtension(REACT_DEVELOPER_TOOLS).catch((err) =>
        console.log("Error loading React DevTools: ", err)
      );
      // mainWindow.webContents.openDevTools();
    }
    // ipcMain.on("show-student-info", (event, args) => {
    //   if (studentInfoWindow != null) {
    //     studentInfoWindow.close();
    //     studentInfoWindow = null;
    //   }
    //   studentInfoWindow = new BrowserWindow({
    //     minWidth: 600,
    //     minHeight: 600,
    //     show: false,
    //     frame: false,
    //     webPreferences: {
    //       nodeIntegration: true,
    //       contextIsolation: false,
    //     },
    //     autoHideMenuBar: true,
    //   });
    //   console.log(args[0]);
    //   studentInfoPath = () => {
    //     if (dev && process.argv.indexOf("--noDevServer") === -1) {
    //       return url.format({
    //         protocol: "http:",
    //         host: "localhost:8080",
    //         pathname: "index.html",
    //         hash: `#sai/${args[0]}`,
    //         slashes: true,
    //       });
    //     } else {
    //       return url.format({
    //         protocol: "file:",
    //         pathname: path.join(__dirname, "dist", "index.html"),
    //         hash: `#sai/${args[0]}`,
    //         slashes: true,
    //       });
    //     }
    //   };
    //   studentInfoWindow.loadURL(studentInfoPath());

    //   studentInfoWindow.show();
    // });
    // ipcMain.on("abort-student-attendance", () => {
    //   studentInfoWindow.hide();
    //   mainWindow.focus();
    //   mainWindow.webContents.send("aborted");
    // });
    // ipcMain.on("accept-student-attendance", (event, args) => {
    //   studentInfoWindow.hide();
    //   mainWindow.focus();
    //   console.log(args);
    //   event.sender.send("accepted", [args[0]]);
    //   // event.reply("accepted", [args[0]]);
    //   // messages.student_attendance_id = args[0];
    //   // messages.accepted = true;
    // });
    ipcMain.on("login", () => {
      mainWindow.hide();
      loginWindow.show();
      loginWindow.focus();
    });
    ipcMain.on("finished-login", () => {
      loginWindow.hide();
      mainWindow.show();
      mainWindow.maximize();
      mainWindow.focus();
    });
  });
  // Emitted when the window is closed.
  mainWindow.on("closed", function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    studentInfoWindow = null;
    app.quit();
  });
  loginWindow.on("closed", function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    studentInfoWindow = null;
    app.quit();
  });
}

ipcMain.on("download-button", (event, info) => {
  const win = BrowserWindow.getFocusedWindow();
  download(win, info, { saveAs: true })
    .then((dl) => console.log("Finished Download"))
    .catch((error) => console.log(error.message));
});
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
