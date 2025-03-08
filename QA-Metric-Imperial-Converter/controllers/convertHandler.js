function numberStringSplitter(input) {
  const number = input.match(/[.\d\/]+/g) || ["1"];
  const string = input.match(/[a-zA-Z]+/g)?.[0];
  return [number[0], string];
}

function checkDiv(possibleFraction) {
  const nums = possibleFraction.split("/");
  return nums.length > 2 ? false : nums;
}

function ConvertHandler() {
  const unitMap = {
    km: "mi",
    mi: "km",
    gal: "L",
    l: "gal",
    lbs: "kg",
    kg: "lbs",
  };

  const unitSpellings = {
    km: "kilometers",
    mi: "miles",
    gal: "gallons",
    l: "liters",
    lbs: "pounds",
    kg: "kilograms",
  };

  const conversionRates = {
    gal: 3.78541,
    lbs: 0.453592,
    mi: 1.60934,
  };

  this.getNum = function (input) {
    let result = numberStringSplitter(input)[0];
    let nums = checkDiv(result);
    if (!nums) return undefined;

    let [num1, num2 = "1"] = nums.map(parseFloat);
    if (isNaN(num1) || isNaN(num2)) return undefined;

    return num1 / num2;
  };

  this.getUnit = function (input) {
    let result = numberStringSplitter(input)[1]?.toLowerCase();
    return unitMap[result] ? (result === "l" ? "L" : result) : undefined;
  };

  this.getReturnUnit = function (initUnit) {
    return unitMap[initUnit.toLowerCase()];
  };

  this.spellOutUnit = function (initUnit) {
    return unitSpellings[initUnit.toLowerCase()] || "unknown unit";
  };

  this.convert = function (initNum, initUnit) {
    let unit = initUnit.toLowerCase();
    if (!conversionRates[unit] && !conversionRates[unitMap[unit]]) return undefined;

    let result =
      unit in conversionRates
        ? initNum * conversionRates[unit]
        : initNum / conversionRates[unitMap[unit]];

    return parseFloat(result.toFixed(5));
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    return `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
  };
}

module.exports = ConvertHandler;