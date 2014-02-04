;(function ( $, window, document, undefined ) {

    var pluginName = "imgBBQ",
	
	defaults = {
		pathToRetina		: 	'@2x', 
		pathToMobile		: 	'@Mobile', 
		minimumKbps			: 	200, 
		testImgURI			:	'http://inspiredroots.com/__devlab/2014/imgbbq/img/speed-test.jpg', 
		debuggingOn			:	false,
		
		isRetina			:	window.devicePixelRatio > 1, 
		speedKbps			: 	0,
		imgType 			: 	'' 
	};
	
	App = {
		
		/* BEGIN: IF DEV MODE, ENABLE CONSOLE LOGGING */
		DLog: function(str) {
			if(window.console) {
				console.log(str);
			}
			if(typeof str == 'string') {
				if($('.imgbbq-output').length == 0) {
					$('body').prepend('<div class="imgbbq-output">' + str + '</div>');
				} else {
					$('.imgbbq-output').append('<div class="imgbbq-output">' + str + '</div>');
				}
			}
		},
		/* END: IF DEV MODE, ENABLE CONSOLE LOGGING */
		
		/* BEGIN: CHECK IF IMAGE FILE EXISTS */
		UrlExists: function(url) {
			var http = new XMLHttpRequest();
			http.open('HEAD', url, false);
			http.send();
			return http.status!=404;
		},
		/* END: CHECK IF IMAGE FILE EXISTS */

	};
	
	isMobile = {
		
		Android: function() {
			return navigator.userAgent.match(/Android/i) ? true : false;
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i) ? true : false;
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPod/i) ? true : false;
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i) ? true : false;
		},
		any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
		}
		
	};
	
    function Plugin( element, options ) {
		this.element = element;
        this.options = $.extend( {}, defaults, options );

        this._defaults = defaults;
        this._name = pluginName;
		
		this.init();
    }

    Plugin.prototype = {
		
        init: function() {
			this.consoleOutput(this.element, this.options)
        },

        consoleOutput: function(el, options) {
	
			ThisElement = $(el);
			
			/* BEGIN: IMG BBQ IMAGE REPLACEMENT FUNCTION */
			var	thisSrc = ThisElement.attr('src');
			var thisSrcArray = thisSrc.split('/');
			var thisSrcFilePos = parseInt(thisSrcArray.length - 1);
			var thisSrcFile = thisSrcArray[thisSrcFilePos];
			thisSrcArray[thisSrcFilePos] = options.imgType + thisSrcFile;
			var thisNewSrc = thisSrcArray.join('/');
			
			var url = thisNewSrc;
			
			if(options.debuggingOn) {
				//App.DLog(url + ' vs. ' + thisSrc);
			}
			
			if(url != thisSrc) {
					
				if(App.UrlExists(url)) {
					ThisElement.attr('src', url);
				} else {
					//				
				}
				
			} else {
				//
			}
			/* END: IMG BBQ IMAGE REPLACEMENT FUNCTION */
			
        }
    };

    $.fn[pluginName] = function ( options ) {
		
		var myPlugIn = this;
		p_options = $.extend( {}, defaults, options );
		//App.DLog(p_options);
		
		speedTest = {
				
			/* BEGIN: LOAD TEST IMAGE */
			getConnectionSpeed: function (p_options) {
				var startTime, endTime;
				var downloadSize = 10000;
				var download = new Image();
				download.onload = function () {
					endTime = (new Date()).getTime();
					speedTest.showResults(startTime, endTime, downloadSize, p_options);
				}
				startTime = (new Date()).getTime();
				download.src = p_options.testImgURI + '?r=' + Math.random();
			}, 
			/* END: LOAD TEST IMAGE */
		
			/* BEGIN: PROCESSS SPEED TEST RESULTS */
			showResults: function (startTime, endTime, downloadSize, p_options) {
				var duration = (endTime - startTime) / 1000;
				var bitsLoaded = downloadSize * 8;
				var speedBps = (bitsLoaded / duration).toFixed(2);
				var speedKbps = (speedBps / 1024).toFixed(2);
				var speedMbps = (speedKbps / 1024).toFixed(2);
				speedKbps = parseInt(speedKbps);
				
				defaults.speedKbps = speedKbps;
				
				// Good conneciton speed
				if(speedKbps >= parseInt(p_options.minimumKbps)) {
					if(p_options.isRetina) {
						// Is retina mobile
						if(isMobile.any()) {
							if(p_options.debuggingOn) {
								App.DLog('Good load time...Mobile...Retina...');
							}
							p_options.imgType = null;
						} else {
							if(p_options.debuggingOn) {
								App.DLog('Good load time...Not Mobile...Retina...');
							}
							p_options.imgType = p_options.pathToRetina + '/';
						}
					} else {
						// Is not retina mobile
						if(isMobile.any()) {
							if(p_options.debuggingOn) {
								App.DLog('Good load time...Mobile...Not Retina...');
							}
							p_options.imgType = p_options.pathToMobile + '/';
						} else {
							if(p_options.debuggingOn) {
								App.DLog('Good load time...Not Mobile...Not Retina...');
							}
							p_options.imgType = null;
						}
					}
				}
				
				// Slower conneciton speed
				if(speedKbps < parseInt(p_options.minimumKbps) && speedKbps > (parseInt(p_options.minimumKbps) * 0.5)) {
					if(p_options.isRetina) {
						// Is retina mobile
						if(isMobile.any()) {
							if(p_options.debuggingOn) {
								App.DLog('Slow load time...Mobile...Retina...');
							}
							p_options.imgType = p_options.pathToMobile + '/';
						} else {
							if(p_options.debuggingOn) {
								App.DLog('Slow load time...Not Mobile...Retina...');
							}
							p_options.imgType = null;
						}
					} else {
						// Is not retina mobile
						if(isMobile.any()) {
							if(p_options.debuggingOn) {
								App.DLog('Slow load time...Mobile...Not Retina...');
							}
							p_options.imgType = p_options.pathToMobile + '/';
						} else {
							if(p_options.debuggingOn) {
								App.DLog('Slow load time...Not Mobile...Not Retina...');
							}
							p_options.imgType = null;
						}
					}
				}
				
				// Really poor conneciton speed
				// Don't account for retina.
				// Just load the mobile images on mobile devices.
				if(speedKbps <= (parseInt(p_options.minimumKbps) * 0.5)) {
					if(isMobile.any()) {
						if(p_options.debuggingOn) {
							App.DLog('Super slow connection. Load low-fi images on Mobile.');
						}
						p_options.imgType = p_options.pathToMobile + '/';
					} else {
						if(p_options.debuggingOn) {
							App.DLog('Super slow connection. Don\'t do anything.');
						}
						p_options.imgType = null;
					}
						
				}
				
				// Update images once the DOM is ready
				//jQuery(function($) {
					if(p_options.imgType !== null) {
						 if(p_options.debuggingOn) {
							App.DLog('Updating images from ' + p_options.imgType + ' directory.');
						 }
						 return myPlugIn.each(function () {
							if (!$.data(this, "plugin_" + pluginName)) {
								$.data(this, "plugin_" + pluginName, new Plugin( this, p_options ));
							}
						});
						
					} else {
						if(p_options.debuggingOn) {
							App.DLog('Original images best suited for this scenario. Images not updated.');
						 }
					}
				//});
				
			}
			/* END: PROCESSS SPEED TEST RESULTS */
		
		};
		
		speedTest.getConnectionSpeed(p_options);
		
    };

})( jQuery, window, document );