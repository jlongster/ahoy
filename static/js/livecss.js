
$(function() {
    window.cssEditor = ace.edit("css-editor");
    window.htmlEditor = ace.edit("html-editor");
    var loc = window.location.pathname.replace(/\/$/, '');
    var parts = loc.split("/");
    var name;

    if(parts.length > 1) {
        name = parts[parts.length-1];
    }
    else {
        name = "global";
    }

    sharejs.open(name + "-css", "text", function(doc, error) {
        doc.attach_ace(cssEditor);
        window.cssDoc = doc;
    });

    sharejs.open(name + "-html", "text", function(doc, error) {
        doc.attach_ace(htmlEditor);
        window.htmlDoc = doc;
    });

    $('#css-editor').append('<div class="name">CSS</div>');
    $('#html-editor').append('<div class="name">HTML</div>');

    $("form.create input").val('p' + Math.floor(Math.random() * 10000));
    $(".header .name").html(name);

    $("form.create").submit(function(e) {
        e.preventDefault();
        var val = $('form.create input').val();
        window.location.href = '/' + val;
    });

    $(window).keydown(function(e) {
        if(e.keyCode == 27) {
            $('#dynamic-css').remove();
            $('#canvas').empty();

            stopRefresh();
            setTimeout(function() {
                startRefresh();
            }, 10*1000);
        }
    });
});

function showError(msg) {
    var err = $('.error');
    err.show();
    err.html(msg);
}

function hideError() {
    $('.error').hide();
}

function refresh() {
    var content = window.cssDoc.getText();
    var parser = new less.Parser();

    parser.parse('#canvas { ' + content + ' }', function(err, tree) {
        if(err) {
            showError(err.message);
        }
        else {
            hideError();

            var old = document.getElementById('dynamic-css');
            if(old) {
                document.body.removeChild(old);
            }

            var text = document.createTextNode(tree.toCSS());
            var style = document.createElement('style');
            style.type = 'text/css';
            style.id = 'dynamic-css';
            style.appendChild(text);
            document.body.appendChild(style);            
        }
    });

    var html = window.htmlDoc.getText();
    $('#canvas').html(html);
}

var refreshInterval;
function startRefresh() {
    refreshInterval = setInterval(refresh, 1000);
}

function stopRefresh() {
    clearInterval(refreshInterval);
}

startRefresh();
