import got from "got";
import { JSDOM } from "jsdom";
import ReadLine from "readline";
import { exec } from "child_process";
import clipboard from "clipboardy";
const args = process.argv.slice(2);

const readline = ReadLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});
class UrlList {
  constructor(sourceDomArray) {
    this.urls = [...sourceDomArray].map(({ src }) => src);
  }
  copy(index) {
    const urlToCopy = this.urls[index];
    if (urlToCopy) {
      console.log(`Copied ${index + 1}`);
      clipboard.writeSync(this.urls[index]);
    }
    closeReadline();
  }
  printAll() {
    this.urls.forEach((url,index) => console.log(`${index+1}: ${url}`));
  }
}
function closeReadline() {
  readline.close();
  readline.removeAllListeners();
}
if (args[0] !== "-d" && args[0]) {
  readlineCallback(args[0]);
} else {
  readline.question("alaatv url: ", readlineCallback);
}

function readlineCallback(alaaTvUrl) {
  got(alaaTvUrl)
    .then((response) => {
      const dom = new JSDOM(response.body);
      const urls = new UrlList(
        dom.window.document.querySelectorAll(".a--video-wraper source")
      );
      urls.printAll();
      if (args.includes("-d")) {
        return urls.copy(0);
      }
      readline.question(
        "Which url do you want to copy? (0 = none, default = 1): ",
        (copyIndex) => {
          if (!copyIndex) copyIndex = 1;
          copyIndex = +copyIndex;
          urls.copy(copyIndex - 1);
        }
      );
    })
    .catch((err) => {
      console.log(err);
      closeReadline();
    });
}
