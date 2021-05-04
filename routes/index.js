var express = require('express');
var router = express.Router();
const puppeteer = require('puppeteer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/render', async (req, res) => {
  const url = req.query.url;
  if (url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: 'networkidle2',
    });
    const pdf = await page.pdf({ format: 'a4' });
    await browser.close();
    res.contentType("application/pdf");
    res.send(pdf);
  }
  res.json({error: 'invalid url'});
});

module.exports = router;
