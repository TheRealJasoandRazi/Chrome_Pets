let My_Pet;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.message === "New_Pet") {
    console.log("Creating pet");
    Create_Pet();
  } else  if (message.message === "Delete_Pet") {
    console.log("Deleting pet");
    if (My_Pet) {
        My_Pet.remove();
        sendResponse({ success: true }); //for the callback function in bg.js
    } else {
        sendResponse({ success: false });
    }
  }
});

function Create_Pet(){
  My_Pet = document.createElement('div');
  My_Pet.setAttribute('id', 'pet');
  My_Pet.style.zIndex = '9999';
  My_Pet.innerHTML = "Pet.png";
  My_Pet.style.width = "100px";
  My_Pet.style.height = "100px";
  My_Pet.style.backgroundColor = "Blue";
  My_Pet.style.position = 'fixed';
  My_Pet.style.top = 0;
  My_Pet.style.left = 0;
  //My_Pet.style.transition = '10s';

  document.body.appendChild(My_Pet);

  My_Pet.addEventListener("click", Pet);

  My_Pet_Move();
}

function Get_Direction(){ 
  const randomAngle = Math.random() * 360;
  const distance = Math.random() * (400 - 100) + 100;
  const angleInRadians = (randomAngle * Math.PI) / 180;
  const translateX = distance * Math.cos(angleInRadians);
  const translateY = distance * Math.sin(angleInRadians);

  const top = parseFloat(My_Pet.style.top) + translateY;
  const left = parseFloat(My_Pet.style.left) + translateX;
  return [top, left];
}

let animationStartTime;
function My_Pet_Move() {
  let top, left;
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;

  do {
    [top, left, translateX, translateY] = Get_Direction();
    if (
      top > 0 &&
      top < windowHeight &&
      left > 0 &&
      left < windowWidth
    ) {
      console.log('Position is within bounds. Breaking loop.');
      break;
    }
    console.log('Position is out of bounds. Continuing loop.');
  } while (true);

  const initialTop = parseFloat(My_Pet.style.top) || 0;
  const initialLeft = parseFloat(My_Pet.style.left) || 0;

  //start time of animation
  animationStartTime = performance.now(); //highly precise time in milliseconds

  function animate(timestamp) { //timestamp is passed in by the browser, only happens when called by the requestAnimationFrame
    //gets the current progress of the animation
    const progress = (timestamp - animationStartTime) / 10000; // 2000 milliseconds for the animation

    //1 indicates the end of an animation, this checks that the pet should still be moving
    if (progress < 1) {
      const currentTop = initialTop + progress * (top - initialTop);
      const currentLeft = initialLeft + progress * (left - initialLeft);

      //updates the position of the pet
      My_Pet.style.top = currentTop + 'px';
      My_Pet.style.left = currentLeft + 'px';

      requestAnimationFrame(animate); //creates a recursion call
    } else { //set the final position
      // Ensure the final position is set
      My_Pet.style.top = top + 'px';
      My_Pet.style.left = left + 'px';

      // stop the bet for a hard coded amount of time
      setTimeout(() => {
        My_Pet_Move();
      }, 2000);
    }
  }

  requestAnimationFrame(animate);
}

function Pet() { //the pet action
  let randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
  My_Pet.style.backgroundColor = randomColor;
}

