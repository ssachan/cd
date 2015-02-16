/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var sourceMap = {
    "thehindu": "The Hindu",
    "telegraghindia": "The Telegraph",
    "economictimes.indiatimes.com": "The Economic Times",
    "reuters.com": "Reuters",
    "timesofindia": "The Times Of India",
    "bbc.com": "BBC",
    "business-standard.com": "Business Standard",
    "indianexpress.com": "The Indian Express"
};

var categoryColorMap = {
    "Economics": "#9B30FF",
    "Enviro &amp; Biodiversity": "#41a62a",
    "Geography": "#FFA824",
    "History": "#A02422",
    "Polity": "#4CB7A5",
    "Science &amp; Tech": "#0266C8",
    "Trivia": "#CD5555",
    "World": "#FF6103",
};

var env = {
    url: 'http://54.254.150.253/',
    ev: 'deviceready'
};

var env = {
    url: 'http://localhost/edu/',
    ev: 'DOMContentLoaded'
};

var slideNumber = 0;

var localStorage = window.localStorage;

var newBites = new Bites();
var savedBites = new Bites();
var lastId = null;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener(env.ev, this.onDeviceReady, false);
    },

    safe_tags_regex: function(str) {
        var text = str.replace(/(<([^>]+)>)/ig, "");
        text = encodeURI(text);
        text = text.replace(/%20/g, ' ').replace(/%[a-zA-Z0-9][a-zA-Z0-9]/g, ' ');
        return text = (text + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
    },

    goToSlide: function(sno) {
        offsetX = sno * sliderWidth;
        slider = getSlider();
        slider.style['-webkit-transition-duration'] = '100ms';
        slider.style.webkitTransform = 'translate3d(' + offsetX + 'px,0,0)';
        e = new CustomEvent('slide', {
            detail: {
                slideNumber: Math.abs(sno)
            },
            bubbles: true,
            cancelable: true
        });
        slider.parentNode.dispatchEvent(e);
    },

    resetSlideNumber: function() {
        slideNumber = 0;
    },

    getOrientation: function(target) {
        var i;
        var r = document.getElementById('slide-right');
        var l = document.getElementById('slide-left');
        if (target === r) {
            return 'r';
        } else if (target === l) {
            return 'l';
        }

    },

    onTouchEnd: function(e) {
        orientation = app.getOrientation(e.target);
        if (!orientation) {
            return;
        }
        slider = document.getElementsByClassName('slide-group')[0];
        sliderWidth = slider.offsetWidth;
        lastSlide = -(slider.children.length - 1);
        if (orientation == 'r') {
            slideNumber--;
        } else {
            slideNumber++;
        }
        //console.log('sno'+slideNumber);
        offsetX = slideNumber * sliderWidth;
        slider.style['-webkit-transition-duration'] = '200ms';
        slider.style.webkitTransform = 'translate3d(' + offsetX + 'px,0,0)';

        $('#slide-left').show();
        $('#slide-right').show();
        if (slideNumber === lastSlide) {
            $('#slide-right').hide();
        }
        if (slideNumber == 0) {
            $('#slide-left').hide();
        }
        /*e = new CustomEvent('slide', {
            detail: {
                slideNumber: Math.abs(slideNumber)
            },
            bubbles: true,
            cancelable: true
        });

        slider.parentNode.dispatchEvent(e);*/
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        FastClick.attach(document.body);
        //document.querySelector('#sd').addEventListener('slide', this.onSlide);
        window.addEventListener('push', app.onPush);
        //app.renderSplashScreen();
        //app.trySilentLogin();
        //app.onLogin({'displayName':'hhe','email':'emd','fn':'cc'});
        app.buildPage('index.html');
        //$('.savelist').on("touchend", app.addToSavedList);        
        lastId = localStorage.getItem("lastId");

        var savedBitesArray = JSON.parse(localStorage.getItem("savedBites"));
        if (savedBitesArray != null) {
            var len = savedBitesArray.length;
            for (var i = 0; i < len; i++) {
                var bite = new Bite(savedBitesArray[i].id, savedBitesArray[i].post_title, savedBitesArray[i].post_content, savedBitesArray[i].category, savedBitesArray[i].link);
                savedBites.add(bite);
            }
        }
        window.analytics.startTrackerWithId('UA-59384961-1');
    },

    onFeedbackSumbit: function(e) {
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: env.url + 'wp-admin/admin-ajax.php?action=submitFeedback',
            data: {
                'email': localStorage.getItem("email"),
                'feedback': $('#feedback-area').val()
            },
            success: app.success
        })
    },

    onPush: function(obj) {
        var requestURL = obj.detail.state.url;
        app.buildPage(requestURL);
    },

    buildPage: function(requestURL) {
        if (requestURL.indexOf("savedlist.html") > -1) {
            app.getSavedBites();
            document.getElementById('slide-right').addEventListener('touchend', app.onTouchEnd);
            document.getElementById('slide-left').addEventListener('touchend', app.onTouchEnd);
            app.resetSlideNumber();
            window.analytics.trackView('Bookmarked');
        } else if (requestURL.indexOf("index.html") > -1) {
            document.getElementById('slide-right').addEventListener('touchend', app.onTouchEnd);
            document.getElementById('slide-left').addEventListener('touchend', app.onTouchEnd);
            app.getNewBites();
            app.resetSlideNumber();
            window.analytics.trackView('Latest');
        } else if (requestURL.indexOf("feedback.html") > -1) {
            $('#submit').on("click", app.onFeedbackSumbit);
            window.analytics.trackView('Feedback');
        }
        app.renderSettingsMenu();
    },

    parseSourceName: function(link) {
        for (str in sourceMap) {
            if (link.indexOf(str) > -1) {
                return sourceMap[str];
            }
        }
        return "Link";
    },

    renderErrorMsg: function(msg) {
        document.getElementById('cid').innerHTML = '<h2 class="error">' + msg + '</h2>';
    },

    renderSingleSlide: function(bite) {
        var html = '';
        html += '<div class="slide"><ul class="table-view">';
        html += '<li class="table-view-cell media"><div class="media-body">';
        html += '<h4 class="clearfix" style="line-height: 2;color:' + categoryColorMap[bite.category] + ';"><span class="badge" style="background-color:' + categoryColorMap[bite.category] + ';"> </span>' + bite.category;
        if (savedBites.get(bite.id) != null) {
            html += '<a class="icon pull-right savelist saved" id="' + bite.id + '" onClick="app.addToSavedList(\'' + bite.id + '\'); window.analytics.trackEvent(\'Un-Bookmark\', \'touch\', \'id-' + bite.id + '\');"></a>';
        } else {
            html += '<a class="icon pull-right savelist" id="' + bite.id + '" onClick="app.addToSavedList(\'' + bite.id + '\'); window.analytics.trackEvent(\'Bookmark\', \'touch\', \'id-' + bite.id + '\');"></a>';
        }
        html += '<a class="icon whatsapp pull-right" onclick="window.plugins.socialsharing.shareViaWhatsApp(\'' + app.safe_tags_regex(bite.post_content) + '\', null, \'' + bite.link + '\', function() {console.log(\'share ok\')}, function(errormsg){alert(errormsg)}); window.analytics.trackEvent(\'WhatsApp Share\', \'touch\', \'id-'+bite.id+'\');"></a></h4>';
        html += '<h3>' + bite.post_title + '</h3>' + bite.post_content;
        if (bite.link != null) {
            html += '<div class="source">Source: <a href="' + bite.link + '" data-ignore="push">' + app.parseSourceName(bite.link) + '</a></div>';
        }
        html += '</div></li></ul></div>';
        return html;
    },

    renderSlides: function(bites) {
        var html = '<div class="slider"><div class="slide-group">';
        bites.forEach(function(bite) {
            html += app.renderSingleSlide(bite);
        });
        html += '</div></div>'
        $('.bar-main').show();
        $('.content').removeClass('splash');
        document.getElementById('cid').innerHTML = html;
        $('#slide-left').hide();
        $('#slide-right').show();
    },

    renderLoading: function() {
        document.getElementById('cid').innerHTML = '<div class="load"><img src="img/load.gif" /></div>'
    },

    renderSplashScreen: function() {
        $('.bar-main').hide();
        $('#cid').addClass('splash');
        $('#cid').html('<button class="btn btn-negative btn-block gp" onClick="app.login()">Login using Google+</button>');
    },

    renderSettingsMenu: function() {
        document.getElementById('fn').value = localStorage.getItem('displayname');
        document.getElementById('email').value = localStorage.getItem('email');
    },

    addToSavedList: function(id) {
        if (savedBites.get(id) != null) {
            // exists in localstorage
            savedBites.remove(id);
            $("#" + id).removeClass('saved');
        } else {
            savedBites.add(newBites.get(id));
            $("#" + id).addClass('saved');
        }
        localStorage.setItem('savedBites', JSON.stringify(savedBites.getAll()));
    },

    // fetch new bites
    getNewBites: function() {
        //alert('here');
        if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else { // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var newBitesArray = eval("(function(){return " + xmlhttp.responseText + ";})()");
                    newBitesArray.forEach(function(bite) {
                        newBites.add(new Bite(bite.ID, bite.post_title, bite.post_content, bite.category, bite.link));
                    });
                    app.renderSlides(newBites.getAll());
                } else {
                    app.renderErrorMsg('Oops!<br>Something went wrong. :(<br> Please check your internet connection or browse through your <a href="savedlist.html">saved list</a>')
                }
                //slide.goToSlide(2);
            }
        }
        app.renderLoading();
        //xmlhttp.open("GET", "http://localhost/edu/wp-admin/admin-ajax.php?action=getBites", true);
        xmlhttp.open("GET", env.url + "wp-admin/admin-ajax.php?action=getBites", true);
        try {
            xmlhttp.send();
        } catch (err) {
            app.renderErrorMsg('Oops!<br>Something went wrong. :(<br> Please check your internet connection or browse through your <a href="savedlist.html">saved list</a>')
        }
    },

    getSavedBites: function() {
        var savedBitesArray = savedBites.getAll();
        if (savedBitesArray.length <= 0) {
            app.renderErrorMsg('You haven\'t saved anything for later read. Touch <span class="icon icon-home icon-circle"></span> icon to build your save list. <a href="index.html">Start Reading</a>');
            return;
        }
        app.renderSlides(savedBitesArray);
    },

    onLogin: function(obj) {
        localStorage.setItem('displayname', obj.displayName);
        localStorage.setItem('email', obj.email);
        //try sending the details to the DB
        $.ajax({
            type: "POST",
            url: env.url + 'wp-admin/admin-ajax.php?action=postUserData',
            data: obj,
            success: app.success
        })
        app.buildPage('index.html');
    },
    success: function() {
        //do nothing
    },
    login: function() {
        window.plugins.googleplus.login({}, app.onLogin,
            function(msg) {
                app.renderErrorMsg("Error: " + msg);
            }
        );
    },

    logout: function() {
        window.plugins.googleplus.logout(
            function(msg) {
                //logged out                    
            }
        );
    },

    trySilentLogin: function() {
        window.plugins.googleplus.trySilentLogin({}, app.onLogin,
            function(msg) {
                //alert('silent login fail: ' + msg);
                app.renderSplashScreen();
            }
        );

    },

};