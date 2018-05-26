(function() {
	getPrice()
	getGas()
	// body...
})();
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