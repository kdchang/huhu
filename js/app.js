// the minimum version of jQuery we want
var version = "1.11.1";

// check prior inclusion and version
if (window.jQuery === undefined || window.jQuery.fn.jquery < version) { 
	var done = false;
	var script = document.createElement("script");
	script.src = '//ajax.googleapis.com/ajax/libs/jquery/' + version +'/jquery.min.js';
	script.onload = script.onreadystatechange = function(){
		if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
			done = true;
			var $fxQuery = jQuery.noConflict();
			initMyBookmarklet();
		}
	};
	document.getElementsByTagName("head")[0].appendChild(script);
} else {
	var $fxQuery = jQuery.noConflict();
	initMyBookmarklet();
}

function initMyBookmarklet() {
	(window.myBookmarklet = function() {
		// JavaScript code
		var $fxQuery = jQuery.noConflict();
		if($fxQuery('#fox-body').length == 0) {
			$fxQuery('body').append('<div class="fox-body" id="fox-body">' + 
				'<img id="fox-img" src="//raw.githubusercontent.com/kdchang/huhu/gh-pages/img/8-bit-fox-sleep.gif">' +
				'<style>'  +
				// the CSS style 
				'#fox-body {position:fixed; bottom:60px; right:60px;}' + 
				'</style>' +
				'</div>');
		}
	})();
}