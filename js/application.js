/*!
 * Switcheroo by OriginalEXE
 * https://github.com/OriginalEXE/Switcheroo
 * MIT licensed
 * Modified by Won J. You
 */

// Global "use strict", wrap it up in functions if you can't deal with it...
"use strict";

var $viewportButtons = $( '.mobile-btn, .tablet-btn, .laptop-btn, .desktop-btn' ),
	$body = $( 'body' ),
	$webIframe = $( '.web-iframe' ),
	currentView = 0, //the active view
	defaultURL = "", //the url that the page should go to on initial load, if wanted
	disableURLField = false; //hide the url input field if you don't want a user to change it


// Let's calculate iframe height
function switcher_iframe_height() {

	if ( $body.hasClass( 'toggle' ) ) return;

	var $w_height = $( window ).height(),
		$b_height = $( '.switcher-bar' ).height() + $( '.switcher-body' ).height(),
		$i_height = $w_height - $b_height - 2;

	$webIframe.height( $i_height );

}
//This function was pulled from a StackOverflow answer
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

//Check for the most common input field mistake
function validateURL( url ){
	var patt = new RegExp("^(http|https)://");
	var res = patt.test(url);
	
	return res;
}

function toggleView( id ){

	var goalWidth;

	currentView = id;
	
	$( "#views > div" ).each(function( index ) {
		if (index != currentView){
			$(this).removeClass("current");
		}
		else{
			$(this).addClass("current");
		}
	});
		
	switch (id){
		case 4 : 
			goalWidth = $( window ).width();
			break;
		case 3 : 
			goalWidth = '1024px';
			break;
		case 2:  
			goalWidth = '768px';
			break;
		case 1: 
			goalWidth = '320px';
			break;
		default: 
			break;
	}
		
	$webIframe.animate({
		'width'       : goalWidth
	});		
}

function loadPage(){
	var url = $("#urlField").val();
		
	//check to see if it's missing http
	if ( validateURL(url) ){
		$webIframe.attr( 'src',  url);
	}
	else{
		$webIframe.attr( 'src',  "http://" + url);
	}
}

function init(){
	$( window ).on( 'resize load', switcher_iframe_height );

	// Hide preloader on iframe load
	$webIframe.load( function() {

		$( '.preloader, .preloading-icon' ).fadeOut( 400 );

	});

	// Switching views
	// numbers are based on the order in the HTML, not based on the order on screen
	$( '.desktop-btn' ).on( 'click', function() {
		toggleView(4);
	});

	$( '.laptop-btn' ).on( 'click', function() {
		toggleView(3);
	});

	$( '.tablet-btn' ).on( 'click', function() {
		toggleView(2);
	});

	$( '.mobile-btn' ).on( 'click', function() {
		toggleView(1);
	});
	
	$( '.remove-btn' ).click( function() {
		var url = $webIframe.attr( 'src');
		
		if (url != "" && url != undefined){
			top.location.href = url;
		}
		else if (defaultURL != "" && defaultURL != undefined){
			top.location.href = defaultURL;
		}
		
		return false;
	});	
	
	switcher_iframe_height();
		
	//go to the defaultURL if it's defined
	if (defaultURL != "" && defaultURL != undefined){
		$webIframe.attr( 'src',  defaultURL);
		$("#urlField").val(defaultURL);		
	}
	else{
		defaultURL = getParameterByName("url"); //use a querystring to jump to a url
		$webIframe.attr( 'src',  defaultURL);
		$("#urlField").val(defaultURL);
	}
	
	if (disableURLField){
		$(".urlInput").css({"display":"none"});
	}
	
	//check for enter key stroke in input field
	$('#urlField').keypress(function (e) {
	  if (e.which == 13) {
		loadPage();
		e.preventDefault();		
	  }
	});
	
	$("#goBtn").on("click", function(){
		loadPage();
	});
	
}

// Start the application
$( document ).ready( function() {

	init();

});


