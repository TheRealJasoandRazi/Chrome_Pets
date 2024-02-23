function New_Pet() {
    chrome.tabs.query({ active: false, lastFocusedWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { message: "Delete_Pet" });
    }); //delete all pets in all tabs

    const newPetData = chrome.storage.local.get(["Pet_Data"]);
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, 
        { 
            message: "New_Pet", Pet_Data_X: newPetData.Pet_Data_X, Pet_Data_Y: newPetData.Pet_Data_Y 
        });
    });
  }
chrome.tabs.onActivated.addListener(New_Pet); //sends data to active tab

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    const newPetData = { Pet_Data_X: message.Pet_Data_X, Pet_Data_Y: message.Pet_Data_Y };
    chrome.storage.local.set({ Pet_Data: newPetData }, function() {
        console.log("Pet_Data is set:");
        console.log(newPetData.Pet_Data_X);
        console.log(newPetData.Pet_Data_Y);
    });
});

chrome.runtime.onInstalled.addListener(function(details) {
    chrome.windows.getCurrent({}, function(currentWindow) {
        const left = currentWindow.width / 2 + "px";
        const top = currentWindow.height / 2 + "px";
        /*
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                message: "New_Pet",
                Pet_Data_X: left,
                Pet_Data_Y: top
            });
        });*/
        const newPetData = { Pet_Data_X: left, Pet_Data_Y: top };
        chrome.storage.local.set({ Pet_Data: newPetData }, function() {
            console.log("on install");
        });
    });
});

