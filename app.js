var env = {
    url: 'http://54.254.150.253/',
    ev: 'deviceready'
};
/*var env = {
    url: 'http://localhost/edu/',
    ev: 'deviceready'
};*/

var localStorage = window.localStorage;

var app = {
    views: {},
    models: {},
    routers: {},
    utils: {},
    adapters: {}
};

$(document).on('deviceready', function() {
    window.analytics.startTrackerWithId('UA-59384961-1');
    app.utils.templates.load(["BiteView", "BiteListItemView", "BiteListView"],
        function() {
            app.router = new app.routers.AppRouter();
            Backbone.history.start();
        });
});