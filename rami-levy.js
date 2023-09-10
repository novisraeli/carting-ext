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
var finalCart
//var ids="372101,410016"
var ids={};
var barcodes=[];
var id_from_barcodes=[];
ids["פולי סויה 600 גר רמילוי"]="320640";
var apids=""
let count=0;

function read_prods() {
  //var apids = ""; // Initialize apids variable

  // Wrap the callback function inside an async function
  chrome.storage.local.get(null, function(data){
    for (var i = 0; i < Object.keys(data).length; i++) {
      var storedName = data['storedName_' + i];
      if (storedName) {
        // Use the storedName in your logic
        console.log(i);
        console.log(storedName);
		barcodes.push(storedName)
        }
      }
    });
  
}


function makeAPICall_fill_ramilevi_storeddata() {
  const storedData = JSON.parse(localStorage.getItem('ramilevy')) || {};
  const apiUrl = "https://www.rami-levy.co.il/api/items";
  const newStorageKey = 'testKey'; // Use a different key for testing
  console.log("start",apids );
  const payload = {
	"ids": apids,
    "type": "id"
  };

  const payloadJson = JSON.stringify(payload);

  // Define headers including all the headers you need
  const headers = {
    "Accept": "application/json, text/plain, */*",
    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjIxNzE5ZDM2NzI0OGYyZDAwY2RkMThmM2U5ZmJhNGYxYTU1OTRkYjZlYjI3ODY4ZTlmZmJhNWI0YTdmNTc2Y2IwNDg3N2FiNjY1ODMwYWNjIn0.eyJhdWQiOiIzIiwianRpIjoiMjE3MTlkMzY3MjQ4ZjJkMDBjZGQxOGYzZTlmYmE0ZjFhNTU5NGRiNmV$",
    "Content-Length": payloadJson.length.toString(),
    "Content-Type": "application/json;charset=UTF-8",
    "Locale": "he",
    "Newrelic": "eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjI3NzI1OTUiLCJhcCI6IjkxNDEyOTI1OSIsImlkIjoiY2Q3Y2Q2YWYxY2I2ZTM4NyIsInRyIjoiZDgyNTgxOWM2ZTM3OGE5ZjIzNGVkZWY1OWExMzVhOTAiLCJ0aSI6MTY5MTg2MDczMDU2NH19",
    "Referer": "https://www.rami-levy.co.il/he?item=7290001201589",
    "Traceparent": "00-7eb3df02b8415ae5e027a134e1a22e50-a4d35f3863b7785d-01",
    "Tracestate": "2772595@nr=0-1-2772595-914129259-a4d35f3863b7785d----1691861887730"
    // Add any other headers if needed
  };

  // Make the API call using fetch
  fetch(apiUrl, {
    method: "POST",
    headers: headers,
    body: payloadJson,
  })
  .then(response => response.json())
  .then(data => {
    console.log("API response123:", data);
	var arr=[]
	for(var i =0; i<data.data.length;i++){
		arr.push(data.data[i]);
	}
    //const firstApiEntry = data.data[0];
   // const firstApiEntry2 = data.data[1];
	
    if (arr[0]) {
      //console.log("First API entry:", firstApiEntry);

      const cartArray = storedData.cart?.items || [];
      console.log("Current cartArray before update:", storedData.cart);
      console.log("Current cartArray before update:", cartArray);
	  console.log("len", arr.length);
	  for(var i=0;i<arr.length;i++){
		console.log(i, arr[i]);
	    cartArray[i] = arr[i];
		console.log("xxx", JSON.parse(localStorage.getItem('ramilevy')));
        storedData.cart.items = cartArray;
        storedData.cart.items[i].price.finalPrice = storedData.cart.items[i].price.price;
        storedData.cart.items[i].price.saleOldPrice = 0;
        storedData.cart.items[i].price.saved = 0;
        storedData.cart.items[i].name ="לוי";
        storedData.cart.items[i].images.transparent =storedData.cart.items[i].images.trim ;
		//storedData.cart.items[0].Net_Content.display=0;
		storedData.cart.items[i].src={};
        storedData.cart.items[i].src.small ="https://img.rami-levy.co.il"+storedData.cart.items[i].images.small ;
        storedData.cart.items[i].src.original ="https://img.rami-levy.co.il"+storedData.cart.items[i].images.original ;
        storedData.cart.items[i].src.trim ="https://img.rami-levy.co.il" + storedData.cart.items[i].images.trim ;
        storedData.cart.items[i].src.transparent ="https://img.rami-levy.co.il"+ storedData.cart.items[i].images.transparent ;
		storedData.cart.items[i].url={};
		storedData.cart.items[i].url.small = storedData.cart.items[i].src.small;
        storedData.cart.items[i].url.original = storedData.cart.items[i].src.original;
        storedData.cart.items[i].url.trim =storedData.cart.items[i].src.trim;
        storedData.cart.items[i].url.transparent=storedData.cart.items[i].src.transparent;
        
        storedData.cart.items[i].amount=1;
		storedData.cart.items[i].checkAvailable=false;
		storedData.cart.items[i].isAvailable=true;
	  }
      
		
		localStorage.setItem(newStorageKey, JSON.stringify("xxxxxx"));
		console.log("yyy", storedData);
        console.log("Local storage updated with new key:", storedData);
        
		setTimeout(setData,200, storedData);
        console.log("Local storage updated:", storedData);
		
      }
    
  })
  .catch(error => {
    console.error("API error:", error);
  });
}
function setData(s) {
	console.log("setting items", s);
	localStorage.setItem('ramilevy', JSON.stringify(s));
	chrome.storage.local.clear(function() {
	  if (chrome.runtime.lastError) {
		console.error(chrome.runtime.lastError);
		return;
	  }
	  console.log("Local storage cleared successfully.");
	});
	location.reload();
	
}
function makeAPICall2() {
  // Define your API endpoint URL
  const apiUrl = "https://www.rami-levy.co.il/api/v2/cart";
  // Define the payload for your API call

  const payload = {
    store: 331,
    isClub: 0,
    supplyAt: "2023-08-12T16:41:58.120Z",
    items: {
      320640: "1.00"
    },
    meta: null
  };
  // Convert the payload to a JSON string
  const payloadJson = JSON.stringify(payload);

  // Define headers including all the headers you need
  const headers = {
    "Accept": "application/json, text/plain, */*",
    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjIxNzE5ZDM2NzI0OGYyZDAwY2RkMThmM2U5ZmJhNGYxYTU1OTRkYjZlYjI3ODY4ZTlmZmJhNWI0YTdmNTc2Y2IwNDg3N2FiNjY1ODMwYWNjIn0.eyJhdWQiOiIzIiwianRpIjoiMjE3MTlkMzY3MjQ4ZjJkMDBjZGQxOGYzZTlmYmE0ZjFhNTU5NGRiNmV$",
    "Content-Length": payloadJson.length.toString(),
    "Content-Type": "application/json;charset=UTF-8",
    "Locale": "he",
    "Newrelic": "eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjI3NzI1OTUiLCJhcCI6IjkxNDEyOTI1OSIsImlkIjoiY2Q3Y2Q2YWYxY2I2ZTM4NyIsInRyIjoiZDgyNTgxOWM2ZTM3OGE5ZjIzNGVkZWY1OWExMzVhOTAiLCJ0aSI6MTY5MTg2MDczMDU2NH19",
    "Referer": "https://www.rami-levy.co.il/he?item=7290001201589",
    "Traceparent": "00-7eb3df02b8415ae5e027a134e1a22e50-a4d35f3863b7785d-01",
    "Tracestate": "2772595@nr=0-1-2772595-914129259-a4d35f3863b7785d----1691861887730"
    // Add any other headers if needed
  };

  // Make the API call using fetch
  fetch(apiUrl, {
    method: "POST",
    headers: headers,
    body: payloadJson,
  })
  .then(response => response.json())
  .then(data => {
    console.log("final cart:", data);
	//inalCart= data.items[1]
    // You can perform any additional actions with the API response here
  })
  .catch(error => {
    console.error("API error:", error);
  });
}


// Trigger the API call when the content script is injected
function clear(){
	
	localStorage.clear();
}
function makeAPICall3(id) {
  // Define your API endpoint URL
  const apiUrl = 'https://www.rami-levy.co.il/api/catalog';
  // Define the payload for your API call
  console.log("count", count);
  var temp = barcodes[count];
  count++;
  console.log("test", temp);
  console.log("count", count);

  const payload = { "q": temp, "aggs": 1, "store": "331" };
  var res = "";
  // Convert the payload to a JSON string
  const payloadJson = JSON.stringify(payload);

  // Define headers including all the headers you need
  const headers = {
    "Accept": "application/json, text/plain, */*",
    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjIxNzE5ZDM2NzI0OGYyZDAwY2RkMThmM2U5ZmJhNGYxYTU1OTRkYjZlYjI3ODY4ZTlmZmJhNWI0YTdmNTc2Y2IwNDg3N2FiNjY1ODMwYWNjIn0.eyJhdWQiOiIzIiwianRpIjoiMjE3MTlkMzY3MjQ4ZjJkMDBjZGQxOGYzZTlmYmE0ZjFhNTU5NGRiNmV$",
    "Content-Length": payloadJson.length.toString(),
    "Content-Type": "application/json;charset=UTF-8",
    "Locale": "he",
    "Newrelic": "eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjI3NzI1OTUiLCJhcCI6IjkxNDEyOTI1OSIsImlkIjoiY2Q3Y2Q2YWYxY2I2ZTM4NyIsInRyIjoiZDgyNTgxOWM2ZTM3OGE5ZjIzNGVkZWY1OWExMzVhOTAiLCJ0aSI6MTY5MTg2MDczMDU2NH19",
    "Referer": "https://www.rami-levy.co.il/he?item=7290001201589",
    "Traceparent": "00-7eb3df02b8415ae5e027a134e1a22e50-a4d35f3863b7785d-01",
    "Tracestate": "2772595@nr=0-1-2772595-914129259-a4d35f3863b7785d----1691861887730"
    // Add any other headers if needed
  };
  console.log("before api", payloadJson);

  // Return a Promise that represents the completion of the API call
  return new Promise((resolve, reject) => {
    fetch(apiUrl, {
      method: "POST",
      headers: headers,
      body: payloadJson,
    })
    .then(response => response.json())
    .then(data => {
      console.log("id????????????", data.data[0].id);
      if (!data.data.length) {
        console.log("problem finding id for product");
        reject("Problem finding ID for product");
      } else {
        res = data.data[0].id;
        id_from_barcodes.push(res);
        apids = apids + res + ",";
        console.log("apidssssssssssssssss", apids);
        resolve(res);
      }
    })
    .catch(error => {
      console.error("API error:", error);
      reject(error);
    });
  });
}

async function loop() {
  var timeout = 50;
  console.log(" barcodes.length ", barcodes.length);
  for (var i = barcodes.length - 1; i >= 0; i--) {
    console.log(timeout, barcodes[i]);
    await makeAPICall3(barcodes[i]); // Wait for the API call to resolve before moving to the next iteration
  }
   makeAPICall_fill_ramilevi_storeddata(); // Wait for the final API call to resolve
}


function loopWrap(){
loop()
  .then(() => {
    console.log("All API calls completed.");
  })
  .catch(error => {
    console.error("An error occurred:", error);
  }); 
}
$(document).ready(function() {
	
	console.log("hello");
	read_prods();
	setTimeout(loopWrap, 1000);
	
	
	//makeAPICall2();
	//setTimeout(makeAPICall3, 500);
	//setTimeout(readLocalStorage, 5000);
	//readLocalStorage();	
	//setTimeout(makeAPICall2, 2000);
	//makeAPICall();
	//for (var i = 0;i<1;i=0){
	//	setTimeout(clear, 500);
	//}

});



