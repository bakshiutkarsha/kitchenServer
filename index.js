const express = require('express');
const cors = require('cors');
const bwipjs = require('bwip-js');
const fs = require('fs');
const puppeteer = require("puppeteer");

const app = express();
app.use(express.json());
app.use(cors());

app.get('/barcodes', (req, res) => {
    bwipjs.toBuffer({
        bcid:        'code128',      
        text:        getBarcodeData(),    
        scale:       3,              
        height:      10,             
        includetext: true,            
        textxalign:  'center',  
    }, function (err, png) {
        if (err) {
            res.json({message :err});
        } else {
           const image = png.toString('base64');
           res.json(image)
        }
    });
})

app.get('/barcodes.pdf', async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const site = "https://kitchenmate.bakshiutkarsha.vercel.app/barcode";
    await page.goto(site, {
        waitUntil: "networkidle2"
    });
    await page.setViewport({ width: 1680, height: 1050 });
    await page.pdf({
        path: "barcodes.pdf",
        format: "A4"
    });
    //res.json(`${site}/barcodes.pdf`)
})

const getBarcodeData = () => {
    const  blacklistWords = ['HATE', 'WASTE']
    const alphaNumericBarcode = getPrefix(3) + getPostfix()
    for (const word in blacklistWords){
        if(alphaNumericBarcode.includes(word)){
            return getBarcodeData()
        }
    }
    return alphaNumericBarcode;
}

const getPrefix = (length) => {
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

const getPostfix = () => {
    return Math.floor(1000 + Math.random() * 9000);
}

const server = app.listen(5000, function() {
    console.log('Express server listening on port ' + server.address().port);
});