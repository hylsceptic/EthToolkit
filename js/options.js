document.addEventListener(
  "DOMContentLoaded",
  function() {
    // your code here
    setTimeout(getPrice, 30);
    setTimeout(getGas, 30);
    setTimeout(getBlance, 30);
    setTimeout(updateCurrency, 30);
  },
  false
);
function sleep(ms) {
  // return new Promise(resolve => setTimeout(resolve, ms));
}

const btnAdd = document.getElementById("add");
const address = document.getElementById("address");
const btnEdit = document.getElementById("btn-edit");
const addTable = document.getElementById("addresses");
const totalBalance = document.getElementById("balance");
const addManager = document.querySelector(".addManager");
const mainPage = document.getElementById("mainPage");
const settingPage = document.getElementById("setting");
const btnSetting = document.getElementById("btn-setting");
const btnBack = document.getElementById("back");
const currentCurrency = document.getElementById("current-currency");
const setCurrency = document.getElementById("set-currency");
const btnSetCurrency = document.getElementById("btn-set-currency");
let showAdd = false;
function httpGet(theUrl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false); // false for synchronous request
  xmlHttp.send(null);
  return xmlHttp.responseText;
}

function getPrice() {
  var text = document.getElementById("price");
  var currency = localStorage.getItem("currency");
  if(currency == null) {
    currency = "USD"
  }
  var unit;
  console.log(currency);
  switch(currency) {
    case "USD":
    unit="$";
    break;
    case "JPY":
    unit="¥";
    break;
    case "CNY":
    unit="￥";
    break;
    case "EUR":
    unit="€";
    break;
    case "AUD":
    unit="$";
    break;
    case "USD":
    unit="$";
    break;
  }
  console.log(unit)
  let resp = JSON.parse(
    httpGet(`https://api.coinmarketcap.com/v2/ticker/1027/?convert=${currency}`)
  );
  var price = resp.data.quotes[currency].price;
  text.innerHTML = numToStr(price)+`<span class="unit">&nbsp;${unit}</span>`;;
}

function numToStr(num) {
  var str=""
  num = Math.ceil(num*100);
  str = '.' + (num%100).toString();
  num = (num - num%100)/100;
  while(num > 1000) {
    str = ","+(num%1000).toString()+str;
    num = (num - num%1000)/1000;
  }
  str = num.toString()+str;
  return str;

}

function getBlance() {
  var adds = getAdd();
  console.log(adds);
  if (adds.length > 0) {
    var balance = 0;
    var url = `https://api.etherscan.io/api?module=account&action=balancemulti&address=${adds}&tag=latest&apikey=YourApiKeyToken`;
    let resp = JSON.parse(httpGet(url));
    if (resp.status == "0") {
      totalBalance.innerHTML = "error";
      console.log(resp.message);
      console.log(url);
    } else {
      var res = resp.result;
      var tb = 0;
      for (i = 0; i < res.length; i++) {
        tb += Number(res[i].balance);
      }
      totalBalance.innerHTML =
        "Ξ&nbsp;" + (tb / 10 ** 18).toString().substring(0, 4);
    }
  } else {
    totalBalance.innerHTML =
      `<span class="unit">Ξ&nbsp;0&nbsp;(Add&nbsp;address&nbsp;to&nbsp;watch)</span>`;
  }
}

function getGas() {
  let resp = JSON.parse(
    httpGet("https://www.etherchain.org/api/gasPriceOracle")
  );
  var text = document.getElementById("standard");
  text.innerHTML = resp.standard.toString().substring(0, 3)+`<span class="unit">&nbsp;Gwei</span>`;
  var text = document.getElementById("safeLow");
  text.innerHTML = resp.safeLow.toString().substring(0, 3)+`<span class="unit">&nbsp;Gwei</span>`;
  var text = document.getElementById("fastest");
  text.innerHTML = resp.fastest.toString().substring(0, 3)+`<span class="unit">&nbsp;Gwei</span>`;
}

document.getElementById("button").onclick = function search() {
  var input = document.getElementById("search");
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

btnAdd.onclick = function rearch() {
  var adds = localStorage.getItem("adds");
  if (adds) {
    adds = adds.split(",");
    if (!adds.includes(address.value)) {
      adds.push(address.value);
    }
  } else {
    adds = Array(address.value);
  }
  localStorage.setItem("adds", adds);
  showAdds();
  setDelete();
};

btnEdit.onclick = function rearch() {
  if (showAdd) {
    addManager.classList.remove("show");
    showAdd = false;
    btnEdit.innerHTML = "Edit";
  } else {
    addManager.classList.add("show");
    showAdd = true;
    btnEdit.innerHTML = "Done";
    showAdds();
    setDelete();
  }
};

function getAdd() {
  var adds = localStorage.getItem("adds");
  if (!adds) return [];
  adds = adds.split(",");
  return adds;
}

function showAdds() {
  var adds = getAdd();
  var text = "";
  for (i = 0; i < adds.length; i++) {
    text += `     
    <div class="address">
    <button class="button-close" id="${adds[i]}">x</button> 
    <a href="https://etherscan.io/address/${adds[i]}" target="_blank">${
      adds[i]
    }</a>
    </div>`;
  }
  text += "<br>";
  addTable.innerHTML = text;
  getBlance();
}

function setDelete() {
  var addCloses = document.querySelectorAll(".button-close");
  for (i = 0; i < addCloses.length; i++) {
    var btnId = i;
    addCloses[btnId].onclick = function rearch() {
      adds = getAdd();
      var index = adds.indexOf(addCloses[btnId].id);
      adds.splice(index, index + 1);
      if (adds.length == 0) {
        localStorage.removeItem("adds");
      } else {
        localStorage.setItem("adds", adds);
      }
      showAdds();
      setDelete();
      getBlance();
    };
  }
}

btnSetting.onclick = function search() {
  mainPage.classList.add("hidden");
  settingPage.classList.remove("hidden");
}
btnBack.onclick = function search() {
  mainPage.classList.remove("hidden");
  settingPage.classList.add("hidden");
  setTimeout(getPrice, 30);
  setTimeout(getGas, 30);
  setTimeout(getBlance, 30);
  setTimeout(updateCurrency, 30);
}

function updateCurrency() {
  var currency = localStorage.getItem("currency");
  if(currency == null) {
    currentCurrency.innerHTML = "USD";  
  }
  else {
    currentCurrency.innerHTML = currency;
  }
  
}

btnSetCurrency.onclick = function search() {
  var currency = setCurrency.value;
  localStorage.setItem("currency", currency);
  updateCurrency()
}