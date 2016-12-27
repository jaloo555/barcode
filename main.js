const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const ipc = require('electron').ipcMain

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let child
function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({width: 800, height: 600, frame: true})

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, './index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })

    // Create detail view (modal box) that holds the confirmation page
    child = new BrowserWindow({
        width: 600,
        height: 400,
        frame: true,
        parent: win,
        modal: true,
        alwaysOnTop: true,
        show: false
    })
    child.loadURL(url.format({
        pathname: path.join(__dirname, './show.html'),
        protocol: 'file:',
        slashes: true
    }))

    prefPane = new BrowserWindow({
      width: 600,
      height: 400,
      frame: true,
      parent: win,
      modal: true,
      alwaysOnTop: true,
      show: false
    })

    prefPane.loadURL(url.format({
      pathname: path.join(__dirname, './pref.html'),
      protocol: 'file:',
      slashes: true
    }))

    // Transit for data between parent and child
    ipc.on('scannedId', function(event, arg) {
        child.show()
        var id = arg;
        child.webContents.send('scannedId', id)
    })

    ipc.on('cancel-action', function() {
        child.hide()
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
    createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
