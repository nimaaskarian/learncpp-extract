import got from "got";
import { JSDOM } from "jsdom";
import ReadLine from "readline";
import clipboard from "clipboardy";
const args = process.argv.slice(2);
function argsHas(arg) {
  return args.includes(arg);
}
class RL {
  constructor() {
    this.readline = ReadLine.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }
  close() {
    this.readline.close();
    this.readline.removeAllListeners();
  }
  question(query) {
    return new Promise((resolve, reject) => {
      this.readline.question(query, resolve);
    });
  }
}
class UrlList {
  constructor(sourceDomArray) {
    this.urls = [...sourceDomArray].map(({ href }) => href);
  }
  copy(index) {
    const urlToCopy = this.urls[index];
    if (urlToCopy) {
      console.log(`Copied ${index + 1}`);
      clipboard.writeSync(this.urls[index]);
    }
  }
  printAll(arrayOfArrays) {
    this.urls.forEach((url, index) => { 
      let output = ""
      if(arrayOfArrays)
        arrayOfArrays.forEach(e=>{
          output += e[index] + " "
        })
      output+=url  
      console.log(output) 
    });
  }
}

// if (args[0] !== "-d" && args[0]) {
//   readlineCallback(args[0]);
// } else {
//   readline.question("alaatv url: ", readlineCallback);
// }
(async () => {
  const readline = new RL();
  const alaaTvUrl = args[0] || await readline.question("url?: ")

  const response = await got(alaaTvUrl);
  if (!response) {
    console.log(response);
    readline.close();
  }
  const dom = new JSDOM(response.body);
  const urls = new UrlList(
    dom.window.document.querySelectorAll(".lessontable-row-title a")
  );
  urls.printAll([
    [...dom.window.document.querySelectorAll(".lessontable-row-number")].map(e=>e.innerHTML),
    urls.urls.map(e=>{
      let splitted = e.split("/")
      return splitted[splitted.length-2]
    })
  ]);
  readline.close();
  if (argsHas("-d")) {
    return urls.copy(0);
  }
  // const copyIndexString = await readline.question(
  //   "Which url do you want to copy? (0 = none, default = 1): "
  // );
  // let copyIndex = +copyIndexString - 1;
  // if (!copyIndexString) copyIndex = 0;
  // urls.copy(copyIndex);
})();
