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
var controllerTypography = '<div class="typography-controller"><select id="headings-fonts"></select><select id="headings-fonts-variant"></select><select id="body-fonts"></select><select id="body-fonts-variant"></select></div>';
controllerWrapper.innerHTML = controllerTypography;

// Load Google Fonts - Crafted from:
// https://github.com/lefoy/google-fonts/blob/master/public/js/components/GoogleFonts.js
window.googlefonts = window.googlefonts || {};

(function(window, document, $) {

    "use strict";

    googlefonts.LoadFonts = (function() {

        var dropdownHeadings = $( '#headings-fonts' ),
        	dropdownBody = $( '#body-fonts' ),
            dropdownHeadingsVariant = $( '#headings-fonts-variant' ),
            dropdownBodyVariant = $( '#body-fonts-variant' ),
            headings = $( 'h1, h2, h3, h4, h5, h6' ),
            body = $( 'body' ),
            currentFontHeadings,
            currentFontHeadingsVariants,
            currentFontBody,
            currentFontBodyVariants,
            fonts;

        function _getParam() {
            var paramString = window.location.search.substr( 1 );
            return paramString != null && paramString != '' ? _transformToAssocArray( paramString ) : {};
        }

        function _transformToAssocArray( paramString ) {
            var params = {};
            var paramsArray = paramString.split( '&' );
            for ( var i = 0; i < paramsArray.length; i++ ) {
                var tempArray = paramsArray[i].split( '=' );
                params[tempArray[0]] = tempArray[1];
            }
            return params;
        }

        function _insertParam( key, value ) {
            key = escape( key ); value = escape( value );

            var kvp = document.location.search.substr( 1 ).split( '&' );
            if ( kvp == '' ) {
                history.pushState({}, '', '?' + key + '=' + value );
            } else {

                var i = kvp.length; var x; while ( i-- ) {
                    x = kvp[i].split( '=' );

                    if ( x[0] == key ) {
                        x[1] = value;
                        kvp[i] = x.join( '=' );
                        break;
                    }
                }

                if ( i < 0 ) { kvp[kvp.length] = [key, value].join( '=' ); }

                history.pushState({}, '', '?' + kvp.join( '&' ) );
            }
        }

        function _updateParams() {        	
            currentFontHeadings && _insertParam( 'headings', currentFontHeadings.replace( /\s/g, '' ) );
            currentFontBody && _insertParam( 'body', currentFontBody.replace( /\s/g, '' ) );
            // currentFontHeadingsVariants && _insertParam( 'headingsvariant', currentFontHeadingsVariants.replace( /\s/g, '' ) );
            // currentFontBodyVariants && _insertParam( 'bodyvariant', currentFontBodyVariants.replace( /\s/g, '' ) );
        }

        function _loadParams() {
            var headingsParam = _getParam().headings,
                //headingsVariantsParam = _getParam().headingsvariant,
            	bodyParam = _getParam().body,
                //bodyVariantsParam = _getParam().bodyvariant,
                fontIndexHeadings,
                //fontIndexHeadingsVariants,
                fontIndexBody; // Attento al semicolon!
                //fontIndexBodyVariants;

            $.each(fonts, function(index, item) {
            	if (item.family.replace(/\s/g, '') === headingsParam) {
            	    currentFontHeadings = item.family;
            	    fontIndexHeadings = index;
            	}
        	    if (item.family.replace(/\s/g, '') === bodyParam) {
        	        currentFontBody = item.family;
        	        fontIndexBody = index;
        	    }
                // if (item.family.replace(/\s/g, '') === headingsVariantsParam) {
                //     currentFontHeadingsVariants = item.variants;
                //     fontIndexHeadingsVariants = index;
                // }
                // if (item.family.replace(/\s/g, '') === bodyVariantsParam) {
                //     currentFontBodyVariants = item.variants;
                //     fontIndexBodyVariants = index;
                // }
            });

            dropdownHeadings.find('option').eq(fontIndexHeadings).attr('selected', 'selected');
            dropdownBody.find('option').eq(fontIndexBody).attr('selected', 'selected');
            //dropdownHeadingsVariant.find('option').eq(fontIndexHeadingsVariants).attr('selected', 'selected');
            //dropdownBodyVariant.find('option').eq(fontIndexBodyVariants).attr('selected', 'selected');

            if (headingsParam !== '') {
                _updateFonts();
            }
        }

        function _displayFonts() {
            $('body').addClass('has-font-loaded');

            for (var i = 0, l = fonts.length; i < l; i++) {
                dropdownHeadings.append('<option value="' + fonts[i].family + '" data-variants=\'' + JSON.stringify( fonts[i].variants ) + '\'>' + fonts[i].family + '</option>');
                dropdownBody.append('<option value="' + fonts[i].family + '" data-variants=\'' + JSON.stringify( fonts[i].variants ) + '\'>' + fonts[i].family + '</option>');
                //$('body').prepend('<div style="text-align:right">' + JSON.stringify(fonts[i]) + '</div><br>');
            }

            _loadParams();
        }

        function _displayVariants() {
            dropdownHeadingsVariant.find( 'option' ).remove();
            dropdownBodyVariant.find( 'option' ).remove();
            var currentFontHeadingsVariants = dropdownHeadings.find( 'option[value="' + currentFontHeadings + '"]' ).data( 'variants' ),
                currentFontBodyVariants = dropdownBody.find( 'option[value="' + currentFontBody + '"]' ).data( 'variants' );
            for (var i = 0, l = currentFontHeadingsVariants.length; i < l; i++) {
                dropdownHeadingsVariant.append('<option value="' + currentFontHeadingsVariants[i] + '">' + currentFontHeadingsVariants[i] + '</option>');
            }
            for (var i = 0, l = currentFontBodyVariants.length; i < l; i++) {
                dropdownBodyVariant.append('<option value="' + currentFontBodyVariants[i] + '">' + currentFontBodyVariants[i] + '</option>');
            }
        }

        function _updateFonts() {
            WebFont.load({
                google: {
                    families: [currentFontHeadings + ':300,400,700', currentFontBody + ':300,400,700']
                },
                active: function() {
                    headings.css('font-family', currentFontHeadings);
                    body.css('font-family', currentFontBody);
                }
            });

            _updateParams();
        }

        function _setupAPI() {
            gapi.client.setApiKey(apiKey);
            gapi.client.load('webfonts', 'v1', function() {

                var request = gapi.client.webfonts.webfonts.list();
                request.execute(function(resp) {
                    fonts = resp.items;
                    _displayFonts();
                    _displayVariants();
                });

            });

        }

        function _bindEvents() {
            dropdownHeadings.on(' change', function() {
                currentFontHeadings = $(this).val().toString();
                _updateFonts();
                _displayVariants();
            });
            dropdownBody.on( 'change', function() {
                currentFontBody = $(this).val().toString();
                _updateFonts();
                _displayVariants();
            });
        }

        function _keyboardNavigation() {
            dropdownHeadings.keydown( function(e) {
                switch( e.which ) {
                    case 38: // up
                    $(this).find( ':selected' ).prev().prop( 'selected', true );
                    break;

                    case 40: // down
                    $(this).find( ':selected ' ).next().prop( 'selected', true );
                    break;

                    default: return; // exit this handler for other keys
                }
                currentFontHeadings = $(this).val().toString();
                _updateFonts();
                e.preventDefault();
            });
            dropdownBody.keydown( function(e) {
                switch( e.which ) {
                    case 38: // up
                    $(this).find( ':selected' ).prev().prop( 'selected', true );
                    break;

                    case 40: // down
                    $(this).find( ':selected ' ).next().prop( 'selected', true );
                    break;

                    default: return; // exit this handler for other keys
                }
                currentFontBody = $(this).val().toString();
                _updateFonts();
                _displayVariants();
                e.preventDefault();
            });
        }


        function init() {
            _setupAPI();
            _bindEvents();
            _keyboardNavigation();
        }

        return {
            init: init
        };

    })();

})(window, document, $);

// Init loadFonts
var loadFonts = function() {
    window.googlefonts.LoadFonts.init();
};