
/** */ 
document.addEventListener("DOMContentLoaded", () => {
    const display = document.getElementById("display");
    let calc = "0";
    let lastIsOperator = false;
    document.querySelector(".buttons").addEventListener("click", (e) => {
        if (!e.target.matches("button")) return;
        const value = e.target.innerText;
        console.log(value);
        

        if (value === "AC") {
            calc = "0";
            lastIsOperator = false;
        } else if (value === "←") { // Handle backspace
            if (calc.length > 1) {
                calc = calc.slice(0, -1);
            } else {
                calc = "0";
            }
            lastIsOperator = ["+", "-", "*", "/"].includes(calc.slice(-1));
        } else if (value === "=") {
            try {
                calc = Function(`return ${calc}`)().toString();
                console.log(calc);
                
            } catch {
                calc = "Error";
            }
            lastIsOperator = false;
        } else if (value === ".") {
            const lastNum = calc.split(/[\+\-\*\/]/).pop();
            if (!lastNum.includes(".")) calc += ".";
        } else if (["/", "*", "-", "+"].includes(value)) {
            if (lastIsOperator) {
                calc = calc.slice(0, -1) + value;
                console.log(calc);
                
            } else {
                calc += value;
                console.log(calc);
                
            }
            lastIsOperator = true;
        } else {
            calc = calc === "0" ? value : calc + value;
            lastIsOperator = false;
        }
        console.log(calc);
        console.log(lastIsOperator);
        
        display.innerText = calc;
    });
});
