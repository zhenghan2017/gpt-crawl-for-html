chrome.runtime.sendMessage({
  action: "domReady",
  domTree: document.documentElement.innerHTML,
});
