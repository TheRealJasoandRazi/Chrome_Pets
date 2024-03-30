let pet;
let Create_Pet_Button_Clicked;

let petting_suffix = "petting_animation_frames";
let walking_suffix = "walking_animation_frames";

const duck_petting_animation_frames = ["pet-petting/duck/petting_1.png", "pet-petting/duck/petting_2.png", "pet-petting/duck/petting_3.png", "pet-petting/duck/petting_4.png", "pet-petting/duck/petting_5.png"]
const duck_walking_animation_frames = ["pet-walking/duck/walking_1.png", "pet-walking/duck/walking_2.png"];
const kangaroo_walking_animation_frames = ["pet-walking/kangaroo/walking_1.png", "pet-walking/kangaroo/walking_2.png", "pet-walking/kangaroo/walking_3.png"];
const kangaroo_petting_animation_frames = ["pet-petting/duck/petting_1.png", "pet-petting/duck/petting_2.png", "pet-petting/duck/petting_3.png", "pet-petting/duck/petting_4.png", "pet-petting/duck/petting_5.png"] //temporarily using duck petting animations for kangaroo

const pet_animation_arrays = { //dictionary to associtae strings to their correct variable
    "duck_petting_animation_frames": duck_petting_animation_frames,
    "duck_walking_animation_frames": duck_walking_animation_frames,
    "kangaroo_walking_animation_frames": kangaroo_walking_animation_frames,
    "kangaroo_petting_animation_frames": kangaroo_petting_animation_frames
};

function send_message_create_pet(tab) {
    chrome.tabs.sendMessage(tab, { message: "Create_Pet",
    pet_walking_frames: pet_animation_arrays[`${pet}_${walking_suffix}`],
    pet_petting_frames: pet_animation_arrays[`${pet}_${petting_suffix}`] });
}

//runs whenever a url is loaded
chrome.webNavigation.onCompleted.addListener(function (details) {
    if (details.frameId === 0) {
        if(Create_Pet_Button_Clicked){
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.scripting.executeScript(
                {
                    target: { tabId: tabs[0].id },
                    files: ["Pet.js"],
                }).then(() => { //makes sure to run Create_Pet after injection is done
                    console.log("script injected in new page");
                    send_message_create_pet(tabs[0].id);
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
                console.log("Deleting pet response in old url:", response);
            });
        }
    }
});

//communicates with popup.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log("Message received in background:", message.message);
    pet = message.pet;

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (message.message === "Create_Pet") {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ["Pet.js"],
            }).then(() => {
                chrome.tabs.sendMessage(tabs[0].id, { message: "Delete_Pet" });
                send_message_create_pet(tabs[0].id);
                Create_Pet_Button_Clicked = true;
            });
        } else if (message.message === "Delete_Pet") {
            chrome.tabs.sendMessage(tabs[0].id, { message: "Delete_Pet" });
            Create_Pet_Button_Clicked = false;
        }
    });
});


//on tab activated, delete all pets in inactive tabs and injects script into new tab
chrome.tabs.onActivated.addListener(function (details) {
    if (Create_Pet_Button_Clicked)
    {
        chrome.tabs.query({}, function (tabs) {
            tabs.forEach(element => {
                if (!element.active){
                    chrome.tabs.sendMessage(element.id, { message: "Delete_Pet" }, function(response) {
                        console.log("Deleting pet response in old tab:", response);
                    });
                } else {
                    chrome.scripting.executeScript(
                        {
                            target: { tabId: element.id },
                            files: ["Pet.js"],
                        }).then(() => { //makes sure to run Create_Pet after injection is done
                            console.log("script injected in new tab");
                            send_message_create_pet(element.id);
                    });
                }
            });
        }); 
    }
});