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
raw_prods = $('.align-items-center.justify-content-between.el');

console.log(raw_prods.length)
for(var i=0; i<raw_prods.length;i++) {
	console.log("Creating Product", $(raw_prods[i]).find('a')[1].title)
	console.log("Creating Product1111", $(raw_prods[i]).title)
	products[i] = new Product($(raw_prods[i]).find('a')[1].title, raw_prods[i]);
}



