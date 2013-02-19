var config = {};
config.UserName = 'eMunch';			//webservice username
config.PassWord = 'idnlgeah11';		//webservice password
config.RestaurantID = '36';			//Restaurant ID of current application
window.globalDataStructure = {};		//holds all data retrieved from server via web service calls
var signOnBtn = $('#fwdBtn');

/*******************************************DEVICE INIT******************************************************************/
function HomeView(){
	
	var htmlResponse = '';
	/*
	 * Ebony Home Screen
	 */
	htmlResponse += '<div data-container="home">'+
						'<div class="homeHead">'+
							'<a class="transparentButton homeIcon" href="javascript:void(0)"><img src="images/ebonyHomeIcon.png"></a>'+
							'<div class="callButton"> <a href="'+(globalDataStructure.restaurantLocations === undefined ? 'javascript:void(0)' : 'tel:'+globalDataStructure.restaurantLocations[0].PhoneNumber)+'" rel="external"><img src="images/call@2x.png"></a></div>'+
						'</div>'+
						'<div class="homeButtons">'+
							'<a href="javascript:void(0)" data-href="hotdeals" data-pagerid="hotdeals" ontouchstart="javascript:linktouch(this);" class="transparentButton pageTrigger whatshot">WHAT\'S HOT</a>'+
							'<a href="http://www.emunching.com" rel="external" target="_blank" class="branding">POWERED BY EMUNCHING</span>'+
						'</div>'+
					'</div>';
	return htmlResponse;	
}

function showHomeScreen(){
	$('#page2').html(HomeView()).trigger('create');

	//setHeaderData(pageId);
	$('#backBtn').hide();
	$('#fwdBtn').removeClass('rightBtnTrigger').addClass('signInTrigger').attr('data-pagerId','signIn').show().find('.ui-btn-text').text('SignIn');
	$('.pageTrigger').each(function(i,e){$(e).removeClass('ui-btn-active forceActiveLink');});
	$('[data-href="home"]').addClass('ui-btn-active forceActiveLink');	
}
function pageInit(){	
	//preparing data object for each page on whole app. add relevent data when you creating new screen statically / dynamically accordingly.
	window.globalDataStructure.pager = {
		'home' : 			{	'href':'home',			'controller':'Home',				'navRef':'home',		'title':'Home',																												'rightBtnTitle':'SignIn',		'rightBtnPagerId':'signIn',			'rightBtnTrigger':'signInTrigger'},
		'menu' : 			{	'href':'menu',			'controller':'getMenuItemGroups',	'navRef':'menu',		'title':'Menu',																												'rightBtnTitle':'SignIn',		'rightBtnPagerId':'signIn',			'rightBtnTrigger':'signInTrigger'},
		'orders' : 			{	'href':'orders',		'controller':'orders',				'navRef':'orders',		'title':'Orders',																											'rightBtnTitle':'SignIn',		'rightBtnPagerId':'signIn',			'rightBtnTrigger':'signInTrigger'},
		'myorders' : 		{	'href':'myorders',		'controller':'myorders',			'navRef':'orders',		'title':'My Orders',	'backBtnTitle':'Orders',	'backBtnPagerId':'orders',												'rightBtnTitle':'SignIn',		'rightBtnPagerId':'signIn',			'rightBtnTrigger':'signInTrigger'},
		'reservation' : 	{	'href':'reservation',	'controller':'reservation',			'navRef':'reservation',	'title':'Reservation',	'backBtnTitle':'Reserve',	'backBtnPagerId':'resesrveTable',	'backBtnTrigger':'reserveTable',	'rightBtnTitle':'SignIn',		'rightBtnPagerId':'signIn',			'rightBtnTrigger':'signInTrigger'},
		'about' : 			{	'href':'about',			'controller':'getAbout',			'navRef':'about',		'title':'About Us',																											'rightBtnTitle':'SignIn',		'rightBtnPagerId':'signIn',			'rightBtnTrigger':'signInTrigger'},
		'events' : 			{	'href':'events',		'controller':'events',				'navRef':'about',		'title':'Events',		'backBtnTitle':'About',		'backBtnPagerId':'about',												'rightBtnTitle':'SignIn',		'rightBtnPagerId':'signIn',			'rightBtnTrigger':'signInTrigger'},
		'history' : 		{	'href':'history',		'controller':'getOurHistory',		'navRef':'about',		'title':'History',		'backBtnTitle':'About Us',	'backBtnPagerId':'about',												'rightBtnTitle':'SignIn',		'rightBtnPagerId':'signIn',			'rightBtnTrigger':'signInTrigger'},
		'locations' : 		{	'href':'location',		'controller':'getMapLocation',		'navRef':'about',		'title':'Location',		'backBtnTitle':'About Us',	'backBtnPagerId':'about',												'rightBtnTitle':'SignIn',		'rightBtnPagerId':'signIn',			'rightBtnTrigger':'signInTrigger'},
		'findus' : 			{	'href':'location',		'controller':'getMapLocation',		'navRef':'about',		'title':'Find Us',		'backBtnTitle':'Contact Us','backBtnPagerId':'contactus',											'rightBtnTitle':'SignIn',		'rightBtnPagerId':'signIn',			'rightBtnTrigger':'signInTrigger'},
		'contactus' : 		{	'href':'contact',		'controller':'getContactUs',		'navRef':'about',		'title':'Contact Us',	'backBtnTitle':'About Us',	'backBtnPagerId':'about',												'rightBtnTitle':'SignIn',		'rightBtnPagerId':'signIn',			'rightBtnTrigger':'signInTrigger'},
		'reviews' : 		{	'href':'reviews',		'controller':'getReviews',			'navRef':'about',		'title':'Reviews',		'backBtnTitle':'About',		'backBtnPagerId':'about',												'rightBtnTitle':'SignIn',		'rightBtnPagerId':'signIn',			'rightBtnTrigger':'signInTrigger'},
		'myreviews' : 		{	'href':'myreview',		'controller':'getMyReviews',		'navRef':'about',		'title':'My Reviews',	'backBtnTitle':'Reviews',	'backBtnPagerId':'reviews',												'rightBtnTitle':'submit',		'rightBtnPagerId':'CreateMyreviews','rightBtnTrigger':'myreviewssubmit'},
		'hotdeals' : 		{	'href':'hotdeals',		'controller':'deals',				'navRef':'home',		'title':'Hot Deals',	'backBtnTitle':'Home',		'backBtnPagerId':'home',												'rightBtnTitle':'SignIn',		'rightBtnPagerId':'signIn',			'rightBtnTrigger':'signInTrigger'},		
		'chefSpecials' : 	{	'href':'chefSpecials',	'controller':'chefSpecial',			'navRef':'home',		'title':'Chef Special'},
		'featuredDeals' : 	{	'href':'featuredDeals',	'controller':'featuredDeals',		'navRef':'home',		'title':'Featured Deals'}
	};
	window.globalDataStructure.pager.isLoading = false;

	$("#page2").show();
	/*$('#fwdBtn').addClass('signInUser');*/
	console.log($('#defaultPage'));
	showHomeScreen();
}


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


//event listener
document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("offline", noInternet , false);

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
	$('.whatshot').live('touchstart touchend',function(e){
		$(this).toggleClass('active');
	});
	$('.pageTrigger').live('click',function(e){		
		changePage($(this).attr('data-pagerId'));
	});
	$('.backBtnTrigger,.rightBtnTrigger').live('click',function(e){
		changePage($(this).attr('data-pagerId'));
	});
	$('#reservationForm').live('submit',function(e){
		console.log('form submit event triggered');
		e.preventDefault();
		e.stopPropagation();
	});
	$('.reserveTable').live('click',function(e){
		//check user login and if no logged in user available ask user to login
		if (localStorage.getItem('securedUserLoggedIn') === "true") { // loggedin user avaiable
			console.log('reservetable button clicked');
			console.log($('#reservename').val());
			console.log($('#reservecontact').val());
			console.log($('#reservetime').val());
			if (window.globalDataStructure.pager.currPageId === 'reservation') {
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
			window.globalDataStructure.pager.initLoginCallback = 'reservationPageloginCallback';
			console.log(window.globalDataStructure.pager);
			initLogin();			
		}
	});
	$('#fwdBtn.signInUser,#fwdBtn.signOutUser').live('click',function(e){
		console.log('singon Button Clicked');
		if(localStorage.getItem("securedUserLoggedIn")==="true"){
			console.log('LoggedIn User Exists.calling init logout');
			initLogout();
		}else{
			console.log('LoggedIn User Not Exists. calling init login');
			initLogin();
		}		
	});
	$('.myreviewssubmit').live('click', function(e) {
		
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
		//myreviewsObject.createMyreviewsPagerId = $(this).attr('data-pagerid');
		window.globalDataStructure.myreviewsObject=myreviewsObject;
		
		createMyreviewsContoller();
		
	});
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
	$('#addToOrder').live('click',function(e){
		var menuItemOrderPage = $(this).closest('#menuItemOrderScreen');
		var itemId = $(menuItemOrderPage).attr('data-menuItemId');
		var itemQuantity = '1';
		if(window.globalDataStructure.order === undefined){
			window.globalDataStructure.order = {};
		}
		if(window.globalDataStructure.order[itemId] === undefined){
			window.globalDataStructure.order[itemId] = window.globalDataStructure.MenuItems[$(menuItemOrderPage).attr('data-categoryid')][$(menuItemOrderPage).attr('data-menuItemPosition')];
			window.globalDataStructure.order[itemId].itemQuantity = itemQuantity;
			alert('Item added to order');
		}else{
			alert('Item already in your order');
		}
	});
	$('#submit-order').live('click',function(e) {
		if(confirm("Your order total cost is : " +$('#grand-total').html()+". Please confirm submission") ) {
			var orderlist = $(this).closest('#myorderlist');
			var menuitems = '';
			$('.order-background').each(function(){
			
				menuitems += $(this).attr('data-menuitem')+','+$(this).find('.text-itemquantity').val()+';';
			});
			window.globalDataStructure.createOrderMenuitems = menuitems;
			createOrderContoller();
		} else {
			return;
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
		if(window.globalDataStructure.order[itemmenuid] !== undefined){ 
			window.globalDataStructure.order[itemmenuid].itemQuantity = itemQuantity;
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
	$('.delete-item').live('click',function(){
		var r=confirm("Are sure you want to delete this item from your order");
		if (r===true) {
			var itemmenuid = $(this).attr('data-menuitem');
			var orderbackgroundelem =$(this).siblings('.order-background');
			
			if(window.globalDataStructure.order[itemmenuid] !== undefined){ 
				delete window.globalDataStructure.order[itemmenuid];
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
	console.log('complete on paginit');
	pageInit();
});

$('[data-role=page]').live('pageshow',function(){
	console.log('script.js pageshow triggered');
	console.log('lazy loading js after pageshow');
	
	<!-- lazy load javascript files -->
	$.getScript("js/Model/model.js").done(function(script, textStatus) {
		  console.log( textStatus );
		  $.getScript("js/View/view.js").done(function(script, textStatus) {
			  console.log( textStatus );
		});
		$.getScript("js/Controller/controller.js").done(function(script, textStatus) {
			  console.log( textStatus );
		      //init webservice calls to fetch data at background
			  getRestaurantLocation();
		});
		$.getScript("js/master.js").done(function(script, textStatus) {
		  console.log( textStatus );
		  if($('.signInTrigger').length>0){getSignOnStatus();}

		  //fix page height according to viewport dimenstions
		  adjustScreenViewPortHeihgt();
		});	
	});
	
	$.getScript("http://maps.google.com/maps/api/js?sensor=false").done(function(script, textStatus) {
		  console.log( textStatus );
	});
	$.getScript("js/jquery.mobiscroll-2.1.min.js").done(function(script, textStatus) {
		  console.log( textStatus );
	});
	$.getScript("js/jquery.raty.min.js").done(function(script, textStatus) {
		  console.log( textStatus );
	});
});