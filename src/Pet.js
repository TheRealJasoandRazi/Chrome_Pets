let My_Pet;
let Is_Petting = false;
let Animation_Timer;
let animationStartTime;
let direction = "";
let animation_interval;

const petting_animation_frames = ["pet-petting/petting_1.png", "pet-petting/petting_2.png", "pet-petting/petting_3.png", "pet-petting/petting_4.png", "pet-petting/petting_5.png"]
const walking_animation_frames = ["pet-walking/walking_2.png", "pet-walking/walking_1.png"];

//waits for message from background.js
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

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
} //whenn the input value t is low, it increases it and vice versa
//this helps create an ease out transition effect

function Create_Pet(){ //properties of pet is hardcoded
  My_Pet = document.createElement('div');
  My_Pet.setAttribute('id', 'pet');
  My_Pet.style.zIndex = '9999';
  //My_Pet.innerHTML = "Pet.png";
  My_Pet.style.width = "100px";
  My_Pet.style.height = "100px";
  //My_Pet.style.backgroundColor = "Blue";
  My_Pet.style.position = 'fixed';
  My_Pet.style.top = 0;
  My_Pet.style.left = 0;
  
  const pet_image = document.createElement('img');
  pet_image.setAttribute('id', 'duck_image')
  pet_image.src = chrome.runtime.getURL("Asset_1.png");
  pet_image.style.width = '100%';
  pet_image.style.height = '100%';
  My_Pet.appendChild(pet_image);

  document.body.appendChild(My_Pet);

  My_Pet.addEventListener("click", Pet);


  function startani(){ //one time animation that runs when the pet is intiially created
    let startTime;
    let time_to_transition = 3000;

    function animate(time) {
        if (!startTime) {startTime = time;}

        let progress = 0;
        progress = easeOut((time - startTime) / time_to_transition);
        //console.log(progress);

        // (progress * distant_to_move) - starting position, end position
        My_Pet.style.left = `${Math.min((progress * 400) - 100, 300)}px`;

        if (progress < 1) {
          if(!Is_Petting){
            requestAnimationFrame(animate);
          } else {
            stop_pet_animation(walking_animation_frames);
          }
        } else{
          stop_pet_animation(walking_animation_frames);
          My_Pet_Move();
        }
    }
    requestAnimationFrame(animate);
  }
  start_pet_animation(walking_animation_frames);
  startani();
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

function My_Pet_Move() {
  let top, left;
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;

  do { //loops infinitely until it finds a location within the borders of the web browser to move to
    [top, left] = Get_Direction();
    if (
      top > 0 &&
      top < windowHeight &&
      left > 0 &&
      left < windowWidth
    ) {
      //console.log('Position is within bounds. Breaking loop.');
      break;
    }
    //console.log('Position is out of bounds. Continuing loop.');
  } while (true);

  const initialTop = parseFloat(My_Pet.style.top) || 0;
  const initialLeft = parseFloat(My_Pet.style.left) || 0;

  console.log(initialLeft);
  console.log(left);
  if (left > initialLeft) {
    direction = "r";
  } else {
    direction = "l";
  }
  //start time of animation
  animationStartTime = performance.now(); //highly precise time in milliseconds

  function animate(timestamp) { //timestamp is passed in by the browser, only happens when called by the requestAnimationFrame
    //gets the current progress of the animation
    progress = easeOut((timestamp - animationStartTime) / 10000); // 2000 milliseconds for the animation
    if (progress < 1) { //1 indicates the end of an animation, this checks that the pet should still be moving
      const currentTop = initialTop + progress * (top - initialTop);
      const currentLeft = initialLeft + progress * (left - initialLeft);

      //updates the position of the pet
      My_Pet.style.top = currentTop + 'px';
      My_Pet.style.left = currentLeft + 'px';

      //creates a recursion call
      if(!Is_Petting){
        requestAnimationFrame(animate); 
      } else {
        stop_pet_animation(walking_animation_frames);
      }

    } else { //set the final position
      // Ensure the final position is set
      My_Pet.style.top = top + 'px';
      My_Pet.style.left = left + 'px';

      stop_pet_animation(walking_animation_frames);
      // stop the bet for a hard coded amount of time
      setTimeout(() => {
        My_Pet_Move();
      }, 2000);
    }
  }
  start_pet_animation(walking_animation_frames);
  requestAnimationFrame(animate);
}

function start_pet_animation(animation_frames) {
  let frame = 0;
  animation_interval = setInterval(function () {
    if (frame > animation_frames.length - 1) {
      frame = 0;
    }
    const duck_element_image = document.getElementById("pet").children[0];
    const duck_image = chrome.runtime.getURL(animation_frames[frame]);
    if (direction == "l") {
      duck_element_image.style.transform = "scaleX(-1)";
    } else {
      duck_element_image.style.transform = "none";
    }
    duck_element_image.src = duck_image;
    frame++;
  }, 500);
}

function stop_pet_animation(animation_frames) {
  clearInterval(animation_interval);
  const duck_image = document.getElementById("pet").children[0];
  const last_index = animation_frames.length - 1;
  duck_image.src = chrome.runtime.getURL(animation_frames[last_index]);
}

function Pet() { //the pet action
  Is_Petting = true; //stops the pet from moving
  const timeout = petting_animation_frames.length * 500;
  setTimeout(() => {
    start_pet_animation(petting_animation_frames);
    setTimeout(() => {
      stop_pet_animation(petting_animation_frames);
      Is_Petting = false;
      My_Pet_Move(); //starts the pet moving again
    }, timeout);
  }, 100);
}

