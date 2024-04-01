//changes color of cells according to their state
function drawRec(x, y, state) {
    ctx.fillStyle = state;
    ctx.strokeStyle = "white";
    ctx.lineWidth = 0.5;

    ctx.beginPath();
    ctx.rect(x * cellSide, y * cellSide, cellSide, cellSide);
    ctx.fill();
    ctx.stroke();
}

//animates cells changing colors
function drawAnimation(x, y, state) {

    time += 5;
    k++;

    timeoutID[k] = setTimeout(function () {
        ctx.fillStyle = state;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 0.5;

        ctx.beginPath();
        ctx.rect(x * cellSide, y * cellSide, cellSide, cellSide);
        ctx.fill();
        ctx.stroke();

    }, time);
}

//draws end position flag
function drawFlag(x, y) {

    var white = 0;
    ctx.fillStyle = "#000000";

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 7; j++) {

            if (white == 0) {
                ctx.fillStyle = "#000000";
                white = 1;
            }

            else if (white == 1) {
                ctx.fillStyle = "#FFFFFF";
                white = 0;
            }

            ctx.beginPath();
            ctx.rect(x * cellSide + (cellSide / 5 * i), y * cellSide + (cellSide / 7 * j), cellSide / 5, cellSide / 7);
            ctx.fill();
        }
    }
}

//clears path created by algorithm
function clearPath() {

    for (let i = 0; i <= k; i++) {
        clearTimeout(timeoutID[i]);
    }

    for (let i = 0; i <= l; i++) {
        clearTimeout(timeoutPathID[i]);
    }

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {

            if (ar[i][j] == 0) {
                drawRec(i, j, "black");
            }

            else{
                drawRec(i, j, "#808080");
            }
        }
    }

    drawRec(startx, starty, "red");
    drawFlag(endx, endy);

    const button = document.getElementById("clearPath");
    button.disabled = true;


}

//clears all walls
function clearWalls() {

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (ar[i][j] = 1 && ((i != startx || j != starty) && (i != endx || j != endy))) {
                ar[i][j] = 0;
                drawRec(i, j, "black");
            }
        }
    }

    drawRec(startx, starty, "red");
    drawFlag(endx, endy);
}