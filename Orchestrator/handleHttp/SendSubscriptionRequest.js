module.exports = function (BUFFER) {
	var module = {};
	var request = require('request');
	module.sr =  SendSubscriptionRequest
	function SendSubscriptionRequest(sub_options, fakeFlag){
		return new Promise(function(resolve, reject){ 
			request(sub_options, function (err, res, body) 
			{
				var statusCode;
				if(res)
					statusCode = res.statusCode;
				
				if (err)
				{
					console.log('Error :', err);
					return reject(false);
				}
				else{
						if( statusCode == 403 ){
							BUFFER.push(sub_options);	
						}
						resolve(statusCode);
				}
			});
		});
	}	
	return module;
};


