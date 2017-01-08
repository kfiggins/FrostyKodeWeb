$(document).ready(function() {
    // Declare Variables
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext("2d");
    var w = $("#canvas").width();
    var h = $("#canvas").height();
    var cw = 10;
    var d;
    var food;
    var score;
    var snake_array;

    // Pause, Restart and Resume
    // Watch keys
    $(document).keydown(function(e) {
            var key = e.which;
            if (key == "32") {
                pause();
            } else if (key == "80") {
                play();
            } else if (key == "82") {
                init();
                play();
            }
        })
        // Play function
    function play() {
        if (typeof Game_Interval != "undefined")
            clearInterval(Game_Interval);
        Game_Interval = setInterval(paint, 60);
        allowPressKeys = true;
    }
    // Pause function
    function pause() {
        clearInterval(Game_Interval);
        allowPressKeys = false;
    }

    function init() {
        d = "right"; //default direction
        play();
        create_snake(); //get that snake
        create_food(); //now we can see the food
        score = 0;
    }
    init();

    // make that snake
    function create_snake() {
        var length = 5; //length of snake
        snake_array = []; //Empty array to start with
        for (var i = length - 1; i >= 0; i--) {
            //This will create a horizontal snake starting from top left
            snake_array.push({
                x: i, //this is along x axis
                y: 0 // along y axis, 0 is the top
            });
        }
    }
    //Create the food. Create x/y between 0-49.
    //There are 50 (500/10) positions across the rows and columns
    // cw is a variable = to 10
    function create_food() {
        food = {
            x: Math.round(Math.random() * (w - 20) / cw),
            y: Math.round(Math.random() * (h - 20) / cw)
        };
    }

    //Painting the canvas
    function paint() {
        // paint canvas
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "white";
        ctx.strokeRect(0, 0, w, h);
        //The movement code
        //?? what is .x and .y?
        var nx = snake_array[0].x;
        var ny = snake_array[0].y;
        //These were the position of the head cell.
        if (d == "right") {
            nx++;
        } else if (d == "left") {
            nx--;
        } else if (d == "up") {
            ny--;
        } else if (d == "down") {
            ny++;
        }
        // going from one side of box to the other
        if (nx == -1) {
            nx = w / cw - 1;
        } else if (nx == w / cw) {
            nx = 0;
        }

        if (ny == -1) {
            ny = h / cw - 1;
        } else if (ny == h / cw) {
            ny = 0;
        }

        if (check_collsion(nx, ny, snake_array)) {
            //restart game
            alert("Game over! Your score is " + score);
            init();
            play();
            return;
        }

        if (nx == food.x && ny == food.y) {
            var tail = {
                x: nx,
                y: ny
            };
            score++;
            //Create new food
            create_food();
        } else {
            var tail = snake_array.pop(); //pops out the last cell
            tail.x = nx;
            tail.y = ny;
        }
        //The snake can now eat the food
        snake_array.unshift(tail);
        //puts back the tail as the first check_collsion
        for (var i = 0; i < snake_array.length; i++) {
            var c = snake_array[i];
            paint_cell(c.x, c.y);
        }
        //Paint food
        paint_cell_food(food.x, food.y);
        //Lets paint the score
        var score_text = "Score: " + score;
        ctx.fillText(score_text, 5, h - 5);
    }

    function paint_cell(x, y) {
        ctx.fillStyle = getRandomColor();
        ctx.fillRect(x * cw, y * cw, cw, cw);
        ctx.strokeStyle = "black";
        ctx.strokeRect(x * cw, y * cw, cw, cw);
    }

    function paint_cell_food(x, y) {
        ctx.fillStyle = "orange";
        ctx.fillRect(x * cw, y * cw, cw, cw);
        ctx.strokeStyle = "white";
        ctx.strokeRect(x * cw, y * cw, cw, cw);
    }

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function check_collsion(x, y, array) {
        //This function will check if the provided x/y coordinates exist in an array of cells or not
        for (var i = 0; i < array.length; i++) {
            if (array[i].x == x && array[i].y == y)
                return true;
        }
        return false;
    }

    //Keyboard controls
    $(document).keydown(function(e) {
        var key = e.which;
        //We will add another clause to prevent reverse gear
        if (key == "37" && d != "right") {
            d = "left";
        } else if (key == "38" && d != "down") {
            d = "up";
        } else if (key == "39" && d != "left") {
            d = "right";
        } else if (key == "40" && d != "up") {
            d = "down";
        }
    })


})
