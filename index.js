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
      const urls = [
        ...dom.window.document.querySelectorAll(".a--video-wraper source"),
      ].map((videoSource) => {
        const url = videoSource.src;
        console.log(url);
        return url;
      });
      if (args.includes("-d")) {
        clipboard.writeSync(urls[1]);
        closeReadline();
        return;
      }
      readline.question(
        "copy which url? (0 = none, default = 1): ",
        (copyIndex) => {
          if (!copyIndex) copyIndex = 1;
          copyIndex = +copyIndex;
          const selectedUrl = urls[copyIndex - 1];
          if (!selectedUrl) {
            closeReadline();
            return;
          }

          clipboard.writeSync(selectedUrl);
        }
      );
    })
    .catch((err) => {
      console.log(err);
      closeReadline();
    });
}
