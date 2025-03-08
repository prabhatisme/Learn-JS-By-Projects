/**
1. Constraint Propagation (Rule-Based Approach)
•   Apply these rules iteratively:
1.	Elimination: If a number is already present in a row, column, or subgrid, remove it from possibilities.
2.	Single Possibility: If a cell has only one possibility left, fill it.
3.	Hidden Singles: If a number appears only once in the possibilities of a row, column, or subgrid, it must go there.
•	Repeat until the board is solved or no further progress can be made.
 */

function getPossibleValues(board, row, col) {
    let possible = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    // Remove numbers already in row
    for (let x = 0; x < 9; x++) {
        possible.delete(board[row][x]);
    }

    // Remove numbers already in column
    for (let x = 0; x < 9; x++) {
        possible.delete(board[x][col]);
    }

    // Remove numbers in the 3x3 subgrid
    let startRow = Math.floor(row / 3) * 3;
    let startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            possible.delete(board[startRow + i][startCol + j]);
        }
    }

    return Array.from(possible);
}

function solveSudokuWithLogic(board) {
    let changed = true;

    while (changed) {
        changed = false;

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    let possibleValues = getPossibleValues(board, row, col);
                    if (possibleValues.length === 1) {
                        board[row][col] = possibleValues[0];
                        changed = true;
                    }
                }
            }
        }
    }
}


/**
2. Backtracking (Search-Based Approach)

Rules- 
    •   Each row must contain the numbers 1-9 without repetition.
	•	Each column must contain the numbers 1-9 without repetition.
	•	Each 3x3 subgrid must contain the numbers 1-9 without repetition.

    •	Check if it violates Sudoku rules.
	•	If valid, move to the next empty cell.
	•	If stuck, backtrack to the previous cell and try a different number.
*/

function isValid(board, row, col, num) {
    // Check row
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num) return false;
    }

    // Check column
    for (let x = 0; x < 9; x++) {
        if (board[x][col] === num) return false;
    }

    // Check 3x3 subgrid
    let startRow = Math.floor(row / 3) * 3;
    let startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num) return false;
        }
    }

    return true;
}

function solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) { // Empty cell
                for (let num = 1; num <= 9; num++) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        if (solveSudoku(board)) return true; // Recursively solve
                        board[row][col] = 0; // Backtrack
                    }
                }
                return false; // No solution found, backtrack
            }
        }
    }
    return true; // Solved
}

// Example Sudoku board (0 represents empty spaces)
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

solveSudoku(board);
console.log(board); // Solved Sudoku board