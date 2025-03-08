"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;
    
    // Check if any required fields are missing
    if (!puzzle || !coordinate || !value) {
      return res.json({ error: "Required field(s) missing" });
    }
    
    // Check puzzle length
    if (puzzle.length !== 81) {
      return res.json({ error: "Expected puzzle to be 81 characters long" });
    }
    
    // Check for invalid characters in puzzle
    if (/[^0-9.]/g.test(puzzle)) {
      return res.json({ error: "Invalid characters in puzzle" });
    }
    
    // Validate coordinate format
    if (coordinate.length !== 2) {
      return res.json({ error: "Invalid coordinate" });
    }
    
    const row = coordinate[0];
    const column = coordinate[1];
    
    // Check if row is a letter from A to I (case insensitive)
    if (!/^[a-i]$/i.test(row)) {
      return res.json({ error: "Invalid coordinate" });
    }
    
    // Check if column is a number from 1 to 9
    if (!/^[1-9]$/.test(column)) {
      return res.json({ error: "Invalid coordinate" });
    }
    
    // Check if value is a number from 1 to 9
    if (!/^[1-9]$/.test(value)) {
      return res.json({ error: "Invalid value" });
    }
    
    // Check if the value is already placed at that coordinate
    const rowIndex = row.toUpperCase().charCodeAt(0) - 65; // A=0, B=1, ..., I=8
    const colIndex = parseInt(column) - 1;
    const index = rowIndex * 9 + colIndex;
    
    if (puzzle[index] === value) {
      return res.json({ valid: true });
    }
    
    // Validate placement
    let validCol = solver.checkColPlacement(puzzle, row, column, value);
    let validRow = solver.checkRowPlacement(puzzle, row, column, value);
    let validReg = solver.checkRegionPlacement(puzzle, row, column, value);
    
    if (validCol && validRow && validReg) {
      return res.json({ valid: true });
    } else {
      let conflicts = [];
      if (!validRow) {
        conflicts.push("row");
      }
      if (!validCol) {
        conflicts.push("column");
      }
      if (!validReg) {
        conflicts.push("region");
      }
      return res.json({ valid: false, conflict: conflicts });
    }
  });

  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;
    
    // Check if puzzle is missing
    if (!puzzle) {
      return res.json({ error: "Required field missing" });
    }
    
    // Check puzzle length
    if (puzzle.length !== 81) {
      return res.json({ error: "Expected puzzle to be 81 characters long" });
    }
    
    // Check for invalid characters in puzzle
    if (/[^0-9.]/g.test(puzzle)) {
      return res.json({ error: "Invalid characters in puzzle" });
    }
    
    let solvedString = solver.solve(puzzle);
    if (!solvedString) {
      return res.json({ error: "Puzzle cannot be solved" });
    } else {
      return res.json({ solution: solvedString });
    }
  });
};