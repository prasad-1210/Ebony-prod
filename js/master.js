var config = {};
config.UserName = 'eMunch';			//webservice username
config.PassWord = 'idnlgeah11';		//webservice password
config.RestaurantID = '36';			//Restaurant ID of current application
config.DataAccessPoint = 'http://dev.emunching.com/eMunchingServices.asmx/JsonWrapper';
config.MealTypes = ['All','Breakfast','Brunch','Morning Tea','Lunch','Dinner','Afternoon Tea','Supper'];
config.activeMealType = 4;
var globalDataStructure = {};		//holds all data retrieved from server via web service calls
var signOnBtn = $('#fwdBtn');
globalDataStructure.patch = {};
globalDataStructure.RestaurantInitConfig = {
		'MealType':{
			'0':'4',
			'1':'5'
		},
		'UI':{									//1.TableView , 2.Signature, 3.ListView, 4.Teaser Menu
			'MenuType':3,						//Possible Values : 2 / 3
			'eventsType':4,						//Possible Values : 1 / 2 / 4 
			'dealsType':4,						//Possible Values : 1 / 2 / 4
			'chefSpecialsType':3,				//Possible Values : 3
			'featuredDealsType':3,				//Possible Values : 3				
			'getMenuItemGroupsType':3,			//dont change
			'getRestaurantMenuItemsAllType':3	//dont change
		}
}


/****************************************************Helper Function ***********************************************************/
function getUrlStringVars(urlString){
    var vars = {};
    var parts = urlString.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[unescape(key)] =  unescape(value);
    });
    return vars;
}

function locChanged(loc){
    console.log("locChanged!");
    console.log(loc);
    if(loc.indexOf("http://html5.emunching.com/facebookSuccess.html") >= 0){
    	console.log('location String:'+loc);
    	var attrArray = getUrlStringVars(loc);
    	console.log('closing Child Browser');
    	window.plugins.childBrowser.close();
    	console.log('call fbLoginController with arg: ');
    	console.log(attrArray);
    	fbLoginCallback(attrArray);
    }
}

function setSignInStatus(){
	//loggedIn User Already Exists
	console.log('setSignInStatus Called');
	console.log('user logged in already: loggin in');
	console.log('noUIAction value:'+globalDataStructure.pager.noSignOnUIAction+' type: '+typeof globalDataStructure.pager.noSignOnUIAction);
	if(globalDataStructure.pager.noSignOnUIAction === undefined || !globalDataStructure.pager.noSignOnUIAction){
		$("#fwdBtn .ui-btn-text").html("Sign Out");
		$('#fwdBtn').removeClass('signInUser').addClass('signOutUser');
		globalDataStructure.pager.noSignOnUIAction = false;
	}	
	console.log('initlogincallback:'+ globalDataStructure.pager.initLoginCallback);
	if(globalDataStructure.pager.initLoginCallback !== '' && globalDataStructure.pager.initLoginCallback !== undefined){
		window[globalDataStructure.pager.initLoginCallback]();
		globalDataStructure.pager.initLoginCallback = '';
	}
}

function setSignOutStatus(){
	//loggedIn User Already Exists
	console.log('setSignOutStatus Called');
	console.log('logged in user exists: loggin out');
	console.log('noUIAction value:'+globalDataStructure.pager.noSignOnUIAction+' type: '+typeof globalDataStructure.pager.noSignOnUIAction);
	if(globalDataStructure.pager.noSignOnUIAction !== undefined || !globalDataStructure.pager.noSignOnUIAction){
		$("#fwdBtn .ui-btn-text").html("SignIn");
		$('#fwdBtn').addClass('signInUser').removeClass('signOutUser');
		globalDataStructure.pager.noSignOnUIAction = false;
	}
	localStorage.clear();
	localStorage.setItem("securedUserLoggedIn", false);
}

function getSignOnStatus(){
	console.log('getSignOnStatus Called');
	if(localStorage.getItem("securedUserLoggedIn")==="true"){
		setSignInStatus();
	}else if(localStorage.getItem("securedUserLoggedIn")==="false"){
		setSignOutStatus();
	}else if(localStorage.getItem("securedUserLoggedIn")===null || typeof localStorage.getItem("securedUserLoggedIn") === undefined){
		setSignOutStatus();
	}
}

function initLogin(){
	console.log('initLogIn Called');
	if(localStorage.getItem("securedUserLoggedIn") === "true"){
		console.log('initLogIn:setSignInStatus()');
		setSignInStatus();
	}else{
		//loggedIn User Not Exists
		console.log('login functionality started');
		window.plugins.childBrowser.showWebPage("http://html5.emunching.com/facebook.html?action=fblogin", { showLocationBar: false });
	}
}

function initLogout(){
	console.log('initLogOut Called');
	if(localStorage.getItem("securedUserLoggedIn")==="true"){
		console.log('initLogout:setSignOutStatus()');
		setSignOutStatus();
	}else{
		//loggedIn User Not Exists
		console.log('login User not available. Something went wrong.');
	}
}

function LikeItemOnfaceBook(itemObj){	
	window.plugins.childBrowser.showWebPage("http://html5.emunching.com/facebook.html?action=fblike&link="+escape(window.globalDataStructure.restaurantLocations[0]['FacebookUrl'])+"&imgLink="+itemObj.ItemImage1+"&RestFBLink="+window.globalDataStructure.restaurantLocations[0].LName+"&itemName="+itemObj.Item+"&itemDesc="+itemObj.ItemDesc, { showLocationBar: false });
}

function makeArrayCircularStartFromItem(arr,index){
	var resArr = [];
	resArr = arr.slice(index);
	resArr = resArr.concat(arr.slice(0,index));
	return resArr;
}
/***********************************************************CallBack Functions***********************************/

function fbLoginCallback(authUserObj){
		//make user signin. set data to localstorage and initiate signup process.
		console.log('fbLogibCallback Called');
		console.log('setting local storage');
		console.log(authUserObj);
		localStorage.clear();
		localStorage.setItem("securedUserLoggedIn", true);
		localStorage.setItem("UserEmail", unescape(authUserObj.email));
		localStorage.setItem("UserFName", unescape(authUserObj.first_name));
		localStorage.setItem("UserLName", unescape(authUserObj.last_name));
		localStorage.setItem("UserName",  unescape(authUserObj.first_name)+' '+unescape(authUserObj.last_name));
		initLogin();
}

function getRestaurantLocationCallback(){
	//do something after restaurant data fetched like adding call number to call button
	$('.callButton a').attr('href','tel:'+globalDataStructure.restaurantLocations[0].PhoneNumber);
	$('#page2').trigger('create');
}

function reservationPageloginCallback(){
	console.log('user login functionality completed. set data to email field');
	if(localStorage.getItem('securedUserLoggedIn') === "true" && localStorage.getItem('UserEmail') !== undefined){
		console.log('email: '+$('#reserveemail').val()+' - '+ localStorage.getItem('UserEmail'));
		$("#reserveemail").attr("readonly",false);
		$('#reserveemail').val(localStorage.getItem('UserEmail'));
		$("#reserveemail").attr("readonly",true);
	}
}


function GoogleMap(){
	this.initialize = function(){
		var map = showMap();
		addMarkersToMap(map);
	};
	
	var showMap = function(){
		var mapOptions = {
				zoom: 7,
				center: new google.maps.LatLng(globalDataStructure.restaurantLocations[0].Latitude,globalDataStructure.restaurantLocations[0].Longitude),
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				title: globalDataStructure.restaurantLocations.RName,
				visible: true,
				clickable: true
		};
		
		/*var myLatlng = new google.maps.LatLng(globalDataStructure.restaurantLocations[0].Latitude,globalDataStructure.restaurantLocations[0].Longitude);
		
		var marker = new google.maps.Marker({
		    position: myLatlng,
		    map: map,
		    title:"Uluru (Ayers Rock)"
		});

		var contentString = '<h3>'+globalDataStructure.restaurantLocations.RName+'<h1>';
	
		var infowindow = new google.maps.InfoWindow({
		    content: contentString
		});
		
		infowindow.open(map,marker);*/
		
		var map = new google.maps.Map(document.getElementById("locationMap"), mapOptions);
		return map;
	};
	
	var addMarkersToMap = function(map){
		$(globalDataStructure.restaurantLocations).each(function(i,e){
			var mapBounds = new google.maps.LatLngBounds();
			var latitudeAndLongitudeOne = new google.maps.LatLng(e.Latitude,e.Longitude);
			var markerOne = new google.maps.Marker({
				position: latitudeAndLongitudeOne,
				map: map
			});
		});
	};

}

function getMapLocationCallback(){
	var height = ($('#mainPage').height())-($('.ui-header').height() + $('.ui-footer').height());
	$('#page2>div').height(height);
	console.log('callbak function of location page');	
	var map = new GoogleMap();
    map.initialize();
}

function reservationCallback(data){
	if(globalDataStructure.restResvConfig !== undefined){
		var now = new Date();
	    $('.datetime').scroller({
	    	preset: 'datetime',
	        minDate: now,
	        theme: 'jqm',
	        display: 'bottom',
	        animate: 'swing',
	        mode: 'scroller',
	        dateFormat:'yy-mm-dd',
	        timeFormat:'HH:ii:ss',
	        stepMinute: parseInt(globalDataStructure.restResvConfig.Interval)
	        
	    });
	    $('#reservetime').live('click',function(e){
	    	e.stopPropagation();
	    	e.preventDefault();
	    	console.log('showing date time picker');
	    	$(this).scroller('show');
	    	return false;
	    });
    }else{
    	//data not returned yet.
    }
}

function reserveTableCallback(data){
		if(data === 'Loading'){
			$.mobile.loading( 'show');
			console.log('reservation callback: initiated');
			console.dir(data);
		}else if(data === 'Accepted'){
			$.mobile.loading( 'hide');
			alert('We got your request. we\'ll reserve a table and contact you back on email');
			console.log('reservation callback completed: accepted');
			$('reservationForm').reset();
			console.dir(data);
		}else{
			$.mobile.loading( 'hide');
			alert('we got some technical issues to reserve a table for you. we are looking into the issue.');
			console.log('reservation callback complete: rejected');
		}	
	
}

function getAboutCallback(){
	$('.operatingText').text('HOURS OF OPERATION: '+ globalDataStructure.restaurantLocations[0].HoursOfOperation);
}

function getMyReviewsCallback(pageId) { 
	
	$('#star').raty({
		  cancel    : true,
		  cancelOff : 'cancel-off-big.png',
		  cancelOn  : 'cancel-on-big.png',
		  space     : true,  
		  size      : 24,
		  path      : 'images',  
		  starOff   : 'star-off-big.png',
		  starOn    : 'star-on-big.png',
		  hints     : ['1', '2', '3', '4', '5']
		});
}

function getReviewsCallback(pageId) {
	$(".userreviews-star").each(function(){
		var value = $(this).attr('val');
		$('#'+this.id).raty({
			  readOnly : true,
			  score    : value,
			  path     : 'images',
			  hints    : ['1', '2', '3', '4', '5'],
			  space: false
		});
		
	});
		
}

function createMyreviewsCallback(pageId) {
	$.mobile.loading( 'hide');
	$('#backBtn').trigger('click');
}

function createOrderCallback(pageId) {
	$.mobile.loading( 'hide');
	globalDataStructure.order = {};
	$('#backBtn').trigger('click');
	//changePage('menu');
	
}

function ordersCallback(pageId) {
	var footerheight = $('.ui-footer').height();
	$('#list-total-prices').css('position','fixed');
	$('#list-total-prices').css('bottom',footerheight+'px');

	$('#myorderlist').css('height',($('#mainPage').height()-$('#list-total-prices').height())+'px');
	$('div[data-container="MyOrdersWrapper"]').css('padding-bottom',$('#list-total-prices').height()+"px");
}

function getReviewCallback(pageId) {
	
		var value = $('#reviewstar').attr('data-rating');
		$('#reviewstar').raty({
			  readOnly : true,
			  score    : value,
			  path     : 'images',
			  hints    : ['1', '2', '3', '4', '5'],
			  space: true
		});	
}

function ReviewsSubmitCallback(){
	console.log('ReviewsSubmitCallback');
	createMyreviewsContoller();
}

function orderSubmitCallback(){
	console.log('ReviewsSubmitCallback');
	createOrderContoller();
} 

/************************************************************* Slide Page Functions **********************************************/
function sliderLeft(e){
	e.stopPropagation();
	e.preventDefault();	
	globalDataStructure.pager.sliderObject.nextSlide = (globalDataStructure.pager.sliderObject.currSlide === 0)?(globalDataStructure.pager.sliderObject.slideCount-1):(globalDataStructure.pager.sliderObject.currSlide-1)
	var slide1 = $('#contentSlider').children('#content'+globalDataStructure.pager.sliderObject.currSlide);
	var slide2 = $('#contentSlider').children('#content'+globalDataStructure.pager.sliderObject.nextSlide);
	
	$('#contentSlider').animate({'marginLeft': '-'+(globalDataStructure.pager.sliderObject.nextSlide*(100/globalDataStructure.pager.sliderObject.slideCount))+'%'}, 500);
	$(slide1).removeClass('active');
	$(slide2).addClass('active');
	globalDataStructure.pager.sliderObject.currSlide = globalDataStructure.pager.sliderObject.nextSlide;
	$('#headerHeading').html(globalDataStructure.pager[$('#contentSlider .active').attr('data-pagerId')].title);
}

function sliderRight(e){
	e.stopPropagation();
	e.preventDefault();
	globalDataStructure.pager.sliderObject.nextSlide = (globalDataStructure.pager.sliderObject.currSlide === (globalDataStructure.pager.sliderObject.slideCount-1))?0:(globalDataStructure.pager.sliderObject.currSlide+1);
	var slide1 = $('#contentSlider').children('#content'+globalDataStructure.pager.sliderObject.currSlide);
	var slide2 = $('#contentSlider').children('#content'+globalDataStructure.pager.sliderObject.nextSlide);
	
	$('#contentSlider').animate({'marginLeft': '-'+(globalDataStructure.pager.sliderObject.nextSlide*(100/globalDataStructure.pager.sliderObject.slideCount))+'%'}, 500);
	$(slide1).removeClass('active');
	$(slide2).addClass('active');
	globalDataStructure.pager.sliderObject.currSlide = globalDataStructure.pager.sliderObject.nextSlide;
	console.log('active pagerId:'+$('#contentSlider .active').attr('data-pagerId'));
	$('#headerHeading').html(globalDataStructure.pager[$('#contentSlider .active').attr('data-pagerId')].title);
}

function sliderCallback(){
	console.log('isLoaded:'+$('#contentSlider').length);
	globalDataStructure.pager.sliderObject.currSlide = 0;
	if($('#contentSlider').length>0){		
		var firstChild = $('#contentSlider').children(':first-child'),title = globalDataStructure.pager[$(firstChild).attr('data-pagerid')].title;
		console.log(firstChild);
		console.log('updating header title: '+title);
		$(firstChild).addClass('active');
		$('#headerHeading').html((title === undefined)?'Events':title);
		console.log('manipulating heights: contentSlider:'+$('#contentSlider').height()+' contentWrapper:'+$('.contentWrapper').height());
		/*$('.contentWrapper').height($('#contentSlider').height()-30);*/
	}
	
}
/*****************************************************************ChangePage Functions********************************************/

function adjustScreenViewPortHeihgt(){	
	var height = (window.windowHeight)-($('.ui-header').outerHeight(true) + $('.ui-footer').outerHeight(true));
	$('#page2').css({'min-height': height+'px'});
}

function setHeaderData(pageId){	
	var backBtnObj = $('#backBtn'),rightBtnObj = $('#fwdBtn'),pageObj = globalDataStructure.pager[pageId];
	console.log('page data:');
	console.log(pageObj);
	
	//handle pageTitle
	$('#headerHeading').text(pageObj.title);
	//set footer active nav link
	$('.pageTrigger').each(function(i,e){$(e).removeClass('ui-btn-active forceActiveLink');});
	$('[data-href="'+globalDataStructure.pager[globalDataStructure.pager.currPageId].navRef+'"]').addClass('ui-btn-active forceActiveLink');
	
	//show or hide left and right header buttons
	//clean prev page trigger classes
	if(globalDataStructure.pager.prevPageId !== null && globalDataStructure.pager.prevPageId !== undefined){
		console.log('cleaning previous page trigger data');
		var PageTrigger = globalDataStructure.pager[globalDataStructure.pager.prevPageId].backBtnTrigger;
		if(PageTrigger !== null && PageTrigger !== undefined){$(backBtnObj).removeClass(PageTrigger);}
		PageTrigger = globalDataStructure.pager[globalDataStructure.pager.prevPageId].rightBtnTrigger;
		if(PageTrigger !== null && PageTrigger !== undefined){$(rightBtnObj).removeClass(PageTrigger);}
	}
	
	if(pageObj.backBtnTitle === undefined){
		console.log('backbutton hidden bcz title: '+pageObj.backBtnTitle); 
		$(backBtnObj).hide();
	}else{
		console.log('backbutton Shown bcz title: '+pageObj.backBtnTitle);
		if(pageObj.backBtnTrigger !== undefined){
			$(backBtnObj).removeClass('backBtnTrigger').addClass(pageObj.backBtnTrigger);
		}else{
			//.removeClass('submitorder')
			$(backBtnObj).addClass('backBtnTrigger');
		}
		$(backBtnObj).attr('data-pagerId',pageObj.backBtnPagerId).show().find('.ui-btn-text').text(pageObj.backBtnTitle);
	}
	if(pageObj.rightBtnTitle === undefined){
		console.log('right button hidden bcz title: '+pageObj.rightBtnTitle);
		$(rightBtnObj).hide();
	}else{
		console.log('right button Shown bcz title: '+pageObj.rightBtnTitle);
		if(pageObj.rightBtnTrigger !== undefined){
			$(rightBtnObj).removeClass('rightBtnTrigger signInTrigger signInUser signOutUser').addClass(pageObj.rightBtnTrigger);
		}else{
			$(rightBtnObj).removeClass('signInTrigger signInUser signOutUser').addClass('rightBtnTrigger');
		}		
		$(rightBtnObj).attr('data-pagerId',pageObj.rightBtnPagerId).show().find('.ui-btn-text').text(pageObj.rightBtnTitle);
	}
	
	//check signInStatus if there is a signin button
	if($('.signInTrigger').length>0){
		getSignOnStatus();
	}
}

function changePage(pageId){
	if(globalDataStructure.pager.isLoading){
		//another call is going on
		return;
	}else{	//new call is initiating
		globalDataStructure.pager.prevPageId = globalDataStructure.pager.currPageId; 
		globalDataStructure.pager.currPageId = pageId;
		var newPage = globalDataStructure.pager[pageId];
		var newPageController = newPage.controller +'Controller'; 
		window[newPageController](null);
	}
}

function changePageCallback(data,pageId){
	if(data === 'Loading'){
		$("#page1").html($('#page2').html());														//copy page2 to page1 for backup and serve back button
		$("#page2").html('');																		//clear page2
		$.mobile.loading( 'show');
	}else{
		$.mobile.loading( 'hide');
		$('#page2').html(data);
	}
	$('#page2').trigger('create');
	$.mobile.silentScroll(0);
	if(pageId === null || pageId === undefined){
		pageId = globalDataStructure.pager.currPageId;
	}	
	setHeaderData(pageId);
	var callbackFunc = globalDataStructure.pager[pageId].controller + 'Callback';
	if(window[callbackFunc] !== undefined){
		window[callbackFunc](pageId);
	}
	console.log($('.contentWrapper').attr('data-pageUIType'));
	if($('.contentWrapper').hasClass('SignatureMenu')){	//if ui is a slider call slider callback to set page defaults 
		sliderCallback();
	}	
	$('#page2').trigger('create');
	adjustScreenViewPortHeihgt();
}

function pageInit(){	
	//preparing data object for each page on whole app. add relevent data when you creating new screen statically / dynamically accordingly.
	globalDataStructure.pager = {
		'home' : 			{	'href':'home',			'controller':'Home',				'navRef':'home',		'title':'Home',																												'rightBtnTitle':'SignIn',		'rightBtnPagerId':'signIn',			'rightBtnTrigger':'signInTrigger'},
		'menu' : 			{	'href':'menu',			'controller':'getMenuItemGroups',	'navRef':'menu',		'title':'Menu',																												'rightBtnTitle':'SignIn',		'rightBtnPagerId':'signIn',			'rightBtnTrigger':'signInTrigger'},
		'orders' : 			{	'href':'orders',		'controller':'orders',				'navRef':'orders',		'title':'Orders',       'backBtnTitle':'Submit','backBtnTrigger':'submitorder',													'rightBtnTitle':'SignIn',		'rightBtnPagerId':'signIn',			'rightBtnTrigger':'signInTrigger'},
		'myorders' : 		{	'href':'myorders',		'controller':'myorders',			'navRef':'orders',		'title':'My Orders',	'backBtnTitle':'Orders',	'backBtnPagerId':'orders',												'rightBtnTitle':'SignIn',		'rightBtnPagerId':'signIn',			'rightBtnTrigger':'signInTrigger'},
		'reservation' : 	{	'href':'reservation',	'controller':'reservation',			'navRef':'reservation',	'title':'Reservation',	'backBtnTitle':'Reserve',	'backBtnPagerId':'resesrveTable',	'backBtnTrigger':'reserveTable',	'rightBtnTitle':'SignIn',		'rightBtnPagerId':'signIn',			'rightBtnTrigger':'signInTrigger'},
		'about' : 			{	'href':'about',			'controller':'getAbout',			'navRef':'about',		'title':'About Us',																											'rightBtnTitle':'SignIn',		'rightBtnPagerId':'signIn',			'rightBtnTrigger':'signInTrigger'},
		'events' : 			{	'href':'events',		'controller':'events',				'navRef':'about',		'title':'Events',		'backBtnTitle':'About',		'backBtnPagerId':'about',												'rightBtnTitle':'SignIn',		'rightBtnPagerId':'signIn',			'rightBtnTrigger':'signInTrigger'},
		'history' : 		{	'href':'history',		'controller':'getOurHistory',		'navRef':'about',		'title':'History',		'backBtnTitle':'About Us',	'backBtnPagerId':'about',												'rightBtnTitle':'SignIn',		'rightBtnPagerId':'signIn',			'rightBtnTrigger':'signInTrigger'},
		'locations' : 		{	'href':'location',		'controller':'getMapLocation',		'navRef':'about',		'title':'Location',		'backBtnTitle':'About Us',	'backBtnPagerId':'about',												'rightBtnTitle':'SignIn',		'rightBtnPagerId':'signIn',			'rightBtnTrigger':'signInTrigger'},
		'findus' : 			{	'href':'location',		'controller':'getMapLocation',		'navRef':'about',		'title':'Find Us',		'backBtnTitle':'Contact Us','backBtnPagerId':'contactus',											'rightBtnTitle':'SignIn',		'rightBtnPagerId':'signIn',			'rightBtnTrigger':'signInTrigger'},
		'contactus' : 		{	'href':'contact',		'controller':'getContactUs',		'navRef':'about',		'title':'Contact Us',	'backBtnTitle':'About Us',	'backBtnPagerId':'about',												'rightBtnTitle':'SignIn',		'rightBtnPagerId':'signIn',			'rightBtnTrigger':'signInTrigger'},
		'reviews' : 		{	'href':'reviews',		'controller':'getReviews',			'navRef':'about',		'title':'Reviews',		'backBtnTitle':'About',		'backBtnPagerId':'about',												'rightBtnTitle':'SignIn',		'rightBtnPagerId':'signIn',			'rightBtnTrigger':'signInTrigger'},
		'createOrder' : 	{	'href':'createOrder',	'controller':'createOrder',			'navRef':'orders',		'title':'Create Order',	'backBtnTitle':'Menu',		'backBtnPagerId':'menu'},
		'myreviews' : 		{	'href':'myreview',		'controller':'getMyReviews',		'navRef':'about',		'title':'My Reviews',	'backBtnTitle':'Reviews',	'backBtnPagerId':'reviews',												'rightBtnTitle':'submit',		'rightBtnPagerId':'CreateMyreviews','rightBtnTrigger':'myreviewssubmit'},
		'hotdeals' : 		{	'href':'hotdeals',		'controller':'deals',				'navRef':'home',		'title':'Hot Deals',	'backBtnTitle':'Home',		'backBtnPagerId':'home',												'rightBtnTitle':'SignIn',		'rightBtnPagerId':'signIn',			'rightBtnTrigger':'signInTrigger'},		
		'chefSpecials' : 	{	'href':'chefSpecials',	'controller':'chefSpecial',			'navRef':'home',		'title':'Chef Special'},
		'featuredDeals' : 	{	'href':'featuredDeals',	'controller':'featuredDeals',		'navRef':'home',		'title':'Featured Deals'}
	};
	globalDataStructure.pager.isLoading = false;
	
	

	$("#page2").show();
	/*$('#fwdBtn').addClass('signInUser');*/
	console.log($('#defaultPage'));
	changePage($('#defaultPage').attr('data-pagerId'));
	//init webservice calls to fetch data at background
	getRestaurantLocation();
	//fix page height according to viewport dimenstions
	adjustScreenViewPortHeihgt();
	
	evaluateWindowDims();
}

function evaluateWindowDims(){
	console.log('updating viewport dims');
	window.windowWidth = document.documentElement.clientWidth;
	window.windowHeight = document.documentElement.clientHeight;
	/*window.viewPortWidth = jQuery('#page2').width() - parseInt($('#page2 div').css('margin-left').slice(0,-2));
	window.viewPortHeight = jQuery('#page2').height() - parseInt($('#page2 div').css('margin-left').slice(0,-2));*/
	window.viewPortMarginLeft = 15;
	window.viewPortMarginRight = 15;
	window.ContentWrapperMarginRight = 30;
	window.viewPortWidth = window.innerWidth//window.windowWidth -(window.viewPortMarginLeft + window.viewPortMarginRight);
	window.viewPortHeight = window.windowHeight - ($('.ui-header').outerHeight(true) + $('.ui-footer').outerHeight(true));
	window.dims = true;
	
	var widthObj = {
	            	'document.body.offsetWidth':document.body.offsetWidth,
	            	'document.documentElement.offsetWidth':document.documentElement.offsetWidth,
	            	'window.innerWidth':window.innerWidth,
	            	'screen.height':screen.height,
	            	'screen.width':screen.width,
	            	'$(window).width()':$(window).width(),
	            	'$(document).width()':$(document).width()
	};
	console.log(widthObj);
	var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
	console.log(x);
}

/*******************************************DEVICE INIT******************************************************************/


function onDeviceReady() {
    // Empty
	console.log('ondeviceReady on ');
	var root = this;
    cb = window.plugins.childBrowser;
    if(cb !== null) {
	    cb.onLocationChange = function(loc){ root.locChanged(loc); };
	    /*cb.onClose = function(){root.onCloseBrowser(); };*/
    }    
}

function noInternet(){
	alert('No Internet Connection');
}

function onResize(){
	
}

//event listener
document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("offline", noInternet , false);
document.addEventListener("resize", onResize() , false);

//init events
$(document).live("mobileinit", function(){
	//apply overrides here
	//allow cross origin resource sharing
	$.support.cors = true;
	$.mobile.allowCrossDomainPages = true;
	$.mobile.defaultPageTransition = 'none';
	$.mobile.touchOverflowEnabled = false;
	
 
	$.mobile.loader.prototype.options.text = "loading";
	$.mobile.loader.prototype.options.textVisible = false;
	$.mobile.loader.prototype.options.theme = "a";
	$.mobile.loader.prototype.options.html = "";

	$("[data-position='fixed']").fixedtoolbar('show');
	$("[data-role=header],[data-role=footer]").fixedtoolbar({ updatePagePadding: false,fullscreen: false,tapToggle:false, hideDuringFocus: "input, select, textarea" });
     
     $.mobile.page.prototype.options.degradeInputs.date = true;     
});

$('[data-role=page]').live('orientationchange',function(){
	adjustScreenViewPortHeihgt();
});
$('[data-role=page]').live('pageinit',function(){
	console.log('script.js pageinit triggered');
	$('#mainPage').trigger('create');
	//use as jquery.ready() function
	
	//What's Hot click Handling Function (Generic App Specific)
	$('.whatshot').live('touchstart touchend',function(e){
		$(this).toggleClass('active');
	});
	
	//Page Navigation Handling Functions
	$('.pageTrigger').live('tap',function(e){		
		changePage($(this).attr('data-pagerId'));
	});
	
	//page navigation (back, forward Buttons) Handling Functions
	$('.backBtnTrigger,.rightBtnTrigger').live('tap',function(e){
		changePage($(this).attr('data-pagerId'));
	});

	//Reservation Handling Functions
	$('#reservationForm').live('submit tap',function(e){
		console.log('form submit event triggered');
		e.preventDefault();
		e.stopPropagation();
	});
	
	$('.reserveTable').live('tap',function(e){
		//check user login and if no logged in user available ask user to login
		if (localStorage.getItem('securedUserLoggedIn') === "true") { // loggedin user avaiable
			console.log('reservetable button clicked');
			console.log($('#reservename').val());
			console.log($('#reservecontact').val());
			console.log($('#reservetime').val());
			if (globalDataStructure.pager.currPageId === 'reservation') {
				if ($('#reservename').val() === '') {
					console.log($('#reservename').val());
					alert('Please enter name');
				} else if ($('#reservecontact').val() === '') {
					console.log($('#reservecontact').val());
					alert('Plase enter phone number');
				} else if ($('#reservetime').val() === '') {
					console.log($('#reservetime').val());
					alert('Please select Date and Time');
				} else {
					console.log('everytihing got validated. all set to go.');
					console.log($('#reservename').val());
					console.log($('#reservecontact').val());
					console.log($('#reservetime').val());
					var reserveObject = {};
					reserveObject['ResName'] = $('#reservename').val();
					reserveObject['CallBackNumber'] = $('#reservecontact').val();
					reserveObject['RestaurantLocaID'] = $('#reservelocation').val();
					reserveObject['UserID'] = $('#reserveemail').val();
					reserveObject['NumGuests'] = $('#reservecount').val();
					reserveObject['TimeSlot'] = $('#reservetime').val();
					reserveTable(reserveObject);
				}
			} else {
				$(this).removeClass('reserveTable');
			}
		} else { //no loggedin user. ask user to login.
			globalDataStructure.pager.initLoginCallback = 'reservationPageloginCallback';
			console.log(globalDataStructure.pager);
			initLogin();			
		}
	});
	
	// Handling Sign-On Actions
	$('#fwdBtn.signInUser,#fwdBtn.signOutUser').live('tap',function(e){
		console.log('singon Button Clicked');
		if(localStorage.getItem("securedUserLoggedIn")==="true"){
			console.log('LoggedIn User Exists.calling init logout');
			initLogout();
		}else{
			console.log('LoggedIn User Not Exists. calling init login');
			initLogin();
		}
	});
	
	//Reviews Handling Functions
	$('.myreviewssubmit').live('tap', function(e) {
		var myreviewsObject = {};
		myreviewsObject.rating = $("[name='score']").val();
		myreviewsObject.review = $.trim($('#myreviews-textarea').val());
		if(myreviewsObject.review === "" || myreviewsObject.review === undefined) {
			alert("Enter your review");
			return;
		} else if(myreviewsObject.rating === "" || myreviewsObject.rating === undefined){
			alert("Enter your rating");
			return;
		}
		globalDataStructure.myreviewsObject=myreviewsObject;
		$.mobile.loading( 'show');
		console.log('localstorage:'+localStorage.getItem('securedUserLoggedIn'));
		
		//check user login and if no logged in user available ask user to login
		if (localStorage.getItem('securedUserLoggedIn') === "true") { // loggedin user avaiable
			console.log('loggedin user exists calling ReviewsSubmitCallback');
			ReviewsSubmitCallback();
		} else { //no loggedin user. ask user to login.
			console.log('loggedinUser not available. init login called with ReviewsSubmitCallback')
			globalDataStructure.pager.initLoginCallback = 'ReviewsSubmitCallback';
			globalDataStructure.pager.noSignOnUIAction = true;
			console.log(globalDataStructure.pager);
			initLogin();
		}
		
	});
	//image slider Handling Functions
	$('.imgContent').live('swipeleft',function(e){
		e.stopPropagation();
		$('.imgContent').animate({
			left:'-100%'
		},'1500',function(){
			$('.imgContent').siblings('.imageBreadCrumb').children('span.active').removeClass('active').next().addClass('active');
		});
	});
	$('.imgContent').live('swipeRight',function(e){
		e.stopPropagation();
		$('.imgContent').animate({
			left:'0'
		},'1500',function(){
			$('.imgContent').siblings('.imageBreadCrumb').children('span.active').removeClass('active').prev().addClass('active');
		});
	});
	
	//Order Page Handling Functions
	$('#addToOrder').live('click tap',function(e){
		var menuItemOrderPage = $(this).closest('#menuItemOrderScreen');
		var itemId = $(menuItemOrderPage).attr('data-menuItemId');
		var itemQuantity = '1';
		if(globalDataStructure.order === undefined){
			globalDataStructure.order = {};
		}
		if(globalDataStructure.order[itemId] === undefined){
			globalDataStructure.order[itemId] = globalDataStructure.MenuItems[$(menuItemOrderPage).attr('data-categoryid')][$(menuItemOrderPage).attr('data-menuItemPosition')];
			globalDataStructure.order[itemId].itemQuantity = itemQuantity;
			alert('Item added to order');
		}else{
			alert('Item already in your order');
		}
	});
	$('.submitorder').live('click tap',function(e) {
		if($('#page2').find('#grand-total').length !==0 ) {
			if(confirm("Submit Order") ) {
				$.mobile.loading( 'show');
				var orderlist = $(this).closest('#myorderlist');
				var menuitems = '';
				$('.order-background').each(function(){
					menuitems += $(this).attr('data-menuitem')+','+$(this).find('.text-itemquantity').val()+';';
				});
				globalDataStructure.createOrderMenuitems = menuitems;
				//check user login and if no logged in user available ask user to login
				if (localStorage.getItem('securedUserLoggedIn') === "true") { // loggedin user avaiable
					orderSubmitCallback();
				} else { //no loggedin user. ask user to login.
					console.log('loggedinUser not available. init login called with ReviewsSubmitCallback')
					globalDataStructure.pager.initLoginCallback = 'orderSubmitCallback';
					console.log(globalDataStructure.pager);
					initLogin();
				}
			} else {
				return;
			}
		}
		
	});
	$('.text-itemquantity').live('change',function(){
		var orderbackgroundelem = $(this).parents('.order-background');
		var itemoriginalprice = orderbackgroundelem.attr('data-menuitemprice');
		var itemdiscountprice = orderbackgroundelem.attr('data-menuitem-discount-price');
		var itemmenuid = orderbackgroundelem.attr('data-menuitem');
		var itemQuantity = $(this).val();
		if(itemQuantity === "" || itemQuantity === null) {
			itemQuantity = 1;
			$(this).val(1);
		}
		if(globalDataStructure.order[itemmenuid] !== undefined){ 
			globalDataStructure.order[itemmenuid].itemQuantity = itemQuantity;
		}
		var itemprice = itemoriginalprice;
		var oldPrice = orderbackgroundelem.find('#order-item-price').text().slice(1);
		var grandTotal = $('#grand-total').text().slice(1);
		if(itemdiscountprice > 0) {			
			var oldOriginalPrice = orderbackgroundelem.find('#order-item-originalprice').text().slice(1);
			var savingstotal = $('#savings-total').text().slice(1);			
			$('#savings-total').text('$'+(savingstotal-(oldOriginalPrice-oldPrice)+(itemoriginalprice-itemprice)*itemQuantity));
			$('#grand-total').text('$'+(grandTotal-(oldPrice)+(itemprice)*itemQuantity));		
			orderbackgroundelem.find('#order-item-price').text('$'+itemprice * itemQuantity);
			orderbackgroundelem.find('#order-item-originalprice').text('$'+itemoriginalprice * itemQuantity);
		} else {
			$('#grand-total').text('$'+(grandTotal-(oldPrice)+((itemprice)*itemQuantity)));
			orderbackgroundelem.find('#order-item-price').text('$'+itemprice * itemQuantity);
		}
		
		 
	});
	$('.delete-item').live('click tap',function(){
		var r=confirm("Are sure you want to delete this item from your order");
		if (r===true) {
			var itemmenuid = $(this).attr('data-menuitem');
			var orderbackgroundelem =$(this).siblings('.order-background');
			
			if(globalDataStructure.order[itemmenuid] !== undefined){ 
				delete globalDataStructure.order[itemmenuid];
			}
			
			if($('ul#myorderlist li').length === 1)  {
				$('.pageView').html('<p class="noData">No Orders Yet. Go to Menu and add some items</p>');
			} else {
				var itemTotalPrice = orderbackgroundelem.find('#order-item-price').text().slice(1);
				var savetotal = $('#savings-total').text().slice(1);
				var grandtotal = $('#grand-total').text().slice(1);  
				
				if(orderbackgroundelem.find('#order-item-originalprice').length !== 0) {
					var itemTotalOriginalPrice = orderbackgroundelem.find('#order-item-originalprice').text().slice(1);
				
					$('#savings-total').text('$'+(savetotal - (itemTotalOriginalPrice - itemTotalPrice)));	
				} 
				
				$('#grand-total').text('$'+(grandtotal - itemTotalPrice));
				$(this).parent('li').remove();
			}
		}
		
	});
	
	// FB Like an Menu Item Handling Functions  
	$('#menuItemOrderFBLike').live('click tap',function(e){
		var itemObj = {};
		itemObj= window.globalDataStructure.MenuItems[$(this).closest('#menuItemOrderScreen').attr('data-categoryid')][$(this).closest('#menuItemOrderScreen').attr('data-menuitemposition')];		
		LikeItemOnfaceBook(itemObj);
	});
	
	//Slider Handling Functions
	$('#signatureSwipeRight .slideTrigger').live('tap',function(e){sliderRight(e);});
	$('#signatureSwipeLeft .slideTrigger').live('tap',function(e){sliderLeft(e);});
	$('#contentSlider').live('swipeleft',function(e){sliderRight(e);});
	$('#contentSlider').live('swiperight',function(e){sliderLeft(e);});
	$('#typeToggle a').live('tap',function(e){
		config.activeMealType = parseInt($(this).attr('data-param'));
		$('#toggleLeftTrigger,#toggleRightTrigger').toggleClass('active');		
	});
	pageInit();
});

$('[data-role=page]').live('pageshow',function(){
	console.log('script.js pageshow triggered');
});