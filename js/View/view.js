function getMenuItemGroupsView(dataObject){
	var htmlResponse = '',dataObjectSource = dataObject;
	htmlResponse += '<div id="restaurantMenuItemGroup" class="menu">'+
						'<div id="typeToggle">'+
							'<a href="#" class="toggleLeft" data-param='+globalDataStructure.RestaurantInitConfig.MealType[0]+'>'+
								'<span id="toggleLeftTrigger" '+((parseInt(globalDataStructure.RestaurantInitConfig.MealType[0]) === config.activeMealType)?'class="active"':'')+'">'+config.MealTypes[globalDataStructure.RestaurantInitConfig.MealType[0]]+'</span>'+
							'</a>'+
							'<a href="#" class="toggleRight" data-param='+globalDataStructure.RestaurantInitConfig.MealType[1]+'>'+
								'<span id="toggleRightTrigger" '+((parseInt(globalDataStructure.RestaurantInitConfig.MealType[1]) === config.activeMealType)?'class="active"':'')+'">'+config.MealTypes[globalDataStructure.RestaurantInitConfig.MealType[1]]+'</span>'+
							'</a>'+
						'</div>';
	if(dataObjectSource === null || dataObjectSource === ''){
		htmlResponse += '<p class="noData">SORRY, NO MENU ITEMS FOUND</p>';
	}else{
		dataObject = [];
		$(dataObjectSource).each(function(i,e){			
			dataObject.push({
				'ID': e.ID,
				'controller':'getRestaurantMenuItemsAll',
				'navRef':'menu',
				'Title':e.GroupName,
				'backBtnTitle':'Menu',
				'backPagerId':'menu',
				'params':{
					'MealCategory':e.ID,
					'position':i
				},
				'Time':'',
				'Date':'',
				'Desc':e.GroupName,
				'Thumb':e.GroupImage,
				'pageName':'menuCategory'
			});
		});
		
		if(globalDataStructure.RestaurantInitConfig.UI.getMenuItemGroupsType === 1){			//	generic Events Style
			htmlResponse += generateTableView(dataObject);			
		}else if(globalDataStructure.RestaurantInitConfig.UI.getMenuItemGroupsType === 2){	//	Signature Menu Style
			htmlResponse += generateSignatureMenu(dataObject);
		}else if(globalDataStructure.RestaurantInitConfig.UI.getMenuItemGroupsType === 3){	//	Signature Menu Style
			htmlResponse += generateListView(dataObject);
		}
	}
	htmlResponse +='</div>';
	return htmlResponse;
}

function getRestaurantMenuItemsAllView(dataObject) {
	var htmlResponse = '',params=dataObject,dataObjectSource = globalDataStructure.MenuItems[config.activeMealType][params.MealCategory];
	htmlResponse += '<div id="restaurantMenuItemGroup">';
	if(dataObjectSource === null || dataObjectSource === ''){
		htmlResponse += '<p class="noData">SORRY, NO MENU ITEMS FOUND</p>';
	}else{
		dataObject = [];
		$(dataObjectSource).each(function(i,e){			
			dataObject.push({
				'ID': e.ID,
				'controller':'menuItemOrder',
				'navRef':'menu',
				'Title':e.Item,
				'backBtnTitle':globalDataStructure.MenuItemGroups[params.position].GroupName,
				'backPagerId':'menuCategory-'+params.MealCategory,
				'params':{
					'menuItemId':e.ID,
					'MealCategory':params.MealCategory,
					'menuType':'0',
					'position':i
				},
				'Time':'',
				'Date':'',
				'Desc':e.ItemDesc,
				'Thumb':e.ItemImage1,
				'pageName':'menuItem'
			});
		});
		
		if(globalDataStructure.RestaurantInitConfig.UI.getRestaurantMenuItemsAllType === 1){			//	generic Events Style
			htmlResponse += generateTableView(dataObject);			
		}else if(globalDataStructure.RestaurantInitConfig.UI.getRestaurantMenuItemsAllType === 2){	//	Signature Menu Style
			htmlResponse += generateSignatureMenu(dataObject);
		}else if(globalDataStructure.RestaurantInitConfig.UI.getRestaurantMenuItemsAllType === 3){	//	Signature Menu Style
			htmlResponse += generateListView(dataObject);
		}
	}
	htmlResponse +='</div>';
	return htmlResponse;
}

function menuItemOrderView(dataObject){
	params = globalDataStructure.pager[globalDataStructure.pager.currPageId].params;
	dataObject = (params.menuType === '0')?
					globalDataStructure.MenuItems[config.activeMealType][params.MealCategory][params.position]:
						(params.menuType === '1')?globalDataStructure.chefSpecial[params.position]:
							globalDataStructure.featuredDeals[params.position];
	console.log(dataObject);
	
	var htmlResponse = '';
	if(dataObject === null){
		htmlResponse += 'No Items Found';
	}else{
		globalDataStructure.pager['menuItemOrder-'+dataObject.ID] = {'href':'menuItemOrder-'+dataObject.ID,'controller':'menu','navRef':'menu','title':dataObject.Item,};
		htmlResponse = '<div id="menuItemOrderScreen" data-href="menuItemOrder-'+dataObject.ID+'" data-pagerId="orders" data-categoryid='+params.MealCategory+' data-menuItemPosition = '+params.position+' data-menuItemId = '+dataObject.ID+'>'+
		'<div id="menuItemOrderHead">'+
			'<div id="menuItemOrderFBLike"><img src="images/likeit.png" style="width: 100%; max-width: 97px; height: auto; max-height: 97px;"></div>'+
			'<div id="menuItemOrderName" class="parent-div">'+
				'<div class="text-div">'+
					'<span>'+
						dataObject.Item+
					'</span>'+
				'</div>'+
			'</div>'+
			'<div id="menuItemOrderPrice">'+
				'<div style="position: absolute; left: 0px; top: 0px; width: 100%; z-index: 9; height: 100%;">'+
					'<div style="float: left; width: 100%; height: 100%; display: table; font-size: 12px;">'+
						'<span style="display: table-cell; vertical-align: middle; font-size: 1.2em;">'+
							((dataObject.DiscountPrice > 0) ? '<span style="text-decoration: line-through;">$'+dataObject.ItemPrice+'</span><br>$'+dataObject.DiscountPrice+'</span>':'<span>$'+dataObject.ItemPrice+'</span>')+
						'</span>'+
					'</div>'+
				'</div>'+
				'<div style="position: absolute; left: 0px; top: 0px; width: 100%;" id="">'+
					'<img style="width: 100%; max-width: 97px; max-height: 97px; height: auto;" src="images/pricetag.png"/>'+
				'</div>'+
			'</div>'+
		'</div>'+
		'<div class="imageSlider">'+
			'<div class="imgContent">'+
				'<img src="'+dataObject.ItemImage2+'" alt="'+dataObject.Item+'" width="320px" height="183px"/>'+
				'<img src="'+dataObject.ItemImage3+'" alt="'+dataObject.Item+'" width="320px" height="183px"/>'+
			'</div>'+
			'<div class="imageBreadCrumb">'+
				'<label class="active"></label>'+
				'<label>&nbsp;</label>'+
			'</div>'+
		'</div>'+
		'<div style="float: left; width: 100%; text-align: center;" id="itemOrderSection">'+
			'<button style="height: 45px; line-height: 12px; margin: 0px;" id="addToOrder">Add to Order</button>'+
		'</div>'+
	'</div>';
	}
		
	return htmlResponse;
}

function getMenuItemSliderView(dataObject){
	var htmlResponse = '',dataObjectSource = dataObject;
	htmlResponse += '<div data-container="MenuItemsWrapper">';
	if(dataObjectSource === null || dataObjectSource === ''){
		htmlResponse += '<p class="noData">SORRY, NO MENU ITEMS FOUND</p>';
	}else{
		dataObject = [];
		$(dataObjectSource).each(function(i,e){
			dataObject.push({
				'ID': e.ID,
				'controller':'menuItemOrder',
				'navRef':'menu',
				'Title':e.Item,
				'backBtnTitle':'Menu',
				'backPagerId':'menu',
				'params':{
					'position':i
				},
				'Time':'',
				'Date':'',
				'Desc':/*e.ItemDesc+'<br/>'+*/'<img src="'+e.ItemImage1+'" alt="'+e.Item+'"/>',
				'Thumb':e.ItemImage1,
				'pageName':'menuItem'
			});
		});		
		htmlResponse += generateSignatureMenu(dataObject);
	}
	htmlResponse +='</div>';
	return htmlResponse;
}

function HomeView(){
	
	var htmlResponse = '';
	/*
	 * Ebony Home Screen
	 */
	htmlResponse += '<div data-container="home">'+
						'<div class="contentWrapper">'+
							'<div class="homeHead">'+
								'<a class="transparentButton homeIcon" href="javascript:void(0)"><img src="images/ebonyHomeIcon.png"></a>'+
								'<div class="callButton"> <a href="'+(globalDataStructure.restaurantLocations === undefined ? 'javascript:void(0)' : 'tel:'+globalDataStructure.restaurantLocations[0].PhoneNumber)+'" rel="external"><img src="images/call@2x.png"></a></div>'+
							'</div>'+
							'<div class="homeButtons">'+
								'<a href="javascript:void(0)" data-href="hotdeals" data-pagerid="hotdeals" ontouchstart="javascript:linktouch(this);" class="transparentButton pageTrigger whatshot">WHAT\'S HOT</a>'+
								'<a href="http://www.emunching.com" rel="external" target="_blank" class="branding">POWERED BY EMUNCHING</span>'+
							'</div>'+
						'</div>'+
					'</div>';
	/*
	 * Emunching Home Screen
	 */ 
	/*htmlResponse += '<div data-container="home">'+
						'<div class="homeLeft"><img src="images/emunching_logo.png"></div>'+
							'<div class="homeRight">'+
								'<img class="logotext" src="images/emunching_logo_text.png">'+
								'<a href="javascript:void(0)" data-href="hotdeals" class="pageTrigger" data-pagerId="hotdeals"><img class="whatshot" src="images/whats_hot_normal.png"></a>'+
							'</div>'+
							'<div class="homeButtons">'+
								'<div>'+
									'<a href="javascript:void(0)" data-href="chefSpecial" data-pagerId="chefSpecials" class="transparentButton pageTrigger" >Chef Specials</a>'+
									'<a href="javascript:void(0)" data-href="featuredDeals" data-pagerId="featuredDeals" class="transparentButton pageTrigger" >Featured Deals</a>'+
								'</div>'+
							'</div>'+
						'</div>';*/
	return htmlResponse;	
}

function chefSpecialView(){
	
	var htmlResponse = '',dataObjectSource = globalDataStructure.chefSpecial;
	htmlResponse += '<div id="chefSpecials">';
	if(dataObjectSource === null || dataObjectSource === ''){
		htmlResponse += '<p class="noData">NO CHEF SPECIALS AVAILABLE</p>';
	}else{
		dataObject = [];
		$(dataObjectSource).each(function(i,e){			
			dataObject.push({
				'ID': e.ID,
				'controller':'menuItemOrder',
				'navRef':'menu',
				'Title':e.Item,
				'backBtnTitle':'Chef Specials',
				'backPagerId':'chefSpecials',
				'params':{
					'menuItemId':e.ID,
					'menuType':'1',
					'position':i
				},
				'Time':'',
				'Date':'',
				'Desc':e.ItemDesc,
				'Thumb':e.ItemImage1,
				'pageName':'menuItem'
			});
		});
		
		if(globalDataStructure.RestaurantInitConfig.UI.chefSpecialsType === 1){		//	generic Events Style
			htmlResponse += generateTableView(dataObject);			
		}else if(globalDataStructure.RestaurantInitConfig.UI.chefSpecialsType === 2){	//	Signature Menu Style
			htmlResponse += generateSignatureMenu(dataObject);
		}else if(globalDataStructure.RestaurantInitConfig.UI.chefSpecialsType === 3){	//	Signature Menu Style
			htmlResponse += generateListView(dataObject);
		}
	}
	htmlResponse +='</div>';
	return htmlResponse;
}

function featuredDealsView(){
	var htmlResponse = '',dataObjectSource = globalDataStructure.featuredDeals;
	htmlResponse += '<div id="featuredDeals">';
	if(dataObjectSource === null || dataObjectSource === ''){
		htmlResponse += '<p class="noData">NO FEATURED DEALS AVAILABLE</p>';
	}else{
		dataObject = [];
		$(dataObjectSource).each(function(i,e){			
			dataObject.unshift({
				'ID': e.ID,
				'controller':'menuItemOrder',
				'navRef':'menu',
				'Title':e.Item,
				'backBtnTitle':'Featured Deals',
				'backPagerId':'featuredDeals',
				'params':{
					'menuItemId':e.ID,
					'menuType':'2',
					'position':i
				},
				'Time':'',
				'Date':'',
				'Desc':e.ItemDesc,
				'Thumb':e.ItemImage1,
				'pageName':'menuItem'
			});
		});
		
		if(globalDataStructure.RestaurantInitConfig.UI.featuredDealsType === 1){			//	generic Events Style
			htmlResponse += generateTableView(dataObject);			
		}else if(globalDataStructure.RestaurantInitConfig.UI.featuredDealsType === 2){	//	Signature Menu Style
			htmlResponse += generateSignatureMenu(dataObject);
		}else if(globalDataStructure.RestaurantInitConfig.UI.featuredDealsType === 3){	//	Signature Menu Style
			htmlResponse += generateListView(dataObject);
		}
	}
	htmlResponse +='</div>';
	return htmlResponse;
}

function getOurHistoryView(){
	var dataObject = globalDataStructure.history;
	var htmlResponse = '<div class="contentWrapper">';
			htmlResponse += ( dataObject === null )?'No History Information Available':dataObject;
		htmlResponse += '</div>';
	$(htmlResponse);
	return htmlResponse;
}

function eventsView(){
	
	/*
	 * @TODO Remove below data hardcoding when you getting teaser image data from webservice
	 * 
	 */
	if(globalDataStructure.RestaurantInitConfig.UI.eventsType === 4 && !globalDataStructure.patch.IsEventsPreLoaded){
		globalDataStructure.events.unshift({
			'EventDesc':'<img width="100%" height="100%" alt="image" src="http://dev.emunching.com/Restaurants/Ebony/ArtWork/DealImages/late%20is%20great.jpg" />',
			'EventDate':'10/26/2012 12:00:00 AM',
			'ID':1,
			'Image':'',
			'Restaurant':'Ebony',
			'EventTime':'9/5/2012 12:00:00 AM',
			'Location':'Ebony Restaurant',
			'Thumbnail':'<img src="images/event_1.png"/>',
			'EventTitle':"Late is great",
			'Type':'',
			'Value':'0.00000'
		},{
			'EventDesc':'<img width="100%" height="100%" alt="image" src="http://dev.emunching.com/Restaurants/Ebony/ArtWork/DealImages/EARLY%20BIRD-1.jpg" />',
			'EventDate':'9/27/2012 12:00:00 AM',
			'ID':2,
			'Image':'',
			'Restaurant':'Ebony',
			'Location':'Ebony Restaurant',
			'EventTime':'9/12/2012 12:00:00 AM',
			'Thumbnail':'<img src="images/event_2.png"/>',
			'EventTitle':"Early bird offer",
			'Type':'',
			'Value':'0.00000'
		},{
			'EventDesc':'<img width="100%" height="100%" alt="image" src="http://dev.emunching.com/Restaurants/Ebony/ArtWork/DealImages/EBONY%20-%20WORKING%20LUNCH%20ADVERT.png" />',
			'EventDate':'10/18/2012 12:00:00 AM',
			'ID':3,
			'Image':'',
			'Restaurant':'Ebony',
			'Location':'Ebony Restaurant',
			'EventTime':'9/19/2012 12:00:00 AM',
			'Thumbnail':'<img src="images/event_3.png"/>',
			'EventTitle':"Working lunch Buffet",
			'Type':'',
			'Value':'0.00000'
		}
		);
		globalDataStructure.patch.IsEventsPreLoaded = true;
	}
	
	var htmlResponse = '',dataObjectSource = globalDataStructure.events;
	htmlResponse += '<div data-container="eventsWrapper">';
	if(dataObjectSource === null || dataObjectSource === ''){
		htmlResponse += '<p class="noData">No events to show</p>';
	}else{
		dataObject = [];
		$(dataObjectSource).each(function(i,e){			
			dataObject.push({
				'ID': e.ID,
				'controller':'eventDesc',
				'navRef':'about',
				'Title':e.EventTitle,
				'backBtnTitle':'Events',
				'backPagerId':'events',
				'params':{
					'position':i
				},
				'Time':e.EventTime, 
				'Date':e.EventDate, 
				'Desc':e.EventDesc,
				'Thumb':(e.Thumbnail === undefined)?'':e.Thumbnail,
				'pageName':'event'
			});
		});
		if(globalDataStructure.RestaurantInitConfig.UI.eventsType === 1){			//	generic Events Style			
			htmlResponse += generateTableView(dataObject);			
		}else if(globalDataStructure.RestaurantInitConfig.UI.eventsType === 2){	//	Signature Menu Style
			htmlResponse += generateSignatureMenu(dataObject);
		}else if(globalDataStructure.RestaurantInitConfig.UI.eventsType === 4){	//	Teaser Menu Style
			htmlResponse += generateTeaserMenu(dataObject);
		}
	}
	htmlResponse +='</div>';
	return htmlResponse;
}

function eventsDescView(){
	if(globalDataStructure.RestaurantInitConfig.UI.dealsType === 1){			//	generic Events Style
		var dataObject = globalDataStructure.events[globalDataStructure.pager[globalDataStructure.pager.currPageId].params.position];
		var htmlResponse = '<div class="eventDescWrapper">'+
								generateTableDescView({'Desc':dataObject.EventDesc})+
							'</div>';		
	}else if(globalDataStructure.RestaurantInitConfig.UI.eventsType === 4){	//	Teaser Menu Style
		var htmlResponse = '',dataObjectSource = globalDataStructure.events;
		htmlResponse += '<div data-container="eventsWrapper">';
		if(dataObjectSource === null || dataObjectSource === ''){
			htmlResponse += '<p class="noData">No events to show</p>';
		}else{
			dataObject = [];
			$(dataObjectSource).each(function(i,e){
				var Obj = {
						'ID': e.ID,
						'controller':'eventDesc',
						'navRef':'home',
						'Title':e.EventTitle,
						'backBtnTitle':'Events',
						'backPagerId':'events',
						'params':{
							'position':i
						},
						'Time':e.EventTime,
						'Date':e.EventDate, 
						'Desc':e.EventDesc,
						'Thumb':e.Thumbnail,
						'pageName':'event'
					}				
					dataObject.push(Obj);
			});
			dataObject = makeArrayCircularStartFromItem(dataObject,(globalDataStructure.pager[globalDataStructure.pager.currPageId].params.position));
			console.log(dataObject);
			htmlResponse += generateSignatureMenu(dataObject); 			//Signature Menu Style
		}
	}
		
	return htmlResponse;
}

function dealsView(){	
	
	/*
	 * @TODO Remove below data hardcoding when you getting teaser image data from webservice
	 * 
	 */
	if(globalDataStructure.RestaurantInitConfig.UI.dealsType === 4 && !globalDataStructure.patch.IsDealsPreLoaded){
		globalDataStructure.deals.unshift({
			'Desc':'<img width="100%" height="100%" alt="image" src="http://dev.emunching.com/Restaurants/Ebony/ArtWork/DealImages/late%20is%20great.jpg" />',
			'Expires':'10/26/2012 12:00:00 AM',
			'ID':1,
			'Image':'',
			'Restaurant':'Ebony',
			'Starts':'9/5/2012 12:00:00 AM',
			'Thumbnail':'<img src="images/event_1.png"/>',
			'Title':"Late is great",
			'Type':'',
			'Value':'0.00000'
		},{
			'Desc':'<img width="100%" height="100%" alt="image" src="http://dev.emunching.com/Restaurants/Ebony/ArtWork/DealImages/EARLY%20BIRD-1.jpg" />',
			'Expires':'9/27/2012 12:00:00 AM',
			'ID':2,
			'Image':'',
			'Restaurant':'Ebony',
			'Starts':'9/12/2012 12:00:00 AM',
			'Thumbnail':'<img src="images/event_2.png"/>',
			'Title':"Early bird offer",
			'Type':'',
			'Value':'0.00000'
		},{
			'Desc':'<img width="100%" height="100%" alt="image" src="http://dev.emunching.com/Restaurants/Ebony/ArtWork/DealImages/EBONY%20-%20WORKING%20LUNCH%20ADVERT.png" />',
			'Expires':'10/18/2012 12:00:00 AM',
			'ID':3,
			'Image':'',
			'Restaurant':'Ebony',
			'Starts':'9/19/2012 12:00:00 AM',
			'Thumbnail':'<img src="images/event_3.png"/>',
			'Title':"Working lunch Buffet",
			'Type':'',
			'Value':'0.00000'
		}
		);
		globalDataStructure.patch.IsDealsPreLoaded = true;
	}
	
	var htmlResponse = '',dataObjectSource = globalDataStructure.deals;
	htmlResponse += '<div data-container="dealsWrapper">';
	
	
	if(dataObjectSource === null || dataObjectSource === ''){
		htmlResponse += '<p class="noData">No Deals to show</p>';
	}else{
		dataObject = [];
		$(dataObjectSource).each(function(i,e){
			dataObject.push({
				'ID': e.ID,
				'controller':'dealDesc',
				'navRef':'home',
				'Title':e.Title,
				'backBtnTitle':'Hot Deals',
				'backPagerId':'hotdeals',
				'params':{
					'position':i
				},
				'Time':e.Starts, 
				'Date':e.Expires, 
				'Desc':e.Desc,
				'Thumb':e.Thumbnail,
				'pageName':'deal'
			});
		});
		if(globalDataStructure.RestaurantInitConfig.UI.dealsType === 1){			//	generic Events Style
			htmlResponse += generateTableView(dataObject);
		}else if(globalDataStructure.RestaurantInitConfig.UI.dealsType === 2){	//	Signature Menu Style
			htmlResponse += generateSignatureMenu(dataObject);
		}else if(globalDataStructure.RestaurantInitConfig.UI.dealsType === 4){	//	Teaser Menu Style
			htmlResponse += generateTeaserMenu(dataObject);
		}
	}
	htmlResponse +='</div>';
	return htmlResponse;
}

function dealDescView(){
	if(globalDataStructure.RestaurantInitConfig.UI.dealsType === 1){			//	generic Events Style
		var dataObject = globalDataStructure.deals[globalDataStructure.pager[globalDataStructure.pager.currPageId].params.position];
		var htmlResponse = '<div class="dealDescWrapper">'+
								generateTableDescView({'Desc':dataObject.Desc})+
							'</div>';
	}else if(globalDataStructure.RestaurantInitConfig.UI.dealsType === 4){	//	Teaser Menu Style
		var htmlResponse = '',dataObjectSource = globalDataStructure.deals;
		htmlResponse += '<div data-container="dealsWrapper">';
		if(dataObjectSource === null || dataObjectSource === ''){
			htmlResponse += '<p class="noData">No Deals to show</p>';
		}else{
			dataObject = [];
			$(dataObjectSource).each(function(i,e){
				var Obj = {
						'ID': e.ID,
						'controller':'dealDesc',
						'navRef':'home',
						'Title':e.Title,
						'backBtnTitle':'Hot Deals',
						'backPagerId':'hotdeals',
						'params':{
							'position':i
						},
						'Time':e.Starts, 
						'Date':e.Expires, 
						'Desc':e.Desc,
						'Thumb':e.Thumbnail,
						'pageName':'deal'
					}				
					dataObject.push(Obj);
			});
			dataObject = makeArrayCircularStartFromItem(dataObject,(globalDataStructure.pager[globalDataStructure.pager.currPageId].params.position));
			console.log(dataObject);
			htmlResponse += generateSignatureMenu(dataObject); 			//Signature Menu Style
		}
	}
	return htmlResponse;
}

function reservationView(){
	var htmlResponse = '';
	var LocationData = '<select id="reservelocation">';
	var reserveCountData = '<select id="reservecount">';
	var userEmail = (localStorage.getItem('UserEmail') !== null)?localStorage.getItem('UserEmail'):' ';
	$(globalDataStructure.restaurantLocations).each(function(i,e){
		LocationData +='<option value="'+e.LocaID+'">'+e.LName+'</option>';		
	});
	// for(var x =1;x<=dataObject.TableThreshold;x++){
	for(var x =1;x<=10;x++){
		reserveCountData += '<option value="'+x+'">'+x+'</option>';
	}
	LocationData += '</select>';
	reserveCountData += '</select>';
	htmlResponse = '<div data-container="reservation">'+
						'<div class="contentWrapper">'+
							'<div id="reservationForm">'+
								'<label for="reserveemail" style="float: left; width: 100%;">EMAIL</label>'+
								'<input type="text" id="reserveemail" style="float: left; width: 100%;" value="'+userEmail+'" readonly="readonly"/>'+
								'<label for="reservename">RESERVATION NAME</label>'+
								'<input type="text" id="reservename"/>'+
					    		'<label for="reservecontact">PHONE NUMBER</label>'+
					    		'<input type="text" id="reservecontact"/>'+
						    	'<label for="reservemsg">OPTIONAL: MESSAGE / SPECIAL REQUEST</label>'+
						    	'<input type="text" id="reservemsg"/>'+
							    '<label for="reservelocation">RESERVATION LOCATION</label>'+
							    LocationData+
							    '<label for="reservecount">NUMBER OF GUESTS</label>'+
							    reserveCountData+
							    '<label for="reservetime">DATE/TIME</label>'+
							    '<input name="scroller" id="reservetime" class="datetime emSelect" />'+
						    '</div>'+
					    '</div>'+
					'</div>';
	console.log(htmlResponse);
	return htmlResponse;
}

function ordersView(){
	var htmlResponse = '';
	var dataObject = globalDataStructure.order;	

	
	if(dataObject === undefined || dataObject == null || $.isEmptyObject(dataObject)){
		
		htmlResponse +='<p class="noData">No Orders Yet. Go to Menu and add some items</p>';
	}else{
		
		var savings = 0;
		var grandtotal = 0;
		htmlResponse = '<div data-role="content" data-container="MyOrdersWrapper"><ul id="myorderlist" >';
		
		$.each(dataObject,function(i,e){ 
			var itemquantity = e.itemQuantity;
			if(e.DiscountPrice > 0 && e.DiscountPrice < e.ItemPrice) {
				
				savings += (e.ItemPrice - e.DiscountPrice)*itemquantity;
				grandtotal += e.DiscountPrice*itemquantity;
			} else {
				grandtotal += e.ItemPrice*itemquantity;
			}
			var itempricehtml = (e.DiscountPrice > 0 ) ? '<div class="text-div order-item-original-price-div" id="order-item-originalprice">$'+e.ItemPrice*itemquantity+'</div><div class="text-div order-item-discount-price-div " id="order-item-price">$'+e.DiscountPrice*itemquantity+'</div>':'<div class="text-div order-item-original-price-div" id="order-item-price">$'+e.ItemPrice*itemquantity+'</div>'
			htmlResponse += '<li><div class="hide-delete-order-button delete-item" data-menuitem = "'+e.ID+'"><img src="images/sub_pressed.png"></div>'+
					'<div class="order-background" data-menuitem = "'+e.ID+'" data-menuitemprice="'+e.ItemPrice+'" data-menuitem-discount-price="'+e.DiscountPrice+'">'+
					'<div class="order-item-img-div"><img src="'+e.ItemImage1+'" alt="'+e.Item+'" width="100%;"/></div>'+
					'<div class="order-item-text-div">'+
						'<div class="parent-div"><div class="text-div item-name">'+e.Item+'</div></div>'+
						'<div class="parent-div order-item-price-div"><div class="order-item-quantity-div"><span class="text-div order-item-quantity-first-span">Quantity </span><span class="order-item-quantity-second-span"> - </span><span class="itemquantity"><input type="tel" value="'+e.itemQuantity+'" style="" class="text-itemquantity"></span></div>'+
						itempricehtml+'</div>'+
						
					'</div></div></li>';
			
		
	
		});
		htmlResponse += '</ul>'+ 
						'<div id="list-total-prices"><div id="list-total-prices-img-div"><img src="images/ribbon.png"></div><div id="list-total-prices-text-div"><h3><span class="list-total-prices-text-div-first-span">Your Savings: </span><span class="list-total-prices-text-div-second-span" id="savings-total">$'+savings+'</span></h3><h3 class="grand-total-color"><span class="list-total-prices-text-div-first-span">Grand Total: </span><span class="list-total-prices-text-div-second-span" id="grand-total">$'+grandtotal+'</span></h3></div> </div>'+
						'</div>';
		//'<div class="order-items-actions-div"><a id="edit-order" data-role="button" style="float:left;" class="Edit-Done-Buttons">Edit</a><a id="done-order" data-role="button" style="float:left;display:none;" class="Edit-Done-Buttons">Done</a><a id="submit-order" data-role="button" style="float:right;">Submit</a></div>'+
		//'<!--<div class="order-items-actions-div"><a id="submit-order" data-role="button" style="float:right;">Submit</a></div> -->'
	}
	return htmlResponse;
}

function getContactUsView(dataObject) {
	var dataObject = globalDataStructure.restaurantLocations[0];
	globalDataStructure.pager.contactus = {'href':'contact','controller':'getContactUs','navRef':'about','title':'Contact Us','backBtnTitle':'About Us','backBtnPagerId':'about'};
	var htmlResponse = '<div data-container="contact-us">'+
							'<div class="about-logo">'+
								'<img src="images/ebonyHomeIcon.png" />'+
								'<a class="contactwebLink" href="'+globalDataStructure.restaurantLocations[0].WebSite+'" rel="external" target="_blank">'+globalDataStructure.restaurantLocations[0].WebSite+'</a>'+
							'</div>'+							
							'<div id="contactus-info-container">'+
								'<div class="contactus-row" style="padding-top:5%; border-bottom:1px solid #ffffff; border-radius:10px 10px 0 0;">'+
									'<img src="images/phone@2x.png" align="left" width="20%"/>'+
									'<div class="contactus-text-block contactus-text-block-background">'+
										'<a href="tel:'+dataObject.PhoneNumber+'" class="contactus-link" rel=external>CALL US<br/><span class="contactus-text-block-phone">'+dataObject.PhoneNumber+'</span></a>'+
									'</div>'+
								'</div>'+
								'<div class="contactus-row">'+
									'<img src="images/mail@2x.png" align="left" /> '+
									'<div class="contactus-text-block contactus-text-block-background">'+
										'<a href="mailto:'+dataObject.EmailAddress+'" class="contactus-link">MAIL US<br/><span class="contactus-text-block-phone">'+dataObject.EmailAddress+'</span></a>'+
									'</div>'+
								'</div>'+
								'<div class="contactus-row">'+
									'<img src="images/globe@2x.png" align="left"/>'+
									'<div class="contactus-text-block contactus-text-block-background">'+
										'<a class="contactus-link pageTrigger" href="javascript:void(0)" data-href="findus" data-pagerId="findus">FIND US<br/><span class="contactus-text-block-phone">'+dataObject.RName+'</span></a>'+
									'</div>'+
								'</div>'+
								((dataObject.FacebookUrl === null || dataObject.FacebookUrl === undefined)?'':
									('<div class="contactus-row">'+
										'<img src="images/facebook@2x.png" align="left"/>'+
										'<div class="contactus-text-block contactus-text-block-background">'+
											'<a href="'+dataObject.FacebookUrl+'" class="contactus-link" data-ajax="false" rel="external" target="_blank">REACH US<br/><span class="contactus-text-block-phone" style="display:block;float:left;width:150px;">'+dataObject.FacebookUrl+'</span></a>'+
										'</div>'+
									'</div>')
								)+
								((dataObject.TwitterHandle === null || dataObject.TwitterHandle === undefined)?'':
									'<div class="contactus-row" >'+
										'<img src="images/twitter@2x.png" align="left" />'+
										'<div class="contactus-text-block contactus-text-block-background">'+
											'<a href="'+dataObject.TwitterHandle+'" class="contactus-link"  data-ajax="false" rel="external" target="_blank">FOLLOW US<br/><span class="contactus-text-block-phone">'+dataObject.TwitterHandle+'</span></a>'+
										'</div>'+
									'</div>'
								)+
							'</div> ';
	return htmlResponse;
}

function reviewsPageView() {
	var dataObject = globalDataStructure.Reviews;
	globalDataStructure.pager.myreviews={'href':'myreview','controller':'getMyReviews','navRef':'about','title':'My Reviews','backBtnTitle':'Reviews','backBtnPagerId':'reviews','rightBtnTitle':'submit','rightBtnTrigger':'myreviewssubmit','rightBtnPagerId':"createMyreviews"};
	
	var htmlResponse ='<div data-role="content" data-container="reviewsWraper">'
		+'<ul data-role="listview"><li><a href="javascript:void(0)" data-navRef="about" data-pageTitle="MyReviews" class="pageTrigger" data-pagerId="myreviews">Type your Review here.</a></li></ul>';
	htmlResponse += '<div class="userreview-contianer"><h3>User Reviews</h3><ul data-role="listview">';
	$.each(globalDataStructure.Reviews.Review, function(i,e){
		globalDataStructure.pager["review-"+e.ID]={'href':'review-'+e.ID,'controller':'getReview','navRef':'about','title':'Reviews','backBtnTitle':'Reviews','backBtnPagerId':'reviews','params':{'index':i}};
		htmlResponse += '<li data-icon="false"><a href="javascript:void(0)" data-href="review-'+e.ID+'" class="pageTrigger review" data-pagerId="review-'+e.ID+'" ><div class="userreviews-'+i+'" style="width:100%;float:left;"><div class="rating-div parent-div"><div class="userreviews-star" id="userrating-'+i+'" val="'+e.Rating+'"></div><div class="text-div">'+e.ReviewerName+'</div></div><div class="reviews-div text-div">'+e.ReviewText+'</div></div></a></li>';
			
	});	
	htmlResponse += '</div></ul></div>';
	return htmlResponse;
} 

function myReviewsPageView() {
	globalDataStructure.pager.createMyreviews={'href':'createMyreviews','controller':'createMyreviews','title':'Create My Reviews','navRef':'about','backBtnTitle':'Reviews','backBtnPagerId':'reviews'};
	var htmlResponse =  '<div data-container="Myreviews" data-role="content">'+
							'<form id="myreviews-submit"><div><textarea name="textarea" id="myreviews-textarea" cols="55" rows="50"></textarea></div>'+
							'<div class="showRating"><div id="star"></div></div>'+
							'</form></div>';
	return htmlResponse;
}

function getReviewView() {
	var dataObject = globalDataStructure.pager[globalDataStructure.pager.currPageId]
	var dataObject = globalDataStructure.Reviews.Review[globalDataStructure.pager[globalDataStructure.pager.currPageId].params.index];
	var htmlResponse = '<div data-container="Review" data-role="content"><div style="width:50%;float:left">'+dataObject.ReviewerName+'</div><div class="reviewRating" style="width:50%;float:left;"><div id="reviewstar" data-rating="'+dataObject.Rating+'"></div></div><div class="green-background" style="width:96%;float:left;height:200px;padding:2%;margin:2% 0;">'+dataObject.ReviewText+'</div></div>'
	return htmlResponse;
}

function generateTableView(dataObject){
	/*
	 * Basic eMuching versions of events view
	 * @param : {['ID': e.ID,'controller':'menuItemOrder','navRef':'menu','Title':e.Item,'backBtnTitle':'Featured Deals','backPagerId':'featuredDeals','params':{'position':i},'Time':'', 'Date':'', 'Desc':e.ItemDesc,'Thumb':e.ItemImage1,'pageName':'menuItem']}
	 */
	var htmlResponse = '';
	
	htmlResponse = '<div class="contentWrapper tableView" data-pageUIType="1">';
	
	$.each(dataObject,function(i,e){
		globalDataStructure.pager[e.pageName+"-"+e.ID] = {'href':e.pageName+"-"+e.ID,'controller':e.controller,'navRef':e.navRef,'title':e.Title,'backBtnTitle':e.backBtnTitle,'backBtnPagerId':e.backPagerId,'params':e.params};
		htmlResponse += '<a href="javascript:void(0)" data-href="'+e.pageName+'-'+e.ID+'" class="pageTrigger Trigger" data-pagerId="'+e.pageName+"-"+e.ID+'">'+
							'<div class="Title label_bg">'+e.Title+'</div>'+
							'<table>'+
								'<tbody>'+
									'<tr>'+
										'<td>Starts On</td>'+
										'<td>: '+e.Date+'</td>'+
									'</tr>'+
									'<tr>'+
										'<td>At</td>'+
										'<td>: '+e.Time+'</td>'+
									'</tr>'+
								'</tbody>'+
							'</table>'+
						'</a>';
	});
	
	htmlResponse += '</div>';
	return htmlResponse;
}

function generateTableDescView(dataObject){
	/*
	 * Basuc eMunching version of eventsDescView
	 * @param : {'Desc':''}
	 */
	var htmlResponse = '<div class="contentWrapper">'+
								dataObject.Desc+
						'</div>';
	return htmlResponse;
}

function generateSignatureMenu(dataObject){
	/*
	 *  Signature Menu
	 *  @param : {['ID': e.ID,'controller':'menuItemOrder','navRef':'menu','Title':e.Item,'backBtnTitle':'Featured Deals','backPagerId':'featuredDeals','params':{'position':i},'Time':'', 'Date':'', 'Desc':e.ItemDesc,'Thumb':e.ItemImage1,'pageName':'menuItem']}
	 *  @return : SignatureMenuHTMLResponse  
	 */
	var htmlResponse = '';
	var sliderWidth = ((dataObject.length) * (window.viewPortWidth)), sliderHeight =  (window.viewPortHeight)-($('ui-header').outerHeight(true)+$('ui-footer').outerHeight(true));
	globalDataStructure.pager.sliderObject = {};
	globalDataStructure.pager.sliderObject.slideCount = dataObject.length;
	globalDataStructure.pager.sliderObject.slideWidth =100/globalDataStructure.pager.sliderObject.slideCount;	
	globalDataStructure.pager.sliderObject.currSlide = 0;
	
	htmlResponse = '<div class="contentWrapper SignatureMenu" data-pageUIType="2" style="width:'+(globalDataStructure.pager.sliderObject.slideCount*100)+'%;min-height:'+sliderHeight+'px;">';
		htmlResponse +='<div id="contentSlider">';
		$.each(dataObject,function(i,e){
			globalDataStructure.pager[e.pageName+"-"+e.ID] = {'href':e.pageName+"-"+e.ID,'controller':e.controller,'navRef':e.navRef,'title':e.Title,'backBtnTitle':e.backBtnTitle,'backBtnPagerId':e.backPagerId,'params':e.params};
			htmlResponse += '<div class="slidercontent" data-pagerId="'+e.pageName+"-"+e.ID+'" id="content'+i+'" style="width:'+window.viewPortWidth+'px;min-height:'+window.viewPortHeight+'px;" >'+e.Desc+'</div>';
		});
		htmlResponse +=	'</div>'+
						'<div id="signatureSwipeLeft"><div><span class="slideTrigger">&nbsp;</span></div></div>'+
						'<div id="signatureSwipeRight"><div><span class="slideTrigger">&nbsp;</span></div></div>';
	htmlResponse += '</div>';
	
	return htmlResponse;
}

function generateListView(dataObject){
	/*
	 * Basic eMunching Style menu 
	 * @param : {['ID': e.ID,'controller':'menuItemOrder','navRef':'menu','Title':e.Item,'backBtnTitle':'Featured Deals','backPagerId':'featuredDeals','params':{'position':i},'Time':'', 'Date':'', 'Desc':e.ItemDesc,'Thumb':e.ItemImage1,'pageName':'menuItem']}
	 */
	// use input data object and prepare HTML to show to user
	var htmlResponse = '<div class="contentWrapper listView" data-pageUIType="3"><ul data-role="listview">';
	
	$.each(dataObject,function(i,e){
		globalDataStructure.pager[e.pageName+'-'+e.ID]= {'href':e.pageName+'-'+e.ID,'controller':e.controller,'navRef':e.navRef,'title':e.Title,params:e.params,'backBtnTitle':e.backBtnTitle,'backBtnPagerId':e.backPagerId};
		htmlResponse += '<li>'+
							'<a href="javascript:void(0)" data-href="'+e.pageName+'-'+e.ID+'" class="pageTrigger" data-pagerId="'+e.pageName+'-'+e.ID+'" >'+
								'<img src="'+e.Thumb+'" alt="'+e.Title+'" />'+
								'<h3>'+e.Title+'</h3>'+
								'<p>'+e.Desc+'</p>'+
							'</a>'+
						'</li>';
		});	
	htmlResponse += '</ul></div>';
	
	return htmlResponse;
}

function generateTeaserMenu(dataObject){
	/*
	 * Basic eMuching versions of events view
	 * @param : {['ID': e.ID,'controller':'menuItemOrder','navRef':'menu','Title':e.Item,'backBtnTitle':'Featured Deals','backPagerId':'featuredDeals','params':{'position':i},'Time':'', 'Date':'', 'Desc':e.ItemDesc,'Thumb':e.ItemImage1,'pageName':'menuItem']}
	 */
	var htmlResponse = '';
	
	htmlResponse = '<div class="contentWrapper teaserView" data-pageUIType="1">';
	
	$.each(dataObject,function(i,e){
		globalDataStructure.pager[e.pageName+"-"+e.ID] = {'href':e.pageName+"-"+e.ID,'controller':e.controller,'navRef':e.navRef,'title':e.Title,'backBtnTitle':e.backBtnTitle,'backBtnPagerId':e.backPagerId,'params':e.params};
		htmlResponse += '<a href="javascript:void(0)" data-href="'+e.pageName+'-'+e.ID+'" class="pageTrigger Trigger" data-pagerId="'+e.pageName+"-"+e.ID+'">';
		if(e.Thumb === 'http://www.emunching.com/Restaurants/Besito/ArtWork/DealImages/noimage-thumb.png' || e.Thumb === ""){		
			htmlResponse += '<div class="Title label_bg">'+e.Title+'</div>'+
			'<table>'+
				'<tbody>'+
					'<tr>'+
						'<td>Starts On</td>'+
						'<td>: '+e.Date+'</td>'+
					'</tr>'+
					'<tr>'+
						'<td>At</td>'+
						'<td>: '+e.Time+'</td>'+
					'</tr>'+
				'</tbody>'+
			'</table>';			
		}else{
			htmlResponse += '<div class="teaserThumb">'+e.Thumb+'</div>';
		}
		htmlResponse += '</a>';
		
	});
	
	htmlResponse += '</div>';
	return htmlResponse;
}