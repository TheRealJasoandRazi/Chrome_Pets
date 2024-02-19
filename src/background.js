/*const default_pet_position = {
    x: Math.floor(window.innerWidth - (0.1 * window.innerWidth)),
    y: Math.floor(window.innerHeight / 2)
};
*/ //need to use chrome.windows api for this
//temp solution

const default_pet_position = {
    x: 100,
    y: 100
}

chrome.tabs.onActivated.addListener(send_position);

async function send_position(){
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    const response = await chrome.tabs.sendMessage(tab.id, {greeting: "hello"});
    console.log(response);
} 