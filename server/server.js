const express = require('express');
const cors = require('cors')
const multiparty = require('multiparty');
const fs = require('fs');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const builder = new xml2js.Builder();

const app = express()
const port = 4000

// parse file
function parseFileData(fileData) {
  let data;
  parser.parseString(fileData, (err, res) => {
    if (err) throw err;

    data = res;
  });

  return data;
};

// parse files
function parseFile(target) {
  const data = fs.readFileSync(target);
  return parseFileData(data);
}

app.use(cors())
app.use(express.urlencoded({ extended: true, limit: '50mb', }));
app.use(express.json({ extended: true, limit: '50mb', }))

app.post('/data', async(req, res) => {
  const form = new multiparty.Form();

  form.parse(req, function (err, fields, files) {
    res.send(parseFile(files.file[0].path));
  });
});

app.get('/',function(req,res) {
  res.sendFile('index.html',  { root: `${__dirname}/../src/` } );
});

app.get('/index.js',function(req,res) {
  res.sendFile('index.js',  { root: `${__dirname}/../src/` } );
});

app.post('/generate', function (req, res) {
  const file = builder.buildObject(req.body.fileData);
  const path = `outputXml/${req.body.fileName}.meta`
  fs.writeFile(path, file, 'UTF-8', function (err) {
    if (err) {
      res.send(err);
      console.log(err)
    }
    else res.send('suceffuly saved file')
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})
