import * as express from 'express';
import * as fs from "fs";
import * as xml2js from "xml2js"
import * as xpath from "xpath"
import { DOMParser as Dom } from "xmldom"


const app: express.Express = express();
app.use(express.text({ type: ['application/xml', 'application/json'] }));


app.get('/', (req, res) => {
    const data = req.body;
    let xmlString = '';
    if (req.headers['content-type'] === 'application/json') {
        const jsonData = JSON.parse(data.replace(/'/g, '"'));
        const builder = new xml2js.Builder();
        xmlString = builder.buildObject(jsonData);
    } else if (req.headers['content-type'] === 'application/xml') {
        xmlString = data.toString();
    }
    var doc = new Dom().parseFromString(xmlString)
    var xmlId = xpath.select("//id/text()", doc)[0]
    var xml = fs.readFileSync('./static/sample.xml', 'utf8').toString();
    var root = new Dom().parseFromString(xml)
    const findName = xpath.select(`//Valute[@ID="${xmlId}"]/Name/text()`, root)[0]
    const findValue = xpath.select(`//Valute[@ID="${xmlId}"]/Value/text()`, root)[0]
    const currency = {
        "Resp": [
            {
                "Name": findName.toString(),
                "Value": findValue.toString()
            }
        ]
    };
    const builder = new xml2js.Builder();
    const resp = builder.buildObject(currency);

    res.send(resp);
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});