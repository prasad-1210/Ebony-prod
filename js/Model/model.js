function sendWebServiceCall(dataObject,callback){
	$.ajax({
        type: 'GET',
        url: config.DataAccessPoint,
        data: 'input='+encodeURIComponent($.param(dataObject)),
        async: false,
        scriptCharset: 'UTF-8',
        dataType: 'jsonp',
        beforeSend:function(){
        	if(globalDataStructure.pager.isLoading){
        		return false;
        	}else{
        		globalDataStructure.pager.isLoading = true;
        		console.log('sending call');
            	console.log('input='+escape($.param(dataObject)));
            	return true;
        	}
        },
        success: function(data){
			console.log('call success');
			data.requestObject = dataObject;
			console.dir(data);
			console.log('callback'+callback);
			globalDataStructure.pager.isLoading = false;
			window[callback](data);
		},
        error: function(jqXHR, textStatus, errorThrown){
			console.log('call error');
        },
        complete: function(jqXHR, textStatus){
			console.log('call complete');
			
        }
      });
}