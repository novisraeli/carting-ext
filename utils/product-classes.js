
class Product {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }
}

class CartProduct extends Product{
  constructor(name, price, element) {
    super(name, price);
    this.element = element;
    this.replacements = Array();
    this.choosen = null;
  }
}
class ReplacmentProduct extends Product{
  constructor(name, price, parent_product) {
    super(name, price);
    this.parent = parent_product;
  }
}

export {Product, CartProduct, ReplacmentProduct};