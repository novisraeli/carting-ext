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

var all_products_html = '';
var cart_products = Array();


function pMul2f(x, y) {
  return Math.ceil(Math.ceil(x*100) * Math.ceil(y*100)) / 10000;
}
function pAdd2f(x, y) {
  return Math.ceil(Math.ceil(x*100) + Math.ceil(y*100)) / 100;
}
function pSub2f(x, y) {
  return Math.ceil(Math.ceil(x*100) - Math.ceil(y*100)) / 100;
}

class Product {
  constructor(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

class CartProduct extends Product{
  constructor(id, name, total_price, amount, element, index) {
    super(id, name, total_price/amount);
    this.element = element;
    this.amount = amount;
    this.total_price = total_price;
    this.replacements = Array(new ReplacmentProduct(-1,'-',-1,-1,this),new ReplacmentProduct(-1,'-',-1,-1,this),new ReplacmentProduct(-1,'-',-1,-1,this));
    this.chosen = null;
    this.index = index;
    this.load_replacements();
  }

  load_replacements() {
    let jsonData;
    var t = this;
    var promise_by_id = this.get_replacment_by_id();
    //var promise_by_id = new ReplacmentProduct(0, this.name, 10, this.amount, this);
    //var promise_by_name = this.get_replacments_by_name();
    promise_by_id.then((result) => {
      console.log("promise_by_id res", result);
      promise_by_id.then((result) => {
        console.log("promise_by_name res", result);
        let replacements = Array(new ReplacmentProduct(0, t.name, result["item_price"], t.amount, t), new ReplacmentProduct(0, t.name, 10, t.amount, t), new ReplacmentProduct(0, t.name, 10, t.amount, t), new ReplacmentProduct(0, t.name, 10, t.amount, t));
        //let replacements = Object.entries(dictionary).map(([name, price]) => {
        //  return new Product(name, price);
        //});
        t.replacements = replacements.slice(0,3);
        updateReplacementsDOMOfProduct(t);
      }).catch((error) => {
        // Promise rejected
        console.error(error);
      });
    }).catch((error) => {
      // Promise rejected
      console.error(error);
    });

    //var replcements = Array(repl_by_id, repl_by_id, repl_by_id)

    console.log("product ", this.name, " - replacements", this.replacements);//.map(obj => obj.name)
  }


  get_replacment_by_id() {
    var t = this;
    return fetch('http://localhost:8080/product/serial?chain_id=2&product_id=' + this.id, {method: 'OPTIONS',mode: 'cors',headers: {'Content-Type': 'application/json'}})
      .then(response => response.json())
      .then(data => {
        return data;
        //t.replacements.unshift(new ReplacmentProduct(0, t.name, data["item_price"], t.amount, t));
        //console.log("IMgoing to updateReplacementsDOMOfProduct", t.replacements);
        //updateReplacementsDOMOfProduct(t);
      })
      .catch(error => {
        // Handle any errors that occur during the request
        console.error('Error:', error);
      });
  }

  get_replacments_by_name() {
    var t = this;
     /*fetch('http://localhost:8080/product/name?chain_id=2&name=' + this.name, {method: 'OPTIONS',mode: 'cors',headers: {'Content-Type': 'application/json'}})
      .then(response => response.json())
      .then(data => {
        return data;
        // Process the parsed JSON data
        //console.log('pr', 'get_replacments_by_name ->', data);
        //updateReplacementsDOMOfProduct(t);
      })
      .catch(error => {
        // Handle any errors that occur during the request
        console.error('Error:', error);
      });*/
    return '';
  }

  
}


class ReplacmentProduct extends Product{
  constructor(id, name, price, amount, parent_product) {
    super(id, name, price);
    this.parent = parent_product;
    this.amount = amount;
    this.total_price = pMul2f(price, amount);
  }
}

function updateReplacementsDOMOfProduct(prod) {
    console.log('prIM replacements', prod.replacements);
       
    replacements = '';
    for(var j = 0; j<prod.replacements.length;j++)
    {

      r = prod.replacements[j];
      price_color = get_price_color(r.total_price - prod.total_price);
      price_change = pSub2f(r.total_price, r.parent.total_price);
      price_change_string = price_change;
      if (price_change > 0)
        price_change_string = '+' + price_change;
      replacements += '<div class="carting-product-suggestion" id="suggestion-' + prod.index +'-' + j +'">';
      replacements += '<div><span class="replcement-name">' + r.name + '</span></div>';
      replacements += '<div><span class="price-change" style="color:' + price_color + '">' + price_change_string + '</span>';
      replacements += '<div class="price-comparator" style="background-color:' + price_color + '">' + r.total_price + '₪</div></div>';
      replacements += '</div>';
      }
    console.log('prIMUpdate replacements calculated');
    console.log('prIMUpdateXXX', prod.element);
    console.log('prIMUpdateYYY', prod.element.querySelector('.suggestion-container-wrapper'));
    prod.element.querySelector('.suggestion-container-wrapper').innerHTML = replacements;
    for(var j = 0; j < prod.replacements.length; j++)
    {
      addListnerWrapper(prod.index,j);
    }

  }

function addProductsToDOM() {
  any_change = false;
  for(var i=0; i < cart_products.length;i++)
  {
    if(!haveProductCT($(cart_products[i].element)))
    {
      prod = cart_products[i];
      replacements = '';
      for(var j = 0; j<prod.replacements.length;j++)
      {

        r = prod.replacements[j];
        price_color = get_price_color(r.total_price - prod.total_price);
        price_change = pSub2f(r.total_price, r.parent.total_price);

        price_change_string = price_change;
        if (price_change > 0)
          price_change_string = '+' + price_change;
        replacements += '<div class="carting-product-suggestion" id="suggestion-' + i +'-' + j +'">';
        replacements += '<div><span class="replcement-name">' + r.name + '</span></div>';
        replacements += '<div><span class="price-change" style="color:' + price_color + '">' + price_change_string + '</span>';
        replacements += '<div class="price-comparator" style="background-color:' + price_color + '">' + r.total_price + '₪</div></div>';
        replacements += '</div>';
      }
      chosen = prod.chosen;

      price_change = pSub2f(chosen.total_price, prod.total_price);

      var s = '<div class="product-ct" id="product-' + i + '">';
      s += '<div class="carting-product-wrapper" id="product-' + i + '">';
      s += '<div class="carting-product" id="prod-' + i + '">';
      s += '<div><i class="fa fa-refresh help" class="" data-id="' + i + '"></i> <span class="replcement-name" id="prod-name">' + chosen.name + '</span></div>';
      s += '<div><span class="price-change" id="prod-price-change">' + price_change + '</span><div class="price-comparator" id="prod-price">' + chosen.total_price +'₪</div></div>';
      s += '</div></div>';
      s += '<div class="carting-product-suggestion-wrapper">';
      s += '<div class="suggestion-container-wrapper" id="suggestion-contatiner-' + i + '">' + replacements + '</div>';
      s += '</div>';
      s += '</div>';

      $(cart_products[i].element).append(s);

      // add listeners to replacments
      for(var j = 0; j < cart_products[i].replacements.length; j++)
      {
        addListnerWrapper(i,j);
      }

      any_change = true;
    }
  }
  if (!isTotalCartExists())
  {
    drawTotalCart();
    updateTotalPrice();
  }
  //add listeners if any changes in DOM
  if(any_change) {
    $('.help').click(function() {
      $(this).toggleClass('selected-help');
      var pid = $(this).attr('data-id');
      console.log("toggle suggestion of product id ", pid);
      $('#product-' + pid + ' .carting-product-suggestion-wrapper').toggle(300);
    });
  }
}
function isTotalCartExists() {
  if($('.total-cart').length)
    return true;
  else
    return false;
}
function haveProductCT(elem) {
  if(elem.find('.product-ct').length)
    return true;
  else
    return false;
}
function getProdAmountDOM(elem) {
  return parseInt(elem.find('[name="qty"]')[0].value);
}

function getProdPriceDOM(elem) {
  str = elem.find('.miglog-prod-totalPrize').text().trim();
  p = str.match("[0-9\.]+");
  return parseFloat(p[0]);
}

function addProductsCart() {
  //console.log('pr tick');
  all_products_new_html =$('.miglog-prod-group')[0].innerHTML;
  if (all_products_html != all_products_new_html)
  {
    cart_products = Array();
    raw_prods = $('.miglog-cart-prod-wrp');
    for(var i=0; i<raw_prods.length;i++) {
      //console.log("Creating Product", $(raw_prods[i]).find('a')[1].title)
      price = getProdPriceDOM($(raw_prods[i]));
      amount = getProdAmountDOM($(raw_prods[i]));

      cart_products[i] = new CartProduct(
        $(raw_prods[i]).find('input[name="productCodePost"]')[0].value.substring(2),
         $(raw_prods[i]).find('a')[1].title,
          price,
          amount,
          raw_prods[i],
          i);

      cart_products[i].chosen = cart_products[i].replacements[0];
    }
    addProductsToDOM();
    all_products_html = all_products_new_html;
  }
  setTimeout(addProductsCart, 1000);

}

function get_price_color(price_change) {
    if (price_change > 0)
      price_color = "#d12d21";
    else if(price_change < 0)
      price_color = "#15ed4f";
    else
      price_color = "#aaa";

    return price_color;
}

function changeProductReplacementChosen(prod_index, replacement_index) {
  console.log("product: ", prod_index, " ", cart_products[prod_index]);
  cart_products[prod_index].chosen = cart_products[prod_index].replacements[replacement_index];
  setChosenDOM(prod_index);
  updateTotalPrice();

}

function setChosenDOM(prod_index) {
  var p = cart_products[prod_index];
  $('#product-' + prod_index + ' .carting-product-suggestion-wrapper').toggle(300);
  $('#product-' + prod_index + ' .help').toggleClass('selected-help')
  var e = document.getElementById("product-" + prod_index);
  chosen = p.chosen;
  price_change = pSub2f(chosen.total_price, p.total_price);

  var price_color = get_price_color(price_change);
  price_change_string = price_change;
  if (price_change > 0)
    price_change_string = '+' + price_change;
  console.log("chosen replacement is: ", p.chosen);
  console.log(price_color);

  e.querySelector("#prod-name").innerHTML = chosen.name;
  e.querySelector("#prod-price").innerHTML = chosen.total_price + '₪';
  e.querySelector("#prod-price-change").innerHTML = price_change_string;
  e.querySelector(".price-comparator").style.backgroundColor = price_color;
  e.querySelector(".price-change").style.color = price_color;

}

function addListnerWrapper(x, y) {
  var r = $('#suggestion-'+x+'-'+y)[0];
  console.log("r ", r);
  r.addEventListener('click',function() {changeProductReplacementChosen(x, y);});
}

function drawTotalCart() {
  im = chrome.runtime.getURL("ramilevy.jpg");
  final_str = " חיסכון!"
  var my_cart_div = '<div class="total-cart">';
  my_cart_div += "משווה מול ";
  my_cart_div += '<img src="'+ im +'" width="40" />\n';
  my_cart_div += '<div style="display:flex;">';
  my_cart_div += '<div class="price-comparator"  id="total-price" style="background-color:' + price_color + '">' + r.total_price + '₪</div>';
  my_cart_div += '<div id="total-price-change">+4</div> ' + final_str;
  my_cart_div += "</div> </div>" 
  $('.hidden-lg-max-header .my-cart  span:first-child').after(my_cart_div);    
  updateTotalPrice();
}

function updateTotalPrice() {
  console.log("Updating total price3");
  sum_products = cart_products.reduce((acc, product) => {return acc + product.total_price; }, 0);
  sum_chosen = cart_products.reduce((acc, product) => {return acc + product.chosen.total_price;}, 0);
  console.log('prChosen', sum_chosen);
  console.log('prCart', sum_products);
  total_change = pSub2f(sum_chosen, sum_products);
  $('#total-price').text(sum_chosen);
  $('#total-price-change').text(total_change);
}

function submitClick(e) {
  e.preventDefault();
  e.stopPropagation();
  alert("Buy detected!");
  updateTotalPrice();
}

function addHelpModal() {
  im = chrome.runtime.getURL("help.jpg");
  var help_modal = '<div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">';
  help_modal += '<div class="modal-dialog modal-lg" style="width:80%">';
  help_modal += '<div class="modal-content">';
  help_modal += '<div class="help-modal-content">';
  help_modal += '<div class="help-text">מדריך למשתמש</div>';
  help_modal += '<div><img src="' + im + '"/></div>';
  help_modal += '</div>';
  help_modal += '</div>';
  help_modal += '</div>';
  help_modal += '</div>';

  var help_button = '<div class="help-button">';
  help_button += '<button type="button" class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg">Carting Help</button>';
  help_button += '</div>';


  
  $('body').before(help_button);
  $('body').before(help_modal);
}

$(document).ready(function() {

  console.log("Number of products", cart_products.length);
  console.log("Products", cart_products);

  $('.btnSubmit').bind('click', submitClick);
  addProductsCart();
  addHelpModal();

});