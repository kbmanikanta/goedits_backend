var config = require('config.json');
var express = require('express');
var router = express.Router();
var uploadsService = require('services/uploads.service');
var multer  = require('multer')
var multerAzure = require('multer-azure');
// var upload = multer({ dest: 'uploads/' })


var upload = multer({ 
  storage: multerAzure({
    connectionString: 'DefaultEndpointsProtocol=https;AccountName=jockey;AccountKey=fgov28LM7Ar9Ge1VqeP6yGAHEvvsY9k3HkY6/HlP2DitTV20gI3ad3tLVfQXy0bpLiQLOMHpjwLYMARsnH6TTQ==;EndpointSuffix=core.windows.net', //Connection String for azure storage account, this one is prefered if you specified, fallback to account and key if not.
    container: 'uploads',  //Any container name, it will be created if it doesn't exist
    blobPathResolver: function(req, file, callback){
      var blobPath = yourMagicLogic(req, file);//Calculate blobPath in your own way.
      callback(null, blobPath);
    }
  })
})

// routes
router.post('/',upload.any(),uploadfiles);

function yourMagicLogic(request,filename)
{
	return "client1/" + filename.originalname;
}

function uploadfiles(req, res, next) {
	    uploadsService.createUpload(req.files,req.body)
        .then(function () {
            res.json('success');
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
	
}

module.exports = router;