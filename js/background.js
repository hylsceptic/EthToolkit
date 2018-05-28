(function() {
	startRequest();
	setInterval(startRequest, 5000);
})();
function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
var index = 1;
function startRequest()
{
	if(index % 2 == 0)
	{
		getPrice()
	} else {
		getGas()
	}
	index++
}

function getPrice() {
	let resp = JSON.parse(httpGet("https://api.coinmarketcap.com/v2/ticker/1027/"))
	let price = resp.data.quotes.USD.price;
	chrome.browserAction.setBadgeText({text: Math.round(price).toString()});
	chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 255, 0]});
}


function getGas() {
	let resp = JSON.parse(httpGet("https://www.etherchain.org/api/gasPriceOracle"))
	let price = resp.standard;
	chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 255, 255]});
	chrome.browserAction.setBadgeText({text: Math.round(price).toString()});
}