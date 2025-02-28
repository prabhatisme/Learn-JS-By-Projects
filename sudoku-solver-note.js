const { log } = require("console");

let board = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

function isValid(board, row, col, num){
    for(let x=0; x<9; x++){
        if(board[row][x]===num) return false;
    }
    for(let x=0; x<9; x++){
        if(board[x][col]===num) return false;
    }

    let startRow = Math.floor(row/3) *3;
    let startCol = Math.floor(col/3) *3;
    for(let i=0; i<3; i++){
        for(let j=0; j<3; j++){
            if(board[startRow+i][startCol+j]===num) return false;
        }
    }
    return true;    
}

function solveSudoku(board){
    for(let row=0; row<9; row++){
        for(let col=0; col<9; col++){
            if(board[row][col]===0){
                for(let num=1; num<=9; num++){
                    if(isValid(board, row, col, num)){
                        board[row][col] = num;
                        if(solveSudoku(board)) return true; //solve
                        board[row][col] = 0; //backtrack
                    }
                }
                return false;            
            }
        }
    }
    return true;
}



let solved = solveSudoku(board);

if (solved) {
    board.forEach(row => console.log(row.join(" ")));
} else {
    console.log("No solution exists.");
}
