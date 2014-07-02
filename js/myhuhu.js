// the minimum version of jQuery we want
var version = '1.11.1';

var huhustyle = document.createElement('link');
huhustyle.rel = 'stylesheet';
huhustyle.type = 'text/css';
huhustyle.href = 'https://firefox.club.tw/huhu/css/myhuhu.less.css';
document.getElementsByTagName('head')[0].appendChild(huhustyle);
// check prior inclusion and version
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://firefox.club.tw/huhu/js/jquery-1.9.1.min.js';
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
        var total_hp = 0;
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
                $('body').append('<div id="myhuhu" draggable="true" class="still"></div>');
                $huhu = $('#myhuhu');
                $huhu.on('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function() {
                    nextMove($(this).attr('class'));
                });
            }
            $('body').append('<div class="dashboard">hi</div>');
            $('.dashboard').show();
            $('.dashboard').hide(10000);
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

        function dragMove(){
            // $huhu.on('drop', drop)

            $huhu.on('dragover', function(e){
                e.preventDefault();
                $huhu.removeClass();
                $huhu.addClass('drag');
            });

            $huhu.on('mousedown', function(e){
                e.preventDefault();
                var fxdrag = setInterval(dragAction, 10);
                $('#myhuhu').css('cursor', 'move');
                $huhu.on('mousemove', function(e) {
                    e.preventDefault();
                    $huhu.css('right', (100 - (e.clientX + 100) / $(window).width() * 100) + '%');
                    $huhu.css('bottom', (100 - (e.clientY + 100) / $(window).height() * 100) + '%');
                });
                $huhu.on('drop mouseup', function(e) {
                    e.preventDefault();
                    $huhu.css('right', (100 - (e.clientX + 100) / $(window).width() * 100) + '%');
                    $huhu.css('bottom', (100 - (e.clientY + 100) / $(window).height() * 100) + '%');
                    $huhu.off('mousemove');
                });
                $huhu.on('mouseleave', function(e){
                    e.preventDefault();
                    clearInterval(fxdrag);
                    console.log(e.clientX, e.clientY);
                });
            });



            function dragAction() {
                $huhu.removeClass();
                $huhu.addClass('drag');                    
            }
            
            function drag(e){
                //e.dataTransfer.setData("Text", e.target.id);
            }

            function allowDrop(e){
                e.preventDefault();
            }

            function drop(e){
                var file, files, tip, total_size, _i, _len;
                var heat = 0;

                e.preventDefault();
                console.log(e);
                files = e.originalEvent.dataTransfer.files;
                console.log(files)
                console.log(heat);
                if (files.length > 0) {
                    total_size = 0;
                    console.log('yo')
                    for (_i = 0, _len = files.length; _i < _len; _i++) {
                        file = files[_i];
                        total_size += file.size;
                        console.log(total_size);
                    }
                    heat += parseInt(total_size / 1000);
                    total_hp += parseInt(total_size / 1000);
                } else {
                    heat += 2;
                    total_hp += 2;
                }
                console.log('eat eat up', heat);
                if (heat > 0) {
                    heat = parseInt(heat, 10);
                    if (heat > 99) {
                      heat = 99;
                    }
                    $huhu.append(tip = $('<div class="huhu-life-tip" />').text('+' + heat));
                    setTimeout((function() {
                      return $(tip).addClass('huhu-show');
                    }), 300);
                    setTimeout((function() {
                      return $(tip).remove();
                    }), 1000);
                } 
            }
        }
        init();
        dragMove();
    })();
}
