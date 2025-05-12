class Splash {

 constructor() {
   
  this.splashBorder = 100;
  
  this.title = createDiv("Bocchi the Rock");
  this.title.style('color:deeppink');
  this.title.style('font-family: Arial, Helvetica, sans-serif');
  this.title.position(this.splashBorder+20, this.splashBorder+20);
  
  this.name = createDiv("Ab");
  this.name.position(this.splashBorder+20, this.splashBorder+60);
  
  this.info = createDiv("Hi. Welcome to my project. It this project, characters in <Bocchi the Rock> will play some songs. <p>You can: 1. Press 1, 2, or 3 to change song. <p>2. Click on the characters to make them stop/start playing. <p>3. Change the playing location and experience some cool effects. Enjoy!");
  
  this.info.position(this.splashBorder+20, this.splashBorder+100);
  this.info.size(windowWidth-this.splashBorder*2-50, windowHeight-this.splashBorder*2-50)
   

  
}
  
  show() {
    push();
    // 2D模式，确保能画矩形而不被3D摄像头影响
    fill(255); // 白色背景
    stroke(255, 0, 0);
    strokeWeight(1);
    rect(this.splashBorder, this.splashBorder, windowWidth - this.splashBorder * 2, windowHeight - this.splashBorder * 2);

    strokeWeight(3);
    stroke(0, 0, 222);
    line(windowWidth - this.splashBorder - 40, this.splashBorder + 20, windowWidth - this.splashBorder - 20, this.splashBorder + 40);
    line(windowWidth - this.splashBorder - 20, this.splashBorder + 20, windowWidth - this.splashBorder - 40, this.splashBorder + 40);

    pop();
  }
  
  
  update() {
    if (
      mouseX > windowWidth - this.splashBorder - 40 &&
      mouseX < windowWidth - this.splashBorder - 20 &&
      mouseY < this.splashBorder + 40 &&
      mouseY > this.splashBorder + 20
    ) {
      return true;
    }
    return false;
  }

  hide() {
    this.title.remove();
    this.name.remove();
    this.info.remove();
  }
}