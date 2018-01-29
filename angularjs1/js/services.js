practinaPanel
      .directive('ngClickCopy', ['ngCopy', function(ngCopy) {
      return {
          restrict: 'A',
          link: function(scope, element, attrs) {
              element.bind('click', function(e) {
                  ngCopy(attrs.ngClickCopy);
              });
          }
      }
      }])
      .directive('autoTabTo', [function() {
    return {
        restrict: "A",
        link: function(scope, el, attrs) {
            el.bind('keyup', function(e) {
                var theEvent = e || window.event;
                var key = theEvent.keyCode || theEvent.which;
                //console.log(key);
                if (key == 8) {
                    var element = document.getElementById(attrs.switch);
                    console.log(element.value);
                    if (element)
                        element.focus();
                    return false;
                } else if (this.value.length === this.maxLength) {
                    var element = document.getElementById(attrs.autoTabTo);
                    if (element)
                        element.focus();
                    //element.value=e;
                }
            });
        }
    }
  }]);
      practinaPanel
          .filter('phoneNumber',function () {
            return function (number) {
                 if (!number) { return ''; }
                 number = String(number);
                 console.log(number);
                 var num=number.split('-');
                 console.log(num);
                 if(num.length>1){
                   var code=num[0];
                   number=num[1];
                 }
                 else{
                   var code='';
                   number=num[0];
                 }
                 number = number.replace(/[^0-9]*/g, '');
                 var formattedNumber = number;

                 var c = (number[0] == '1') ? '1' : '';
                 number = number[0] == '1' ? number.slice(1) : number;
                //  var c = number[0];
                 var area = number.substring(0, 3);
                 var front = number.substring(3, 6);
                 var end = number.substring(6, 10);
                 console.log(c,area,front,end);
                 if (front) {
                     formattedNumber = (code + " (" + area + ") " + front);
                 }
                 if (end) {
                     formattedNumber += ("-" + end);
                 }
                 return formattedNumber;
             };
         })
        .filter('dateformatter', function() {
        return function(date) {
        //var strdate = strtotime(date);
        var d = new Date(date);
        var month = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
        var date = d.getDate() + "-" + month[d.getMonth()] + "-" + d.getFullYear();
        var time = d.toLocaleTimeString().toUpperCase();
        date = date + " | " +  time;
        return date;

        }
      })

    // =========================================================================
    // Header Messages and Notifications list Data
    // =========================================================================
practinaPanel
    .service('ngCopy', ['$window', '$rootScope', function($window, $rootScope) {
    var body = angular.element($window.document.body);
    var textarea = angular.element('<textarea/>');
    textarea.css({
        position: 'fixed',
        opacity: '0'
    });

    return function(toCopy) {
        textarea.val(toCopy);
        body.append(textarea);
        textarea[0].select();

        try {
            var successful = document.execCommand('copy');
            if (!successful) throw successful;
            // console.log(successful);
            $rootScope.openToast('success', 'Referral Code Copied !', '');
        } catch (err) {
            window.prompt("Copy to clipboard: Ctrl+C, Enter", toCopy);
        }

        textarea.remove();
    }
    }])
    .service('messageService', ['$resource', function($resource){
        this.getMessage = function(img, user, text) {
            var gmList = $resource("data/messages-notifications.json");

            return gmList.get({
                img: img,
                user: user,
                text: text
            });
        }
    }])


/*Counter*/
.directive('countTo', ['$timeout', function ($timeout) {
            return {
                replace: false,
                scope: true,
                link: function (scope, element, attrs) {

                    var e = element[0];
                    var num, refreshInterval, duration, steps, step, countTo, value, increment;

                    var calculate = function () {
                        refreshInterval = 30;
                        step = 0;
                        scope.timoutId = null;
                        countTo = parseFloat(attrs.countTo) || 0;
                        scope.value = parseFloat(attrs.value, 10) || 0;
                        duration = (parseFloat(attrs.duration) * 1000) || 0;

                        steps = Math.ceil(duration / refreshInterval);
                        increment = ((countTo - scope.value) / steps);
                        num = scope.value;
                    }

                    var tick = function () {
                        scope.timoutId = $timeout(function () {
                            num += increment;
                            step++;
                            if (step >= steps) {
                                $timeout.cancel(scope.timoutId);
                                num = countTo;
                                e.textContent = countTo;
                            } else {
                                e.textContent = Math.round(num);
                                // Math.round(num);
                                tick();
                            }
                        }, refreshInterval);

                    }

                    var start = function () {
                        if (scope.timoutId) {
                            $timeout.cancel(scope.timoutId);
                        }
                        calculate();
                        tick();
                    }

                    attrs.$observe('countTo', function (val) {
                        if (val) {
                            start();
                        }
                    });

                    attrs.$observe('value', function (val) {
                        start();
                    });

                    return true;
                }
            }
        }])


    // =========================================================================
    // Best Selling Widget Data (Home Page)
    // =========================================================================

    .service('bestsellingService', ['$resource', function($resource){
        this.getBestselling = function(img, name, range) {
            var gbList = $resource("data/best-selling.json");

            return gbList.get({
                img: img,
                name: name,
                range: range,
            });
        }
    }])


    // =========================================================================
    // Todo List Widget Data
    // =========================================================================

    .service('todoService', ['$resource', function($resource){
        this.getTodo = function(todo) {
            var todoList = $resource("data/todo.json");

            return todoList.get({
                todo: todo
            });
        }
    }])


    // =========================================================================
    // Recent Items Widget Data
    // =========================================================================

    .service('recentitemService', ['$resource', function($resource){
        this.getRecentitem = function(id, name, price) {
            var recentitemList = $resource("data/recent-items.json");

            return recentitemList.get ({
                id: id,
                name: name,
                price: price
            })
        }
    }])


    // =========================================================================
    // Recent Posts Widget Data
    // =========================================================================

    .service('recentpostService', ['$resource', function($resource){
        this.getRecentpost = function(img, user, text) {
            var recentpostList = $resource("data/messages-notifications.json");

            return recentpostList.get ({
                img: img,
                user: user,
                text: text
            })
        }
    }])

    // =========================================================================
    // Data Table
    // =========================================================================

    .service('tableService', [function(){
        this.data = [
            {
                "id": 10238,
                "name": "Marc Barnes",
                "email": "marc.barnes54@example.com",
                "username": "MarcBarnes",
                "contact": "(382)-122-5003"
            },
            {
                "id": 10243,
                "name": "Glen Curtis",
                "email": "glen.curtis11@example.com",
                "username": "GlenCurtis",
                "contact": "(477)-981-4948"
            },
            {
                "id": 10248,
                "name": "Beverly Gonzalez",
                "email": "beverly.gonzalez54@example.com",
                "username": "BeverlyGonzalez",
                "contact": "(832)-255-5161"
            },
            {
                "id": 10253,
                "name": "Yvonne Chavez",
                "email": "yvonne.chavez@example.com",
                "username": "YvonneChavez",
                "contact": "(477)-446-3715"
            },
            {
                "id": 10234,
                "name": "Melinda Mitchelle",
                "email": "melinda@example.com",
                "username": "MelindaMitchelle",
                "contact": "(813)-716-4996"

            },
            {
                "id": 10239,
                "name": "Shannon Bradley",
                "email": "shannon.bradley42@example.com",
                "username": "ShannonBradley",
                "contact": "(774)-291-9928"
            },
            {
                "id": 10244,
                "name": "Virgil Kim",
                "email": "virgil.kim81@example.com",
                "username": "VirgilKim",
                "contact": "(219)-181-7898"
            },
            {
                "id": 10249,
                "name": "Letitia Robertson",
                "email": "letitia.rober@example.com",
                "username": "Letitia Robertson",
                "contact": "(647)-209-4589"
            },
            {
                "id": 10237,
                "name": "Claude King",
                "email": "claude.king22@example.com",
                "username": "ClaudeKing",
                "contact": "(657)-988-8701"
            },
            {
                "id": 10242,
                "name": "Roland Craig",
                "email": "roland.craig47@example.com",
                "username": "RolandCraig",
                "contact": "(932)-935-9471"
            },
            {
                "id": 10247,
                "name": "Colleen Parker",
                "email": "colleen.parker38@example.com",
                "username": "ColleenParker",
                "contact": "(857)-459-2792"
            },
            {
                "id": 10252,
                "name": "Leah Jensen",
                "email": "leah.jensen27@example.com",
                "username": "LeahJensen",
                "contact": "(861)-275-4686"
            },
            {
                "id": 10236,
                "name": "Harold Martinez",
                "email": "martinez67@example.com",
                "username": "HaroldMartinez",
                "contact": "(836)-634-9133"
            },
            {
                "id": 10241,
                "name": "Keith Lowe",
                "email": "keith.lowe96@example.com",
                "username": "KeithLowe",
                "contact": "(778)-787-3100"
            },
            {
                "id": 10246,
                "name": "Charles Walker",
                "email": "charles.walker90@example.com",
                "username": "CharlesWalker",
                "contact": "(486)-440-4716"
            },
            {
                "id": 10251,
                "name": "Lillie Curtis",
                "email": "lillie.curtis12@example.com",
                "username": "LillieCurtis",
                "contact": "(342)-510-2258"
            },
            {
                "id": 10235,
                "name": "Genesis Reynolds",
                "email": "genesis@example.com",
                "username": "GenesisReynolds",
                "contact": "(339)-375-1858"
            },
            {
                "id": 10240,
                "name": "Oscar Palmer",
                "email": "oscar.palmer24@example.com",
                "username": "OscarPalmer",
                "contact": "(544)-270-9912"
            },
            {
                "id": 10245,
                "name": "Lena Bishop",
                "email": "Lena Bishop",
                "username": "LenaBishop",
                "contact": "(177)-521-1556"
            },
            {
                "id": 10250,
                "name": "Kent Nguyen",
                "email": "kent.nguyen34@example.com",
                "username": "KentNguyen",
                "contact": "(506)-533-6801"
            }
        ];
    }])


    // =========================================================================
    // Malihu Scroll - Custom Scroll bars
    // =========================================================================
    .service('scrollService', function() {
        var ss = {};
        ss.malihuScroll = function scrollBar(selector, theme, mousewheelaxis) {
            $(selector).mCustomScrollbar({
                theme: theme,
                scrollInertia: 100,
                axis:'yx',
                mouseWheel: {
                    enable: true,
                    axis: mousewheelaxis,
                    preventDefault: true
                }
            });
        }

        return ss;
    })


    //==============================================
    // BOOTSTRAP GROWL
    //==============================================

    .service('growlService', function(){
        var gs = {};
        gs.growl = function(message, type) {
            $.growl({
                message: message
            },{
                type: type,
                allow_dismiss: false,
                label: 'Cancel',
                className: 'btn-xs btn-inverse',
                placement: {
                    from: 'top',
                    align: 'right'
                },
                delay: 2500,
                animate: {
                        enter: 'animated bounceIn',
                        exit: 'animated bounceOut'
                },
                offset: {
                    x: 20,
                    y: 85
                }
            });
        }

        return gs;
    })
