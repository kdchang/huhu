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
		var imageList = ['8-bit-fox-run.gif', '8-bit-fox-abdomen.gif'];
		// setInterval(function(){var action = }, 6000);
		var action = '8-bit-fox-run.gif';
		var $fxQuery = jQuery.noConflict();
		if($fxQuery('#fox-body').length == 0) {
			$fxQuery('body').append('<div class="fox-body-div" id="fox-body-div">' + 
				'<img class="fox-img" id="fox-img" src="//raw.githubusercontent.com/kdchang/huhu/gh-pages/img/' + action + '.gif">' +
				'<style>'  +
				// the CSS style 
				'#fox-body-div {position:fixed; bottom:100px; right:50px;}' + 
				'#fox-img {width:150px;}' +
				'</style>' +
				'</div>');
		}
	})();
}