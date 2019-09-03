/*
Kevin Pham
Provides behavior for MTM volunteer GUI used to update data for silent auction
items.  This includes loading data and sending changes.
*/

(function() {
  "use strict";
  
  const READER_URL = "../mtmReader.php";
  const UPDATER_URL = "mtmUpdater.php";
  const CONFIRM_DELAY = 500;
  
  window.addEventListener("load", init);
  
  function init() {
    id("preview-btn").addEventListener("click", loadPreview);
    id("submit").addEventListener("click", delayChange);
  }
  
  function delayChange() {
    setTimeout(sendChange, CONFIRM_DELAY);
  }
  
  function sendChange() {
    if (confirm("Are you sure?  Press OK to continue.")) {
      let pswd = id("password").value;
      let item = id("item").value;
      let paddle = id("paddle").value;
      let amnt = id("amount").value;
      if (pswd.length === 0 || item <= 0 || paddle <= 0 || amnt <= 0) {
        alert ("Please input a valid password, item number, paddle number, and bid amount");
      }else {
        let data = new FormData();
        data.append("password", pswd);
        data.append("item", item);
        data.append("paddle", paddle);
        data.append("bid", amnt);
        fetch(UPDATER_URL, {method: "POST", body: data})
          .then(checkStatus)
          .then(successfulChange)
          .catch(console.error);
      }
    }
  }
  
  function successfulChange(response) {
    alert("The change was added.");
    id("item").value = "";
    id("paddle").value = "";
    id("amount").value = "";
    qs("#preview h2").innerText = "";
    qs("#preview h3").innerText = "";
    qs("#preview p").innerText = "";
  }
  
  function loadPreview() {
    let item = id("item").value;
    if (item <= 0) {
      alert("Please enter an item number.");
    }else {
      fetch(READER_URL + "?item=" + item)
        .then(checkStatus)
        .then(JSON.parse)
        .then(showPreview)
        .catch(console.error);
    }
  }
  
  function showPreview(response) {
    console.log(response);
    qs("#preview h2").innerText = response.name;
    qs("#preview h3").innerText = "Highest bid: $" + response.bids[0].bid;
    qs("#preview p").innerText = response.description;
  }
  
  /*==========Helper Functions==========*/
  
  const id = (id) => document.getElementById(id);
  const qs = (query) => document.querySelector(query);
  
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300 || response.status === 0) {
      return response.text();
    } else {
      response.text().then(alert);
      return Promise.reject(new Error(response.status + ": " + response.statusText));
    }
  }
})();