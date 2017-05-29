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

// Create Typography controller HTML
var controllerTypography = '<div class="typography-controller" style="display:none;"><select id="headings-fonts"></select><select id="body-fonts"></select></div>';
controllerWrapper.innerHTML = controllerTypography;

// Populate Typography fields
function getFonts( fonts ) {
	for ( var i = 0; i < fonts.items.length; i++ ) {
		$( '#headings-fonts, #body-fonts' ).append( $('<option></option>' ).attr( 'value', fonts.items[i].family ).text( fonts.items[i].family ) );
		//$('body').prepend( JSON.stringify( fonts.items[i] ) + '<br /><br />' );
	}
}


// Create Google script node
var webfontsScript = document.createElement( 'script' );
webfontsScript.src = 'https://www.googleapis.com/webfonts/v1/webfonts?key=' + apiKey + '&callback=getFonts';
document.body.appendChild( webfontsScript );

// Update style
$( '#headings-fonts' ).change( function() {
	var id = $( '#headings-fonts option:selected' ).val();
	$( 'h1, h2, h3, h4, h5, h6' ).css( 'font-family', id );
});
$( '#body-fonts' ).change( function() {
	var id = $( '#body-fonts option:selected' ).val();
	$( 'body' ).css( 'font-family', id );
});



 WebFontConfig = {
   google: { families: ['ABeeZee', 'Abel', 'Abril Fatface', 'Aclonica', 'Acme', 'Actor', 'Adamina', 'Advent Pro', 'Aguafina Script', 'Akronim', 'Aladin', 'Aldrich', 'Alegreya', 'Alegreya SC', 'Alex Brush', 'Alfa Slab One', 'Alice', 'Alike', 'Alike Angular', 'Allan', 'Allerta', 'Allerta Stencil', 'Allura', 'Almendra', 'Almendra Display', 'Almendra SC', 'Amarante', 'Amaranth', 'Amatic SC', 'Amethysta', 'Anaheim', 'Andada', 'Andika', 'Angkor', 'Annie Use Your Telescope', 'Anonymous Pro', 'Antic', 'Antic Didone', 'Antic Slab', 'Anton', 'Arapey', 'Arbutus', 'Arbutus Slab', 'Architects Daughter', 'Archivo Black', 'Archivo Narrow', 'Arimo', 'Arizonia', 'Armata', 'Artifika', 'Arvo', 'Asap', 'Asset', 'Astloch', 'Asul', 'Atomic Age', 'Aubrey', 'Audiowide', 'Autour One', 'Average', 'Average Sans', 'Averia Gruesa Libre', 'Averia Libre', 'Averia Sans Libre', 'Averia Serif Libre', 'Bad Script', 'Balthazar', 'Bangers', 'Basic', 'Battambang', 'Baumans', 'Bayon', 'Belgrano', 'Belleza', 'BenchNine', 'Bentham', 'Berkshire Swash', 'Bevan', 'Bigelow Rules', 'Bigshot One', 'Bilbo', 'Bilbo Swash Caps', 'Bitter', 'Black Ops One', 'Bokor', 'Bonbon', 'Boogaloo', 'Bowlby One', 'Bowlby One SC', 'Brawler', 'Bree Serif', 'Bubblegum Sans', 'Bubbler One', 'Buda', 'Buenard', 'Butcherman', 'Butterfly Kids', 'Cabin', 'Cabin Condensed', 'Cabin Sketch', 'Caesar Dressing', 'Cagliostro', 'Calligraffitti', 'Cambo', 'Candal', 'Cantarell', 'Cantata One', 'Cantora One', 'Capriola', 'Cardo', 'Carme', 'Carrois Gothic', 'Carrois Gothic SC', 'Carter One', 'Caudex','Cedarville Cursive', 'Ceviche One', 'Changa One', 'Chango', 'Chau Philomene One', 'Chela One', 'Chelsea Market', 'Chenla', 'Cherry Cream Soda', 'Cherry Swash', 'Chewy', 'Chicle', 'Chivo', 'Cinzel', 'Cinzel Decorative', 'Clicker Script', 'Coda', 'Coda Caption', 'Codystar', 'Combo', 'Comfortaa', 'Coming Soon','Concert One', 'Condiment', 'Content', 'Contrail One', 'Convergence', 'Cookie', 'Copse', 'Corben', 'Courgette', 'Cousine', 'Coustard', 'Covered By Your Grace', 'Crafty Girls', 'Creepster', 'Crete Round', 'Crimson Text', 'Croissant One', 'Crushed', 'Cuprum', 'Cutive', 'Cutive Mono']}
  };
  (function() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  })();