`use strict`
const boardContainer = document.getElementById('board')


var mineLocetion = []
var board = []
var cellData = {
    minesAroundCount: 0,
    isShown: false,
    isMine: false,
    isMarked: false
}

var gLevel = {
    SIZE: 4,
    MINES: 2,
}

var gGame = {
    isOn: true,
    shownCount: 0,
    flagCount: 0,
    secsPassed: 0
}

function onInit() {
    buildBoard(gLevel.SIZE, cellData)
    setMineLocetion(gLevel.MINES, board)
    setMinesNegsCount(mineLocetion)
    renderBoard(board)
}
function resetGame() {
    boardContainer.innerHTML = ''
    mineLocetion = []
    board = []
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.flagCount = 0
    gGame.secsPassed = 0
    stopTimer()
    onInit()
}

function setLevel(size, mines) {
    gLevel.SIZE = size
    gLevel.MINES = mines
    var elTimer = document.getElementById('timer')
    elTimer.textContent = '00:00'
    resetGame()
}

function expandShown(board, row, col) {
    if (row < 0 || row >= board.length || col < 0 || col >= board[0].length || board[row][col].isShown) {
        return
    }

    const cell = board[row][col]
    if (cell.isMarked) {
        cell.isMarked = false
        gGame.flagCount++
        updateFlagCount()
    } else {
        cell.isShown = true
        gGame.shownCount++
    }

    if (cell.minesAroundCount === 0) {
        const directions = [
            { x: -1, y: -1 }, { x: -1, y: 0 }, { x: -1, y: 1 },
            { x: 0, y: -1 }, { x: 0, y: 1 },
            { x: 1, y: -1 }, { x: 1, y: 0 }, { x: 1, y: 1 }
        ]

        directions.forEach(dir => {
            const newRow = row + dir.x
            const newCol = col + dir.y
            expandShown(board, newRow, newCol)
        })
    }

    renderBoard(board)
}



function renderBoard(board) {
    boardContainer.innerHTML = ''
    const table = document.createElement('table')
    console.log('render board start')
    for (let row = 0; row < board.length; row++) {
        const tr = document.createElement('tr')
        for (let col = 0; col < board[row].length; col++) {
            const td = document.createElement('td')
            td.classList.add('cell')
            if (board[row][col].isMarked) {
                td.classList.add('flag')
            }
            td.addEventListener('click', function (event) {
                onCellClicked(row, col, event)
                audio.play()
            })
            td.addEventListener('contextmenu', function (event) {
                event.preventDefault()
                onCellClicked(row, col, event)
            })
            var cell = board[row][col]
            if (board[row][col].isShown) {
                if (board[row][col].isMine) {
                    td.textContent = "💣"
                } else {
                    td.textContent = cell.minesAroundCount
                }
            }
            console.log('set mines and numbers')
            tr.appendChild(td)
        }
        table.appendChild(tr)
    }
    boardContainer.appendChild(table)
}



function setMinesNegsCount(mineLocations) {
    var nMine = mineLocations.length
    var mlocetionCheck = 0
    while (mlocetionCheck < nMine) {
        for (let i = 0; i < nMine; i++) {
            var x = mineLocations[i][0]
            var y = mineLocations[i][1]
            console.log(`mine faund in ${mineLocations[i]}`)
            for (let row = -1; row <= 1; row++) {
                for (let colum = -1; colum <= 1; colum++) {
                    var newRow = x + row
                    var newCol = y + colum
                    if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board[0].length && !board[newRow][newCol].isMine)
                        board[newRow][newCol].minesAroundCount++
                    mlocetionCheck++

                }
            }

        }
    }
}

function buildBoard(SIZE, cellData) {
    for (let i = 0; i < SIZE; i++) {
        const row = []
        for (let j = 0; j < SIZE; j++) {
            row.push({ ...cellData })
        }
        board.push(row)
    }
    return board
}


function setMineLocetion(nMine, board) {
    var mineSets = 0
    while (mineSets < nMine) {
        const x = Math.floor(Math.random() * board.length) //row
        const y = Math.floor(Math.random() * board[0].length) // colum
        if (!board[x][y].isMine) {
            board[x][y].isMine = true
            mineLocetion.push([x, y])
            mineSets++
        }
        console.log('mine locetion set')
        gGame.flagCount = mineSets
    }
}

function onCellClicked(row, col, event) {
    if (gGame.isOn) {
        startTimer()
        updateMessage(`Good Luck! 🧚 🧚🏾 🧚`)
        var cell = board[row][col]
        // Right-click (to mark/unmark)
        if (event.button === 2) {
            if (!cell.isShown) {
                if (cell.isMarked) {
                    cell.isMarked = false
                    gGame.flagCount++
                } else if (gGame.flagCount > 0) {
                    cell.isMarked = true
                    gGame.flagCount--
                }
                updateFlagCount()
                renderBoard(board)
            }
            event.preventDefault()
            return
        }
        if (!cell.isShown) {
            if (cell.minesAroundCount === 0) {
                expandShown(board, row, col)
                checkWinLoose(cell)
            } else {
                cell.isShown = true
                gGame.shownCount++
                renderBoard(board)
                checkWinLoose(cell)
            }
        }
    }
}



function checkWinLoose(clickedCell) {
    if (clickedCell.isMine) {
        updateMessage('game over you click a mine! 🥺')
        stopTimer()
        for (let i = 0; i < mineLocetion.length; i++) {
            var x = mineLocetion[i][0]
            var y = mineLocetion[i][1]
            board[x][y].isShown = true
            // Remove flag if bomb is revealed
            if (board[x][y].isMarked) {
                board[x][y].isMarked = false
                gGame.flagCount++
            }
            console.log(board[x][y].isShown)
        }
        gGame.isOn = false
        renderBoard(board)
        gGame.isOn = false
    }
    if (gGame.shownCount === (board.length * board[0].length) - mineLocetion.length) {
        updateMessage(`you win 😊 🥰 💘`)
        stopTimer()
        gGame.isOn = false
    }
}

function updateFlagCount() {
    var flagCounter = document.getElementById('flagCounter')
    flagCounter.textContent = gGame.flagCount
}

function updateMessage(message) {
    var messageElement = document.getElementById('message')
    messageElement.textContent = message
}
var isTimerRunning = false
let gTimer
function startTimer() {
    if (!isTimerRunning) {
        isTimerRunning = true
        var start = Date.now()
        var elTimer = document.getElementById('timer')
        gTimer = setInterval(function () {
            const diff = Date.now() - start
            const secs = parseInt(diff / 1000)
            const minutes = Math.floor(secs / 60)
            const seconds = secs % 60
            const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            elTimer.textContent = formattedTime
        }, 1000)
    }
}

function stopTimer() {
    clearInterval(gTimer)
    isTimerRunning = false
}
const audio = new Audio("https://www.fesliyanstudios.com/play-mp3/387")
const buttons = document.querySelectorAll("button")

buttons.forEach(button => {
    button.addEventListener("click", () => {
        audio.play()
    })
})

const changeBackgroundButton = document.getElementById('dark')
changeBackgroundButton.addEventListener('click', () => {
    document.body.style.backgroundImage = 'url("https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.wallpapersafari.com%2F58%2F35%2FYDXOl2.jpg&f=1&nofb=1&ipt=8175b18bcf37ed06db30c3deee3e8cf6ad4f2b7ef07afdd19648bc233d4e5abe&ipo=images")';
    const audio = new Audio('https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg');
    audio.play()
})

// function lifeMod() {
// var lifeLeft = getElementById("lifeMod")

// }