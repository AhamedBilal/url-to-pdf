const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const hummus = require('muhammara');



/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

function modifyPDF(inStream, outStream, cb) {
    // encrypting PDF stream
    hummus.recrypt(inStream, outStream, {
        userPassword: '1234',
        ownerPassword: 'owner',
        userProtectionFlag: 4,
    });
    if (inStream.close) {
        inStream.close(() => {
            console.log('PDF generation complete')
        });
    }
    if (outStream.close) {
        outStream.close(cb);
    }
}

router.get('/render', async (req, res) => {
    const url = req.query.url;
    if (url) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, {
            waitUntil: 'networkidle2',
        });
        // generating PDF using dev tools
        const pdf = await page.pdf({format: 'a4', printBackground: true});
        await browser.close();

        // encrypting start

        res.writeHead(200, {'Content-Type': 'application/pdf'});

        // creating streams for modification
        const inStream = new hummus.PDFRStreamForBuffer(pdf);
        const outStream = new hummus.PDFStreamForResponse(res);
        modifyPDF(inStream, outStream);
        res.end()
        return;
        // encrypting end
    }
    await res.json({error: 'no url found'});
});

module.exports = router;
