// the minimum version of jQuery we want
var version = '1.11.1';
var $fxQuery;

var huhuStyle = document.createElement('link');
huhuStyle.rel = 'stylesheet';
huhuStyle.type = 'text/css';
huhuStyle.href = 'css/myhuhu.less.css';
document.getElementsByTagName('head')[0].appendChild(huhuStyle);

// check prior inclusion and version
var huhuScript = document.createElement('script');
huhuScript.type = 'text/javascript';
huhuScript.src = 'js/jquery-1.9.1.min.js';
huhuScript.onload = huhuScript.onreadystatechange = function() {
    if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
        $fxQuery = jQuery.noConflict();
    }
};
var huhuJuiScript = document.createElement('script');
huhuJuiScript.type = 'text/javascript';
huhuJuiScript.src = 'js/jquery-ui-1.11.0.js';
huhuJuiScript.onload = huhuScript.onreadystatechange = function() {
    if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
        initHuhu($fxQuery);
    }
};
// include circle
var circleScript = document.createElement('script');
circleScript.type = 'text/javascript';
circleScript.src = 'js/circles.min.js';

document.body.appendChild(huhuScript);
document.body.appendChild(huhuJuiScript);
document.body.appendChild(circleScript);

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.startsWith = function(suffix) {
    return this.indexOf(suffix) == 0;
};

function initHuhu($) {
    (window.myhuhu = function() {
        var total_blood = 70;
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

        // alias
        var $huhu = $('#myhuhu');
        var $huhuSprite = $('#myhuhu-sprite');
        var $dashboard = $('#dashboard');

        function init() {
            if ($huhu.length == 0) {
                // append huhu
                $('body').append('<div id="myhuhu" draggable="true"><div id="myhuhu-sprite" class="still"></div></div>');
                $huhu = $('#myhuhu');
                $huhuSprite = $('#myhuhu-sprite');
                $huhuSprite.on('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function() {
                    nextMove($(this).attr('class'));
                });

                // make the document draggable
                $('body').children().attr('draggable', 'true');

                // the huhu draggable action
                $huhu.draggable({
                    start: function() {
                        function dragAction() {
                            $huhuSprite.removeClass();
                            $huhuSprite.addClass('drag');
                        }
                        fxdrag = setInterval(dragAction, 10);
                    },
                    drag: function(event, ui){

                    }, 
                    stop: function( event, ui ) {
                        clearInterval(fxdrag);
                    }
                });
            }
        }

        function nextMove(currentClass) {
            var preAction = currentClass.split(' ', 1);
            var action = preAction[0];
            console.log(action);
            var status = 'middle';
            if (action.endsWith('-before')) {
                action = action.substring(0, action.length - 7);
                status = 'before';
            } else if (action.endsWith('-after')) {
                action = action.substring(0, action.length - 6);
                status = 'after';
            }
            var move = moves[action];
            var next;
            if (move.hasTransitMove && status != 'after') {
                if (status == 'before') {
                    next = action;
                    detectMoveRightOrLeft(action);
                } else if (Math.floor(Math.random() * 3) > 0) {
                    next = action;
                    detectMoveRightOrLeft(action);
                } else {
                    next = action + '-after';
                }
            } else {
                var moveKeys = move['next'];
                next = moveKeys[Math.floor(Math.random() * moveKeys.length)];
                if (moves[next].hasTransitMove) {
                    next += '-before';
                }
            }
            $huhuSprite.removeClass();
            var elem = $huhuSprite.get(0);
            elem.offsetWidth = elem.offsetWidth;
            $huhuSprite.addClass(next);
        }

        function detectMoveRightOrLeft(action) {
            if (action == 'run-left') {
                console.log(action);
                $('#progress').css('left', '0%');
                var index = Math.floor(Math.random() * 3);
                console.log($huhu.position());
                console.log(getPosition(document.querySelector("#myhuhu")).x);
                $huhu.css('left', getPosition(document.querySelector("#myhuhu")).x - 15 + "px");
                //alert($huhu.width());
                //$huhu.css('right', (100 - ($huhu.getBoundingClientRect().right) / $(window).width() * 100) + '%');
                //$huhu.css('bottom', (100 - (e.clientY + 100) / $(window).height() * 100) + '%');
                // 5px = 0.5 %
                // 1273
                // right: 15.239591516103692%;
                //alert(((getPosition(document.querySelector("#myhuhu")).y ) / $(window).width() * 100));
                //$huhu.css('right', ((getPosition(document.querySelector("#myhuhu")).y ) / $(window).width() * 100) + '%');
            } else if (action == 'run-right') {
                console.log(action);
                //console.log($huhu.offset());
                console.log($huhu.position());
                console.log(getPosition(document.querySelector("#myhuhu")).x);
                $('#progress').css('left', '60%');
                $huhu.css('left', getPosition(document.querySelector("#myhuhu")).x + 15 + "px");
                //$huhu.css('left', $huhu.offset().left + 10);
                //$huhu.css('right', ((getPosition(document.querySelector("#myhuhu")).y) / $(window).height() * 100)); 
                //$huhu.css('right', ((getPosition(document.querySelector("#myhuhu")).y) / $(window).width() * 100) + '%');
            }
        }

        function getPosition(element) {
            var xPosition = 0;
            var yPosition = 0;

            while (element) {
                xPosition += (element.offsetLeft - $(element).scrollLeft() + element.clientLeft);
                yPosition += (element.offsetTop - $(element).scrollTop() + element.clientTop);
                element = element.offsetParent;
            }
            return {
                x: xPosition,
                y: yPosition
            };
        }
        console.log($(document).scrollTop());

        function dashBoard() {
            if($('#dashboard').length == 0) {
                //<h2 id="dashboard-title">Huhu(狐狐)</h2>
                $('body').append('<div id="dashboard"><div class="huhu-blood-circle" id="huhu-blood-cicle"></div></div>');
                $('#dashboard').append('<div><button id="dashboard-img-btn">吃了什麼圖</button></div><div><button id="dashboard-msg-huhu">發信給狐狐</button></div><div id="dashboard-footer"><p>made with <span id="love">♥</span> in Mozilla Taiwan</p></div>');
                $('#dashboard').addClass('dashboard');
                //$('#dashboard-title').addClass('dashboard-title');
                $('#dashboard-img-btn').addClass('dashboard-img-btn dashboard-btn');
                $('#dashboard-msg-huhu').addClass('dashboard-msg-huhu dashboard-btn');
                $('#dashboard-footer').addClass('dashboard-footer');
                $('#love').addClass('love');
                $huhu.on("contextmenu", function(e){
                    console.log('XD');
                    updateBlood(total_blood, 1);
                    $('#dashboard').toggleClass('slide-in');
                    // circle API

                    return false;
                });
            } else {

            }

            // circle
            var myCircle = Circles.create({
                id:         'huhu-blood-cicle',
                radius:     70,
                value:      total_blood,
                maxValue:   100,
                width:      10,
                text:       function(value){return value + '%';},
                colors:     ['#FFFFFF', 'rgb(0, 255, 153)'],
                duration:   400,
                wrpClass:   'circles-wrp',
                textClass:  'circles-text'
            })

            // click & hide dashboard  
            $(document).on('click', function(e){
                $('#dashboard').removeClass('slide-in'); 
            });

            function updateBlood(blood, duration) {
                myCircle.update(blood, duration);
            }
            // if($('#dashboard').length == 0) {
            //     $('body').append('<div id="dashboard" style="display:none; width:100px; background:red;">Dash</div>');
            //     $('#dashboard').show();
            //     console.log($('#dashboard').length);
            // } else {
            //     $('#dashboard').hide();
            //     alert('x');
            // }
            // document.oncontextmenu = function() {return false;};
            // $huhu.mousedown(function(e){ 
            //     if( e.button == 2 ) { 
            //         console.log('Right mouse button!'); 
            //         return false; 
            // } 
            //     return true; 
            // }); 
            setInterval((function() {
                if(total_blood > 0) {
                    updateBlood(total_blood, 100);
                }
                updateBlood(total_blood, 100);
            }), 100);

            setInterval((function() {
                if(total_blood > 0) {
                    total_blood -= 1;
                    updateBlood(total_blood, 100);
                }
                updateBlood(total_blood, 100);
            }), 10000);
        }

        function dragObject() {
            // Save the dragged object 
            $(document).on('dragstart', function(e) {
                if (typeof(Storage) !== "undefined") {
                    // Code for localStorage/sessionStorage.
                    window.dragTheObject = e.target;
                    // console.log(e);
                } else {
                    console.log('sorry, your broser cannot support drag event');
                }
                //e.dataTransfer.setData("text/plain", "This is text to drag")
                //console.log(e);               
            });
            // Fire the drop event
            $huhu.on('dragover', function(e) {
                e.preventDefault();
                return false;
            });

            // drop the object to huhu and save the image url
            $huhu.on('drop', function(e) {
                var file, files, tip, total_size, i, len;
                var heat = 0;
                $(dragTheObject).remove();
                e.preventDefault();
                $huhuSprite.removeClass();
                $huhuSprite.addClass('eat');
                files = e.originalEvent.dataTransfer.files;
                //console.log(files)
                //console.log(heat);
                if (files.length > 0) {
                    total_size = 0;
                    //console.log('yo')
                    for (i = 0, len = files.length; i < len; i++) {
                        file = files[i];
                        total_size += file.size;
                        //console.log(total_size);
                    }
                    heat += parseInt(total_size / 10000);
                    total_blood += parseInt(total_size / 10000);
                } else {
                    heat += 5;
                    total_blood += 5;
                }
                //console.log('eat eat up', heat);
                if (heat > 0) {
                    heat = parseInt(heat, 10);
                    if (heat > 100) {
                        heat = 100;
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
            })

            // change the cursor
            $huhu.on('mouseover', function(e) {
                e.stopPropagation();
                $huhu.css('cursor', 'move');
            });
        }

        init();
        dragObject();
        dashBoard();
    })();
}