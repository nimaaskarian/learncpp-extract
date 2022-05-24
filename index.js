import got from "got";
import { JSDOM } from "jsdom";
import ReadLine from "readline";
import { spawn } from "child_process";
const args = process.argv.slice(2);

const readline = ReadLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});
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
        return videoSource.src;
      });
      urls.forEach((url) => {
        console.log(url);
      });
      if (args.includes("-d")) {
        spawn("mpv", [urls[0]]);
        readline.close();
        return;
      }
      readline.question(
        "mpv which url? (0 = none, default = 1): ",
        (mpvIndex) => {
          if (!mpvIndex) mpvIndex = 1;
          mpvIndex = +mpvIndex;
          if (!urls[mpvIndex - 1]) return readline.close();

          const mpv = spawn("mpv", [urls[mpvIndex - 1]]);
          readline.close();
        }
      );
    })
    .catch((err) => {
      console.log(err);
      readline.close();
    });
}
