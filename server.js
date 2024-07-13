const express = require("express");
const app = express();
const puppeteer = require("puppeteer");
const port = 8383;

//http://127.0.0.1:9222/json/version
//paste this extension at the end of target in chrome properties :  --remote-debugging-port=9222;

app.use(express.static("public"));
app.use(express.json());

app.post("/", async (req, res) => {
  const { role, child, resumePath, coverLetter } = req.body;

  try {
    console.log(role);
    console.log(child);
    console.log(resumePath);
    console.log(coverLetter);
    const wsChromeEndpointurl =
      "ws://127.0.0.1:9222/devtools/browser/b21a52c8-ef29-444b-bf57-9729652a8edc";
    const browser = await puppeteer.connect({
      browserWSEndpoint: wsChromeEndpointurl,
    });
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto("https://internshala.com/student/dashboard");
    await page.waitForSelector("#internships_new_superscript");
    await page.click("#internships_new_superscript");
    await delay(4000);
    await page.waitForSelector("#select_category_chosen > ul > li > input");
    await page.type("#select_category_chosen > ul > li > input", "s" + role, {
      delay: 50,
    });
    await delay(500);
    await page.keyboard.press("Enter");
    await delay(2000);
    const promise = new Promise((resolve) =>
      browser.once("targetcreated", resolve)
    );
    await page.$eval(
      `#internship_list_container_1 > div:nth-child(${child}) > div.internship_meta`,
      (el) => el.click()
    );
    const newPage = await promise.then((target) => target.page());
    await newPage.setViewport({ width: 1366, height: 768 });
    await newPage.bringToFront();
    await delay(2000);
    await newPage.$eval("#apply_now_button", (el) => el.click());
    await delay(2000);
    await newPage.$eval(
      "#layout_table > div.proceed-btn-container > button",
      (el) => el.click()
    );
    await delay(2000);
    await newPage.type(
      "#cover_letter_holder > div.ql-editor.ql-blank",
      coverLetter
    );
    await delay(2000);
    const elementHandle = await newPage.$("input[name=custom_resume]");
    await elementHandle.uploadFile(resumePath);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing form data!");
  }
});

app.listen(port, () => console.log(`Server started on port : ${port}`));
