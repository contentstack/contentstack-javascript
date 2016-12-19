'use strict';

var Request = require('./dynamic-stack'),
	when = require('when'),
	init = require('./config'),
	userLogin = {
		url: init.url + '/user-session' ,
		method:"POST",
		body:{
		  "user": {
		    "email": "harshal.patel@raweng.com",
		    "password": "H@rshal91"
		  }
		}
	},
	user = {},
	headers = {
		api_key:"bltf9cdecd012ea43cc"
	};


	Request(userLogin)
	        .then(function (data) {
	        	user = data.user || {};
	        	headers.authtoken = user.authtoken;
				sentEntryForPublish();	        	
			})
	        .catch(function (error) {
	            console.error("error",error);
	        });

function sentEntryForPublish(){
	var contentTypesUrls = [
		'/content_types/home/entries/blt73b3d4a5809760a5/publish',
		'/content_types/numbers_content_type/entries/blt70beacfaf912d62e/publish',
		'/content_types/multiple_assets/entries/blte83628cdaf4cef75/publish',
		'/content_types/source/entries/blt5cbb9523685c42bf/publish'
	];
	var requestObj = {
		url: init.url +'/content_types/home/entries/blt73b3d4a5809760a5/publish',
		method:"POST",
		headers : headers,
		body:{
		  "entry": {
		    "locales": [
		      "en-us"
		    ],
		    "environments": [
		      "development"
		    ]
		  },
		  "locale": "en-us",
		  "version": 3
		}
	};

	function publishEntry(url) {
	    var deferred = when.defer();
	    requestObj.url = init.url + url;
		Request(requestObj)
		        .then(function (data) {
		        	deferred.resolve(data); 
		        })
		        .catch(function (error) {
		           deferred.reject(error);
		        });
	    return deferred.promise;
	}
	function publishAll(contentTypesUrls){
		var deferreds = [];
		contentTypesUrls.forEach(function(url){
			deferreds.push(publishEntry(url));
		});
		return when.all(deferreds);	
	};

	publishAll(contentTypesUrls)
			.then(function(data){
				console.log("data after all",data);
			}).catch(function(error){
				console.error("error",error);
			}); 
	
	


};	 

