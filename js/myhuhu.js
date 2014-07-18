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

//dashBoard($fxQuery);

// Dashboard

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
        var $dashboard = $('#dashboard');
        function init() {
            if($huhu.length == 0) {
                $('body').append('<div id="myhuhu" draggable="true" class="still"></div>');
                $huhu = $('#myhuhu');
                $huhu.on('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function() {
                    nextMove($(this).attr('class'));
                });
                $('body').children().attr('draggable', 'true');
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
                    detectMoveRightOrLeft(action);
                }
                else if (Math.floor(Math.random() * 3) > 0) {
                    next = action;
                    detectMoveRightOrLeft(action);
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

        function detectMoveRightOrLeft(action) {
            if(action == 'run-left') {
                console.log(action);
                var index = Math.floor(Math.random() * 3);
                console.log($huhu.offset());
                $huhu.css('left', $huhu.offset().left - 10);
            } else if(action == 'run-right') {
                console.log(action);
                console.log($huhu.offset());
                $huhu.css('left', $huhu.offset().left + 10); 
            }
        };

        function dashBoard() {
            if(typeof ($('#dashboard')) == 'undefined') {
                $('body').append('<div id="dashboard" style="display:none; width:100px; background:red;">Dash</div>');
                $('#dashboard').show();
                console.log($('#dashboard').length);
            } else {
                $('#dashboard').hide();
                //alert('x');
            }
            $(document).on('click', function(e){
                $('#dashboard').hide(1000);               
            });
            console.log($('#dashboard').length);
            //alert('a');
        };

        function dragMove(){
            // Save the dragged object 
            $(document).on('dragstart', function(e){
                if(typeof(Storage) !== "undefined") {
                    // Code for localStorage/sessionStorage.
                    window.dragTheObject = e.target;
                    console.log(e);
                } else {
                    console.log('sorry, your broser')
                }
                //e.dataTransfer.setData("text/plain", "This is text to drag")
                console.log(e);
                
            });
            // Fire the drop event
            $huhu.on('dragover', function(e){
                e.preventDefault();
                return false;
            });
            // drop the object to huhu
            $huhu.on('drop', function(e){
                var file, files, tip, total_size, i, len;
                var heat = 0;
                $(dragTheObject).remove();
                e.preventDefault();
                $huhu.removeClass();
                $huhu.addClass('eat');
                files = e.originalEvent.dataTransfer.files;
                console.log(files)
                console.log(heat);
                if (files.length > 0) {
                    total_size = 0;
                    console.log('yo')
                    for (i = 0, len = files.length; i < len; i++) {
                        file = files[i];
                        total_size += file.size;
                        console.log(total_size);
                    }
                    heat += parseInt(total_size / 1000);
                    total_hp += parseInt(total_size / 1000);
                } else {
                    heat += 3;
                    total_hp += 3;
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
                return false;
            });
            
            // change the cursor
            $huhu.on('mouseover', function(e){
                $('#myhuhu').css('cursor', 'move');
            });

            // control the position of huhu
            $huhu.on('mousedown', function(e){
                e.preventDefault();
                var fxdrag = setInterval(dragAction, 10);
                $huhu.on('mousemove', function(e) {
                    e.preventDefault();
                    console.log(e);
                    $huhu.css('right', 100 - (e.clientX + 100) / $(window).width() * 100 + '%');
                    $huhu.css('bottom', 100 - (e.clientY + 100) / $(window).height() * 100 + '%');

                    // $huhu.css('right', (100 - (e.clientX + 100) / $(window).width() * 100) + '%');
                    //$huhu.css('bottom', e.pageY + 'px');
                    //$huhu.css('left', e.pageX + 'px');
                    console.log('dd');
                    console.log((e.clientX) / $(window).width() * 100);
                });
                $huhu.on('mouseup', function(e) {
                    e.preventDefault();
                    console.log(e);
                    $huhu.css('right', (100 - (e.clientX + 100) / $(window).width() * 100) + '%');
                    $huhu.css('bottom', (100 - (e.clientY + 100) / $(window).height() * 100) + '%');
                    $huhu.off('mousemove');
                    clearInterval(fxdrag);
                });
                $huhu.on('mouseleave', function(e){
                    e.preventDefault();
                    clearInterval(fxdrag);
                    $huhu.off('mousemove');
                    console.log(e.clientX, e.clientY);
                });
            });

            function dragAction() {
                $huhu.removeClass();
                $huhu.addClass('drag');                    
            }
        }
        init();
        dragMove();
        dashBoard();
    })();
}
