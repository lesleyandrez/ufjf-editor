const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron')
const windowStateKeeper = require('electron-window-state')
const Store = require('electron-store');
const fs = require('fs')

let mainWindow;
const store = new Store();
const isMac = process.platform === 'darwin'

const template = [
    // { role: 'appMenu' }
    ...(isMac ? [{
        label: app.name,
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    }] : []),
    // { role: 'fileMenu' }
    {
        label: 'File',
        submenu: [
            isMac ? { role: 'close' } : { role: 'quit' },
            {
                label: 'New',
                accelerator: 'CmdOrCtrl+N',
                click() {
                    console.log('New...')
                    mainWindow.webContents.send('new');
                },
            },
            {
                label: 'Open',
                accelerator: 'CmdOrCtrl+O',
                click() {
                    console.log('Open...')
                },
            },
            {
                label: 'Save',
                accelerator: 'CmdOrCtrl+S',
                click() {
                    console.log('Save...')
                    saveFile()
                },
            },
            {
                label: 'Save As',
                accelerator: 'CmdOrCtrl+Shift+S',
                click() {
                    console.log('Save As...')
                },
            }
        ]
    },
    // { role: 'editMenu' }
    {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            ...(isMac ? [
                { role: 'delete' },
                { role: 'selectAll' },
                { type: 'separator' },
                {
                    label: 'Speech',
                    submenu: [
                        { role: 'startSpeaking' },
                        { role: 'stopSpeaking' }
                    ]
                }
            ] : [
                { role: 'delete' },
                { type: 'separator' },
                { role: 'selectAll' }
            ])
        ]
    },
    // { role: 'viewMenu' }
    {
        label: 'View',
        submenu: [
            { type: 'separator' },
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    // { role: 'windowMenu' }
    {
        label: 'Window',
        submenu: [
            { role: 'minimize' },
            { role: 'zoom' },
            ...(isMac ? [
                { type: 'separator' },
                { role: 'front' },
                { type: 'separator' },
                { role: 'window' }
            ] : [
                { role: 'close' }
            ])
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click: async () => {
                    const { shell } = require('electron')
                    await shell.openExternal('https://electronjs.org')
                }
            }
        ]
    }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

app.whenReady().then(async () => {
    let mainWindowState = windowStateKeeper({
        defaultWidth: 800,
        defaultHeight: 600
    });

    const state = store.get('is-always-on-top') || false;
    const win = new BrowserWindow({
        width: mainWindowState.width,
        height: mainWindowState.height,
        x: mainWindowState.x,
        y: mainWindowState.y,
        minWidth: 400,
        minHeight: 400,
        frame: false,
        show: false,
        alwaysOnTop: state,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })

    mainWindowState.manage(win)

    win.on('ready-to-show', () => {
        win.show()
        win.webContents.send('is-always-on-top', state)
    })

    await win.loadFile('index.html')

    // win.webContents.openDevTools()

    mainWindow = win
})

ipcMain.on('toggle-pin', () => {
    mainWindow.setAlwaysOnTop(!mainWindow.isAlwaysOnTop())
    const state = mainWindow.isAlwaysOnTop()
    store.set('is-always-on-top', state)
    mainWindow.webContents.send('is-always-on-top', state)
})

ipcMain.on('close', () => {
    console.log('close main')
    mainWindow.close()
})

function getContent() {
    return new Promise((resolve) => {
        mainWindow.webContents.send('get-content');

        ipcMain.once('content', (event, content) => {
            resolve(content)
        })
    });
}

async function saveFile() {
    const response = await dialog.showSaveDialog(mainWindow, {
        name: 'Texts',
        extensions: ['txt']
    })

    const content = await getContent();

    if (response.canceled) return

    fs.writeFileSync(response.filePath, content, { encoding: 'utf-8' })
}
