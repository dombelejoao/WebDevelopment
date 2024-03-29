// wIH (weights between input and hidden layer)
//biasH (biases of the hidden layer)
//wHO (weights between hidden layer and output)
//biasO  (biases of the output layer) as arguments
function nn(data, wIH, biasH, wHO, biasO) {
    // compute layer2 output
    var out2 = [];

    for (var i = 0; i < wIH.length; i++) {

        out2[i] = biasH[i];

        for (var j = 0; j < wIH[i].length; j++) {
            out2[i] += data[j] * wIH[i][j];
        }

        out2[i] = 1 / (1 + Math.exp(-out2[i]));
    }

    //compute layer3 activation
    var out3 = [];

    for (var i = 0; i < wHO.length; i++) {

        out3[i] = biasO[i];

        for (var j = 0; j < wHO[i].length; j++) {
            out3[i] += out2[j] * wHO[i][j];
        }
    }

    // compute layer3 output
    var max3 = out3.reduce(function (p, c) {
        return Math.max(p, c);
    });
    var nominators = out3.map(function (e) {
        return Math.exp(e - max3);
    });
    var denominator = nominators.reduce(function (p, c) {
        return p + c;
    });
    var output = nominators.map(function (e) {
        return e / denominator;
    });

    return output;
}

// It computes the bounding rectangle of the digit defined by the above-threshold surrounding.
// It iterates over each pixel of the image and finds the minimum and maximum x and y coordinates that contain the digit.
function getBoundingRectangle(img, threshold) {
    var rows = img.length;
    var columns = img[0].length;
    var minX = columns;
    var minY = rows;
    var maxX = -1;
    var maxY = -1;
    for (var y = 0; y < rows; y++) {
        for (var x = 0; x < columns; x++) {
            if (img[y][x] < threshold) {
                if (minX > x) minX = x;
                if (maxX < x) maxX = x;
                if (minY > y) minY = y;
                if (maxY < y) maxY = y;
            }
        }
    }

    return {
        minY: minY,
        minX: minX,
        maxY: maxY,
        maxX: maxX
    };
}
// Here it computes the center of mass of the digit in the image for centering purposes. 
// It takes in a grayscale image represented as a 2D array img and calculates the mean x and y coordinates weighted by the pixel intensity. 
function centerImage(img) {
    var meanX = 0;
    var meanY = 0;
    var rows = img.length;
    var columns = img[0].length;
    var sumPixels = 0;

    for (var y = 0; y < rows; y++) {
        for (var x = 0; x < columns; x++) {
            var pixel = (1 - img[y][x]);
            sumPixels += pixel;
            meanY += y * pixel;
            meanX += x * pixel;
        }
    }

    meanX /= sumPixels;
    meanY /= sumPixels;

    var dY = Math.round(rows / 2 - meanY);
    var dX = Math.round(columns / 2 - meanX);

    return {
        transX: dX,
        transY: dY
    };
}

//converts an RGBA image (represented as imgData, which is an object containing pixel data) to a grayscale image represented as a 2D array. 
//It iterates over each pixel in the image and normalizes it to the range [0, 1]. 

function imageToGrayscale(imgData) {

    var grayscaleImg = [];

    for (var y = 0; y < imgData.height; y++) {

        grayscaleImg[y] = [];

        for (var x = 0; x < imgData.width; x++) {

            var offset = y * 4 * imgData.width + 4 * x;
            var alpha = imgData.data[offset + 3];

            if (alpha == 0) {
                imgData.data[offset] = 255;
                imgData.data[offset + 1] = 255;
                imgData.data[offset + 2] = 255;
            }

            imgData.data[offset + 3] = 255;

            grayscaleImg[y][x] = imgData.data[y * 4 * imgData.width + x * 4 + 0] / 255;
        }
    }
    return grayscaleImg;
}

function recognize() {
    //convert RGBA image to a grayscale array, then compute bounding rectangle and center of mass  
    var imgData = ctx.getImageData(0, 0, 500, 500);
    grayscaleImg = imageToGrayscale(imgData);
    var boundingRectangle = getBoundingRectangle(grayscaleImg, 0.01);
    var trans = centerImage(grayscaleImg);

    //copy image to hidden canvas, translate to center-of-mass, then
    //scale to fit into a 200x200 box
    var canvasCopy = document.createElement("canvas");
    canvasCopy.width = imgData.width;
    canvasCopy.height = imgData.height;

    var copyCtx = canvasCopy.getContext("2d");
    var brW = boundingRectangle.maxX + 1 - boundingRectangle.minX;
    var brH = boundingRectangle.maxY + 1 - boundingRectangle.minY;
    var scaling = 350 / Math.max(brW, brH);
    //scale
    copyCtx.translate(canvas.width / 2, canvas.height / 2);
    copyCtx.scale(scaling, scaling);
    copyCtx.translate(-canvas.width / 2, -canvas.height / 2);
    //translate to center of mass
    copyCtx.translate(trans.transX, trans.transY);
    //default take image from original canvas
    copyCtx.drawImage(ctx.canvas, 0, 0);


    //bin image into 18x18 blocks (giving a 28x28 image)
    imgData = copyCtx.getImageData(0, 0, 500, 500);
    grayscaleImg = imageToGrayscale(imgData);

    var nnInput = new Array(784);

    for (var y = 0; y < 28; y++) {
        for (var x = 0; x < 28; x++) {

            var mean = 0;

            for (var v = 0; v < 18; v++) {
                for (var h = 0; h < 18; h++) {
                    if (y * 18 + v <= 499 && x * 18 + h <= 499) {
                        mean += grayscaleImg[y * 18 + v][x * 18 + h];
                    }
                    //when pixel is out of bounds, duplicate last pixel
                    else {
                        mean += grayscaleImg[Math.min(499, y * 18 + v)][Math.min(499, x * 18 + h)];
                    }
                }
            }

            mean = (1 - mean / 400);                                   
            nnInput[x * 28 + y] = (mean - 0.5) / 0.5;
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(copyCtx.canvas, 0, 0);

    for (var y = 0; y < 28; y++) {
        for (var x = 0; x < 28; x++) {
            var block = ctx.getImageData(x * 18, y * 18, 18, 18);
            var newVal = 255 * (0.5 - nnInput[x * 28 + y] / 2);
            for (var i = 0; i < 4 * 18 * 18; i += 4) {
                block.data[i] = newVal;
                block.data[i + 1] = newVal;
                block.data[i + 2] = newVal;
                block.data[i + 3] = 255;
            }
            ctx.putImageData(block, x * 18, y * 18);
        }
    }

    //processing neural network
    var maxIndex = 0;
    var nnOutput = nn(nnInput, wIH, biasH, wHO, biasO);

    nnOutput.reduce(function (p, c, i) {
        if (p < c) {
            maxIndex = i;
            return c;
        }
        else {
            return p;
        }
    });

    document.getElementById("number").innerHTML = maxIndex;
}
