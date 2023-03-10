
class Product {
  constructor(name, element) {
    this.name = name;
    this.element = element;
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
raw_prods = document.getElementsByClassName("miglog-prod-body");

for(var i=0; i<raw_prods.length;i++) {
	if (raw_prods[i].getElementsByTagName('a')[0] != undefined)
	{
		console.log("Creating Product", raw_prods[i].getElementsByTagName('a')[0].title)
		products[i] = new Product(raw_prods[i].getElementsByTagName('a')[0].title, raw_prods[i]);
	}
}
	
console.log("Number of products", products.length)

for(var i=0; i<products.length;i++)
{
	var s = '<div class="carting-product-wrapper">';
	s += '<div class="carting-product-wrapper">';
	s += '<div class="price-comparator">20 ש"ח</div>';
	s += '<div class="help">?</div>';
	s += '</div>';

	products[i].element.innerHTML += s;
}