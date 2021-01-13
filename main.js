const { app, BrowserWindow, session,shell } = require('electron');
const path = require('path');
const url = require('url');
const contextMenu = require('electron-context-menu');
app.dock.bounce()


contextMenu({
	prepend: (defaultActions, params, browserWindow) => [
		{
			label: 'Open Link',
			// Only show it when right-clicking text
      //visible: params.selectionText.trim().length > 0,
      visible: params.linkURL.length !== 0 && params.mediaType === 'none',
			click: () => {
        console.log(params.selectionText);
        shell.openExternal(params.selectionText);
			}
		}
	]
});


function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'assets/icon.icns'),
    title: "Google Calendar Desktop",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      spellcheck: true
    }
  })
  win.loadURL('https://calendar.google.com');
  win.webContents.on("new-window", (event, url) => {
    try {
      shell.openExternal(url);
      event.preventDefault();
    } catch (error) {
       console.log("Ignoring " + url + " due to " + error.message);
    }
  });

}

function changeDayIcon(i) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  app.dock.setIcon(path.join(__dirname, 'assets/icons/png/calendar_'+date+'.png'))

  setTimeout(() => {
      changeDayIcon(++i);
  }, 30*1000*10)
}
changeDayIcon(1);

app.disableHardwareAcceleration()
app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

const dispose = contextMenu();

dispose();