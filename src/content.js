const My_Pet = document.createElement('div');
My_Pet.innerHTML = "Pet.png"
My_Pet.style.width = 50;
My_Pet.style.height = 50;
My_Pet.style.backgroundColor = "Blue";
My_Pet.style.position = 'fixed';
My_Pet.style.top = '50%';
My_Pet.style.left = '50%';
My_Pet.style.transform = 'translate(-50%, -50%)';

document.body.appendChild(My_Pet);
My_Pet.style.animation = 'moveAnimation 5s linear infinite';
/*
function My_Pet_Move() {
    Directions_To_Move = ["l", "r", "u", "d"]
    let direction = Directions_To_Move[Math.floor(Math.random() * 4)];
    switch (direction) {
        case 'u':
        My_Pet.style.transform = `translate(-50%, -50%) translateY(-100px)`;
        break;
        case 'd':
        My_Pet.style.transform = `translate(-50%, -50%) translateY(100px)`;
        break;
        case 'l':
        My_Pet.style.transform = `translate(-50%, -50%) translateX(-100px)`;
        break;
        case 'r':
        My_Pet.style.transform = `translate(-50%, -50%) translateX(100px)`;
        break;
    }
    setTimeout(() => {
        My_Pet_Move();
    }, 1000);
}

My_Pet_Move()*/

const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes moveAnimation {
    0% {
      transform: translate(-50%, -50%);
    }
    50% {
      transform: translate(-50%, -50%) translateX(100px);
    }
    100% {
      transform: translate(-50%, -50%);
    }
  }
`, styleSheet.cssRules.length);
