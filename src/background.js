function send_position() { //sendds position to the current tab
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { message: "return_position" });
    });
  }
chrome.tabs.onActivated.addListener(send_position); //recieves position from old tab

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log(message.Pet_Data_X);
    console.log(message.Pet_Data_Y);
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, 
        { 
            message: "New_Pet", Pet_Data_X: message.Pet_Data_X, Pet_Data_Y: message.Pet_Data_Y 
        });
    });
});

/*
chrome.storage.local.get(["Pet_Data"]).then((result) => {
    if(result.Pet_Data !== undefined){
        //console.log("got data");
    } else {
        chrome.storage.local.set({ Pet_Data: "stuff in here" }).then(() => {
            //console.log("Value is set");
        });
    }
});
*/ //dont even need storage for it?
