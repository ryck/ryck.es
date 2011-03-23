
// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  arguments.callee = arguments.callee.caller;  
  if(this.console) console.log( Array.prototype.slice.call(arguments) );
};
// make it safe to use console.log always
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c})(window.console=window.console||{});


// place any jQuery/helper plugins in here, instead of separate, slower script files.

/*
 * respond.js - A small and fast polyfill for min/max-width CSS3 Media Queries
 * Copyright 2011, Scott Jehl, scottjehl.com
 * Dual licensed under the MIT or GPL Version 2 licenses. 
 * Usage: Check out the readme file or github.com/scottjehl/respond
*/
(function( win, mqSupported ){
	//exposed namespace
	win.respond		= {};
	
	//define update even in native-mq-supporting browsers, to avoid errors
	respond.update	= function(){};
	
	//expose media query support flag for external use
	respond.mediaQueriesSupported	= mqSupported;
	
	//if media queries are supported, exit here
	if( mqSupported ){ return; }
	
	//define vars
	var doc 			= win.document,
		docElem 		= doc.documentElement,
		mediastyles		= [],
		rules			= [],
		appendedEls 	= [],
		parsedSheets 	= {},
		resizeThrottle	= 30,
		head 			= doc.getElementsByTagName( "head" )[0] || docElem,
		links			= head.getElementsByTagName( "link" ),
		
		//loop stylesheets, send text content to translate
		ripCSS			= function(){
			var sheets 	= doc.styleSheets,
				sl 		= sheets.length;

			for( var i = 0; i < sl; i++ ){
				var sheet		= sheets[ i ],
					href		= sheet.href;
				
				//only links plz and prevent re-parsing
				if( !!href && !parsedSheets[ href ] ){
					ajax( href, function( styles ){
						translate( styles, href );
						parsedSheets[ href ] = true;
					} );
				}
			}		
		},
		//find media blocks in css text, convert to style blocks
		translate		= function( styles, href ){
			var qs		= styles.match( /@media ([^\{]+)\{([\S\s]+?)(?=\}\/\*\/mediaquery\*\/)/gmi ),
				ql		= qs && qs.length || 0,
				href	= href.substring( 0, href.lastIndexOf( "/" )) + "/";
				
			for( var i = 0; i < ql; i++ ){
				var fullq	= qs[ i ].match( /@media ([^\{]+)\{([\S\s]+?)$/ ) && RegExp.$1,
					eachq	= fullq.split( "," ),
					eql		= eachq.length;
					
				rules.push( RegExp.$2 && RegExp.$2.replace( /(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g, "$1" + href + "$2$3" ) );
					
				for( var j = 0; j < eql; j++ ){
					var thisq	= eachq[ j ];
					mediastyles.push( { 
						media	: thisq.match( /(only\s+)?([a-zA-Z]+)(\sand)?/ ) && RegExp.$2,
						rules	: rules.length - 1,
						minw	: thisq.match( /\(min\-width:\s?(\s?[0-9]+)px\s?\)/ ) && parseFloat( RegExp.$1 ), 
						maxw	: thisq.match( /\(max\-width:\s?(\s?[0-9]+)px\s?\)/ ) && parseFloat( RegExp.$1 )
					} );
				}	
			}
			applyMedia();
		},
        	
		lastCall,
		
		resizeDefer,
		
		//enable/disable styles
		applyMedia			= function( fromResize ){
			var name		= "clientWidth",
				docElemProp	= docElem[ name ],
				currWidth 	= doc.compatMode === "CSS1Compat" && docElemProp || doc.body[ name ] || docElemProp,
				styleBlocks	= {},
				dFrag		= doc.createDocumentFragment(),
				lastLink	= links[ links.length-1 ],
				now 		= (new Date()).getTime();
			
			//throttle resize calls	
			if( fromResize && lastCall && now - lastCall < resizeThrottle ){
				clearTimeout( resizeDefer );
				resizeDefer = setTimeout( applyMedia, resizeThrottle );
				return;
			}
			else {
				lastCall	= now;
			}
										
			for( var i in mediastyles ){
				var thisstyle = mediastyles[ i ];
				if( !thisstyle.minw && !thisstyle.maxq || 
					( !thisstyle.minw || thisstyle.minw && currWidth >= thisstyle.minw ) && 
					(!thisstyle.maxw || thisstyle.maxw && currWidth <= thisstyle.maxw ) ){						
						if( !styleBlocks[ thisstyle.media ] ){
							styleBlocks[ thisstyle.media ] = [];
						}
						styleBlocks[ thisstyle.media ].push( rules[ thisstyle.rules ] );
				}
			}
			
			//remove any existing respond style element(s)
			for( var i in appendedEls ){
				if( appendedEls[ i ] && appendedEls[ i ].parentNode === head ){
					head.removeChild( appendedEls[ i ] );
				}
			}
			
			//inject active styles, grouped by media type
			for( var i in styleBlocks ){
				var ss		= doc.createElement( "style" ),
					css		= styleBlocks[ i ].join( "\n" );
				
				ss.type = "text/css";	
				ss.media	= i;
				
				if ( ss.styleSheet ){ 
		        	ss.styleSheet.cssText = css;
		        } 
		        else {
					ss.appendChild( doc.createTextNode( css ) );
		        }
		        dFrag.appendChild( ss );
				appendedEls.push( ss );
			}
			
			//append to DOM at once
			head.insertBefore( dFrag, lastLink.nextSibling );
		},
		//tweaked Ajax functions from Quirksmode
		ajax = function( url, callback ) {
			var req = xmlHttp();
			if (!req){
				return;
			}	
			req.open( "GET", url, true );
			req.onreadystatechange = function () {
				if ( req.readyState != 4 || req.status != 200 && req.status != 304 ){
					return;
				}
				callback( req.responseText );
			}
			if ( req.readyState == 4 ){
				return;
			}
			req.send();
		},
		//define ajax obj 
		xmlHttp = (function() {
			var xmlhttpmethod = false,
				attempts = [
					function(){ return new ActiveXObject("Microsoft.XMLHTTP") },
					function(){ return new ActiveXObject("Msxml3.XMLHTTP") },
					function(){ return new ActiveXObject("Msxml2.XMLHTTP") },
					function(){ return new XMLHttpRequest() }		
				],
				al = attempts.length;
		
			while( al-- ){
				try {
					xmlhttpmethod = attempts[ al ]();
				}
				catch(e) {
					continue;
				}
				break;
			}
			return function(){
				return xmlhttpmethod;
			};
		})();
	
	//translate CSS
	ripCSS();
	
	//expose update for re-running respond later on
	respond.update = ripCSS;
	
	//adjust on resize
	function callMedia(){
		applyMedia( true );
	}
	if( win.addEventListener ){
		win.addEventListener( "resize", callMedia, false );
	}
	else if( win.attachEvent ){
		win.attachEvent( "onresize", callMedia );
	}
})(
	this,
	(function( win ){
		//cond. comm. IE check by James Padolsey
		var ie = (function(undef){
 		    var v 	= 3,
		        div	= document.createElement( "div" ),
		        all	= div.getElementsByTagName( "i" );
		 
		    while(div.innerHTML = "<!--[if gt IE " + (++v) + "]><i></i><![endif]-->", all[0]);
		    return v > 4 ? v : undef;
		}());
		
		//for speed, flag browsers with window.matchMedia support and IE 9 as supported
		if( win.matchMedia || ie && ie >= 9 ){ return true; }
		//flag IE 8 and under as false - no test needed
		if( ie && ie <= 8 ){ return false; }
		//otherwise proceed with test
		var doc		= win.document,
			docElem	= doc.documentElement,
		    fb		= doc.createElement( "body" ),
		    div		= doc.createElement( "div" ),
		    se		= doc.createElement( "style" ),
			cssrule	= "@media only all { #qtest { position: absolute; } }";
		div.setAttribute( "id", "qtest" );
			
		se.type = "text/css";
		fb.appendChild( div );
		if ( se.styleSheet ){ 
		  se.styleSheet.cssText = cssrule;
		} 
		else {
		  se.appendChild( doc.createTextNode( cssrule ) );
		} 
		docElem.insertBefore( fb, docElem.firstChild );
		docElem.insertBefore( se, fb );
		support = ( win.getComputedStyle ? win.getComputedStyle( div, null ) : div.currentStyle )["position"] == "absolute";
		docElem.removeChild( fb );
		docElem.removeChild( se );
		return support;
	})( this )
);

/*!
 * mbp - Moible boilerplate helper functions: 
 * http://www.blog.highub.com/
 * by Shi Chuan
 */
 
// Hide URL Bar for iOS
// http://remysharp.com/2010/08/05/doing-it-right-skipping-the-iphone-url-bar/
function hideUrlBar() {
	/mobile/i.test(navigator.userAgent) && !pageYOffset && !location.hash && setTimeout(function () {
	window.scrollTo(0, 0);
	}, 1000);
}


// Fast Buttons
// http://code.google.com/mobile/articles/fast_buttons.html
function fastButton(element, handler) {
    this.element = element;
    this.handler = handler;
	element.addEventListener('touchstart', this, false);
	element.addEventListener('click', this, false);
};

fastButton.prototype.handleEvent = function(event) {
    switch (event.type) {
		case 'touchstart': this.onTouchStart(event); break;
        case 'touchmove': this.onTouchMove(event); break;
        case 'touchend': this.onClick(event); break;
        case 'click': this.onClick(event); break;
    }
};

fastButton.prototype.onTouchStart = function(event) {
    event.stopPropagation();
    this.element.addEventListener('touchend', this, false);
	document.body.addEventListener('touchmove', this, false);
    this.startX = event.touches[0].clientX;
    this.startY = event.touches[0].clientY;
    this.element.style.backgroundColor = "rgba(0,0,0,.7)";
};

fastButton.prototype.onTouchMove = function(event) {
    if(Math.abs(event.touches[0].clientX - this.startX) > 10 || Math.abs(event.touches[0].clientY - this.startY) > 10) {
		this.reset();
    }
};
fastButton.prototype.onClick = function(event) {
    event.stopPropagation();
    this.reset();
    this.handler(event);
    if(event.type == 'touchend') {
		preventGhostClick(this.startX, this.startY);
    }
    this.element.style.backgroundColor = "";
};
fastButton.prototype.reset = function() {
    this.element.removeEventListener('touchend', this, false);
    document.body.removeEventListener('touchmove', this, false);
    this.element.style.backgroundColor = "";
};
function preventGhostClick(x, y) {
    coordinates.push(x, y);
    window.setTimeout(gpop, 2500);
};
function gpop() {
	coordinates.splice(0, 2);
};
function gonClick(event) {
	for(var i = 0; i < coordinates.length; i += 2) {
		var x = coordinates[i];
        var y = coordinates[i + 1];
        if(Math.abs(event.clientX - x) < 25 && Math.abs(event.clientY - y) < 25) {
			event.stopPropagation();
            event.preventDefault();
        }
    }
};
document.addEventListener('click', gonClick, true);
var coordinates = [];


// iOS Startup Image
function iosStrtSrn() {
  var filename = navigator.platform === 'iPad' ? 'h/' : 'l/';
  document.write('<link rel="apple-touch-startup-image" href="/images/' + filename + 'splash.png" />' );
}


// Autogrow
(function( $ ){

  $.fn.growingTextarea = function( options ) {
	
	var settings = {
      'lineHeight' : 12
    };
	
    return this.each(function() {
		if ( options ) { 
			$.extend( settings, options );
		}
		var $this = $(this);
		var textLineHeight = $this.css("line-height");
		
		if (textLineHeight.indexOf("px") == -1) {
			textLineHeight = settings.lineHeight;
		} else {
			textLineHeight = parseInt(textLineHeight, 10);
		}
		$this.css('overflow','hidden');
		$this.keyup(function(e){
			var newHeight = $this.attr("scrollHeight");
			var currentHeight = $this.attr("clientHeight");
			if (newHeight > currentHeight) {
				$this.css('height', newHeight + 3 * textLineHeight + 'px');
			}
		});
    });

  };
})( jQuery );


/*
  Copyright 2010 Google Inc.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

/**
 * @fileoverview Bookmark bubble library. This is meant to be included in the
 * main JavaScript binary of a mobile web application.
 *
 * Supported browsers: iPhone / iPod / iPad Safari 3.0+
 */

var google = google || {};
google.bookmarkbubble = google.bookmarkbubble || {};


/**
 * Binds a context object to the function.
 * @param {Function} fn The function to bind to.
 * @param {Object} context The "this" object to use when the function is run.
 * @return {Function} A partially-applied form of fn.
 */
google.bind = function(fn, context) {
  return function() {
    return fn.apply(context, arguments);
  };
};


/**
 * Function used to define an abstract method in a base class. If a subclass
 * fails to override the abstract method, then an error will be thrown whenever
 * that method is invoked.
 */
google.abstractMethod = function() {
  throw Error('Unimplemented abstract method.');
};



/**
 * The bubble constructor. Instantiating an object does not cause anything to
 * be rendered yet, so if necessary you can set instance properties before
 * showing the bubble.
 * @constructor
 */
google.bookmarkbubble.Bubble = function() {
  /**
   * Handler for the scroll event. Keep a reference to it here, so it can be
   * unregistered when the bubble is destroyed.
   * @type {function()}
   * @private
   */
  this.boundScrollHandler_ = google.bind(this.setPosition, this);

  /**
   * The bubble element.
   * @type {Element}
   * @private
   */
  this.element_ = null;

  /**
   * Whether the bubble has been destroyed.
   * @type {boolean}
   * @private
   */
  this.hasBeenDestroyed_ = false;
};


/**
 * Shows the bubble if allowed. It is not allowed if:
 * - The browser is not Mobile Safari, or
 * - The user has dismissed it too often already, or
 * - The hash parameter is present in the location hash, or
 * - The application is in fullscreen mode, which means it was already loaded
 *   from a homescreen bookmark.
 * @return {boolean} True if the bubble is being shown, false if it is not
 *     allowed to show for one of the aforementioned reasons.
 */
google.bookmarkbubble.Bubble.prototype.showIfAllowed = function() {
  if (!this.isAllowedToShow_()) {
    return false;
  }

  this.show_();
  return true;
};


/**
 * Shows the bubble if allowed after loading the icon image. This method creates
 * an image element to load the image into the browser's cache before showing
 * the bubble to ensure that the image isn't blank. Use this instead of
 * showIfAllowed if the image url is http and cacheable.
 * This hack is necessary because Mobile Safari does not properly render
 * image elements with border-radius CSS.
 * @param {function()} opt_callback Closure to be called if and when the bubble
 *        actually shows.
 * @return {boolean} True if the bubble is allowed to show.
 */
google.bookmarkbubble.Bubble.prototype.showIfAllowedWhenLoaded =
    function(opt_callback) {
  if (!this.isAllowedToShow_()) {
    return false;
  }

  var self = this;
  // Attach to self to avoid garbage collection.
  var img = self.loadImg_ = document.createElement('img');
  img.src = self.getIconUrl_();
  img.onload = function() {
    if (img.complete) {
      delete self.loadImg_;
      img.onload = null;  // Break the circular reference.

      self.show_();
      opt_callback && opt_callback();
    }
  };
  img.onload();

  return true;
};


/**
 * Sets the parameter in the location hash. As it is
 * unpredictable what hash scheme is to be used, this method must be
 * implemented by the host application.
 *
 * This gets called automatically when the bubble is shown. The idea is that if
 * the user then creates a bookmark, we can later recognize on application
 * startup whether it was from a bookmark suggested with this bubble.
 *
 * NOTE: Using a hash parameter to track whether the bubble has been shown
 * conflicts with the navigation system in jQuery Mobile. If you are using that
 * library, you should implement this function to track the bubble's status in
 * a different way, e.g. using window.localStorage in HTML5.
 */
google.bookmarkbubble.Bubble.prototype.setHashParameter = google.abstractMethod;


/**
 * Whether the parameter is present in the location hash. As it is
 * unpredictable what hash scheme is to be used, this method must be
 * implemented by the host application.
 *
 * Call this method during application startup if you want to log whether the
 * application was loaded from a bookmark with the bookmark bubble promotion
 * parameter in it.
 *
 * @return {boolean} Whether the bookmark bubble parameter is present in the
 *     location hash.
 */
google.bookmarkbubble.Bubble.prototype.hasHashParameter = google.abstractMethod;


/**
 * The number of times the user must dismiss the bubble before we stop showing
 * it. This is a public property and can be changed by the host application if
 * necessary.
 * @type {number}
 */
google.bookmarkbubble.Bubble.prototype.NUMBER_OF_TIMES_TO_DISMISS = 2;


/**
 * Time in milliseconds. If the user does not dismiss the bubble, it will auto
 * destruct after this amount of time.
 * @type {number}
 */
google.bookmarkbubble.Bubble.prototype.TIME_UNTIL_AUTO_DESTRUCT = 15000;


/**
 * The prefix for keys in local storage. This is a public property and can be
 * changed by the host application if necessary.
 * @type {string}
 */
google.bookmarkbubble.Bubble.prototype.LOCAL_STORAGE_PREFIX = 'BOOKMARK_';


/**
 * The key name for the dismissed state.
 * @type {string}
 * @private
 */
google.bookmarkbubble.Bubble.prototype.DISMISSED_ = 'DISMISSED_COUNT';


/**
 * The arrow image in base64 data url format.
 * @type {string}
 * @private
 */
google.bookmarkbubble.Bubble.prototype.IMAGE_ARROW_DATA_URL_ = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAATCAMAAABSrFY3AAABKVBMVEUAAAD///8AAAAAAAAAAAAAAAAAAADf398AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD09PQAAAAAAAAAAAC9vb0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD19fUAAAAAAAAAAAAAAADq6uoAAAAAAAAAAAC8vLzU1NTT09MAAADg4OAAAADs7OwAAAAAAAAAAAD///+cueenwerA0vC1y+3a5fb5+/3t8vr4+v3w9PuwyOy3zO3h6vfh6vjq8Pqkv+mat+fE1fHB0/Cduuifu+iuxuuivemrxOvC1PDz9vzJ2fKpwuqmwOrb5vapw+q/0vDf6ffK2vLN3PPprJISAAAAQHRSTlMAAAEGExES7FM+JhUoQSxIRwMbNfkJUgXXBE4kDQIMHSA0Tw4xIToeTSc4Chz4OyIjPfI3QD/X5OZR6zzwLSUPrm1y3gAAAQZJREFUeF5lzsVyw0AURNE3IMsgmZmZgszQZoeZOf//EYlG5Yrhbs+im4Dj7slM5wBJ4OJ+undAUr68gK/Hyb6Bcp5yBR/w8jreNeAr5Eg2XE7g6e2/0z6cGw1JQhpmHP3u5aiPPnTTkIK48Hj9Op7bD3btAXTfgUdwYjwSDCVXMbizO0O4uDY/x4kYC5SWFnfC6N1a9RCO7i2XEmQJj2mHK1Hgp9Vq3QBRl9shuBLGhcNtHexcdQCnDUoUGetxDD+H2DQNG2xh6uAWgG2/17o1EmLqYH0Xej0UjHAaFxZIV6rJ/WK1kg7QZH8HU02zmdJinKZJaDV3TVMjM5Q9yiqYpUwiMwa/1apDXTNESjsAAAAASUVORK5CYII=';


/**
 * The close image in base64 data url format.
 * @type {string}
 * @private
 */
google.bookmarkbubble.Bubble.prototype.IMAGE_CLOSE_DATA_URL_ = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAALVBMVEXM3fm+1Pfb5/rF2fjw9f23z/aavPOhwfTp8PyTt/L3+v7T4vqMs/K7zP////+qRWzhAAAAXElEQVQIW2O4CwUM996BwVskxtOqd++2rwMyPI+ve31GD8h4Madqz2mwms5jZ/aBGS/mHIDoen3m+DowY8/hOVUgxusz+zqPg7SvPA1UxQfSvu/du0YUK2AMmDMA5H1qhVX33T8AAAAASUVORK5CYII=';


/**
 * The link used to locate the application's home screen icon to display inside
 * the bubble. The default link used here is for an iPhone home screen icon
 * without gloss. If your application uses a glossy icon, change this to
 * 'apple-touch-icon'.
 * @type {string}
 * @private
 */
google.bookmarkbubble.Bubble.prototype.REL_ICON_ =
    'apple-touch-icon-precomposed';


/**
 * Regular expression for detecting an iPhone or iPod or iPad.
 * @type {!RegExp}
 * @private
 */
google.bookmarkbubble.Bubble.prototype.MOBILE_SAFARI_USERAGENT_REGEX_ =
    /iPhone|iPod|iPad/;


/**
 * Regular expression for detecting an iPad.
 * @type {!RegExp}
 * @private
 */
google.bookmarkbubble.Bubble.prototype.IPAD_USERAGENT_REGEX_ = /iPad/;


/**
 * Regular expression for extracting the iOS version. Only matches 2.0 and up.
 * @type {!RegExp}
 * @private
 */
google.bookmarkbubble.Bubble.prototype.IOS_VERSION_USERAGENT_REGEX_ =
    /OS (\d)_(\d)(?:_(\d))?/;


/**
 * Determines whether the bubble should be shown or not.
 * @return {boolean} Whether the bubble should be shown or not.
 * @private
 */
google.bookmarkbubble.Bubble.prototype.isAllowedToShow_ = function() {
  return this.isMobileSafari_() &&
      !this.hasBeenDismissedTooManyTimes_() &&
      !this.isFullscreen_() &&
      !this.hasHashParameter();
};


/**
 * Builds and shows the bubble.
 * @private
 */
google.bookmarkbubble.Bubble.prototype.show_ = function() {
  this.element_ = this.build_();

  document.body.appendChild(this.element_);
  this.element_.style.WebkitTransform =
      'translate3d(0,' + this.getHiddenYPosition_() + 'px,0)';

  this.setHashParameter();

  window.setTimeout(this.boundScrollHandler_, 1);
  window.addEventListener('scroll', this.boundScrollHandler_, false);

  // If the user does not dismiss the bubble, slide out and destroy it after
  // some time.
  window.setTimeout(google.bind(this.autoDestruct_, this),
      this.TIME_UNTIL_AUTO_DESTRUCT);
};


/**
 * Destroys the bubble by removing its DOM nodes from the document.
 */
google.bookmarkbubble.Bubble.prototype.destroy = function() {
  if (this.hasBeenDestroyed_) {
    return;
  }
  window.removeEventListener('scroll', this.boundScrollHandler_, false);
  if (this.element_ && this.element_.parentNode == document.body) {
    document.body.removeChild(this.element_);
    this.element_ = null;
  }
  this.hasBeenDestroyed_ = true;
};


/**
 * Remember that the user has dismissed the bubble once more.
 * @private
 */
google.bookmarkbubble.Bubble.prototype.rememberDismissal_ = function() {
  if (window.localStorage) {
    try {
      var key = this.LOCAL_STORAGE_PREFIX + this.DISMISSED_;
      var value = Number(window.localStorage[key]) || 0;
      window.localStorage[key] = String(value + 1);
    } catch (ex) {
      // Looks like we've hit the storage size limit. Currently we have no
      // fallback for this scenario, but we could use cookie storage instead.
      // This would increase the code bloat though.
    }
  }
};


/**
 * Whether the user has dismissed the bubble often enough that we will not
 * show it again.
 * @return {boolean} Whether the user has dismissed the bubble often enough
 *     that we will not show it again.
 * @private
 */
google.bookmarkbubble.Bubble.prototype.hasBeenDismissedTooManyTimes_ =
    function() {
  if (!window.localStorage) {
    // If we can not use localStorage to remember how many times the user has
    // dismissed the bubble, assume he has dismissed it. Otherwise we might end
    // up showing it every time the host application loads, into eternity.
    return true;
  }
  try {
    var key = this.LOCAL_STORAGE_PREFIX + this.DISMISSED_;

    // If the key has never been set, localStorage yields undefined, which
    // Number() turns into NaN. In that case we'll fall back to zero for
    // clarity's sake.
    var value = Number(window.localStorage[key]) || 0;

    return value >= this.NUMBER_OF_TIMES_TO_DISMISS;
  } catch (ex) {
    // If we got here, something is wrong with the localStorage. Make the same
    // assumption as when it does not exist at all. Exceptions should only
    // occur when setting a value (due to storage limitations) but let's be
    // extra careful.
    return true;
  }
};


/**
 * Whether the application is running in fullscreen mode.
 * @return {boolean} Whether the application is running in fullscreen mode.
 * @private
 */
google.bookmarkbubble.Bubble.prototype.isFullscreen_ = function() {
  return !!window.navigator.standalone;
};


/**
 * Whether the application is running inside Mobile Safari.
 * @return {boolean} True if the current user agent looks like Mobile Safari.
 * @private
 */
google.bookmarkbubble.Bubble.prototype.isMobileSafari_ = function() {
  return this.MOBILE_SAFARI_USERAGENT_REGEX_.test(window.navigator.userAgent);
};


/**
 * Whether the application is running on an iPad.
 * @return {boolean} True if the current user agent looks like an iPad.
 * @private
 */
google.bookmarkbubble.Bubble.prototype.isIpad_ = function() {
  return this.IPAD_USERAGENT_REGEX_.test(window.navigator.userAgent);
};


/**
 * Creates a version number from 4 integer pieces between 0 and 127 (inclusive).
 * @param {*=} opt_a The major version.
 * @param {*=} opt_b The minor version.
 * @param {*=} opt_c The revision number.
 * @param {*=} opt_d The build number.
 * @return {number} A representation of the version.
 * @private
 */
google.bookmarkbubble.Bubble.prototype.getVersion_ = function(opt_a, opt_b,
    opt_c, opt_d) {
  // We want to allow implicit conversion of any type to number while avoiding
  // compiler warnings about the type.
  return /** @type {number} */ (opt_a) << 21 |
      /** @type {number} */ (opt_b) << 14 |
      /** @type {number} */ (opt_c) << 7 |
      /** @type {number} */ (opt_d);
};


/**
 * Gets the iOS version of the device. Only works for 2.0+.
 * @return {number} The iOS version.
 * @private
 */
google.bookmarkbubble.Bubble.prototype.getIosVersion_ = function() {
  var groups = this.IOS_VERSION_USERAGENT_REGEX_.exec(
      window.navigator.userAgent) || [];
  groups.shift();
  return this.getVersion_.apply(this, groups);
};


/**
 * Positions the bubble at the bottom of the viewport using an animated
 * transition.
 */
google.bookmarkbubble.Bubble.prototype.setPosition = function() {
  this.element_.style.WebkitTransition = '-webkit-transform 0.7s ease-out';
  this.element_.style.WebkitTransform =
      'translate3d(0,' + this.getVisibleYPosition_() + 'px,0)';
};


/**
 * Destroys the bubble by removing its DOM nodes from the document, and
 * remembers that it was dismissed.
 * @private
 */
google.bookmarkbubble.Bubble.prototype.closeClickHandler_ = function() {
  this.destroy();
  this.rememberDismissal_();
};


/**
 * Gets called after a while if the user ignores the bubble.
 * @private
 */
google.bookmarkbubble.Bubble.prototype.autoDestruct_ = function() {
  if (this.hasBeenDestroyed_) {
    return;
  }
  this.element_.style.WebkitTransition = '-webkit-transform 0.7s ease-in';
  this.element_.style.WebkitTransform =
      'translate3d(0,' + this.getHiddenYPosition_() + 'px,0)';
  window.setTimeout(google.bind(this.destroy, this), 700);
};


/**
 * Gets the y offset used to show the bubble (i.e., position it on-screen).
 * @return {number} The y offset.
 * @private
 */
google.bookmarkbubble.Bubble.prototype.getVisibleYPosition_ = function() {
  return this.isIpad_() ? window.pageYOffset + 17 :
      window.pageYOffset - this.element_.offsetHeight + window.innerHeight - 17;
};


/**
 * Gets the y offset used to hide the bubble (i.e., position it off-screen).
 * @return {number} The y offset.
 * @private
 */
google.bookmarkbubble.Bubble.prototype.getHiddenYPosition_ = function() {
  return this.isIpad_() ? window.pageYOffset - this.element_.offsetHeight :
      window.pageYOffset + window.innerHeight;
};


/**
 * The url of the app's bookmark icon.
 * @type {string|undefined}
 * @private
 */
google.bookmarkbubble.Bubble.prototype.iconUrl_;


/**
 * Scrapes the document for a link element that specifies an Apple favicon and
 * returns the icon url. Returns an empty data url if nothing can be found.
 * @return {string} A url string.
 * @private
 */
google.bookmarkbubble.Bubble.prototype.getIconUrl_ = function() {
  if (!this.iconUrl_) {
    var link = this.getLink(this.REL_ICON_);
    if (!link || !(this.iconUrl_ = link.href)) {
      this.iconUrl_ = 'data:image/png;base64,';
    }
  }
  return this.iconUrl_;
};


/**
 * Gets the requested link tag if it exists.
 * @param {string} rel The rel attribute of the link tag to get.
 * @return {Element} The requested link tag or null.
 */
google.bookmarkbubble.Bubble.prototype.getLink = function(rel) {
  rel = rel.toLowerCase();
  var links = document.getElementsByTagName('link');
  for (var i = 0; i < links.length; ++i) {
    var currLink = /** @type {Element} */ (links[i]);
    if (currLink.getAttribute('rel').toLowerCase() == rel) {
      return currLink;
    }
  }
  return null;
};


/**
 * Creates the bubble and appends it to the document.
 * @return {Element} The bubble element.
 * @private
 */
google.bookmarkbubble.Bubble.prototype.build_ = function() {
  var bubble = document.createElement('div');
  var isIpad = this.isIpad_();

  bubble.style.position = 'absolute';
  bubble.style.zIndex = 1000;
  bubble.style.width = '100%';
  bubble.style.left = '0';
  bubble.style.top = '0';

  var bubbleInner = document.createElement('div');
  bubbleInner.style.position = 'relative';
  bubbleInner.style.width = '214px';
  bubbleInner.style.margin = isIpad ? '0 0 0 82px' : '0 auto';
  bubbleInner.style.border = '2px solid #fff';
  bubbleInner.style.padding = '20px 20px 20px 10px';
  bubbleInner.style.WebkitBorderRadius = '8px';
  bubbleInner.style.WebkitBoxShadow = '0 0 8px rgba(0, 0, 0, 0.7)';
  bubbleInner.style.WebkitBackgroundSize = '100% 8px';
  bubbleInner.style.backgroundColor = '#b0c8ec';
  bubbleInner.style.background = '#cddcf3 -webkit-gradient(linear, ' +
      'left bottom, left top, ' + isIpad ?
          'from(#cddcf3), to(#b3caed)) no-repeat top' :
          'from(#b3caed), to(#cddcf3)) no-repeat bottom';
  bubbleInner.style.font = '13px/17px sans-serif';
  bubble.appendChild(bubbleInner);

  // The "Add to Home Screen" text is intended to be the exact same text
  // that is displayed in the menu of Mobile Safari.
  if (this.getIosVersion_() >= this.getVersion_(4, 2)) {
    bubbleInner.innerHTML = 'Bookmark this web on your phone: ' +
        'tap on the arrow and then <b>\'Add to Home Screen\'</b>';
  } else {
    bubbleInner.innerHTML = 'Bookmark this web on your phone: ' +
        'tap <b style="font-size:15px">+</b> and then ' +
        '<b>\'Add to Home Screen\'</b>';
  }

  var icon = document.createElement('div');
  icon.style['float'] = 'left';
  icon.style.width = '55px';
  icon.style.height = '55px';
  icon.style.margin = '-2px 7px 3px 5px';
  icon.style.background =
      '#fff url(' + this.getIconUrl_() + ') no-repeat -1px -1px';
  icon.style.WebkitBackgroundSize = '57px';
  icon.style.WebkitBorderRadius = '10px';
  icon.style.WebkitBoxShadow = '0 2px 5px rgba(0, 0, 0, 0.4)';
  bubbleInner.insertBefore(icon, bubbleInner.firstChild);

  var arrow = document.createElement('div');
  arrow.style.backgroundImage = 'url(' + this.IMAGE_ARROW_DATA_URL_ + ')';
  arrow.style.width = '25px';
  arrow.style.height = '19px';
  arrow.style.position = 'absolute';
  arrow.style.left = '111px';
  if (isIpad) {
    arrow.style.WebkitTransform = 'rotate(180deg)';
    arrow.style.top = '-19px';
  } else {
    arrow.style.bottom = '-19px';
  }
  bubbleInner.appendChild(arrow);

  var close = document.createElement('a');
  close.onclick = google.bind(this.closeClickHandler_, this);
  close.style.position = 'absolute';
  close.style.display = 'block';
  close.style.top = '-3px';
  close.style.right = '-3px';
  close.style.width = '16px';
  close.style.height = '16px';
  close.style.border = '10px solid transparent';
  close.style.background =
      'url(' + this.IMAGE_CLOSE_DATA_URL_ + ') no-repeat';
  bubbleInner.appendChild(close);

  return bubble;
};
