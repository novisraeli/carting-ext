// Create a new link element
var link = document.createElement("link");

// Set the attributes of the link element
link.setAttribute("rel", "stylesheet");
link.setAttribute("type", "text/css");
link.setAttribute("href", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css");
link.setAttribute("integrity", "sha512-SzlrxWUlpfuzQ+pcUCosxcglQRNAq/DZjVsC0lE40xsADsfeQoEypE+enwcOiGjk/bSuGGKHEyjSoQ1zVisanQ==");
link.setAttribute("crossorigin", "anonymous");

// Add the link element to the head section of the page
document.head.appendChild(link);

class Product {
  constructor(name, element) {
    this.name = name;
    this.element = element;
    this.show = false;
  }

  // Method to add a product to the cart
  addToCart() {
    // Add logic here to add the product to the cart
    console.log(`Added ${this.name} to the cart`);
  }

  // Method to display the product details
  displayDetails() {
    // Add logic here to display the product details
    console.log(`Product: ${this.name}`);
  }
}


products = Array();
raw_prods = $('.miglog-cart-prod-wrp');

for(var i=0; i<raw_prods.length;i++) {
	console.log("Creating Product", $(raw_prods[i]).find('a')[1].title)
	products[i] = new Product($(raw_prods[i]).find('a')[1].title, raw_prods[i]);
}
	
console.log("Number of products", products.length)

replcements = '<div class="arrow"></div><div class="suggestion-container">'
replcements += '<div><img src="https://www.chocolateworld.co.il/wp-content/uploads/2022/12/1671620758_kinder20dedos8.png" alt="Image 1"></div>';
replcements += '<div><img src="https://www.chocolateworld.co.il/wp-content/uploads/2022/12/1671620758_kinder20dedos8.png" alt="Image 2"></div>';
replcements += '<div><img src="https://www.chocolateworld.co.il/wp-content/uploads/2022/12/1671620758_kinder20dedos8.png" alt="Image 3"></div>';
replcements += '</div>';
for(var i=0; i<products.length;i++)
{
	var s = '<div class="carting-product-wrapper" id="product-' + i + '">';
	s += '<div class="carting-product" id="prod-' + i + '">';
	s += '<div><i class="fa fa-refresh help" class="" data-id="' + i + '"></i> <span class="replcement-name">אריאל קפסולות לכביסה</span></div>';
	s += '<div><span class="price-change">-5</span><div class="price-comparator">20₪</div></div>';
	s += '</div>';
	s += '<div class="suggestion-container-wrapper" data-id="' + i + '">' + replcements + '</div>';
	s += '</div>';
	$(products[i].element).append(s);
}


$(document).ready(function() {
  $('.help').click(function() {
  	$(this).toggleClass('selected-help');

  	var pid = $(this).attr('data-id');
    $('#product-' + pid + ' .suggestion-container-wrapper').stop().toggle(300);
  });


});