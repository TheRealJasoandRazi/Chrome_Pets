let Create_Pet_Button_Clicked = false; //keeps track if pet exists
let pet;

let petting_suffix = "petting_animation_frames";
let walking_suffix = "walking_animation_frames";

const duck_petting_animation_frames = ["pet-petting/duck/petting_1.png", "pet-petting/duck/petting_2.png", "pet-petting/duck/petting_3.png", "pet-petting/duck/petting_4.png", "pet-petting/duck/petting_5.png"]
const duck_walking_animation_frames = ["pet-walking/duck/walking_1.png", "pet-walking/duck/walking_2.png"];
const kangaroo_walking_animation_frames = ["pet-walking/kangaroo/walking_1.png", "pet-walking/kangaroo/walking_2.png", "pet-walking/kangaroo/walking_3.png"];
const kangaroo_petting_animation_frames = ["pet-petting/duck/petting_1.png", "pet-petting/duck/petting_2.png", "pet-petting/duck/petting_3.png", "pet-petting/duck/petting_4.png", "pet-petting/duck/petting_5.png"] //temporarily using duck petting animations for kangaroo

const petArrays = { //dictionary to associtae strings to their correct variable
    "duck_petting_animation_frames": duck_petting_animation_frames,
    "duck_walking_animation_frames": duck_walking_animation_frames,
    "kangaroo_walking_animation_frames": kangaroo_walking_animation_frames,
    "kangaroo_petting_animation_frames": kangaroo_petting_animation_frames
};

//runs whenever a url is loaded
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
                    chrome.tabs.sendMessage(tabs[0].id, { message: "New_Pet",
                    pet_walking_frames: petArrays[`${pet}_${walking_suffix}`],
                    pet_petting_frames: petArrays[`${pet}_${petting_suffix}`] });
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
    if (message.message === "Create_Pet") {
        console.log("Message received in background:", message.message);
        console.log(message.pet); //debugging
        pet = message.pet;
        console.log(pet); //debugging
        if(!Create_Pet_Button_Clicked){
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.scripting.executeScript(
                {
                    target: { tabId: tabs[0].id },
                    files: ["Pet.js"],
                }).then(() => { //makes sure to run New_Pet after injection is done
                    console.log("script injected in first page");
                    chrome.tabs.sendMessage(tabs[0].id, { message: "Delete_Pet" });
                    chrome.tabs.sendMessage(tabs[0].id, { message: "New_Pet", 
                    pet_walking_frames: petArrays[`${pet}_${walking_suffix}`],
                    pet_petting_frames: petArrays[`${pet}_${petting_suffix}`] });
                });
            });
            Create_Pet_Button_Clicked = true; //set to True
        } else if (Create_Pet_Button_Clicked){
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { message: "Delete_Pet" });
                chrome.tabs.sendMessage(tabs[0].id, { message: "New_Pet",
                pet_walking_frames: petArrays[`${pet}_${walking_suffix}`],
                pet_petting_frames: petArrays[`${pet}_${petting_suffix}`] });
            });
        }
    } else if (message.message === "Delete_Pet") {
        Create_Pet_Button_Clicked = false;
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { message: "Delete_Pet" });
        });
    }
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
                        }).then(() => { //makes sure to run New_Pet after injection is done
                            console.log("script injected in new page");
                            chrome.tabs.sendMessage(element.id, { message: "New_Pet",
                            pet_walking_frames: petArrays[`${pet}_${walking_suffix}`],
                            pet_petting_frames: petArrays[`${pet}_${petting_suffix}`] });
                    });
                }
            });
        }); 
    }
});