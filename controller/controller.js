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
webfontsScript.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js';
document.body.appendChild( webfontsScript );

// Add Client script
var webfontsScript = document.createElement( 'script' );
webfontsScript.src = 'https://apis.google.com/js/client.js?onload=loadFonts';
document.body.appendChild( webfontsScript );

// Create Typography controller HTML
var controllerTypography = '<div class="typography-controller"><h4>Headings typography</h4><select id="headings-fonts"></select><select id="headings-fonts-variant"></select><h4>Body typography</h4><select id="body-fonts"></select><select id="body-fonts-variant"></select><h4>Body font size</h4><input name="body-font-size-s" id="body-font-size-s" class="font-size-controller" min="14" max="20" step="1" type="number" value="16"><input name="body-font-size-m" id="body-font-size-m" class="font-size-controller" min="14" max="20" step="1" type="number" value="18"></div>';
controllerWrapper.innerHTML = controllerTypography;

// Create font style bucket
var styleBucket = document.createElement( 'style' );
styleBucket.setAttribute( 'id', 'style-bucket' );
document.head.appendChild( styleBucket );

// Create font size bucket
var sizeBucket = document.createElement( 'style' );
sizeBucket.setAttribute( 'id', 'size-bucket' );
document.head.appendChild( sizeBucket );

// Load Google Fonts - Crafted from:
// https://github.com/lefoy/google-fonts/blob/master/public/js/components/GoogleFonts.js
window.typographycontroller = window.typographycontroller || {};

(function(window, document, $) {

    "use strict"; 

    // Google Fonts handling
    typographycontroller.LoadFonts = (function() {

        var dropdownHeadings = $( '#headings-fonts' ),
            dropdownBody = $( '#body-fonts' ),
            dropdownHeadingsVariants = $( '#headings-fonts-variant' ),
            dropdownBodyVariants = $( '#body-fonts-variant' ),
            fontSizeControllers = $( '.font-size-controller' ),
            styleBucket = $( '#style-bucket' ),
            sizeBucket = $( '#size-bucket' ),
            headingsTarget = 'h1, h2, h3, h4, h5, h6',
            bodyTarget = 'html',
            paramsString = window.location.search.substr(1),
            paramsArray,
            currentFontHeadings,
            currentFontHeadingsVariants,
            currentFontBody,
            currentFontBodyVariants,
            currentFontHeadingsAllVariants,
            currentFontBodyAllVariants,
            currentBodySizeS,
            currentBodySizeM,
            fontIndexHeadings,
            fontIndexHeadingsVariants,
            headingsParam,
            headingsVariantsParam,
            fontIndexBody,
            fontIndexBodyVariants,
            bodyParam,
            bodyVariantsParam,
            bodySizeSParams,
            bodySizeMParams,
            fonts,
            families;    

        function _getParam() {
            return paramsString != null && paramsString != '' ? _transformToArray( paramsString ) : {};
        }

        function _transformToArray( paramsString ) {
            var tags = {};
            var tagsArray = paramsString.split( '&' );
            for ( var i = 0; i < tagsArray.length; i++ ) {
                var x = tagsArray[i].split( '=' ),
                    y = x[1].split( ':' );

                tags[x[0]] = [y[0], y[1]];
            }

            return tags;
        }

        function _insertParam( key, value, variant ) {

            key = escape( key ); value = escape( value ); variant = escape( variant );

            if ( paramsArray == '' ) {
                history.pushState({}, '', '?' + key + '=' + value + ':' + variant );
            } else {

                var i = paramsArray.length; var x; var y; while ( i-- ) {
                    x = paramsArray[i].split( '=' ),
                    y = x[1].split( ':' );

                    if ( x[0] == key ) {
                        y[0] = value;
                        y[1] = variant;
                        x[1] = y.join( ':' );
                        paramsArray[i] = x.join( '=' );
                        break;
                    }
                }

                if ( i < 0 ) {
                    var y = [value, variant].join( ':' )
                    paramsArray[paramsArray.length] = [key, y].join( '=' );
                }
            }
        }

        function _updateParams() {
            paramsArray = document.location.search.substr(1).split( '&' );
            currentFontHeadings && _insertParam( 'h', currentFontHeadings.replace( /\s/g, '' ), currentFontHeadingsVariants.replace( /\s/g, '' ) );
            currentFontBody && _insertParam( 'b', currentFontBody.replace( /\s/g, '' ) , currentFontBodyVariants.replace( /\s/g, '' ) );
            ( currentBodySizeS && currentBodySizeM ) && _insertParam( 'bfs', currentBodySizeS.replace( /\s/g, '' ), currentBodySizeM.replace( /\s/g, '' ) );
            paramsArray != '' && history.pushState({}, '', '?' + paramsArray.join( '&' ) );
        }

        function _loadParams() {
            var parseParams = _getParam();
            headingsParam = parseParams.h ? parseParams.h[0] : null,
            headingsVariantsParam = parseParams.h ? parseParams.h[1] : null,
            bodyParam = parseParams.b ? parseParams.b[0] : null,
            bodyVariantsParam = parseParams.b ? parseParams.b[1] : null,
            bodySizeSParams = parseParams.bfs ? parseParams.bfs[0] : '16',
            bodySizeMParams = parseParams.bfs ? parseParams.bfs[1] : '18';

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

            currentBodySizeS = bodySizeSParams;
            currentBodySizeM = bodySizeMParams;
        }

        function _syncSelects() {
            dropdownHeadings.find('option').eq(fontIndexHeadings).attr('selected', 'selected');
            dropdownBody.find('option').eq(fontIndexBody).attr('selected', 'selected');
            $('#body-font-size-s').val(bodySizeSParams);
            $('#body-font-size-m').val(bodySizeMParams);
        }

        function _displayFonts() {
            $('body').addClass('has-font-loaded');

            //dropdownHeadings.append('<option disabled selected>-- Pick a Font --</option>');
            //dropdownBody.append('<option disabled selected>-- Pick a Font --</option>');
            for(var i = 0, l = fonts.length; i < l; i++) {
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

            if( currentFontHeadings == null && currentFontBody == null ) {
                return; // Stop executing code below
            }

            if( currentFontHeadings ) {
                // Store latest font variant selected
                var prevHeadingsVariant = dropdownHeadingsVariants.find( ':selected' ).val();

                // Clean previous options
                dropdownHeadingsVariants.find( 'option' ).remove();

                var headingsVariants = _parseVariants( currentFontHeadings, dropdownHeadings );

                // Populate headings variants selects
                for (var i = 0, l = headingsVariants.length; i < l; i++) {
                    dropdownHeadingsVariants.append('<option value="' + headingsVariants[i] + '">' + headingsVariants[i] + '</option>')
                }

                // Headings: Define options to be selected and update params variables
                var regularHeadingsVariant = dropdownHeadingsVariants.find( 'option[value="regular"]' );
                if( headingsVariantsParam && $.inArray( headingsVariantsParam, headingsVariants ) != -1 ) {
                    dropdownHeadingsVariants.find( 'option[value="' + headingsVariantsParam + '"]' ).prop( 'selected', true );
                    currentFontHeadingsVariants = headingsVariantsParam;
                } else if( prevHeadingsVariant && $.inArray( prevHeadingsVariant, currentFontHeadingsAllVariants ) != -1 ) { // Get latest font variant selected
                    dropdownHeadingsVariants.find( 'option[value="' + prevHeadingsVariant + '"]' ).prop( 'selected', true );
                    currentFontHeadingsVariants = prevHeadingsVariant;
                } else if( regularHeadingsVariant.length ) { // Get regular variant
                    dropdownHeadingsVariants.find( 'option[value="regular"]' ).prop( 'selected', true );
                    currentFontHeadingsVariants = 'regular';
                } else {
                    dropdownHeadingsVariants.find( 'option:first-of-type' ).prop( 'selected', true );
                    currentFontHeadingsVariants = dropdownHeadingsVariants.find( 'option:first-of-type' ).val();
                }
            }

            if( currentFontBody ) {
                // Store latest font variant selected
                var prevBodyVariant = dropdownBodyVariants.find( ':selected' ).val();

                // Clean previous options
                dropdownBodyVariants.find( 'option' ).remove();

                var bodyVariants = _parseVariants( currentFontBody, dropdownBody );

                // Populate body variants selects
                for (var i = 0, l = bodyVariants.length; i < l; i++) {
                    dropdownBodyVariants.append('<option value="' + bodyVariants[i] + '">' + bodyVariants[i] + '</option>')
                }

                // Remove unwanted body variant
                var unwantedBodyVariants = [
                    '100italic',
                    '200italic',
                    '300italic',
                    'italic',
                    '500italic',
                    '600italic',
                    '700italic',
                    '800italic',
                    '900italic',
                    '700',
                    '800',
                    '900'
                ];
                for(var i = 0, l = unwantedBodyVariants.length; i < l; i++) {
                    dropdownBodyVariants.find( 'option[value=' + unwantedBodyVariants[i] + ']' ).remove();
                }

                // Body: Define options to be selected and update params variables
                var regularBodyVariant = dropdownBodyVariants.find( 'option[value="regular"]' );
                if( bodyVariantsParam && $.inArray( bodyVariantsParam, bodyVariants ) != -1 ) {
                    dropdownBodyVariants.find( 'option[value="' + bodyVariantsParam + '"]' ).prop( 'selected', true );
                    currentFontBodyVariants = bodyVariantsParam;
                } else if( prevBodyVariant && $.inArray( prevBodyVariant, currentFontBodyAllVariants ) != -1 ) { // Get latest font variant selected
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
        }

        function _updateFonts() {

            if( currentFontHeadings == null && currentFontBody == null ) {
                return; // Stop executing code below
            }

            // Init array
            families = [];

            // Get all variants of a font
            if( currentFontHeadings ) {
                currentFontHeadingsAllVariants = _parseVariants( currentFontHeadings, dropdownHeadings );
                var headingsArray = currentFontHeadings + ':' + currentFontHeadingsAllVariants;
                families.push( headingsArray );
            }
            if( currentFontBody ) {
                currentFontBodyAllVariants = _parseVariants( currentFontBody, dropdownBody );
                var bodyArray = currentFontBody + ':' + currentFontBodyAllVariants;
                families.push( bodyArray );
            }

            // Remove duplicate items in array
            var uniqueFamilies = [];
            $.each( families, function(i, el) {
                $.inArray(el, uniqueFamilies) && uniqueFamilies.push(el);
            });

            // Convert headings variants to font-weight and font style
            var currentFontHeadingsWeight, currentFontHeadingsStyle;
            if ( currentFontHeadingsVariants ) {
                if( currentFontHeadingsVariants.indexOf( 'italic' ) !== -1 ) {
                    currentFontHeadingsWeight = currentFontHeadingsVariants.length > 6 ? currentFontHeadingsVariants.replace( 'italic', '' ) : 'normal';
                    currentFontHeadingsStyle = 'italic';
                } else if( currentFontHeadingsVariants.indexOf( 'regular' ) !== -1 ) {
                    currentFontHeadingsWeight = 'normal';
                    currentFontHeadingsStyle = 'normal';
                } else {
                    currentFontHeadingsWeight = currentFontHeadingsVariants;
                    currentFontHeadingsStyle = 'normal';
                }
            }

            // Convert body variants to font-weight and font style
            var currentFontBodyWeight;
            if( currentFontBodyVariants ) {
                if( currentFontBodyVariants.indexOf( 'regular' ) !== -1 ) {
                    currentFontBodyWeight = 'normal';
                } else {
                    currentFontBodyWeight = currentFontBodyVariants;
                }
            }

            // Load fonts
            WebFont.load({
                google: {
                    families: uniqueFamilies
                },
                active: function() {
                    var headingsStyle = '',
                        bodyStyle = '';
                    if( currentFontHeadings ) {
                        headingsStyle = headingsTarget + ' { ';
                        headingsStyle += 'font-family:' + currentFontHeadings + ';';
                        headingsStyle += 'font-weight:' + currentFontHeadingsWeight + ';';
                        headingsStyle += 'font-style:' + currentFontHeadingsStyle + ';';
                        headingsStyle += ' } ';
                    }
                    if( currentFontBody ) {
                        bodyStyle = bodyTarget + ' { ';
                        bodyStyle += 'font-family:' + currentFontBody + ';';
                        bodyStyle += 'font-weight:' + currentFontBodyWeight + ';';
                        bodyStyle += ' } ';
                    }
                    styleBucket.html('').append( headingsStyle + bodyStyle );
                }
            });

            _updateParams();
        }

        function _updateSizes() {
            var headingsSize = '',
                bodySize = '';

            bodySize = bodyTarget + ' { ';
            bodySize += 'font-size:' + currentBodySizeS + 'px;';
            bodySize += ' } ';
            bodySize += '@media (min-width: 768px) { ';
            bodySize += bodyTarget + ' { ';
            bodySize +=  'font-size:' + currentBodySizeM + 'px;';
            bodySize += ' } ';
            bodySize += ' } ';
            sizeBucket.html('').append( bodySize );

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
                    _updateFonts();
                    _updateSizes();
                });

            });

        }

        function _bindEvents() {
            dropdownHeadings.on(' change', function() {
                currentFontHeadings = $(this).val().toString();
                _displayVariants();
                _syncSelects();
                _updateFonts();
            });
            dropdownHeadingsVariants.on(' change', function() {
                currentFontHeadingsVariants = $(this).val().toString();
                _updateFonts();
            });
            dropdownBody.on( 'change', function() {
                currentFontBody = $(this).val().toString();
                _displayVariants();
                _syncSelects();
                _updateFonts();
            });
            dropdownBodyVariants.on( 'change', function() {
                currentFontBodyVariants = $(this).val().toString();
                _updateFonts();
            });
            fontSizeControllers.on( 'change', function() {
                currentBodySizeS = $( '#body-font-size-s' ).val().toString();
                currentBodySizeM = $( '#body-font-size-m' ).val().toString();
                _updateSizes();
            });
        }

        function _keyboardNavigation() {
            dropdownHeadings.keydown( function(e) {
                switch( e.which ) {
                    case 38: // up
                    $(this).find( ':selected' ).prev().prop( 'selected', true );
                    break;

                    case 40: // down
                    $(this).find( ':selected' ).next().prop( 'selected', true );
                    break;

                    default: return; // exit this handler for other keys
                }
                currentFontHeadings = $(this).val().toString();
                _displayVariants();
                _syncSelects();
                _updateFonts();
                e.preventDefault();
            });
            dropdownHeadingsVariants.keydown( function(e) {
                switch( e.which ) {
                    case 38: // up
                    $(this).find( ':selected' ).prev().prop( 'selected', true );
                    break;

                    case 40: // down
                    $(this).find( ':selected' ).next().prop( 'selected', true );
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
                    $(this).find( ':selected' ).next().prop( 'selected', true );
                    break;

                    default: return; // exit this handler for other keys
                }
                currentFontBody = $(this).val().toString();
                _displayVariants();
                _syncSelects();
                _updateFonts();
                e.preventDefault();
            });
            dropdownBodyVariants.keydown( function(e) {
                switch( e.which ) {
                    case 38: // up
                    $(this).find( ':selected' ).prev().prop( 'selected', true );
                    break;

                    case 40: // down
                    $(this).find( ':selected' ).next().prop( 'selected', true );
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
    window.typographycontroller.LoadFonts.init();
};