var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
var db1 = mongo.db(config.connectionString, { native_parser: true });
db.bind('orders');
db1.bind('images');
var uploadService = {};
uploadService.createUpload = createUpload;

module.exports = uploadService;

function createUpload(files,body) {
	 var deferred = Q.defer();
	console.log(JSON.stringify(body) + " - " + JSON.stringify(files));	
	var orders = {
		category :body.category,
		numofphotos:body.numofphotos,
		comments:'test comments',
		orderGUID:'5ab61-3b2d0-9eb03-f3238-e7f97',
		datecreated:new Date()
	}
   var docid = createOrder(orders);
   
    var ids = _.each(files, function(p) {
	 return _.extend(p,{orderGUID:'5ab61-3b2d0-9eb03-f3238-e7f97'});
	});
	createImagesOrder(ids);	
   deferred.resolve();
    return deferred.promise;
}



function createOrder(orders) {
    var deferred = Q.defer();
	      db.orders.insert(
            orders,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                deferred.resolve(doc);
            });
	
    return deferred.promise;
}


function createImagesOrder(images) {
    var deferred = Q.defer();
	      db1.images.insert(
            images,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                deferred.resolve(doc);
            });
	
    return deferred.promise;
}


