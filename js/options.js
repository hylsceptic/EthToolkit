document.addEventListener('DOMContentLoaded', function() {
   // your code here
   	setTimeout(getPrice, 40)
   	setTimeout(getGas,   40)
}, false);
function sleep(ms) {
  // return new Promise(resolve => setTimeout(resolve, ms));
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function getPrice() {
	var text = document.getElementById("price");
	let resp = JSON.parse(httpGet("https://api.coinmarketcap.com/v2/ticker/1027/"))
	text.innerHTML = resp.data.quotes.USD.price;
}


function getGas() {
	let resp = JSON.parse(httpGet("https://www.etherchain.org/api/gasPriceOracle"))
	var text = document.getElementById("standard");
	text.innerHTML = resp.standard;
	var text = document.getElementById("safeLow");
	text.innerHTML = resp.safeLow;
	var text = document.getElementById("fastest");
	text.innerHTML = resp.fastest;
}

document.getElementById("button").onclick = function search() {
	var input = document.getElementById("address");
	if(input.value.length == 42){
		chrome.tabs.create({ url: "https://etherscan.io/address/" + input.value })
	} else {

		chrome.tabs.create({ url: "https://etherscan.io/tx/" + input.value })
	}
		

}