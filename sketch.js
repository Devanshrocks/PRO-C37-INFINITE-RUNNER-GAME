

//initiate Game STATEs
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOver, gameOverImg, restart, restartImg

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadImage("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

}

function setup() {
  createCanvas(displayWidth, displayHeight);
// createCanvas(600,200);
  trex = createSprite(50, height-20, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);

  trex.scale = 0.5;

  ground = createSprite(width/2,height-20, width , 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  invisibleGround = createSprite(width/3,height-10, width, 10);
  invisibleGround.visible = false;

  CloudsGroup = new Group();
  ObstaclesGroup = new Group();

  score = 0;

  //place gameOver and restart icon on the screen
  gameOver = createSprite(width/2, height-100);
  restart = createSprite(width/2, height-60);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  restart.addImage(restartImg);
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;

}

function draw() {
  background(180);

  text("Score: " + score, width-100, height-150);
  text("game developed by Devansh ", 50, height-150);
  if (gameState === PLAY) {

    score = score + Math.round(getFrameRate() / 60);

    ground.velocityX = -(6 + 3 * score / 100);



    if (keyDown("space") && trex.y >= height-41) {
      trex.velocityY = -12;
    }


    trex.velocityY = trex.velocityY + 0.8

    if (ground.x < 0) {
      ground.x = width / 2;
    }


    spawnClouds();
    spawnObstacles();

    //End the game when trex is touching the obstacle
    if (ObstaclesGroup.isTouching(trex)) {
      //    playSound("jump.mp3");
      gameState = END;
      //     playSound("die.mp3");
    }

  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);

    //change the trex animation
    trex.changeAnimation("collided", trex_collided);

    //set lifetime of the game objects so that they are never destroyed
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);


  }

  if (mousePressedOver(restart)) {
    reset();
  }

  trex.collide(invisibleGround);

  drawSprites();

}

function reset() {
  gameState = PLAY;

  gameOver.visible = false;
  restart.visible = false;

  ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();

  trex.changeAnimation("running", trex_running);

  if (localStorage["HighestScore"] < score) {
    localStorage["HighestScore"] = score
  }
  score = 0;

}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite( width, height-80, 40, 10);
    cloud.y = Math.round(random(height-120, height-80));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = (-1) * (width/cloud.velocityX) ;


    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    CloudsGroup.add(cloud);
  }

}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(width,height-35, 10, 40);
    obstacle.velocityX = -(6 + 3 * score / 100);

    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1: obstacle.addImage(obstacle1);
        break;
      case 2: obstacle.addImage(obstacle2);
        break;
      case 3: obstacle.addImage(obstacle3);
        break;
      case 4: obstacle.addImage(obstacle4);
        break;
      case 5: obstacle.addImage(obstacle5);
        break;
      case 6: obstacle.addImage(obstacle6);
        break;
      default: break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = (-1) * (width/obstacle.velocityX) ;


    if (obstaclesGroup !== undefined) {
      var index = 0
      var y = 0;
      var x;
      for (var obs in obstaclesGroup) {
        index = index + 1;
        obstaclesGroup[index - 1].x = x
        obstaclesGroup[index - 1].y = y
        if (index === trex.index) {
          camera.position.x = obstaclesGroup[index - 1].x;
          camera.position.y = displayWidth / 2
        }
        y = y + 50;
        x = displayHeight - obstaclesGroup[obs].distance;

      }
    }




    //add each obstacle to the group
    ObstaclesGroup.add(obstacle);
  }
}