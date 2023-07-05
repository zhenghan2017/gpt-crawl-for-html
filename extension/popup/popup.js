chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  let status = "waiting";
  switch (request.action) {
    case "domSuccess": {
      console.info("DOM tree retrieved successfully.");
      status = "loaded success";
      break;
    }
    case "domError": {
      console.error("Error occurred: " + request.message);
      status = "loaded error";
      break;
    }
    case "syncData": {
      console.info("sync data successfully.", savedData);
      const savedData = request.data;
      // 在这里使用保存的数据进行展示或其他操作
      const dataContainer = document.getElementById("dom-status");
      dataContainer.textContent = JSON.stringify(savedData);
      break;
    }
    default:
  }

  const dataContainer = document.getElementById("dom-status");
  dataContainer.textContent = status;
});
