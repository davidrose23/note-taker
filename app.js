const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
const fs = require('fs');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
  });
  

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/notes', (req, res) => {
    fs.readFile('./data.json', (err, data) => {
        if (err) {
            res.render('error', { error: err });
        } else {
            let notes = JSON.parse(data);
            res.render('index', { notes: notes });
        }
    });
});

app.post('/save', (req, res) => {
    fs.readFile('./data.json', (err, data) => {
        if (err) {
            res.render('error', { error: err });
        } else {
            let notes = JSON.parse(data);
            req.body.id = new Date().getTime();
            notes.push(req.body);
            fs.writeFile('./data.json', JSON.stringify(notes), (err) => {
                if (err) {
                    res.render('error', { error: err });
                } else {
                    res.redirect('/notes');
                }
            });
        }
    });
});

app.post('/delete/:id', (req, res) => {
    fs.readFile('./data.json', (err, data) => {
        if (err) {
            res.render('error', {error: err});
        } else {
            let notes = JSON.parse(data);
            notes = notes.filter(note => note.id != req.params.id);
            fs.writeFile('./data.json', JSON.stringify(notes), (err) => {
                if (err) {
                    res.render('error', {error: err});
                } else {
                    res.redirect('/notes');
                }
            });
        }
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
