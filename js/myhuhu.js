// the minimum version of jQuery we want
var version = '1.11.1';

var huhustyle = document.createElement('link');
huhustyle.rel = 'stylesheet';
huhustyle.type = 'text/css';
huhustyle.href = 'css/myhuhu.less.css';
document.getElementsByTagName('head')[0].appendChild(huhustyle);
// check prior inclusion and version
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'js/jquery-1.9.1.min.js';
script.onload = script.onreadystatechange = function(){
    if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
        var $fxQuery = jQuery.noConflict();
        initHuhu($fxQuery);
    }
};
document.body.appendChild(script);

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.startsWith = function(suffix) {
    return this.indexOf(suffix) == 0;
};

function initHuhu($) {
    (window.myhuhu = function() {
        var moves = {
            'still': {
                next: ['still', 'run-left', 'run-right', 'snooze', 'sleep', 'satisfied']
            },
            'eat': {
                next: ['satisfied']
            },
            'drag': {
                next: ['still']
            },
            'sleep': {
                'hasTransitMove': true,
                next: ['snooze', 'still']
            },
            'run-right': {
                'hasTtransitMove': true,
                next: ['run-right', 'run-left', 'still']
            },
            'run-left': {
                'hasTransitMove': true,
                next: ['run-left', 'run-right', 'still']
            },
            'snooze': {

                next: ['still', 'sleep']
            },
            'satisfied': {

                next: ['still', 'run-left', 'run-right']
            }
        };
        var $huhu = $('#myhuhu');
        function init() {
            if($huhu.length == 0) {
                $('body').append('<div id="myhuhu" class="still"></div>');
                $huhu = $('#myhuhu');
                $huhu.on('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function() {
                    nextMove($(this).attr('class'));
                });
            }
        }
        function nextMove(currentClass) {
            var action = currentClass;
            if (currentClass.endsWith('-before')) {
                action = currentClass.substring(0, currentClass.length - 7);
            }
            else if (currentClass.endsWith('-after')) {
                action = currentClass.substring(0, currentClass.length - 6);
            }
            else {

            }
            var moveKeys = moves[action]['next'];
            var move = moveKeys[Math.floor(Math.random() * moveKeys.length)];
            $huhu.removeClass();
            var elem = $huhu.get(0);
            elem.offsetWidth = elem.offsetWidth;
            $huhu.addClass(move);
        }
        init();
    })();
}
