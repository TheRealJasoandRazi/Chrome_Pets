function New_Pet() {
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
            if (!tab.active) {
                chrome.tabs.sendMessage(tab.id, { message: "Delete_Pet" });
            }
        });
    });

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
    console.log(message);
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

chrome.tabs.onCreated.addListener(function (tab) {
    console.log('New tab created. Tab ID:', tab.id);
    chrome.scripting.executeScript(
        {
            target : {tabId : tab.id },
            files : [ "Pet.js" ],
        }).then(() => console.log("script injected in new tab"));
});

/*
chrome.webNavigation.onCompleted.addListener(function(details) {
    // Check if the navigation is in the main frame
    if (details.frameId === 0) {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.scripting.executeScript(
            {
                target : {tabId : tabs[0].id },
                files : [ "Pet.js" ],
            }).then(() => console.log("script injected in new page"));
      });
    }
});*/
  

