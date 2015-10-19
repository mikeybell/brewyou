// BREW YOU! -- How many brews can you choose
var brewYou = {};

brewYou.apiKey = 'MDozYmM4ZTc3OC03MjBiLTExZTUtYmYwNS0wYmIxZjdiMmMxMDI6UGlBZVVneEJBRWRwRUJhNmFQRzlGejg2RWtJT1lmYnphSDlP';

// FORM
brewYou.formSubmit = function() {
	$('.submit-form').on('submit', function(e) {
		e.preventDefault(); // Prevent reload
		brewYou.cash = $('.cash').val(); // get cash value
		brewYou.cheapness = Number($('input[name=radio]:checked', '.submit-form').val()); // convert radio button value to numer + save to variable

		// Call AJAX
		var page = 1;
		if (brewYou.cheapness == 400){
			page = 15;
		}
		if (brewYou.cheapness == 300){
			page = 5;
		}
		if (brewYou.cheapness == 200){
			page = 2;
		}
		if (brewYou.cheapness == 100){
			page = 1;
		}

		brewYou.getBeer(page); // show page depending on user input

		// Animations
		$('section.beer').fadeIn();

		$('html, body').animate({
			scrollTop: $("#beer").offset().top
		}, 1000);

		$('a.to-top').on('click', function(e) {
		e.preventDefault();

		$('html, body').animate({
			scrollTop: $("#top").offset().top
		}, 1000);

		});

	});
};



// GET BEER
brewYou.getBeer = function(page) {
	$.ajax({
		url: 'http://lcboapi.com/products',
		method: 'GET',
		dataType: 'jsonp',
		data: {
			accessKey: brewYou.apiKey,
			per_page: 20,
			page: page,
			order: 'price_in_cents.asc',
			q: 'beer'
		}
	}).then(function(res) {
		var beerList = brewYou.parseBeer(res.result); // save math into beerList
		brewYou.displayBeer(beerList); // run function to add HTML to page
	});
};


// Calculate math based on user input
brewYou.parseBeer = function(beerList) {
	var parsedBeer = [];

	$.each(beerList, function(i, value) {

		var beerObject = {};

		beerObject.name = value.name ;
		beerObject.price = (value.price_in_cents / 100).toFixed(2);
		beerObject.total = Math.floor(brewYou.cash * 100 / value.price_in_cents);
		beerObject.image = value.image_thumb_url;

		if(value.alcohol_content > 0 && value.image_thumb_url && value.volume_in_milliliters < 550) {
			// parsedBeer.push(value);
			parsedBeer.push(beerObject); // add beerObject to the parsedBeer array
		}
	});
	return parsedBeer;
};

// DISPLAY BEER
// 'beerList' is the same as res.result
brewYou.displayBeer = function(beerList) {
	$('#beerwork').html(''); // reset html on another input

	$.each(beerList, function(i, value) {		
		var name = $('<h3>').addClass("name").text(value.name);
		var total = $('<h3>').addClass("total").text(value.total + " beers ");
		var price = $('<h3>').addClass("price").text("@ " + "$" + value.price + " each");
		var image = $('<img>').attr('src', value.image);

		var beerBox = $('<div>').addClass("beer-box").append(image, name, total, price);
		$('#beerwork').append(beerBox);
	});
};
	


brewYou.init = function() {
	brewYou.formSubmit();
};


$(document).ready(function(){
  brewYou.init();
});