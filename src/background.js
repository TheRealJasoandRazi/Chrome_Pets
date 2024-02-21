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

function send_position() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { message: "myMessage" });
    });
  }
chrome.tabs.onActivated.addListener(send_position);
