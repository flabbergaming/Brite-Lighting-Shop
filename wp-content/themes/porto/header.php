<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<!--[if IE]><meta http-equiv='X-UA-Compatible' content='IE=edge,chrome=1'><![endif]-->
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
	<link rel="profile" href="http://gmpg.org/xfn/11" />
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />

	<?php get_template_part( 'head' ); ?>
</head>
<script>

function classRemove() {	
	
var remClass = document.getElementById('main-toggle-menu');


//show[0].classList.add('closed');
remClass.classList.remove('show-always');
 console.log (remClass);


};

function addClass(){

var show = document.getElementById('main-toggle-menu');

show.classList.add('show-always');

}

</script>
<body <?php body_class(); ?>>
<?php get_template_part( 'header/header_before' ); ?>
