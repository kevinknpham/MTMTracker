/*
Kevin Pham
This file provides behavior and loads information for the MTM projector website.
*/

(function() {
  "use strict";

  const URL_BASE = "../mtmReader.php";

  let data;
  let dataIndex = 0;
  
  window.addEventListener("load", init);
  
  function init() {
    // TODO:
    // - load list of items then filter out super-silent items
    // - create function that runs on a timer that will hide and show and the front view
    // - create function that updates items being shown that can be called by above function
    fetch(URL_BASE + "?item=all")
      .then(checkStatus)
      .then(JSON.parse)
      .then(filterInitalData)
      .catch(console.error);
  }

  function filterInitalData(resp) {
    data = resp.data.filter((item) => item["super-silent"] && (item.bid != item.cap)).map(item => item.id);
  }

  function showLoading() {
    dataLength = data.length;
    if (dataLength > 0) {
      id("front").classList.add("front-shown");

      fetch(URL_BASE + "?item=all")
        .then(checkStatus)
        .then(JSON.parse)
        .then(updateInfo)
        .catch(console.error);
      dataIndex++;
      if (dataIndex >= dataLength) {
        dataIndex = dataIndex % dataLength;
      }
    }
  }

  function updateInfo(response) {
    
  }
  
  /*=====Helper Functions=====*/
  
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