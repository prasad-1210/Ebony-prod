function getMenuItemGroupsController(dataObject){
	//check if menu is Signature menu or list view menu and start data flow
	var responseHTML = '',requestObject = {};

	var resFlag = 
		(
			(globalDataStructure.RestaurantInitConfig.UI.MenuType === 2)
			?'2'			//Signature Menu
			:(
					(globalDataStructure.RestaurantInitConfig.UI.MenuType === 3)
					?'3'		//Generic menu
					:'0'		//error
			)
		)+
		(
			((dataObject !== null && dataObject !== undefined)
				? '1'							//process callback
				: ((globalDataStructure.MenuItems !== null && globalDataStructure.MenuItems !== undefined)
						?((globalDataStructure.MenuItems[config.activeMealType] !== undefined && globalDataStructure.MenuItems[config.activeMealType] !== null && globalDataStructure.MenuItems[config.activeMealType] !== '')
								? '0'			// menu category of active meal type exists => use prefetched cache data.
								: '3'		// menu category of active meal type not exists => send webservice call 	
						): '2'			// menu categories not exists => send webservice call
					)								//data Object Not Null => act as a webservice callback function
			)
		);
	switch (resFlag) {
	case '00':
	case '01':
	case '02':
	case '03':		
		//error. check menu type config. it should not be zero
		break;
	case '20':
	case '30':		
		//use existing data and call view
		if(resFlag.charAt(0) == '2'){			//process Signature Menu		
			responseHTML = getMenuItemSliderView(globalDataStructure.MenuItems[config.activeMealType]);		//call slider view to show menu items slicer
		}else if(resFlag.charAt(0) == '3'){		//process Generic Menu
			responseHTML = getMenuItemGroupsView(globalDataStructure.MenuItemGroups);						//call generic menu item category view to show menu item categories
		}
		break;
	case '21':
	case '31':
		//process webservice callback data
		if(resFlag.charAt(0) == '2'){
			if(!dataObject.error){						//process signature menu
				if(globalDataStructure.MenuItems === undefined){
					globalDataStructure.MenuItems = {};
				}
				globalDataStructure.MenuItems[config.activeMealType] = $.isArray(dataObject.RestaurantMenuItems.MenuItem)?dataObject.RestaurantMenuItems.MenuItem:[dataObject.RestaurantMenuItems.MenuItem];		//check globalDataStructure and push data on to data structure
				responseHTML  = getMenuItemSliderView(globalDataStructure.MenuItems[config.activeMealType]);
			}else{										//error returned by server from webservice call
				globalDataStructure.MenuItems = '';
				responseHTML = getMenuItemSliderView(null);
			}
		}else if(resFlag.charAt(0) == '3'){
			if(!dataObject.error){						//process generic menu
				globalDataStructure.MenuItemGroups = $.isArray(dataObject.RestaurantMenuGroups.Group)?dataObject.RestaurantMenuGroups.Group:[dataObject.RestaurantMenuGroups.Group];		//check globalDataStructure and push data on to data structure
				responseHTML  = getMenuItemGroupsView(globalDataStructure.MenuItemGroups);
			}else{										//error returned by server from webservice call
				globalDataStructure.MenuItemGroups = '';
				responseHTML = getMenuItemGroupsView(null);
			}
		}
		break;
	case '22':	
	case '23':
	case '32':
	case '33':
		//send webservice call 
		requestObject.UserName = config.UserName;
		requestObject.PassWord = config.PassWord;
		if(resFlag.charAt(0) == '2'){				
			requestObject.RestaurantID = config.RestaurantID;
			requestObject.MealType = '0';
			requestObject.DealType = '0';
			requestObject.MenuItemType = '0';
			requestObject.MealCategory = '0';
			requestObject.RequestMethod = 'GetRestaurantMenuItemsAll_XML';
		} else if(resFlag.charAt(0) == '3'){
			requestObject.RestID = config.RestaurantID;
			requestObject.RequestMethod = 'GetRestaurantsMenuItemGroups_XML';
		}
		var responseObject = sendWebServiceCall(requestObject,'getMenuItemGroupsController');		//sendcall to fetch data from server
		responseHTML = (responseObject === null || responseObject === undefined || responseObject)?'Loading': getMenuItemSliderView(responseObject);			//call view with data and return HTML back.
		break;
	}	
	changePageCallback(responseHTML);
}


function getRestaurantMenuItemsAllController(dataObject){
	this.RequestMethod = 'GetRestaurantMenuItemsAll_XML';
	var responseHTML = '';
	var clickObj = globalDataStructure.pager[globalDataStructure.pager.currPageId];
	var params = clickObj.params;

	var resFlag = 	((dataObject !== null && dataObject !== undefined)
					? '1'								//data Object Not Null => act as a webservice callback function
					:((globalDataStructure.MenuItems !== null && globalDataStructure.MenuItems !== undefined)
							?((globalDataStructure.MenuItems[config.activeMealType] !== undefined && globalDataStructure.MenuItems[config.activeMealType] !== null && globalDataStructure.MenuItems[config.activeMealType] !== '' )
								?((globalDataStructure.MenuItems[config.activeMealType][params.MealCategory] !== undefined && globalDataStructure.MenuItems[config.activeMealType][params.MealCategory] !== null && globalDataStructure.MenuItems[config.activeMealType][params.MealCategory] !== '')
									? '0'				//menu items of active meal type menu category exists => use prefetched cache data.
									: '4'			//menu items of active meal type category not exists => send webservice call
								)
								: '3'			//menu items of active meal type not exists => send webservice call
							)
							: '2'			//menu items not exists => send webservice call
						)								
					);
	switch (resFlag) {
	case '0':
		responseHTML = getRestaurantMenuItemsAllView(params);		//call view with data and return HTML back.
		break;
	case '1':
		params = globalDataStructure.pager[('menuCategory-'+dataObject.requestObject.MealCategory)].params;
		if(globalDataStructure.MenuItems === undefined){
			globalDataStructure.MenuItems = {};
		}		
		if(globalDataStructure.MenuItems[config.activeMealType] === undefined){
			globalDataStructure.MenuItems[config.activeMealType] = {};
		}
		if(!dataObject.error){			
			globalDataStructure.MenuItems[config.activeMealType][dataObject.requestObject.MealCategory] = $.isArray(dataObject.RestaurantMenuItems.MenuItem)?dataObject.RestaurantMenuItems.MenuItem:[dataObject.RestaurantMenuItems.MenuItem];
			responseHTML = getRestaurantMenuItemsAllView(params);
		}else{
			globalDataStructure.MenuItems[config.activeMealType][dataObject.requestObject.MealCategory] = '';
			responseHTML = getRestaurantMenuItemsAllView(params);
		}
		break;
	case '2':
	case '3':
	case '4':
		var requestObject = {};										//request Method to fetch data
		requestObject.UserName = config.UserName;
		requestObject.PassWord = config.PassWord;
		requestObject.RestaurantID = config.RestaurantID;
		requestObject.MealType = config.activeMealType;
		requestObject.DealType = '0';
		requestObject.MenuItemType = '0';
		requestObject.MealCategory = params.MealCategory;
		requestObject.RequestMethod = this.RequestMethod;
		var responseObject = sendWebServiceCall(requestObject,'getRestaurantMenuItemsAllController');		//sendcall to fetch data from server
		//globalDataStructure.MenuItemGroups = responseObject;		//check globalDataStructure and push data on to data structure
		responseHTML = (responseObject === null || responseObject === undefined || responseObject)?'Loading': getRestaurantMenuItemsAllView(responseObject);			//call view with data and return HTML back.
		break;
	}
	changePageCallback(responseHTML);
}

function menuItemOrderController(){
	changePageCallback(menuItemOrderView());
}

function HomeController(pageId){	
	changePageCallback(HomeView());
}

function dealsController(dataObject){
	this.RequestMethod = 'GetDeals_XML';
	var responseHTML = '';
	var clickObj = globalDataStructure.pager[globalDataStructure.pager.currPageId];
	var params = clickObj.params;
	if(dataObject === null || dataObject === undefined){	//init function
		if(globalDataStructure.deals || globalDataStructure.deals ===''){							//data already fetched from server, so use that data
			responseHTML = dealsView(globalDataStructure.deals);		//call view with data and return HTML back.
		}else{															//data not available in cache globalDataStructure so send call to server and fetch data.
			var requestObject = {};										//request Method to fetch data
			requestObject.UserName = config.UserName;
			requestObject.PassWord = config.PassWord;
			requestObject.RestaurantID = config.RestaurantID;
			requestObject.RequestMethod = this.RequestMethod;
			var responseObject = sendWebServiceCall(requestObject,'dealsController');		//sendcall to fetch data from server
			//globalDataStructure.Deals = responseObject;		//check globalDataStructure and push data on to data structure
			responseHTML = (responseObject === null || responseObject === undefined || responseObject)?'Loading': dealsView(responseObject);			//call view with data and return HTML back.
		}		
	}else{																//callback function
		if(!dataObject.error){
			globalDataStructure.deals = $.isArray(dataObject.Deals.Deal)?dataObject.Deals.Deal:[dataObject.Deals.Deal];		//check globalDataStructure and push data on to data structure			
		}else{
			globalDataStructure.deals = '';
		}
		responseHTML = dealsView();
	}
	changePageCallback(responseHTML);
}

function dealDescController(){
	changePageCallback(dealDescView());
}

function chefSpecialController(dataObject){
	this.RequestMethod = 'GetRestaurantMenuItemsAll_XML';
	var responseHTML = '';
	var clickObj = globalDataStructure.pager[globalDataStructure.pager.currPageId];
	var params = clickObj.params;
	if(dataObject === null || dataObject === undefined){	//init function
		if(globalDataStructure.chefSpecial || globalDataStructure.chefSpecial === ''){							//data already fetched from server, so use that data
			responseHTML = chefSpecialView(globalDataStructure.chefSpecial);		//call view with data and return HTML back.
		}else{															//data not available in cache globalDataStructure so send call to server and fetch data.
			var requestObject = {};										//request Method to fetch data
			requestObject.UserName = config.UserName;
			requestObject.PassWord = config.PassWord;
			requestObject.RestaurantID = config.RestaurantID;
			requestObject.MealType = config.activeMealType;
			requestObject.DealType = '1';
			requestObject.MenuItemType = '0';
			requestObject.MealCategory = '0';
			requestObject.RequestMethod = this.RequestMethod;
			var responseObject = sendWebServiceCall(requestObject,'chefSpecialController');		//sendcall to fetch data from server
			//globalDataStructure.MenuItemGroups = responseObject;		//check globalDataStructure and push data on to data structure
			responseHTML = (responseObject === null || responseObject === undefined || responseObject)?'Loading': chefSpecialView(responseObject);			//call view with data and return HTML back.
		}
	}else{						//callback function
		if(!dataObject.error){
			globalDataStructure.chefSpecial = $.isArray(dataObject.RestaurantMenuItems.MenuItem)?dataObject.RestaurantMenuItems.MenuItem:[dataObject.RestaurantMenuItems.MenuItem];		//check globalDataStructure and push data on to data structure
		}else{
			globalDataStructure.chefSpecial = '';
		}
		responseHTML = chefSpecialView();
	}
	changePageCallback(responseHTML);
}

function featuredDealsController(dataObject){
	this.RequestMethod = 'GetRestaurantMenuItemsAll_XML';
	var responseHTML = '';
	var clickObj = globalDataStructure.pager[globalDataStructure.pager.currPageId];
	var params = clickObj.params;
	if(dataObject === null || dataObject === undefined){	//init function
		if(globalDataStructure.featuredDeals || globalDataStructure.featuredDeals === ''){							//data already fetched from server, so use that data
			responseHTML = featuredDealsView();		//call view with data and return HTML back.
		}else{															//data not available in cache globalDataStructure so send call to server and fetch data.
			var requestObject = {};										//request Method to fetch data
			requestObject.UserName = config.UserName;
			requestObject.PassWord = config.PassWord;
			requestObject.RestaurantID = config.RestaurantID;
			requestObject.MealType = config.activeMealType;
			requestObject.DealType = '2';
			requestObject.MenuItemType = '0';
			requestObject.MealCategory = '0';
			requestObject.RequestMethod = this.RequestMethod;
			var responseObject = sendWebServiceCall(requestObject,'featuredDealsController');		//sendcall to fetch data from server
			//globalDataStructure.MenuItemGroups = responseObject;		//check globalDataStructure and push data on to data structure
			responseHTML = (responseObject === null || responseObject === undefined || responseObject)?'Loading': featuredDealsView(responseObject);			//call view with data and return HTML back.
		}		
	}else{						//callback function
		if(!dataObject.error){
			globalDataStructure.featuredDeals = $.isArray(dataObject.RestaurantMenuItems.MenuItem)?dataObject.RestaurantMenuItems.MenuItem:[dataObject.RestaurantMenuItems.MenuItem];		//check globalDataStructure and push data on to data structure
		}else{
			globalDataStructure.featuredDeals= '';
		}
		responseHTML = featuredDealsView();
	}
	changePageCallback(responseHTML);
}

function getAboutController(dataObject){
	var aboutHtml = '';
	$.ajax({
			url: 'about.html',
            type: 'get',
            dataType: 'html',
            async: false,
            cache: false,
            success: function(data){
            	aboutHtml = data;
            }
        }
    );
	changePageCallback(aboutHtml);
}

function getOurHistoryController(dataObject){
	this.RequestMethod = 'GetRestaurantAbout_XML';
	var responseHTML = '';
	if(dataObject === null || dataObject === undefined){	//init function
		if(globalDataStructure.AboutUs || globalDataStructure.AboutUs === ''){							//data already fetched from server, so use that data
			responseHTML = getOurHistoryView();		//call view with data and return HTML back.
		}else{															//data not available in cache globalDataStructure so send call to server and fetch data.
			var requestObject = {};										//request Method to fetch data
			requestObject.UserName = config.UserName;
			requestObject.PassWord = config.PassWord;
			requestObject.RestaurantID = config.RestaurantID;
			requestObject.RequestMethod = this.RequestMethod;
			var responseObject = sendWebServiceCall(requestObject,'getOurHistoryController');		//sendcall to fetch data from server
			//globalDataStructure.MenuItemGroups = responseObject;		//check globalDataStructure and push data on to data structure
			responseHTML = (responseObject === null || responseObject === undefined || responseObject)?'Loading': getOurHistoryView(responseObject);			//call view with data and return HTML back.
		}
	}else{						//callback function
		if(!dataObject.error){
			globalDataStructure.history = dataObject.AboutUs.About.History;		//check globalDataStructure and push data on to data structure
		}else{
			globalDataStructure.AboutUs = '';
		}
		responseHTML = getOurHistoryView();
	}	
	changePageCallback(responseHTML);
}

function getMapLocationController(dataObject){
	responseHTML = '<div data-container="locationMap" id="locationMap" />';
	changePageCallback(responseHTML);
}

function eventsController(dataObject){
	this.RequestMethod = 'GetEvents_XML';
	var responseHTML = '';
	var clickObj = globalDataStructure.pager[globalDataStructure.pager.currPageId];
	var params = clickObj.params;
	if(dataObject === null || dataObject === undefined){	//init function
		if(globalDataStructure.events || globalDataStructure.events === ''){							//data already fetched from server, so use that data
			responseHTML = eventsView();								//call view with data and return HTML back.
		}else{															//data not available in cache globalDataStructure so send call to server and fetch data.
			var requestObject = {};										//request Method to fetch data
			requestObject.UserName = config.UserName;
			requestObject.PassWord = config.PassWord;
			requestObject.RestaurantID = config.RestaurantID;
			requestObject.RequestMethod = this.RequestMethod;
			var responseObject = sendWebServiceCall(requestObject,'eventsController');		//sendcall to fetch data from server
			//globalDataStructure.events = responseObject;		//check globalDataStructure and push data on to data structure
			responseHTML = (responseObject === null || responseObject === undefined || responseObject)?'Loading': eventsView(responseObject);			//call view with data and return HTML back.
		}
	}else{																//callback function
		if(!dataObject.error){
			globalDataStructure.events = $.isArray(dataObject.Events.Event)?dataObject.Events.Event:[dataObject.Events.Event];		//check globalDataStructure and push data on to data structure		
		}else{
			globalDataStructure.events = '';
		}
		responseHTML = eventsView();
	}
	changePageCallback(responseHTML);
}

function eventDescController(dataObject){
	changePageCallback(eventsDescView());
}

function ordersController(){
	changePageCallback(ordersView());
}

function reservationController(dataObject){	
	this.RequestMethod = 'GetRestaurantResvConfig_XML';
	var responseHTML = '';
	var clickObj = globalDataStructure.pager[globalDataStructure.pager.currPageId];
	var params = clickObj.params;
	if(dataObject === null || dataObject === undefined){	//init function
		if(globalDataStructure.restResvConfig || globalDataStructure.restResvConfig === ''){							//data already fetched from server, so use that data
			responseHTML = reservationView();		//call view with data and return HTML back.
		}else{															//data not available in cache globalDataStructure so send call to server and fetch data.
			var requestObject = {};										//request Method to fetch data
			requestObject.UserName = config.UserName;
			requestObject.PassWord = config.PassWord;
			requestObject.RestaurantID = config.RestaurantID;
			requestObject.RequestMethod = this.RequestMethod;
			var responseObject = sendWebServiceCall(requestObject,'reservationController');		//sendcall to fetch data from server
			//globalDataStructure.MenuItemGroups = responseObject;		//check globalDataStructure and push data on to data structure
			responseHTML = (responseObject === null || responseObject === undefined || responseObject)?'Loading': reservationView(responseObject);			//call view with data and return HTML back.
		}		
	}else{						//callback function
		if(!dataObject.error){
			globalDataStructure.restResvConfig  = dataObject.RestaurantResvConfig.ResvConfig;
		}else{
			globalDataStructure.restResvConfig = '';
		}
		responseHTML = reservationView();
	}
	changePageCallback(responseHTML);
}

function reserveTable(dataObject){
	this.RequestMethod = 'CreateReservation';
	var responseHTML = '';
	if(dataObject.ValidReturn === undefined){	//init function		
			var requestObject = {};										//request Method to fetch data			
			requestObject.UserName = config.UserName;
			requestObject.PassWord = config.PassWord;
			requestObject.RestaurantID = config.RestaurantID;
			requestObject.RequestMethod = this.RequestMethod;
			requestObject = $.extend(requestObject , dataObject);
			var responseObject = sendWebServiceCall(requestObject,'reserveTable');		//sendcall to fetch data from server
			responseHTML = (responseObject === null || responseObject === undefined || responseObject)?'Loading': responseObject;			//call view with data and return HTML back.		
			
	}else{						//callback function
		if(!dataObject.error){
			responseHTML = dataObject.ValidReturn.ReturnString;
		}else{
			responseHTML = '';
		}		
	}
	reserveTableCallback(responseHTML);
} 

function getReviewsController(dataObject){
	
	this.RequestMethod = 'GetReviews_XML';
	var responseHTML = '';
	if(dataObject === null || dataObject === undefined){	//init function
		if(globalDataStructure.Reviews || globalDataStructure.Reviews === ''){
							//data already fetched from server, so use that data
			responseHTML = reviewsPageView();	//call view with data and return HTML back.
		}else{															//data not available in cache globalDataStructure so send call to server and fetch data.
			var requestObject = {};										//request Method to fetch data
			requestObject.UserName = config.UserName;
			requestObject.PassWord = config.PassWord;
			requestObject.RestaurantID = config.RestaurantID;
			requestObject.RequestMethod = this.RequestMethod;
			var responseObject = sendWebServiceCall(requestObject,'getReviewsController');		//sendcall to fetch data from server
			//globalDataStructure.MenuItemGroups = responseObject;		//check globalDataStructure and push data on to data structure
			responseHTML = (responseObject === null || responseObject === undefined || responseObject)?'Loading': getReviewsView(responseObject);			//call view with data and return HTML back.
			return responseHTML;  
		}
		
	}else{						//callback function
		if(!dataObject.error){
			globalDataStructure.Reviews = dataObject.Reviews;		//check globalDataStructure and push data on to data structure
			
		}else{
			globalDataStructure.Reviews = '';	
		}
		responseHTML = reviewsPageView();
	}
	
	changePageCallback(responseHTML);
}

function getRestaurantLocation(dataObject){
	this.RequestMethod = 'GetRestaurantLocations_XML';
	var responseHTML = '';
	if(dataObject === null || dataObject === undefined){	//init function
		if(globalDataStructure.AboutUs){							//data already fetched from server, so use that data
		// this is one time pageload call. no recalls allowed. if recalled, there is some error  
		}else{															//data not available in cache globalDataStructure so send call to server and fetch data.
			var requestObject = {};										//request Method to fetch data
			requestObject.UserName = config.UserName;
			requestObject.PassWord = config.PassWord;
			requestObject.RestaurantID = config.RestaurantID;
			requestObject.RequestMethod = this.RequestMethod;
			var responseObject = sendWebServiceCall(requestObject,'getRestaurantLocation');		//sendcall to fetch data from server
			globalDataStructure.pager.isLoading = true;
			//globalDataStructure.restaurantLocations = responseObject;		//check globalDataStructure and push data on to data structure
			//responseHTML = (responseObject === null || responseObject === undefined || responseObject)?'Loading': getReviewsView(responseObject);			//call view with data and return HTML back.
		}
		return responseHTML;
	}else{						//callback function
		if(!dataObject.error){
			console.log(dataObject.RestaurantLocations);
			globalDataStructure.restaurantLocations = $.isArray(dataObject.RestaurantLocations.Location)?dataObject.RestaurantLocations.Location:[dataObject.RestaurantLocations.Location];		//check globalDataStructure and push data on to data structure
			console.log(globalDataStructure.restaurantLocations);
			if(window['getRestaurantLocationCallback'] !== undefined){
				window['getRestaurantLocationCallback']();
			}
			//ajaxCallback(getReviewsView(dataObject));
		}else{
			globalDataStructure.restaurantLocations = '';
			//ajaxCallback(getReviewsView(null));
		}		
	}
}


function fbLoginController(dataObject){
	this.RequestMethod = 'RegisterRestaurantUserExtended';
	console.log(dataObject);
	if(dataObject.ValidReturn === undefined){
		console.log('sending fbRegisteration call');
          console.log("Name:"+dataObject.name+",First Name:"+dataObject.first_name+",Last Name:"+dataObject.last_name+",username:"+dataObject.username+",email:"+dataObject.email);
          globalDataStructure.userObject = dataObject;
          var requestObject = {};
          requestObject.UserName = config.UserName;
          requestObject.PassWord = config.PassWord;
          requestObject.RestaurantID = config.RestaurantID;
          requestObject.RestaurantLocaID = '38';
          requestObject.FirstName = dataObject.first_name;
          requestObject.LastName = dataObject.last_name;
          requestObject.Email = dataObject.email;
          requestObject.Salt = "24f52e77 9c3f1c93ed56268339ac0b4";
          requestObject.RPassword = "xxxxxx";
          requestObject.Phone = "01234567890";
          requestObject.RequestMethod = this.RequestMethod;
          var responseObject = sendWebServiceCall(requestObject,'fbLoginController');		//sendcall to fetch data from server
	}else{
			fbLoginCallback(dataObject.requestObject);
	}
}

function getContactUsController(dataObject) {
	changePageCallback(getContactUsView());	
	
}

/*function myordersController(){
	
	changePageCallback(myorderPageView());
} */
function createOrderContoller(dataObject) {
	if(dataObject === null || dataObject === undefined){ 
		this.RequestMethod = 'CreateOrder';
		var requestObject = {};										//request Method to fetch data
		requestObject.UserName = config.UserName;
		requestObject.PassWord = config.PassWord;
		requestObject.OrderName = 'testing';
		requestObject.RestaurantID = config.RestaurantID;
		requestObject.RestaurantLocaID = '38';
		requestObject.UserId = config.userId;
		requestObject.MenuItems = globalDataStructure.createOrderMenuitems;
		requestObject.RequestMethod = this.RequestMethod;
		
		var responseObject = sendWebServiceCall(requestObject,'createOrderContoller');	
	} else {
		if(!dataObject.error && dataObject.Response){ 
			alert("Your order submited successfully");
		}
		changePageCallback('','createOrder');
	}	
	//changePageCallback('','createOrder');
}

function getMyReviewsController(dataObject) {
	changePageCallback(myReviewsPageView());
}

function createMyreviewsContoller(dataObject) {
	//alert("Your review is submitted successfully");
	if(dataObject === null || dataObject === undefined){
		this.RequestMethod = 'CreateReview';
		var requestObject = {};										//request Method to fetch data
		requestObject.UserName = config.UserName;
		requestObject.PassWord = config.PassWord;
	
		requestObject.Restaurant = config.RestaurantID;
		requestObject.LocaID = '38';
		requestObject.UserId = config.userId;
		requestObject.Rating = globalDataStructure.myreviewsObject.rating;
		requestObject.Review = globalDataStructure.myreviewsObject.review;
		requestObject.RequestMethod = this.RequestMethod;
		
		var responseObject = sendWebServiceCall(requestObject,'createMyreviewsContoller');	
	} else {
		if(!dataObject.error && dataObject.Response){ 
			alert("Your review submited successfully");
		}
		changePageCallback('','createMyreviews');
	}
	
}

function getReviewController(dataObject) { 
	changePageCallback(getReviewView());	
}