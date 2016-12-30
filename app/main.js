const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const ipc = require('electron').ipcMain
const Datastore = require('nedb')
const moment = require('moment')
const json2csv = require('json2csv')
const fs = require('fs')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let child
let saleSetting

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({width: 800, height: 600, frame: true})
    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, './html/index.html'),
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
        height: 580,
        frame: true,
        parent: win,
        modal: true,
        alwaysOnTop: true,
        show: false
    })
    child.loadURL(url.format({
        pathname: path.join(__dirname, './html/show.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Create detail view (modal box) that holds the confirmation page
    saleSetting = new BrowserWindow({
        width: 600,
        height: 560,
        frame: true,
        parent: win,
        modal: true,
        alwaysOnTop: true,
        show: true
    })
    saleSetting.loadURL(url.format({
        pathname: path.join(__dirname, './html/saleSetting.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Transit for setting clubName
    ipc.on('setClubName-toggle', function(event, arg) {
        var id = arg;
        if (saleSetting.isVisible()) {
            saleSetting.hide()
            win.webContents.send('setClubName', id)
        } else {
            saleSetting.show()
            saleSetting.webContents.send('changeClubName', id)
        }
    })

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

// TODO:  Change to load to an external file, load into google sheets api

function runDatabase() {
    var dbPath = path.join(__dirname, './db/records.json');
    var db = new Datastore({filename: dbPath, autoload: true});
    db.count({}, function (err, count) {
      // test if db working
      console.log(count, 'items');
    });
    ipc.on('saveToDB', function(event, data) {
        child.hide()
        var newItem = {
          clubName: data['club'],
          id: data['id'],
          amount: data['amount'],
          date_created: moment().format('MMMM Do YYYY, h:mm:ss a')
        }
        db.insert(newItem, function(err, doc) {
            console.log('Inserted $', doc.amount, 'for ', doc.clubName, ' by ', doc.id)
        })
        win.webContents.send('clear')
    })
    ipc.on('export-request', (event) => {
      console.log('received request, now exporting');
      db.find({}, function (err, docs) {
        var fields = ['clubName', 'id', 'amount', 'date_created', '_id']
        var data = docs
        var csv = json2csv({data: data, fields: fields})
        console.log(csv)
        win.webContents.send('parsed-csv', csv);
      });
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
    createWindow()
    runDatabase()
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
