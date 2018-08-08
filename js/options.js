document.addEventListener(
  "DOMContentLoaded",
  function() {
    // your code here
    setTimeout(getPrice, 40);
    setTimeout(getGas, 40);
    setTimeout(getBlance, 40);
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
let showAdd = false;
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
      totalBalance.innerHTML = (tb / 10 ** 18).toString().substring(0, 4);
    }
  } else {
    totalBalance.innerHTML = "0";
  }
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
    <button class="button-close" id="${adds[i]}">x</button> ${adds[i]}</div>`;
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
