"use strict";

var getModelFields = function(mod) {
	var retval = new Array();
    Object.keys(mod._doc).forEach(field => {
		if (!(field.startsWith('$') || field.startsWith('_'))) {
			retval.push(field);
		}
	});
	
	return retval;
}

module.exports = {
	getModelFields
}