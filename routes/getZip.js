var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path')
var admZip = require('adm-zip');
// give the path for directory which we want to zip 

var folderpath = path.join(__dirname+'../../public/uploads/');

var uploadDir = fs.readdirSync(folderpath)

router.get('/', function(req, res, next){
    var zip = new admZip(); // object
    
    for(var i=0; i < uploadDir.length ; i++){
        zip.addLocalFile(folderpath+uploadDir[i])
    }

    // define name of zip file
    var downloadName = 'downloadFile.zip';

    var data = zip.toBuffer(); // retur content of entrire zip file

    // save zip file to root dir
    zip.writeZip(folderpath+'/'+downloadName);

    // code for downloading the zip
    res.set('Content-Type','application/octet-stream');
    res.set('Content-Disposition', 'attachment; filename =' + downloadName)
    res.set('Content-Length', data.length);
    res.send(data);

})

module.exports = router