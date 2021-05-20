var express = require('express');
var router = express.Router();
const puppeteer = require('puppeteer');
const qpdf = require('node-qpdf');
const HummusRecipe = require('hummus-recipe');
const fs = require("fs");


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/render', async (req, res) => {
    const url = req.query.url;
    if (url) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, {
            waitUntil: 'networkidle2',
        });
        const pdf = await page.pdf({
            format: 'a4', printBackground: true, margin: {
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px'
            },
            path: 'hn.pdf'
        });
        await browser.close();

        const options = {
            keyLength: 256,
            password: '1234'
        }

        let pdfDoc = new HummusRecipe('hn.pdf', 'output.pdf');

        await pdfDoc.encrypt({
            userPassword: '1234',
            ownerPassword: '123',
            userProtectionFlag: 4
        }).endPDF();
        await pdfDoc.read('temp.pdf');
        const data = await fs.readFileSync('output.pdf');
        res.contentType("application/pdf");
        res.send(data);
        await fs.unlinkSync('output.pdf');
        return;
    }
    await res.json({error: 'no url found'});
});

module.exports = router;
