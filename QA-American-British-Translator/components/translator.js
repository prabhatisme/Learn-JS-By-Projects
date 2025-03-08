const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {
    ameToBri(text){
  text = text.toString()
        const timeRegex2 = /([01]?\d|2[0-4])\.[0-5]\d/g
    if(timeRegex2.test(text)){
        text = text.replace(timeRegex2, `<span class="highlight">${text.match(timeRegex2)[0].split(".")[0]}:${text.match(timeRegex2)[0].split(".")[1]}</span>`);
    }
       
  const findMatch2 = Object.keys(americanOnly).forEach(x => {
        const regex = new RegExp(`\\b${americanOnly[x]}\\b`, 'g')
        text = text.replace(regex, `<span class="highlight">` + x + `</span>`)
    })
    const reversedBritish = Object.entries(britishOnly).reduce((acc, [key, value]) => {
        acc[value] = key;
        return acc;
    }, {})
    const findMatch4 = Object.keys(reversedBritish).forEach(x => {
        const regex = new RegExp(`\\b${reversedBritish[x]}\\b`, 'g')
        text = text.replace(regex, `<span class="highlight">` + x + `</span>`)
    })
    const findMatch5 = Object.keys(americanToBritishSpelling).forEach(x => {
        const  regex = new RegExp(`\\b${americanToBritishSpelling[x]}\\b`, 'g')
        text = text.replace(regex, `<span class="highlight">` + x + `</span>`)
       })
    /*const findMatch6 = Object.keys(americanToBritishTitles).forEach(x => {
            const  regex = new RegExp(`\\b${americanToBritishTitles[x]}\\b`, 'gi')
            text = text.toLowerCase().replace(regex, `<span class="highlight">${x[0].toUpperCase() + x.slice(1)}</span>`)
        })
    text = text.charAt(0).toUpperCase() + text.slice(1)
    text = text.trim()*/
        return text;
    }
    

briToAme(text){
    text = text.toString()
    const originalText = text;

    const timeRegex = /([01]?\d|2[0-4]):[0-5]\d/g;
if(timeRegex.test(text)){
    text = text.replace(timeRegex, `<span class="highlight">${text.match(timeRegex)[0].split(":")[0]}.${text.match(timeRegex)[0].split(":")[1]}</span>`);
}
    const findMatch2 = Object.keys(britishOnly).forEach(x => {
        const regex = new RegExp(`\\b${britishOnly[x]}\\b`, 'g')
        text = text.replace(regex, `<span class="highlight">${x}</span>`)
    })
    const reversedAmerican = Object.entries(americanOnly).reduce((acc, [key, value]) => {
            acc[value] = key;
            return acc;
        }, {})
       const findMatch4 = Object.keys(reversedAmerican).forEach(x => {
        const regex = new RegExp(`\\b${reversedAmerican[x]}\\b`, 'g')
        text = text.replace(regex, `<span class="highlight">${x}</span>`)
    })
   const reversedSpelling = Object.entries(americanToBritishSpelling).reduce((acc, [key, value]) => {
        acc[value] = key;
        return acc;
    }, {})

    const findMatch5 = Object.keys(reversedSpelling).forEach(x => {
        const regex = new RegExp(`\\b${reversedSpelling[x]}\\b`, 'g')
        text = text.replace(regex, `<span class="highlight">${x}</span>`)
    })
   
    const reversedTitles2 = {
        mr: 'mr.',
        mrs: 'mrs.',
        ms: 'ms.',
        mx: 'mx.',
        dr: 'dr.',
        prof: 'prof.'
      }
     const keyFound = Object.keys(reversedTitles2).find(x => originalText.toLowerCase().includes(reversedTitles2[x]));
      if(keyFound !== undefined){
        const regex = new RegExp(reversedTitles2[keyFound], 'i');
        text = text.replace(regex, `<span class="highlight">` + keyFound[0].toUpperCase() + keyFound.slice(1) + `</span>`) 
        }
        text = text.charAt(0).toUpperCase() + text.slice(1)
    text = text.trim()
    console.log('original:', originalText, 'revised:', text)
    return text
}

}

module.exports = Translator;