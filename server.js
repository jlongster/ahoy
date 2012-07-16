var connect = require('connect');
var sharejs = require('share').server;
var fs = require('fs');
var config = require('./config');

var server = connect(
    connect.logger(),
    connect.static(__dirname + '/static')
);
var options = {db: {type: 'memory'}}; // See docs for options. {type: 'redis'} to enable persistance.

server.use(
    connect.router(function(app) {
        app.get('/:name',  function(req, res) {
            fs.readFile(__dirname + '/static/index.html', function(err, content) {
                if (err) {
                    res.writeHead(500);
                    res.write(err.toString());
                    res.end();
                }
                else {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(content, 'utf-8');
                }
            });
        });
    })
);

// Attach the sharejs REST and Socket.io interfaces to the server
sharejs.attach(server, options);

server.listen(config.port, function(){
    console.log('Server running on port ' + config.port);
});
