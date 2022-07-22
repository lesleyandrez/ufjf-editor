const { ipcRenderer } = require('electron')

const $btnClose = document.getElementById('close')
const $btnTogglePin = document.getElementById('toggle-pin')
const $textEditor = document.getElementById('text-editor')

$textEditor.value = localStorage.getItem('content')
$textEditor.oninput = () => {
    localStorage.setItem('content', $textEditor.value)
}

$btnClose.onclick = () => {
    console.log('close renderer')
    ipcRenderer.send('close')
}

$btnTogglePin.onclick = () => {
    ipcRenderer.send('toggle-pin')
}

ipcRenderer.on('is-always-on-top', (event, isAlwaysOnTop) => {
    console.log('isAlwaysOnTop', isAlwaysOnTop)

    if (isAlwaysOnTop) {
        $btnTogglePin.innerText = 'Fixado'
    } else {
        $btnTogglePin.innerText = 'Normal'
    }
})

ipcRenderer.on('new', () => {
    $textEditor.value = ''
})

ipcRenderer.on('get-content', () => {
    ipcRenderer.send('content', $textEditor.value)
})

