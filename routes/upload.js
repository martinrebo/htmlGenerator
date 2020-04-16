var express = require('express');
var router = express.Router();
var csv=require('csvtojson');

var ejs = require('ejs');
var fs = require('fs');
var path = require('path');

var zipFolder = require ('zip-folder')


/* POST upload page. */
router.post('/', function(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;
    var data = { }
    // Create tempFolder 
    var tempFolder = Date.now()
    let tempdir = path.join(__dirname, `/../tmp/${tempFolder}` );
    fs.mkdirSync(tempdir);
    let uploads = path.join(__dirname, `/../tmp/${tempFolder}/uploads`  )
    fs.mkdirSync(uploads)
    let downloads = path.join(__dirname, `/../tmp/${tempFolder}/files`  )
    fs.mkdirSync(downloads)
    let zip = path.join(__dirname, `/../tmp/${tempFolder}/zip`  )
    fs.mkdirSync(zip)

    let uploadPath = path.join(__dirname,`/../tmp/${tempFolder}/uploads/${sampleFile.name}` )
     
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv( uploadPath, function(err) {
      if (err)
        return res.status(500).send(err);
  
        csv()
        .fromFile(uploadPath)
        .then((jsonObj)=>{
           data = jsonObj
           return data
          
        }).then( (data) => { 

         // CREATE HTML FILES in a temp file 
         data.map( (page, index) => {
           let viewsPath = path.join(__dirname, '../views/locationVoiture.ejs')
           
          let template = fs.readFileSync(viewsPath, 'utf-8')
           var html = ejs.render( template, page);

         let resultsPath = path.join(__dirname, `/../tmp/${tempFolder}/files/${index}-ED-${page.name}.html` )

          fs.writeFileSync( resultsPath, html, 'utf8')

         })
        
        }).then( ()=> {
          // CREATE ZIP FOLDER
  
          let zipfile =path.join(__dirname, `../tmp/${tempFolder}/zip/archive.zip`)
          
          zipFolder( downloads, zipfile, (err) => { 
            if(err) {
              console.log('error zipfoder', err)
            } else {
              let file = path.join(__dirname, `../tmp/${tempFolder}/zip/archive.zip`)
              res.download(file);
            }
          })
        })           
        .catch((err)=> console.log(err))



    // res.send('file upload')



    });
  });

  module.exports = router