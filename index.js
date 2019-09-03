/*
Kevin Pham
JS file that provides behavior for modal and loads info for each item.
*/

(function() {
  "use strict";
  
  const URL_BASE = "mtmReader.php";
  const COLORS = ["color1", "color2"];
  const NUM_BIDS = 3;
  
  window.addEventListener("load", init);
  
  function init() {
    getItems();
    id("close").addEventListener("click", closeModal);
    id("filter").addEventListener("click", toggleSuperSilent);
    setInterval(update, 120000);
  }
  
  function update() {
    fetch(URL_BASE + "?item=all")
      .then(checkStatus)
      .then(JSON.parse)
      .then(updateItems)
      .catch(error);
  }
  
  function updateItems(response) {
    let data = response.data;
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      if (item.bid >= item.cap) {
        // replace card with sold version
        id("card-container").replaceChild(generateCard(item), id("item" + item.id));
      }else {
        qs("#item" + item.id + " .price").innerText = "$" + item.bid;
      }
    }
  }
  
  function toggleSuperSilent() {
    if (this.classList.contains("selected")) {
      this.classList.remove("selected");
      let cards = qsa(".card");
      for (let i = 0; i < cards.length; i++) {
        cards[i].classList.remove("hidden");
      }
    }else {
      this.classList.add("selected");
      let cards = qsa(".card");
      for (let i = 0; i < cards.length; i++) {
        cards[i].classList.add("hidden");
      }
      let superCards = qsa(".super-silent");
      for (let i = 0; i < superCards.length; i++) {
        superCards[i].classList.remove("hidden");
      }
    }
  }
  
  function closeModal() {
    id("modal").classList.add("hidden");
  }
  
  function getItems() {
    fetch(URL_BASE + "?item=all")
      .then(checkStatus)
      .then(JSON.parse)
      .then(processItemsList)
      .catch(error);
  }
  
  function processItemsList(response) {
    let list = response.data;
    list.sort((a, b) => a.id - b.id);
    for (let i = 0; i < list.length; i++) {
      id("card-container").appendChild(generateCard(list[i]));
    }
  }
  
  function generateCard(item) {
    let result = ce("div");
    result.classList.add("card");
    let color = item["super-silent"] ? "super-silent" : getRandomIndex(COLORS);
    if (item.bid >= item.cap) {
      color = "sold";
    }
    result.classList.add(color);
    
    let idDiv = ce("div");
    idDiv.classList.add("id");
    let idSpan = ce("span");
    let idNum = item.id;
    idSpan.innerText = idNum;
    idDiv.appendChild(idSpan);
    
    let img = ce("img");
    img.src = item.img;
    img.alt = item.name;
    
    let info = ce("aside");
    info.classList.add("info");
    let name = ce("span");
    name.classList.add("name");
    name.innerText = item.name;
    let price = ce("span");
    price.classList.add("price");
    price.innerText = "$" + item.bid;
    info.appendChild(name);
    info.appendChild(price);
    
    result.appendChild(idDiv);
    result.appendChild(img);
    result.appendChild(info);
    result.id = "item" + idNum;
    result.addEventListener("click", function() {
      generateModal(color, idNum);
    });
    return result;
  }
  
  function generateModal(color, id) {
    clearModal(color);
    fetch(URL_BASE + "?item=" + id)
      .then(checkStatus)
      .then(JSON.parse)
      .then(showModal)
      .catch(error);
  }
  
  function clearModal(color) {
    let modal = id("modal");
    for (let i = 0; i < COLORS.length; i++) {
      modal.classList.remove(COLORS[i] + "-modal");
    }
    modal.classList.remove("super-silent-modal");
    modal.classList.remove("sold-modal");
    modal.classList.add(color + "-modal");
    id("modal-name").innerHTML = "";
    id("modal-img").src = "";
    id("modal-img").alt = "";
    id("modal-description").innerHTML = "";
    qs("#modal-bids h3").innerText = "";
    let bids = qsa("#modal-bids .amount, #modal-bids .paddle");
    for (let i = 0; i < bids.length; i++) {
      bids[i].innerHTML = "";
    }
    for (let i = 0; i < COLORS.length; i++) {
      modal.classList.remove(COLORS[i] + "-modal");
    }
    modal.classList.remove("super-silent-modal");
    modal.classList.add(color + "-modal");
    id("modal-main").classList.add("hidden");
    id("loading").classList.remove("hidden");
    modal.classList.remove("hidden");
  }
  
  function showModal(response) {
    id("modal-name").innerText = response.name;
    id("modal-img").src = response.image;
    id("modal-img").alt = response.name;
    id("modal-description").innerText = response.description;   // Consider changing to innerHTML later
    qs("#modal-bids h3").innerText = "Highest Bids (max: $" + response.cap + ")";
    let bids = response.bids;
    bids.sort((a, b) => (b.bid - a.bid));
    for (let i = 0; i < bids.length && i < NUM_BIDS; i++) {
      qs("#bid" + (i + 1) + " .amount").innerText = "$" + bids[i].bid;
      qs("#bid" + (i + 1) + " .paddle").innerText = bids[i].name;
      id("bid" + (i + 1)).classList.remove("hidden");
    }
    for (let i = bids.length; i < NUM_BIDS; i++) {
      id("bid" + (i + 1)).classList.add("hidden");
    }
    id("modal-main").classList.remove("hidden");
    id("loading").classList.add("hidden");
  }
  
  /*=====Helper Functions=====*/
  
  function error(err) {
    console.error(err);
    alert("Sorry, we can't get the auction items right now.");
  }
  
  function getRandomIndex(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  
  const ce = (el) => document.createElement(el);
  const id = (id) => document.getElementById(id);
  const qs = (query) => document.querySelector(query);
  const qsa = (query) => document.querySelectorAll(query);
  
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300 || response.status === 0) {
      return response.text();
    } else {
      return Promise.reject(new Error(response.status + ": " + response.statusText));
    }
  }
})();