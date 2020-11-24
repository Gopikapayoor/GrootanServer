const express = require("express");
const bodyParser = require('body-parser');
const app = express();
var fs = require("fs");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var busboy = require('connect-busboy');
//...
app.use(busboy());
//...
app.post('/postData', function (req, res) {
    console.log("s");
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);
        fstream = fs.createWriteStream('./uploads/' + filename);
        file.pipe(fstream);
        fstream.on('close', function () {

            res.send(filename);
        });
    });

});
app.get("/read", (req, res) => {
    res.send('success');

});


app.post("/uploadFile", (req, res) => {
    //Logic to validate the coupon and ack the user
    res.set('Content-Type', 'application/json');
    var path = req.body.name;
    console.log(path);
    var exporter = require('csv-to-mysql');
    exporter('localhost', 'sample', 'root', 'password', "./uploads/" + path);
    var result = "uploaded";
    res.send(JSON.stringify(result));
});

const port = process.env.PORT || 1234;
app.listen(port, () => console.log("Listening at " + port));