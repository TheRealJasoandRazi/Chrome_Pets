let Create_Pet_Button_Clicked = false;

chrome.webNavigation.onCompleted.addListener(function (details) {
    if (details.frameId === 0) {
        if(Create_Pet_Button_Clicked){
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.scripting.executeScript(
                {
                    target: { tabId: tabs[0].id },
                    files: ["Pet.js"],
                }).then(() => { //makes sure to run New_Pet after injection is done
                    console.log("script injected in new page");
                    chrome.tabs.sendMessage(tabs[0].id, { message: "New_Pet" });
                });
            });
        }
    }
});

//onBeforeNavigate -> onCommitted -> [onDOMContentLoaded] -> onCompleted

chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
    if (details.frameId === 0) {
        if(Create_Pet_Button_Clicked){
            chrome.tabs.sendMessage(details.tabId, { message: "Delete_Pet" }, function(response) {
                console.log("Deleting pet response:", response);
            });
        }
    }
});

//communicates with popup.html
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.message === "Create_Pet") {
        console.log("Message received in background:", message.message);
        if(!Create_Pet_Button_Clicked){
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.scripting.executeScript(
                {
                    target: { tabId: tabs[0].id },
                    files: ["Pet.js"],
                }).then(() => { //makes sure to run New_Pet after injection is done
                    console.log("script injected in first page");
                    chrome.tabs.sendMessage(tabs[0].id, { message: "New_Pet" });
                });
            });
        }
        Create_Pet_Button_Clicked = true; //set to True
        //sendResponse({ response: "Message received in background" });
    }
});

//on tab activated, delete all pets in inactive tabs
/*
chrome.tabs.onActivated.addListener(function (details) {
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(element => {
            chrome.tabs.sendMessage(element.tabId, { message: "Delete_Pet" }, function(response) {
                console.log("Deleting pet response:", response);
            });
        });
    }); 
});*/

 /*"content_scripts": [ //can't be put in json file
        {
          "matches": ["<all_urls>"],
          "js": ["Pet.js"]
        }
      ],
    */