// the minimum version of jQuery we want
var version = '1.11.1';

var huhustyle = document.createElement('link');
huhustyle.rel = 'stylesheet';
huhustyle.type = 'text/css';
huhustyle.href = '%(base_url)scss/myhuhu.less.css';
document.getElementsByTagName('head')[0].appendChild(huhustyle);
// check prior inclusion and version
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = '%(base_url)sjs/jquery-1.9.1.min.js';
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
//                next: ['sleep']
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
                'hasTransitMove': true,
                next: ['run-left', 'still']
            },
            'run-left': {
                'hasTransitMove': true,
                next: ['run-right', 'still']
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
            var status = 'middle';
            if (currentClass.endsWith('-before')) {
                action = currentClass.substring(0, currentClass.length - 7);
                status = 'before';
            }
            else if (currentClass.endsWith('-after')) {
                action = currentClass.substring(0, currentClass.length - 6);
                status = 'after';
            }
            var move = moves[action];
            var next;
            if (move.hasTransitMove && status != 'after') {
                if (status == 'before') {
                    next = action;
                }
                else if (Math.floor(Math.random() * 3) > 0) {
                    next = action;
                }
                else {
                    next = action + '-after';
                }
            }
            else {
                var moveKeys = move['next'];
                next = moveKeys[Math.floor(Math.random() * moveKeys.length)];
                if (moves[next].hasTransitMove) {
                    next += '-before';
                }
            }
            $huhu.removeClass();
            var elem = $huhu.get(0);
            elem.offsetWidth = elem.offsetWidth;
            $huhu.addClass(next);
        }
        init();
    })();
}
