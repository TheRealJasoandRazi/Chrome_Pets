const My_Pet = document.createElement('div');
My_Pet.innerHTML = "Pet.png";
My_Pet.style.width = "100px";
My_Pet.style.height = "100px";
My_Pet.style.backgroundColor = "Blue";
My_Pet.style.position = 'fixed';
My_Pet.style.top = '50%';
My_Pet.style.left = '50%';
My_Pet.style.transform = 'translate(-50%, -50%)';

document.body.appendChild(My_Pet);
My_Pet.style.animation = 'moveAnimation 5s linear infinite';

function My_Pet_Move() {
  const randomAngle = Math.random() * 360; // Generate a random angle in degrees
  const distance = Math.random() * (400 - 100) + 100;
  // Convert angle to radians
  const angleInRadians = (randomAngle * Math.PI) / 180;

  // Calculate X and Y components of the translation based on the angle
  const translateX = distance * Math.cos(angleInRadians);
  const translateY = distance * Math.sin(angleInRadians);

  My_Pet.style.transition = 'transform 5s linear';
  My_Pet.style.transform = `translate(${translateX}px, ${translateY}px)`;

  // Reset the transition and trigger the next movement after 5 seconds
  setTimeout(() => {
      My_Pet.style.transition = 'none';
      My_Pet_Move();
  }, 2000); //doesnt even work
}

My_Pet_Move();

My_Pet.addEventListener("click", Pet);
function Pet(){
  console.log("clicked");
  let randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
  My_Pet.style.backgroundColor = randomColor;
  console.log("changed colour")
  setTimeout(1000);
}
