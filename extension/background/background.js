// 点击扩展时调用
chrome.browserAction.onClicked.addListener(function (tab) {
  // FIXME: 这里无法触发，我们需要在扩展被点开的时候重新回填一些数据状态
  console.log("extension icon is clicked");
  // chrome.storage.local.get("domStatus", function (result) {
  //   const data = result.myData;
  //   console.log(
  //     "%c [ data ]-6",
  //     "font-size:13px; background:pink; color:#bf2c9f;",
  //     data,
  //     tab
  //   );
  //   // 设置数据后，发送消息给 popup.html
  //   emitDataToHtml(tab.id, data);
  // });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log(
    "%c [ tab ]-18",
    "font-size:13px; background:pink; color:#bf2c9f;",
    tab
  );
  if (changeInfo.status === "complete") {
    chrome.tabs.executeScript(
      tabId,
      { file: "script/contentScript.js" },
      function () {
        let domLoadedStatus = false;
        if (chrome.runtime.lastError) {
          emitError(chrome.runtime.lastError.message);
        } else {
          emitSuccess();
          domLoadedStatus = true;
        }

        chrome.storage.local.set({ domLoadedStatus }, function () {
          emitDataToHtml(tabId, domLoadedStatus);
        });
      }
    );
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "domReady") {
    const domTree = request.domTree;
    // 处理接收到的DOM树
  }
});

function emitSuccess() {
  chrome.runtime.sendMessage({ action: "domSuccess" });
}

function emitError(errorMessage) {
  chrome.runtime.sendMessage({ action: "domError", message: errorMessage });
}

function emitDataToHtml(tabId, data) {
  // 设置数据后，发送消息给 popup.html
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabId, { action: "syncData", data });
    console.log("send sync data success");
  });
}
