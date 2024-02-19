const My_Pet = document.createElement('div');
My_Pet.innerHTML = "Pet.png";
My_Pet.style.width = "100px";
My_Pet.style.height = "100px";
My_Pet.style.backgroundColor = "Blue";
My_Pet.style.position = 'fixed';
My_Pet.style.top = '50%';
My_Pet.style.left = '50%';

document.body.appendChild(My_Pet);
My_Pet.addEventListener("click", Pet);
My_Pet_Move();

/*
chrome.runtime.onMessage.addListener(CreatePet);
function CreatePet(message){
  console.log(message);
}*/
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting === "hello")
      sendResponse({farewell: "goodbye"});
  }
); // this reciever can't be found by the sender in background.js

function My_Pet_Move() {
  const randomAngle = Math.random() * 360;
  const distance = Math.random() * (400 - 100) + 100;
  const angleInRadians = (randomAngle * Math.PI) / 180;
  const translateX = distance * Math.cos(angleInRadians);
  const translateY = distance * Math.sin(angleInRadians);

  requestAnimationFrame(() => {
    My_Pet.style.transition = '5s';
    My_Pet.style.transform = `translate(${translateX}px, ${translateY}px)`;
  });
  console.log("moved")
}

function Time_Out() {
  setTimeout(My_Pet_Move, 2000);
}

function Pet() {
  let randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
  My_Pet.style.backgroundColor = randomColor;
}

My_Pet.addEventListener('transitionend', Time_Out);
