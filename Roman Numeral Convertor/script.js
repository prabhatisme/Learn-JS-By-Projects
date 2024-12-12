const form = document.getElementById('form');
const convertButton = document.getElementById('convert-btn');
const output = document.getElementById('output');

// Roman numeral mapping
const romanMapping = [
    { value: 1000, numeral: "M" },
    { value: 900, numeral: "CM" },
    { value: 500, numeral: "D" },
    { value: 400, numeral: "CD" },
    { value: 100, numeral: "C" },
    { value: 90, numeral: "XC" },
    { value: 50, numeral: "L" },
    { value: 40, numeral: "XL" },
    { value: 10, numeral: "X" },
    { value: 9, numeral: "IX" },
    { value: 5, numeral: "V" },
    { value: 4, numeral: "IV" },
    { value: 1, numeral: "I" },
  ];
  
  // console.log(romanMapping.length);
  // Function to convert number to Roman numeral
  function convertToRoman(num) {
    let roman = '';
    for (let i = 0; i < romanMapping.length; i++) {
      while (num >= romanMapping[i].value) {
        roman += romanMapping[i].numeral;
        num -= romanMapping[i].value;
      }
    }
    return roman;
  }
  
  // Validation and conversion on button click
  convertButton.addEventListener('click', function() {
    const input = document.getElementById('number').value;
    const outputDiv = output;
  
    // Validate the input
    const number = parseInt(input, 10);
  
    if (isNaN(number)) {
      outputDiv.innerText = 'Please enter a valid number.';
    } else if (number <= 0) {
      outputDiv.innerText = 'Please enter a positive number greater than 0.';
    } else if (number > 3999) {
      outputDiv.innerText = 'Please enter a number less than or equal to 3999.';
    } else {
      // Convert number to Roman numeral and display result
      const romanNumeral = convertToRoman(number);
      outputDiv.innerText = `${romanNumeral}`;
    }
  });