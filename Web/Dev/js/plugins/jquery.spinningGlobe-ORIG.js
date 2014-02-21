/**
 *
 * Plugin:			Spinning Globe jQuery Plugin
 * Plugin URI:		http://webplantmedia.com/jquery/2012/08/spinning-globe-jquery-plugin/
 * Description:		jQuery plugin that turns any div element into a rotating animation of the planet earth.
 * Version:			1.0.0
 * Author:			Chris Baldelomar
 * Author URI:		http://webplantmedia.com
 * License:			GNU General Public License version 3.0
 * License URI:		http://www.gnu.org/licenses/gpl-3.0.html
 *
 */
(function( $ ){
  $.fn.spinningGlobe = function( options ) {  
		// default options
		var defaults = {  
			earthWidth: 1889, // width of the earth map 
			earthHeight: 500, // height of the earth map
			prefix: 'img/globe1/', // prefix for your image path
			logo: false, // if true, will look for image file named 'globe_middleground_{width}x{height}.png'
			resistance: 30 // value 1-100. The higher the number, the slower the globe spins.
		};  

		// merge default options with user defined options
		var options = $.extend(defaults, options);  

		// calculate rest of options 
		// critical for smooth and accurate rotations
		options.globeWidth = options.earthHeight,  
		options.timer = options.earthWidth * options.resistance,  
		options.earthWidthHalf = Math.round(options.earthWidth / 2),  
		options.resetWidth = options.earthWidthHalf - 1;
		options.resetWidthHalf = Math.round(options.earthWidthHalf / 2);
		options.earthBoundingWidth = options.earthHeight - 2;

		// cache elements
		var $obj = $(this);
		var $foregroundEarthImg = null;
		var $backgroundEarthImg = null;

		// functions for plugin
		var methods = {
			// begins plugin process
			init : function( ) { 
				// set parent element with style
				$obj.css('width', options.earthHeight+'px')
					.css('height', options.earthHeight+'px')
					.css('position', 'relative')
					.css('overflow', 'hidden')
					.css('display', 'none')
					.css('background-color', 'transparent');

				// build html and images for 3D globe
				var html = ''+
				'<div class="globe-background" style="position:absolute; top: 0; left: 0;">'+
					'<img src="'+options.prefix+'globe_background_'+options.earthHeight+'x'+options.earthHeight+'.png" />'+
				'</div>'+
				'<div class="earth-background" style="position:absolute; top: 1px; left: 1px; overflow: hidden; width:'+options.earthBoundingWidth+'px; height:'+options.earthBoundingWidth+'px;">'+
					'<img style="position: absolute; left: -0px; top: 0px; height: '+options.earthHeight+'px;" src="'+options.prefix+'earth_background_'+options.earthWidth+'x'+options.earthHeight+'.png" width="'+options.earthWidth+'" height="'+options.earthHeight+'"/>'+
				'</div>';
				if (options.logo) {
				html += ''+
				'<div class="globe-middleground" style="position:absolute; top: 0; left: 0;">'+
					'<img src="'+options.prefix+'globe_middleground_'+options.earthHeight+'x'+options.earthHeight+'.png" />'+
				'</div>';
				}
				html += ''+
				'<div class="earth-foreground" style="position:absolute; top: 1px; left: 1px; overflow: hidden; width:'+options.earthBoundingWidth+'px; height:'+options.earthBoundingWidth+'px;">'+
					'<img style="position: absolute; left: -'+options.earthWidthHalf+'px; top: 0px; height: '+options.earthHeight+'px;" src="'+options.prefix+'earth_foreground_'+options.earthWidth+'x'+options.earthHeight+'.png" width="'+options.earthWidth+'" height="'+options.earthHeight+'" />'+
				'</div>'+
				'<div class="globe-foreground" style="position:absolute; top: 0; left: 0;">'+
					'<img src="'+options.prefix+'globe_foreground_'+options.earthHeight+'x'+options.earthHeight+'.png" />'+
				'</div>';

				// insert 3D globe into parent element
				$obj.html(html);

				// slowly fade in 3D globe after all images have been loaded
				// disable dragging. This prevents unsightly behavior when a user drags an image.
				$obj.children('div').children('img').load(function() {
					$obj.fadeIn('slow');
				}).bind('dragstart', function(event) { 
					event.preventDefault(); 
				});

				// cache foreground and background of map of earth
				$foregroundEarthImg = $obj.children('.earth-foreground').children('img');
				$backgroundEarthImg = $obj.children('.earth-background').children('img');

				// initialize foreground and background animation
				methods.spinEarthForeground.apply();
				methods.spinEarthBackground.apply();
			},
			// globe should spin from left to right. 
			spinEarthForeground : function( ) {
				// animate to the right
				$foregroundEarthImg.animate({"left": "+="+options.resetWidth+"px"}, options.timer, "linear", function() {
					$foregroundEarthImg.css('left', '-'+options.earthWidthHalf+'px');
					methods.spinEarthForeground.apply();
				});
			},
			spinEarthBackground : function( ) {
				// animate to the left
				$backgroundEarthImg.animate({"left": "-="+options.resetWidth+"px"}, options.timer, "linear", function() {
					$backgroundEarthImg.css('left', '-0px');
					methods.spinEarthBackground.apply();
				});
			}
		};

		// initialize plugin
		return methods.init.apply( this );
  };
})( jQuery );
