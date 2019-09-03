/*
Kevin Pham
This file provides behavior and loads information for the MTM projector website.
*/

(function() {
  "use strict";
  
  window.addEventListener("load", init);
  
  function init() {

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