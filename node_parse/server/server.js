const express = require('express');
const cors = require('cors')
const multiparty = require('multiparty');
const fs = require('fs');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const builder = new xml2js.Builder();

const app = express()
const port = 4000

let metaData;
let metaName;
let availCmps = [];

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

const createFrontendData = function (obj) {
  const { availComp } = obj.CPedVariationInfo
  // get avail comps
  const componentsDict = {
    0: 'head',
    1: 'berd',
    2: 'hair',
    3: 'uppr',
    4: 'lowr',
    5: 'hand',
    6: 'feet',
    7: 'teef',
    8: 'accs',
    9: 'task',
    10: 'decl',
    11: 'jbib',
  }

  const innerComponents = Object.assign({}, availComp[0].split(' '));

  Object.entries(innerComponents).forEach(([key, val]) => {
    if (val != 255) {
      availCmps.push(key)
    }
  })
}

const walkSync = function(dir) {
  const files = fs.readdirSync(dir);
  const filesList = [];
  const textures = [];

  files.forEach((file) => {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      const texts = [];
      fs.readdirSync(dir + '/' + file).forEach(subfile => {
        texts.push(subfile)
      })
      texts.sort((a, b) => parseInt(a,10) - parseInt(b,10));
      textures.push(texts)
    }
    else {
      filesList.push(file);
    }
  });

  filesList.sort((a, b) => parseInt(a,10) - parseInt(b,10));

  const item = {
    files: filesList,
    textures: textures
  }

  return item;
};

app.use(cors())
app.use(express.urlencoded({ extended: true, limit: '50mb', }));
app.use(express.json({ extended: true, limit: '50mb', }))

app.post('/data', async(req, res) => {
  const form = new multiparty.Form();

  form.parse(req, function (err, fields, files) {
    metaData = parseFile(files.file[0].path)
    createFrontendData(metaData);
    res.send([metaData, availCmps]);
  });

  availCmps = [];
});

app.get('/',function(req,res) {
  res.sendFile('index.html',  { root: `${__dirname}/../src/` } );
});

app.get('/index.js',function(req,res) {
  res.sendFile('index.js',  { root: `${__dirname}/../src/` } );
});

app.post('/custom', function (req, res) {
  metaName = req.body.path;
  const dirData = walkSync(`../extended_clothes/${metaName}/components/${req.body.element}/`)

  res.send(dirData);
})

app.post('/generate', function (req, res) {
  const file = builder.buildObject(req.body.fileData);
  const path = `outputXml/${req.body.fileName}.ymt.xml`
  // fs.open(path, 'w', () => {

  // })
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
