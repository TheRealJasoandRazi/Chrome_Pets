function New_Pet() {
    chrome.tabs.query({ active: false, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { message: "Delete_Pet" });
    }); //delete all pets in all tabs

    chrome.storage.local.get(["Pet_Data"], function(result) {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, 
            { 
                message: "New_Pet", 
                Pet_Data_X: result.Pet_Data.Pet_Data_X, 
                Pet_Data_Y: result.Pet_Data.Pet_Data_Y 
            });
        });
    });
  }
chrome.tabs.onActivated.addListener(New_Pet); //sends data to active tab

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    chrome.storage.local.set({ Pet_Data: message });
    chrome.storage.local.get(["Pet_Data"], function(result) {
        console.log(result);
    });
    //TEST
});

chrome.runtime.onInstalled.addListener(function(details) {
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
            chrome.scripting
                .executeScript({
                target : {tabId : tab.id },
                files : [ "Pet.js" ],
                })
                .then(() => console.log("script injected in all frames"));
        });
    });

    chrome.windows.getCurrent({}, function(currentWindow) {
        const left = currentWindow.width / 2 + "px";
        const top = currentWindow.height / 2 + "px";

        console.log(left);
        console.log(top);
        const newPetData = { Pet_Data_X: left, Pet_Data_Y: top };
        chrome.storage.local.set({ Pet_Data: newPetData }, function() {
            console.log("on install");
        });
    });
});

