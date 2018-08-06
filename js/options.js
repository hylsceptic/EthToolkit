document.addEventListener(
  "DOMContentLoaded",
  function() {
    // your code here
    setTimeout(getPrice, 40);
    setTimeout(getGas, 40);
  },
  false
);
function sleep(ms) {
  // return new Promise(resolve => setTimeout(resolve, ms));
}

function httpGet(theUrl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false); // false for synchronous request
  xmlHttp.send(null);
  return xmlHttp.responseText;
}

function getPrice() {
  var text = document.getElementById("price");
  let resp = JSON.parse(
    httpGet("https://api.coinmarketcap.com/v2/ticker/1027/")
  );
  var price = resp.data.quotes.USD.price;
  text.innerHTML = price.toString().substring(0, 5);
}

function getGas() {
  let resp = JSON.parse(
    httpGet("https://www.etherchain.org/api/gasPriceOracle")
  );
  var text = document.getElementById("standard");
  text.innerHTML = resp.standard.toString().substring(0, 3);
  var text = document.getElementById("safeLow");
  text.innerHTML = resp.safeLow.toString().substring(0, 3);
  var text = document.getElementById("fastest");
  text.innerHTML = resp.fastest.toString().substring(0, 3);
}

document.getElementById("button").onclick = function search() {
  var input = document.getElementById("address");
  if (input.value.substring(0, 2) == "0x") {
    if (input.value.length == 42) {
      chrome.tabs.create({
        url: "https://etherscan.io/address/" + input.value
      });
    } else {
      chrome.tabs.create({ url: "https://etherscan.io/tx/" + input.value });
    }
  } else if (
    input.value.substring(input.value.length - 4, input.value.length) == ".eth"
  ) {
    chrome.tabs.create({
      url: "https://etherscan.io/enslookup?q=" + input.value
    });
  }
};
