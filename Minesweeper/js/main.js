'use strict'

var board = []
var mineLocation = []
var cellsToRevile = []
var cellsToRevile2 = []
var gBoard = {
    minesAroundCount: 0,
    isShown: false,
    mine: false,
    isMarked: true
}

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var squares = 'squares'

function onInit() {
    buildBoard(8, gBoard)
    createMines(board)
    mineNearCellCaount(board)
    renderBoard()
    hideBoard()
    cellClicked()
    // handleCellClick()
}


function renderBoard() {
    var tbl = document.createElement("table")
    var tblBody = document.createElement("tbody")
    for (let i = 0; i < board.length; i++) {
        var row = document.createElement("tr")
        for (let j = 0; j < board[i].length; j++) {
            var cell = document.createElement("td")
            let cellText
            if (board[i][j].mine === true) {
                cellText = document.createTextNode('💣')
            }
            else {
                cellText = document.createTextNode(` ${board[i][j].minesAroundCount}`)
            }

            cell.appendChild(cellText)
            row.appendChild(cell)
        }
        tblBody.appendChild(row)
    }
    tbl.appendChild(tblBody)
    document.body.appendChild(tbl)
    tbl.setAttribute("border", "2")

}
function hideBoard() {
    var cells = document.querySelectorAll("td")
    cells.forEach(function (cell) {
        cell.classList.add("covered")
        console.log('board is cover')
    })
}

function createMines(board) {
    var size = board.length
    var numMines = Math.floor((size * size) / 4.5)
    var placedMines = 0

    while (placedMines < numMines) {
        var x = Math.floor(Math.random() * size)
        var y = Math.floor(Math.random() * size)

        if (!board[x][y].mine) {
            board[x][y].mine = true
            mineLocation.push(({ x: x, y: y }))
            placedMines++

        }
    }
    console.log('mine are set')
}
console.log(mineLocation)


function cellClicked() {
    console.log('cell cliked work')
    var cells = document.querySelectorAll("td")
    cells.forEach(cell => {
        cell.addEventListener("click", (event) => {
            if (cell.classList.contains('covered')) {
                var row = cell.parentNode.rowIndex
                var col = cell.cellIndex
                if (!board[row][col].mine && board[row][col].minesAroundCount === 0) {
                    cellsToRevile.push([row, col])
                    onClickShowEmptyCells([row, col])
                }
                cell.classList.remove('covered')
                console.log(`you clicked on ${row}, ${col}`)
                console.log(cellsToRevile2)
                removeCellCover()


            }
            if (cell.textContent === '💣') {
                console.log(' you loose')
                revealAllBombs()
            }
        })
    })
}

function revealAllBombs() {
    var cells = document.querySelectorAll("td")
    cells.forEach(cell => {
        if (cell.textContent === '💣') {
            cell.classList.remove('covered')
        }
    })
}

function mineNearCellCaount(board) {
    var size = board.length
    // var directions = [
    //     [-1, -1], [-1, 0], [-1, 1],
    //     [0, -1], /*💣*/  [0, 1],
    //     [1, -1],  [1, 0],  [1, 1]
    // ]
    //store the mine location
    for (var i = 0; i < mineLocation.length; i++) {
        var mine = mineLocation[i]
        var x = mine.x
        var y = mine.y
        for (var directionsI = -1; directionsI <= 1; directionsI++) {
            for (var directionsj = -1; directionsj <= 1; directionsj++) {
                var newX = x + directionsI
                var newY = y + directionsj
                if (newX >= 0 && newX < size && newY >= 0 && newY < size && !board[newX][newY].mine) {
                    board[newX][newY].minesAroundCount++
                }
            }

        }
    }
    console.log('mineNearCellCaount work')
}

function onClickShowEmptyCells(clicked) {
    var size = board.length
    var x = clicked[0]
    var y = clicked[1]
    console.log('on click start')
    if (!board[x][y].isShown)
        for (var i = -1; i <= 1; i++)
            for (var j = -1; j <= 1; j++) {
                var newX = parseInt(x) + i
                var newY = parseInt(y) + j

                if (newX >= 0 && newX < size && newY >= 0 && newY < size) {
                    var neighborCell = board[newX][newY]

                    if (!neighborCell.isShown && neighborCell.minesAroundCount === 0) {
                        neighborCell.isShown = true
                        cellsToRevile2.push([newX, newY])
                        console.log('cell number to new aray')
                        onClickShowEmptyCells([newX, newY])
                    }
                }
            }
}


function removeCellCover() {
    console.log('cells to revile work')
    for (var i = 0; i < cellsToRevile2.length; i++) {
        var cellCoords = cellsToRevile2[i]
        var x = cellCoords[0]
        var y = cellCoords[1]
        var cell = document.querySelector(`tr:nth-child(${x + 1}) td:nth-child(${y + 1})`)
        cell.classList.remove('covered')
    }

}