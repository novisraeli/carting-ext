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

var loading = false;
var all_products_html = '';
var cart_products = Array();
async function getProductByid(product_id) {

  const url = `http://localhost:8080/product/serial?chain_id=2&product_id=` + product_id;
  const options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    console.log("API get_by_id returned for product ", product_id, " data: ", JSON.stringify(data))
    return data;
  } catch (error) {
    // Handle any errors that occur during the request
    console.error('Error API:', error);
    console.log('Error occurred while fetching data. Please check the console for more details.');
  }
}
async function getProductsByName(product_name) {

  const url = `http://localhost:8080/product/name?chain_id=2&name=` + product_name;
  const options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    // Handle the results (e.g., alert the data)
    console.log("API get_by_name returned for product ", product_name, " data: ", JSON.stringify(data))
    return data;
  } catch (error) {
    // Handle any errors that occur during the request
    console.error('Error API:', error);
    console.log('Error occurred while fetching data. Please check the console for more details.');
  }
}


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

class CartProduct extends Product {
  constructor(id, name, total_price, amount, element, index) {
    console.log("Update Cart product ", name)
    super(id, name, total_price/amount);
    this.element = element;
    this.amount = amount;
    this.total_price = total_price;
    this.replacements = Array(new ReplacmentProduct(-1,'-',-1,-1,this),new ReplacmentProduct(-1,'-',-1,-1,this),new ReplacmentProduct(-1,'-',-1,-1,this));
    this.chosen = null;
    this.index = index;
  }


  async load_replacements() {
    return new Promise(resolve => {
      Promise.all([this, getProductByid(this.id), getProductsByName(this.name)])
      .then(([prod, result_by_id, results_by_name]) => {
          console.log("Detected for ", prod.name, " items: ", results_by_name);
          var repl_by_id = new ReplacmentProduct(result_by_id["item_code"], result_by_id["product_name"], result_by_id["item_price"], prod.amount, prod);

          let replacements = [];
          results_by_name.forEach((d) => {
            replacements.push(new ReplacmentProduct(d["item_code"], d["item_name"], d["item_price"], prod.amount, prod));
          });


			if(result_by_id["item_code"]) {
			  // Check if an object with the same id exists in the array
			  const hasObjectWithSameId = replacements.some(obj => obj.id === repl_by_id.id);

			  // If an object with the same id does not exist, add the new object
			  if (!hasObjectWithSameId) {
				replacements.unshift(repl_by_id);
			  }
			}


          console.log("Detection for ", prod.name , " Replacements = ", replacements);
          prod.replacements = replacements.slice(0,3);

          updateReplacementsDOMOfProduct(prod);
          changeProductReplacementChosen(prod.index, 1, false);
          resolve();
        }).catch(error => {
         // Handle any errors that occurred during the promises
          console.error('Error:', error);
        });
    });
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
    console.log('product: ', prod.name, ' | Replacements: ' , prod.replacements);
       
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

function areObjectsEqual(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if the number of keys is the same
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Check if the keys are the same
  if (!keys1.every(key => keys2.includes(key))) {
    return false;
  }

  // Check if the values for each key are the same
  for (const key of keys1) {
    const value1 = obj1[key];
    const value2 = obj2[key];

    // If the value is an object, recursively check its properties
    if (typeof value1 === 'object' && typeof value2 === 'object') {
      if (!areObjectsEqual(value1, value2)) {
        return false;
      }
    } else if (value1 !== value2) {
      return false;
    }
  }

  return true;
}


function get_raw_products(element) {
  raw_prods = $('.miglog-cart-prod-wrp');
  prods = {};
  for(var i=0; i<raw_prods.length;i++) {
    id = $(raw_prods[i]).find('input[name="productCodePost"]')[0].value.substring(2),
    amount = getProdAmountDOM($(raw_prods[i]));
    prods[id] = amount;
  }
  return prods;
}

var raw_prods_prev = {};
async function addProductsCart() {

  var all_products_new_html = $('.miglog-prod-group')[0].innerHTML;
  var raw_prods_current = get_raw_products(all_products_new_html);
  
  if (!areObjectsEqual(raw_prods_prev, raw_prods_current))
  {
    console.log("Cart Change Detected ", raw_prods_prev, raw_prods_current);
    raw_prods_prev = raw_prods_current;

    console.log("change in cart detected")
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

    for (const key in cart_products) {
      await cart_products[key].load_replacements();
    }
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

function changeProductReplacementChosen(prod_index, replacement_index, do_toggle=true) {
  //console.log("product: ", prod_index, " ", cart_products[prod_index]);
  cart_products[prod_index].chosen = cart_products[prod_index].replacements[replacement_index];
  setChosenDOM(prod_index, do_toggle);
  updateTotalPrice();
  generateTable(cart_products);

}

function setChosenDOM(prod_index, do_toggle) {
  var p = cart_products[prod_index];
  if (do_toggle) {
    $('#product-' + prod_index + ' .carting-product-suggestion-wrapper').toggle(300);
    $('#product-' + prod_index + ' .help').toggleClass('selected-help')
  }
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
  total_change = pSub2f(sum_chosen, sum_products);
  $('#total-price').text(sum_chosen);
  $('#total-price-change').text(total_change);
}

function submitClick(e) {

  alert("Buy detected!");

}

function addHelpModal() {
  im = chrome.runtime.getURL("help.jpg");
  var help_modal = '<div class="modal fade bd-example-modal-lg" id="help-modal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">';
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
  help_button += '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#help-modal">Carting Help</button>';
  help_button += '</div>';


  
  $('body').before(help_button);
  $('body').before(help_modal);
}

function moveToRamiLevi() {
	console.log("MoveToRamiLevi pressed");
	const chosenArray = cart_products.map(obj => obj.chosen);
	console.log("rami levi cart to be:" , chosenArray);
	//temp
	chrome.storage.local.clear(function() {
	  if (chrome.runtime.lastError) {
		console.error(chrome.runtime.lastError);
		return;
	  }
	  console.log("Local storage cleared successfully.");
	});
	for(var i=0; i<chosenArray.length;i++){
		console.log(chosenArray[i].id)
		chrome.storage.local.set({ ['storedName_' + i]: chosenArray[i].id });
	}
	
	
	window.open("https://www.rami-levy.co.il");
}


function addCompareModal() {
  
  final_str = " חיסכון!"
  var my_cart_div = '<div class="total-cart">';
  my_cart_div += "משווה מול ";
  my_cart_div += '<img src="'+ im +'" width="40" />\n';

  submit_button = $('.wrapper-btnSubmit').first();
  if (submit_button)
  {
      submit_button = submit_button[0];
      submit_button.classList.add('buy-btn-finish');
      // Select all child elements with class "title-btn"
      const childElementsWithTitleClass = submit_button.querySelectorAll('.title-btn');

      // Loop through the selected child elements and remove each one
      childElementsWithTitleClass.forEach((childElement) => {
        childElement.remove();
      });
      
      console.log("submit button = ", submit_button);
  }

  var m = '<div id="compare-modal" class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">';
  m += '<div class="modal-dialog modal-lg" style="width:80%">';
  m += '<div class="modal-content container mt-5 text-center">';
  m += '  <h1 class="modal-title text-center">טבלה השוואת סלים</h1>';
  m += '        <div style="margin:25px;"><table class="table table-bordered table-striped text-center cmp-table" id="cmp-table">';
  m += '            <!-- Table rows will be dynamically generated here -->';
  m += '        </table></div>';
  m += '        <div style="margin:25px;"><div class="btn btn-primary buy-btn" >קנה בשופרסל' + submit_button.outerHTML + '</div>';
   m += '        <div class="btn btn-primary buy-btn" onclick="moveToRamiLevi()" id="movebtn" style="background: #42a229;">קנה ברמי לוי</div></div>';
  m += '</div>';
  m += '</div>';
  m += '</div>';

  
  var compare_button = '<div class="compare-button">';
  compare_button += '<button type="button" id="cmp-btn" class="btn btn-primary" data-toggle="modal" data-target="#compare-modal">השווה סלים</button>';
  compare_button += '</div>';
  $('.wrapper-btnSubmit').html(compare_button);
  $('body').before(m);
    document.getElementById("movebtn").addEventListener('click',function() {moveToRamiLevi();});

}

// Function to generate the HTML table
function generateTable(cartProducts) {
  rami_logo = chrome.runtime.getURL("rami_logo.png");
  shufersal_logo = chrome.runtime.getURL("shufersal_logo.png");

  const tableBody = document.getElementById('cmp-table');

  // Clear any existing rows from the table
  tableBody.innerHTML = '';

  // add logos tr

  const rowhead = document.createElement('tr');

  var cartCell = document.createElement('td');
  cartCell.innerHTML = '<img src="' + shufersal_logo +'"  height ="50"/>';
  rowhead.appendChild(cartCell);

  var chosenCell = document.createElement('td');
  chosenCell.innerHTML = '<img src="' + rami_logo +'"  height ="50"/>';
  rowhead.appendChild(chosenCell);

  tableBody.appendChild(rowhead);
  // Create rows for each CartProduct
  for (const cartProduct of cartProducts) {
    const row = document.createElement('tr');

    // Create cells for Cart Product
    const cartCell = document.createElement('td');
    cartCell.textContent = cartProduct.name + ' ' + cartProduct.price.toFixed(2) + '\r\rש"ח';
    row.appendChild(cartCell);

    // Create cells for Chosen Product
    const chosenCell = document.createElement('td');
    if (cartProduct.chosen) {
      chosenCell.textContent = cartProduct.chosen.name + ' ' + cartProduct.chosen.price.toFixed(2) + '\r\rש"ח';
    } else {
      chosenCell.textContent = 'None';
    }
    row.appendChild(chosenCell);

    tableBody.appendChild(row);
  }
  const row = document.createElement('tr');
  const totalPriceProducts = cartProducts.reduce((sum, cartProduct) => sum + cartProduct.price, 0);
  const totalPriceChosen = cartProducts.reduce((sum, cartProduct) => sum + cartProduct.chosen.price, 0);
  cartCell = document.createElement('td');
  cartCell.innerHTML = '<b>' +totalPriceProducts.toFixed(2) + 'ש"ח</b>';
  row.appendChild(cartCell);

  chosenCell = document.createElement('td');
  chosenCell.innerHTML = '<b>' +totalPriceChosen.toFixed(2) + 'ש"ח</b>';
  row.appendChild(chosenCell);
  tableBody.appendChild(row);
}

$(document).ready(function() {

  console.log("Number of products", cart_products.length);
  console.log("Products", cart_products);

  $('.btnSubmit').bind('click', submitClick);
  addProductsCart();
  addCompareModal();
  addHelpModal();
  

});