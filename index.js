const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


// Home Page
app.get('/', function (req, res) {

    fs.readdir('./files', function (err, files) {

        if (err) {
            console.log(err);
            return res.send("Error reading files");
        }

        res.render("index", { files: files });
    });

});


// Show File Content
app.get('/file/:filename', function (req, res) {

    fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err, filedata) {

        if (err) {
            console.log(err);
            return res.send("File not found");
        }

        res.render('show', {
            filename: req.params.filename,
            filedata: filedata
        });

    });

});


// Create Task
app.post('/create', function (req, res) {

    const fileName = req.body.title.split(' ').join('');

    fs.writeFile(
        `./files/${fileName}.txt`,
        req.body.details,
        function (err) {

            if (err) {
                console.log(err);
                return res.send("Error creating file");
            }

            res.redirect('/');
        }
    );

});


// Delete Task
app.post('/delete/:filename', function (req, res) {

    fs.unlink(`./files/${req.params.filename}`, function (err) {

        if (err) {
            console.log(err);
            return res.send("Error deleting file");
        }

        res.redirect('/');
    });

});


app.listen(3000, function () {
    console.log("Server running on port 3000");
});