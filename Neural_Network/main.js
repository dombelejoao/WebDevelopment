var canvas;
var Drawing = false;
var canvas = document.querySelector("canvas");
canvas.width = 500;
canvas.height = 500;
var ctx = canvas.getContext("2d");
var X = 0;
var offsetX = 0;
var Y = 0;
var offsetY = 0;
var paths = []; // recording paths
const color = "black";
var lineWidth = 20;
var pixeling = false;


function pencil() {
    pixeling = true; 
    canvas.addEventListener("mousedown", startPos);
    canvas.addEventListener("mouseup", endPos);
    canvas.addEventListener("mousemove", drawPencil);

}


function brush() {
    canvas.removeEventListener("mousedown", startPos);
    canvas.removeEventListener("mouseup", endPos);
    canvas.removeEventListener("mousemove", drawPencil);
    pixeling = false;

    canvas.addEventListener("mousemove", function (e) {
        findxy('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findxy('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findxy('out', e)
    }, false);

}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("number").innerHTML = "";
}

function startPos(e) {
    Drawing = true;
    X = e.pageX - canvas.offsetLeft;
    Y = e.pageY - canvas.offsetTop;
    var i = Math.floor(X / 10) * 10;
    var j = Math.floor(Y / 10) * 10;
    drawRec(i, j);

}

// it sets the drawing state to false "when the mouse is lifted up"
function endPos() {
    Drawing = false;
}


// It checks if the drawing state is true and then calculates the X and Y positions of the mouse within the canvas
// It then passes those positions to the drawRec function
function drawPencil(e) {
    if (!Drawing) return;

    X = e.pageX - canvas.offsetLeft;
    Y = e.pageY - canvas.offsetTop;


    var i = Math.floor(X / 10) * 10;
    var j = Math.floor(Y / 10) * 10;

    drawRec(i, j);
}



function drawRec(x, y) {
    ctx.fillStyle = "black";

    ctx.beginPath();
    ctx.rect(x, y, 20, 20);
    ctx.fill();
}


//When res is equal to 'move', findxy checks if the drawing state is true
// If it is, findxy sets the previous X and Y positions to the starting X and Y positions 
// then calculates the new starting X and Y positions of the mouse within the canvas 
//It updates the currPath variable in the paths array with the new X and Y positions 
// then passes the previous and current X and Y positions to the draw function

function findxy(res, e) {
    if (pixeling == false) {
        if (res == 'down') {
            if (e.pageX != undefined && e.pageY != undefined) {
                X = e.pageX - canvas.offsetLeft;
                Y = e.pageY - canvas.offsetTop;
            } else {
                X = e.clientX + document.body.scrollLeft
                    + document.documentElement.scrollLeft
                    - canvas.offsetLeft;
                    Y = e.clientY + document.body.scrollTop
                    + document.documentElement.scrollTop
                    - canvas.offsetTop;
            }
            //draw a circle
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.arc(X, Y, lineWidth / 2, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.closePath();
            ctx.fill();

            paths.push([[X], [Y]]);
            Drawing = true;
        }
        if (res == 'up' || res == "out") {
            Drawing = false;
        }

        if (res == 'move') {
            if (Drawing) {
                // draw a line to previous point
                offsetX = X;
                offsetY = Y;
                if (e.pageX != undefined && e.pageY != undefined) {
                    X = e.pageX - canvas.offsetLeft;
                    Y = e.pageY - canvas.offsetTop;
                    
                } else {
                    X = e.clientX + document.body.scrollLeft
                        + document.documentElement.scrollLeft
                        - canvas.offsetLeft;
                        Y = e.clientY + document.body.scrollTop
                        + document.documentElement.scrollTop
                        - canvas.offsetTop;
                }
                currPath = paths[paths.length - 1];
                currPath[0].push(X);
                currPath[1].push(Y);
                paths[paths.length - 1] = currPath;
                draw(ctx, color, lineWidth, offsetX, offsetY, X, Y);
            }
        }
    }
}

function draw(ctx, color, lineWidth, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}
