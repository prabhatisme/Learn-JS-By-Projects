const userInput = document.getElementById("text-input");
const checkPalindromeBtn = document.getElementById("check-btn");
const resultDiv = document.getElementById('result');

const checkForPalindrome = input => {
    return input;
}

checkPalindromeBtn.addEventListener('click', () => {
    userInput.value=  '';
    console.log(userInput.value);
    // checkForPalindrome(userInput.value);

})