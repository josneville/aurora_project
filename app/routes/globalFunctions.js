module.exports = {
	checkEmptyParams: function(params){
  	for (var i = 0; i < params.length; i++) {
    	if (!params[i]) {
      	return true;
    	}
  	}
  	return false;
	},
	checkEmptyObject: function(obj){
	  for (var key in obj) {
	    if (Object.prototype.hasOwnProperty.call(obj, key)) {
	      return false;
	    }
	  }
	  return true;
	},
	error: function(res, statusCode, err, message){
		if (err !== "" && err != null){
			var errorJSON = {error: err, timestamp: (new Date()).toJSON()};
			console.log(errorJSON);
		}
		res.status(statusCode).send({message: message});
		return;
	}
}
