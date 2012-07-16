
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

    sharejs.open(name + "-css", "text", function(error, doc) {
        doc.attach_ace(cssEditor);
        window.cssDoc = doc;
        setCSS();

        var timer;

        doc.on('change', function() {
            if(timer) {
                clearTimeout(timer);
            }

            timer = setTimeout(function() {
                setCSS();
            }, 300);
        });
    });

    sharejs.open(name + "-html", "text", function(error, doc) {
        doc.attach_ace(htmlEditor);
        window.htmlDoc = doc;
        setHTML();

        var timer;

        doc.on('change', function() {
            if(timer) {
                clearTimeout(timer);
            }

            timer = setTimeout(function() {
                setHTML();
            }, 300);
        });
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

            stopApplying();
            setTimeout(function() {
                startApplying();
                setCSS();
                setHTML();
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

function setHTML() {
    if(applying) {
        var html = window.htmlDoc.getText();
        html = html.replace('<script', '');
        html = html.replace('&lt;script', '');
        $('#canvas').html(html);
    }
}

function setCSS() {
    var content = window.cssDoc.getText();
    var parser = new less.Parser();

    if(applying) {
        parser.parse('#canvas { ' + content + ' }', function(err, tree) {
            if(err) {
                showError(err.message);
            }
            else {
                hideError();
                var css = $('#dynamic-css');

                if(!css.length) {
                    $('body').append(
                        '<style id="dynamic-css" type="text/css"></style>'
                    );
                    css = $('#dynamic-css');
                }

                $('#dynamic-css').text(tree.toCSS());
            }
        });
    }
}

var applying = true;

function stopApplying() {
    applying = false;
}

function startApplying() {
    applying = true;
}