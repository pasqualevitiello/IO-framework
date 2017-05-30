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
            dropdownHeadingsVariants = $( '#headings-fonts-variant' ),
            dropdownBodyVariants = $( '#body-fonts-variant' ),
            headings = $( 'h1, h2, h3, h4, h5, h6' ),
            body = $( 'body' ),
            currentFontHeadings,
            currentFontHeadingsVariants,
            currentFontBody,
            currentFontBodyVariants,
            currentFontHeadingsAllVariants,
            currentFontBodyAllVariants,
            fontIndexHeadings,
            fontIndexHeadingsVariants,
            headingsParam,
            fontIndexBody,
            fontIndexBodyVariants,
            bodyParam,
            fonts,
            families;

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
            currentFontHeadingsVariants && _insertParam( 'headingsvariant', currentFontHeadingsVariants.replace( /\s/g, '' ) );
            currentFontBodyVariants && _insertParam( 'bodyvariant', currentFontBodyVariants.replace( /\s/g, '' ) );
        }

        function _loadParams() {
            var headingsParam = _getParam().headings,
                headingsVariantsParam = _getParam().headingsvariant,
            	bodyParam = _getParam().body,
                bodyVariantsParam = _getParam().bodyvariant;

            $.each(fonts, function(index, item) {
            	if (item.family.replace(/\s/g, '') === headingsParam) {
            	    currentFontHeadings = item.family;
            	    fontIndexHeadings = index;
                    // Font Variant param
                    if( headingsVariantsParam && $.inArray( headingsVariantsParam, item.variants ) != -1 ) {
                        currentFontHeadingsVariants = headingsVariantsParam;
                        fontIndexHeadingsVariants = item.variants.indexOf(headingsVariantsParam);
                    }
            	}
        	    if (item.family.replace(/\s/g, '') === bodyParam) {
        	        currentFontBody = item.family;
        	        fontIndexBody = index;
                    // Font Variant param
                    if( bodyVariantsParam && $.inArray( bodyVariantsParam, item.variants ) != -1 ) {
                        currentFontBodyVariants = bodyVariantsParam;
                        fontIndexBodyVariants = item.variants.indexOf(bodyVariantsParam);
                    }
        	    }
            });
        }

        function _syncSelects() {
            dropdownHeadings.find('option').eq(fontIndexHeadings).attr('selected', 'selected');
            dropdownBody.find('option').eq(fontIndexBody).attr('selected', 'selected');

            if (headingsParam !== '') {
                _updateFonts(); // Da rivedere, non capisco bene a che serve
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

        function _parseVariants( currentFont, fontSelect ) {
            var currentFontVariants,
                currentFontVariants = fontSelect.find( 'option[value="' + currentFont + '"]' ).data( 'variants' );
            if( currentFontVariants ) {
                return currentFontVariants;
            }
        }

        function _displayVariants() {

            // Store latest font variant selected
            var prevHeadingsVariant = dropdownHeadingsVariants.find( ':selected' ).val(),
                prevBodyVariant = dropdownBodyVariants.find( ':selected' ).val();

            // Clean previous options
            dropdownHeadingsVariants.find( 'option' ).remove();
            dropdownBodyVariants.find( 'option' ).remove();

            var headingsVariants = _parseVariants( currentFontHeadings, dropdownHeadings ),
                bodyVariants = _parseVariants( currentFontBody, dropdownBody );

            // Populate headings variants selects
            for (var i = 0, l = headingsVariants.length; i < l; i++) {
                dropdownHeadingsVariants.append('<option value="' + headingsVariants[i] + '">' + headingsVariants[i] + '</option>')
            }
            // Populate body variants selects
            for (var i = 0, l = bodyVariants.length; i < l; i++) {
                dropdownBodyVariants.append('<option value="' + bodyVariants[i] + '">' + bodyVariants[i] + '</option>')
            }

            // Headings: Define options to be selected and update params variables
            var regularHeadingsVariant = dropdownHeadingsVariants.find( 'option[value="regular"]' );
            if( prevHeadingsVariant && $.inArray( prevHeadingsVariant, currentFontHeadingsAllVariants ) != -1 ) { // Get latest font variant selected
                dropdownHeadingsVariants.find( 'option[value="' + prevHeadingsVariant + '"]' ).prop( 'selected', true );
                currentFontHeadingsVariants = prevHeadingsVariant;
            } else if( regularHeadingsVariant.length ) { // Get regular variant
                dropdownHeadingsVariants.find( 'option[value="regular"]' ).prop( 'selected', true );
                currentFontHeadingsVariants = 'regular';
            } else {
                dropdownHeadingsVariants.find( 'option:first-of-type' ).prop( 'selected', true );
                currentFontHeadingsVariants = dropdownHeadingsVariants.find( 'option:first-of-type' ).val();
            }

            // Body: Define options to be selected and update params variables
            var regularBodyVariant = dropdownBodyVariants.find( 'option[value="regular"]' );
            if( prevBodyVariant && $.inArray( prevBodyVariant, currentFontBodyAllVariants ) != -1 ) { // Get latest font variant selected
                dropdownBodyVariants.find( 'option[value="' + prevBodyVariant + '"]' ).prop( 'selected', true );
                currentFontBodyVariants = prevBodyVariant;
            } else if( regularBodyVariant.length ) { // Get regular variant
                dropdownBodyVariants.find( 'option[value="regular"]' ).prop( 'selected', true );
                currentFontBodyVariants = 'regular';
            } else {
                dropdownBodyVariants.find( 'option:first-of-type' ).prop( 'selected', true );
                currentFontBodyVariants = dropdownBodyVariants.find( 'option:first-of-type' ).val();
            }
        }

        function _updateFonts() {

            // Get all variants of a font
            currentFontHeadingsAllVariants = _parseVariants( currentFontHeadings, dropdownHeadings ),
            currentFontBodyAllVariants = _parseVariants( currentFontBody, dropdownBody ),
            families = [ currentFontHeadings + ':' + currentFontHeadingsAllVariants, currentFontBody + ':' + currentFontBodyAllVariants ];

            // Avoid double font loading
            if( currentFontHeadings == currentFontBody ) {
                families = [ currentFontHeadings + ':' + currentFontHeadingsAllVariants ];
            }

            WebFont.load({
                google: {
                    families: families
                },
                active: function() {
                    headings.css({
                        'font-family': currentFontHeadings,
                        'font-weight': currentFontHeadingsVariants,
                    });
                    body.css({
                        'font-family': currentFontBody,
                        'font-weight': currentFontBodyVariants,
                    });
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
                    _syncSelects();
                });

            });

        }

        function _bindEvents() {
            dropdownHeadings.on(' change', function() {
                currentFontHeadings = $(this).val().toString();
                _updateFonts();// doppia call che determina multiple caricamento fonts
                _displayVariants();
                _syncSelects();
            });
            dropdownHeadingsVariants.on(' change', function() {
                currentFontHeadingsVariants = $(this).val().toString();
                _updateFonts();// doppia call che determina multiple caricamento fonts
            });
            dropdownBody.on( 'change', function() {
                currentFontBody = $(this).val().toString();
                _updateFonts();
                _displayVariants();
                _syncSelects();// doppia call che determina multiple caricamento fonts
            });
            dropdownBodyVariants.on(' change', function() {
                currentFontBodyVariants = $(this).val().toString();
                _updateFonts();// doppia call che determina multiple caricamento fonts
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
                _displayVariants();
                _syncSelects();
                e.preventDefault();
            });
            dropdownHeadingsVariants.keydown( function(e) {
                switch( e.which ) {
                    case 38: // up
                    $(this).find( ':selected' ).prev().prop( 'selected', true );
                    break;

                    case 40: // down
                    $(this).find( ':selected ' ).next().prop( 'selected', true );
                    break;

                    default: return; // exit this handler for other keys
                }
                currentFontHeadingsVariants = $(this).val().toString();
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
                _syncSelects();
                e.preventDefault();
            });
            dropdownBodyVariants.keydown( function(e) {
                switch( e.which ) {
                    case 38: // up
                    $(this).find( ':selected' ).prev().prop( 'selected', true );
                    break;

                    case 40: // down
                    $(this).find( ':selected ' ).next().prop( 'selected', true );
                    break;

                    default: return; // exit this handler for other keys
                }
                currentFontBodyVariants = $(this).val().toString();
                _updateFonts();
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