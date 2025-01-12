//COMPT4537 LAB0 caitlyn chen
// Color.js functionality
class Color {
    static getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}

// Button.js functionality
class Button {
    constructor(color, width, height, top, left, order) {
        this.order = order + 1; 
        this.btn = document.createElement("button");
        this.btn.textContent = this.order;
        this.btn.dataset.order = this.order;
        this.btn.style.backgroundColor = color;
        this.btn.style.width = width;
        this.btn.style.height = height;
        this.btn.style.position = "absolute";
        this.btn.onclick = () => Game.checkOrder(this);
        
        this.setLocation(top, left);
        document.getElementById('buttonContainer').appendChild(this.btn);
    }

    setLocation(top, left) {
        this.btn.style.top = top;
        this.btn.style.left = left;
    }
}

// Game.js functionality
class Game {
    static init() {
        const numberOfButtons = Game.initButton();
        if (numberOfButtons) {
            Game.btns = Game.createButtons(numberOfButtons);
            Game.totalBtns = Game.btns.length;
            Game.orderCount = 0;
            Game.endGame = false;

            setTimeout(() => {
                Game.makeMove(Game.btns); 
                Game.hideNum(Game.btns);
            }, Game.btns.length * 1000);
        }
    }

    static initButton() {
        const inputElement = document.getElementById("buttons"); 
        const input = parseInt(inputElement.value); 
        if (isNaN(input) || input < 3 || input > 7) {
            alert("Please enter a valid number between 3 and 7.");
            return null;
        }
        return input;
    }

    static createButtons(numberOfButtons) {
        const container = document.getElementById('buttonContainer');
        container.innerHTML = ''; 
        let buttons = [];
        for (let i = 0; i < numberOfButtons; i++) {
            let button = new Button(Color.getRandomColor(), "100px", "50px", "0px", `${i * 110}px`, i);
            buttons.push(button);
        }
        return buttons; 
    }

    static checkOrder(clickedButton) {
        if (!Game.endGame) {
            if (clickedButton.order === Game.orderCount + 1) {
                clickedButton.btn.textContent = clickedButton.order; // Reveal the number
                Game.orderCount++;
                if (Game.orderCount === Game.totalBtns) {
                    alert("Excellent memory!");
                    Game.endGame = true;
                }
            } else {
                Game.endGame = true;
                Game.showNum(Game.btns);
                alert("Wrong order!");
            }
        } else {
            console.log("Game has ended");
        }
    }

    static makeMove(btns){
        const tmp = Game.createArray(btns.length)
        
        let counter = 0
        const intervalId = setInterval(() =>{
            if (counter < btns.length) {
                Game.shuffleArray(tmp);
                counter++;  // Increment the number
                //r g b y
                for (let i = 0; i < btns.length; i++) {
                    // 0*110  --> 3*110
                    // 1*110  --> 2*110
                    btns[i].setLocation(
                        (tmp[i]*60) + 'px',
                        Math.floor(Math.random()*100) + 'px'
                    );
                }
            }else {
                clearInterval(intervalId); 
            }
        }, 2000)
    }

    static createArray(n) {
        let array = [];
        for (let i = 0; i < n; i++) {
            array.push(i);
        }
        return array;
    }

    // [0,1,2,3] --> 0*110 1*110px 2*110px 3*110px   [3,2,0,1]  --> []
    //  r g b y
    static shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            // Generate a random index from 0 to i
            const j = Math.floor(Math.random() * (i + 1));
            // Swap elements at indices i and j
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    static hideNum(btns) {
        btns.forEach(button => {
            button.btn.textContent = '';  
            button.btn.disabled = false; 
        });
    }

    static showNum(btns) {
        btns.forEach(button => {
            button.btn.textContent = button.order;
        });
    }
}

document.getElementById("submit").addEventListener("click", Game.init);