const userInput = document.getElementById('text-input');
const checkPalindromeBtn = document.getElementById('check-btn');
const resultDiv = document.getElementById('result');

const checkForPalindrome = input => {
    const originalInput = input;
    if(input===''){
        alert('Please input a value');
        return;
    }

    resultDiv.replaceChildren();

    const lowerCaseStr = input.replace(/[^A-Za-z0-9]/gi, '').toLowerCase();
    // console.log(`input.replace(/[^A-Za-z0-9]/gi, '').toLowerCase()`);
    console.log(lowerCaseStr);
    let resultMsg = `<strong>${originalInput}</strong> ${
        lowerCaseStr === [...lowerCaseStr].reverse().join('') ? 'is' : 'is not'
      } a palindrome.`;
      console.log([...lowerCaseStr]);
    const pTag = document.createElement('p');
    pTag.className = 'user-input';

    pTag.innerHTML = resultMsg;
    resultDiv.appendChild(pTag);
  
    // Show the result.
    resultDiv.classList.remove('hidden');
} 

checkPalindromeBtn.addEventListener('click', () => {
    checkForPalindrome(userInput.value);
    userInput.value='';
    // console.log("key");
})

// userInput.addEventListener('keydown', e => {
//     console.log("entered");
// })

  
// function isPalindrome(input) {
//     // Remove non-alphanumeric characters and convert to lowercase
//     let cleaninput = input.toLowerCase().replace(/[^a-z0-9]/g, "");
    
//     // Split, reverse, and join to get the reversed string
//     let reversedinput = cleanName.split("").reverse().join("");
    
//     // Compare the original cleaned name with the reversed one
//     if (cleanName === reversedName) {
//         console.log("The `"$input"` is a palindrome.");
//     } else {
//         console.log("The `"$input" is not a palindrome.");
//     }
// }




















