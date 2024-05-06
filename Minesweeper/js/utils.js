'use strict'

function buildBoard(size, gBoard) {
    for (var x = 0; x < size; x++) {
        var row = []
        for (var y = 0; y < size; y++) {
            row.push({ ...gBoard })
        }
        board.push(row)
    }

    console.log(board)
    return board
}




