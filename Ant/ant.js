let canvas = document.getElementById('canvas');
canvas.width = 1000;
canvas.height = 600;
let context = canvas.getContext('2d');

// Setting up variables for the algorithm
let numAnts = 10;
let numIterations;
let evaporationRate = 0.5;
let pheromoneMatrix = [];
let Alpha = 1;
let Beta = 2;
let q = 100;
let initialPheromone = 5;
let distances;
let points = [];