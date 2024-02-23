let My_Pet;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.message === "New_Pet") {
    console.log("Creating pet");
    console.log(message.Pet_Data_Y);
    console.log(message.Pet_Data_X);
    Create_Pet(message.Pet_Data_Y, message.Pet_Data_X);
  } else if(message.message === "Delete_Pet"){
    console.log("Deleting pet");
    My_Pet.remove();
  }
});

function Create_Pet(top, left){
  const newPet = document.createElement('div');
  newPet.innerHTML = "Pet.png";
  newPet.style.width = "100px";
  newPet.style.height = "100px";
  newPet.style.backgroundColor = "Blue";
  newPet.style.position = 'fixed';
  newPet.style.top = top;
  newPet.style.left = left;

  document.body.appendChild(newPet);

  My_Pet = newPet;

  My_Pet.addEventListener("click", Pet);
  My_Pet.addEventListener('transitionend', Time_Out);

  My_Pet_Move();
}

function My_Pet_Move() {
  const randomAngle = Math.random() * 360;
  const distance = Math.random() * (400 - 100) + 100;
  const angleInRadians = (randomAngle * Math.PI) / 180;
  const translateX = distance * Math.cos(angleInRadians);
  const translateY = distance * Math.sin(angleInRadians);

  //update position of pet, this doesn't move the pet but is used when it returns its position
  newTop = (parseFloat(My_Pet.style.top) + translateY) + "px";
  newLeft = (parseFloat(My_Pet.style.left) + translateX) + "px";
  
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;

  //makes sure the pet can't move outside of the window screen
  My_Pet.style.top = Math.max(0, Math.min(newTop, windowHeight - My_Pet.style.height)) + "px";
  My_Pet.style.left = Math.max(0, Math.min(newLeft, windowWidth - My_Pet.style.width)) + "px";

  requestAnimationFrame(() => { //this code waits for the next available frame and moves the div
    My_Pet.style.transition = '5s';
    My_Pet.style.transform = `translate(${translateX}px, ${translateY}px)`;
  });

  chrome.runtime.sendMessage({
    Pet_Data_X: My_Pet.style.left,
    Pet_Data_Y: My_Pet.style.top
  });
}

function Time_Out() { //creates a delay before moving the pet again
  setTimeout(My_Pet_Move, 2000);
}

function Pet() { //the pet action
  let randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
  My_Pet.style.backgroundColor = randomColor;
}

