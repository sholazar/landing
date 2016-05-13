$(document).ready(function(){
    $('.navig').click(function () { 
	elementClick = $(this).attr("href");
	destination = $(elementClick).offset().top;
							
	$('body').animate( { scrollTop: destination }, 1000 );			
	$('html').animate( { scrollTop: destination }, 1000 );
			
	return false;
    });
});