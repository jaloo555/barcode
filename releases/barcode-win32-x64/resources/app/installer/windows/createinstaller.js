const createWindowsInstaller = require('electron-winstaller')
const path = require('path')
const rootPath = path.join('./')
const outPath = path.join(rootPath, 'releases')

resultPromise = createWindowsInstaller.createWindowsInstaller({
      appDirectory: path.join(outPath, 'barcode-win32-x64'),
      authors: 'Jason Chen',
      noMsi: true,
      outputDirectory: path.join(outPath, 'windows-installer'),
      exe: 'barcode.exe'
});

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));
