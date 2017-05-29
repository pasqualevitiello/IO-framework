/**
 * Create and append HTML
 */	
var controllerWrapper = document.createElement('div');
controllerWrapper.id = 'controller';
document.body.insertBefore( controllerWrapper, document.body.firstChild );

/**
 * Typography controller
 */
// https://stackoverflow.com/questions/13856272/google-fonts-getting-a-list-of-available-fonts-through-ajax
// https://vivekdragon.wordpress.com/2012/12/07/google-font-api-for-select/
// https://github.com/lefoy/google-fonts/blob/master/public/js/components/GoogleFonts.js

// Google API key
var apiKey = 'AIzaSyBS2UUiahoRjToJ9g2C5Je1aHcwfFKkHPQ';

// Add WebFont script
var webfontsScript = document.createElement( 'script' );
webfontsScript.src = 'http://ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js';
document.body.appendChild( webfontsScript );

// Add Client script
var webfontsScript = document.createElement( 'script' );
webfontsScript.src = 'https://apis.google.com/js/client.js?onload=loadFonts';
document.body.appendChild( webfontsScript );

// Create Typography controller HTML
var controllerTypography = '<div class="typography-controller"><select id="headings-fonts"></select><select id="body-fonts"></select></div>';
controllerWrapper.innerHTML = controllerTypography;


window.googlefonts = window.googlefonts || {};

(function(window, document, $) {

    "use strict";

    googlefonts.LoadFonts = (function() {

        var dropdown = $( '#headings-fonts' ),
            preview = $( 'h1' ),
            currentFont,
            fonts;

        function _updateHash() {

            window.location.hash = currentFont.replace(/\s/g, '');

        }

        function _loadHash() {

            var hash = window.location.hash.substring(1),
                fontIndex;

            $.each(fonts, function(index, item) {
                if (item.family.replace(/\s/g, '') === hash) {
                    currentFont = item.family;
                    fontIndex = index;
                    return false;
                }
            });

            dropdown.find('option').eq(fontIndex).attr('selected', 'selected');

            if (hash !== '') {
                _updateFont();
            }

        }

        function _display() {

            $('body').addClass('is-loaded');

            for (var i = 0, l = fonts.length; i < l; i++) {
                dropdown.append('<option value="' + fonts[i].family + '">' + fonts[i].family + '</option>');
            }

            _loadHash();

        }

        function _updateFont() {

            WebFont.load({
                google: {
                    families: [currentFont + ':300,400,700']
                }
            });

            preview.css('font-family', currentFont);

            _updateHash();
        }

        function _setupAPI() {

            gapi.client.setApiKey(apiKey);

            gapi.client.load('webfonts', 'v1', function() {

                var request = gapi.client.webfonts.webfonts.list();
                request.execute(function(resp) {
                    fonts = resp.items;
                    _display();
                });

            });

        }

        function _bindEvents() {

            dropdown.on('change', function() {
                currentFont = $(this).val().toString();
                _updateFont();
            });
        }

        function init() {
            _setupAPI();
            _bindEvents();
        }

        return {
            init: init
        };

    })();

})(window, document, $);

var loadFonts = function() {
    window.googlefonts.LoadFonts.init();
};