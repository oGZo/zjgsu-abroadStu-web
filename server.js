var express = require('express');
var app     = express();
var maxAge  = 31557600000;

app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/build' ));
app.use('/bower_components', express.static(__dirname + '/bower_components' ));
app.use('/resource', express.static(__dirname + '/resource' ));

app.get('/*', function(req,res)
{
    res.sendfile(__dirname + '/build/index.html');
});

app.listen(3001);

console.log('Listening on port 3001');
