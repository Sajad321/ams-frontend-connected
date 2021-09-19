// ./build_installer.js

// 1. Import Modules
const { MSICreator } = require("electron-wix-msi");
const path = require("path");

// 2. Define input and output directory.
// Important: the directories must be absolute, not relative e.g
// appDirectory: "C:\\Users\sdkca\Desktop\OurCodeWorld-win32-x64",
const APP_DIR = path.resolve(
  __dirname,
  "./build/accounts-and-attendance-managment-system-win32-x64"
);
// outputDirectory: "C:\\Users\sdkca\Desktop\windows_installer",
const OUT_DIR = path.resolve(__dirname, "./windows_installer");

// 3. Instantiate the MSICreator
const msiCreator = new MSICreator({
  appDirectory: APP_DIR,
  outputDirectory: OUT_DIR,

  // Configure metadata
  description:
    "System for managing the attendance and accounts for students according to QR code",
  exe: "accounts-and-attendance-managment-system.exe",
  name: "Accounts and Attendance Management System Desktop App",
  manufacturer: "BeSmarty Inc",
  version: "1.3.0",
  shortcutName: "AAMS",

  // Configure installer User Interface
  ui: {
    chooseDirectory: true,
  },
});

// 4. Create a .wxs template file
msiCreator.create().then(function () {
  // Step 5: Compile the template to a .msi file
  msiCreator.compile();
});
