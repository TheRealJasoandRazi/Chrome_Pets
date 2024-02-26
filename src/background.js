/*function New_Pet() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { message: "New_Pet" });
    });
}*/
/*
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
});*/
/*
chrome.tabs.onCreated.addListener(function (tab) {
    console.log('New tab created. Tab ID:', tab.id);
    chrome.scripting.executeScript(
        {
            target : {tabId : tab.id },
            files : [ "Pet.js" ],
        }).then(() => console.log("script injected in new tab"));
});*/

chrome.webNavigation.onCompleted.addListener(function (details) {
    if (details.frameId === 0) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript(
            {
                target: { tabId: tabs[0].id },
                files: ["Pet.js"],
            }).then(() => {
                console.log("script injected in new page");
                chrome.tabs.sendMessage(tabs[0].id, { message: "New_Pet" });
            });
        });
    }
});

//onBeforeNavigate -> onCommitted -> [onDOMContentLoaded] -> onCompleted
/*chrome.webNavigation.onCommitted.addListener(function (details) {
    if (details.transitionType === "back_forward") {
        console.log("Back or Forward button used");
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                message: "Delete_Pet"
            });
        });
    }
});*/

/*chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
        message: "Delete_Pet"
    });
});*/

chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
    if (details.frameId === 0) {
        chrome.tabs.sendMessage(details.tabId, { message: "Delete_Pet" }, function(response) {
            console.log("Deleting pet response:", response);
        });
    }
});

//on tab activated, delete all pets in inactive tabs
