var mode = 0;

let splash;
let splashShowing = true; // 初始时显示 splash

//导入角色图像与创建角色
  let imgV1, imgG1, imgD1, imgB1;
  let imgV2, imgG2, imgD2, imgB2;
  let imgV3, imgG3, imgD3, imgB3;
  let vocal, guitar, drum, bass;

//角色摇摆控制
  //喜多与虹夏
  let counterA = 0;
  let directionA = 1;
  //波奇与凉
  let counterB = 0;
  let directionB = -1; 

//导入歌曲


  let songs = {
    A:{
      vocal: null,
      guitar: null,
      drum: null,
      bass: null,
      others: null
    },
    B:{
      vocal: null,
      guitar: null,
      drum: null,
      bass: null,
      others: null
    },
    E:{
      vocal: null,
      guitar: null,
      drum: null,
      bass: null,
      others: null
    }
  }

let currentSongKey = "A"; // 当前播放的歌曲

//others是否播放
  let track=0;

//背景选择
  let BG;
  let reverb;
  let RT=0;
  let DR=0;
  let change=0;
  let isWallpaperChanged = false;
//全屏播放音乐
  let audioStarted = false;

function preload() {
  
  //定义角色图像
  
  imgV1 = loadImage('Ikuyo/I1.png');
  imgG1 = loadImage('Bocchi/B1.png');
  imgD1 = loadImage('Nijika/N1.png');
  imgB1 = loadImage('Ryo/R1.png');
  
  imgV2 = loadImage('Ikuyo/I2.png');
  imgG2 = loadImage('Bocchi/B2.png');
  imgD2 = loadImage('Nijika/N2.png');
  imgB2 = loadImage('Ryo/R2.png');
  
  imgV3 = loadImage('Ikuyo/I4.png');
  imgG3 = loadImage('Bocchi/B3.png');
  imgD3 = loadImage('Nijika/N3.png');
  imgB3 = loadImage('Ryo/R3.png');
  
  //定义背景图像
  
  WP1=loadImage('BG/WallPaper1.png');
  WP2=loadImage('BG/WallPaper2.png');
  FriedBergHall=loadImage('BG/FriedBergHallBG.png');
  Studio=loadImage('BG/Studio.png');
  OuterHarbor=loadImage('BG/OuterHarbor.png');
  sea=loadSound('BG/Sea.mp3');
  
  //歌曲1
  songs.A.vocal = loadSound('song1/1Vocal.mp3');
  songs.A.guitar = loadSound('song1/1Guitar.mp3');
  songs.A.drum = loadSound('song1/1Drum.mp3');
  songs.A.bass = loadSound('song1/1Bass.mp3');
  songs.A.others=loadSound('song1/1Others.mp3');
  
  songs.B.vocal = loadSound('song2/2Vocal.mp3');
  songs.B.guitar = loadSound('song2/2Guitar.mp3');
  songs.B.drum = loadSound('song2/2Drum.mp3');
  songs.B.bass = loadSound('song2/2Bass.mp3');
  songs.B.others=loadSound('song2/2Others.mp3');

  //歌曲5
  
  songs.E.vocal = loadSound('songD/DVocal.mp3');
  songs.E.guitar = loadSound('songD/DGuitar.mp3');
  songs.E.drum = loadSound('songD/DDrum.mp3');
  songs.E.bass = loadSound('songD/DBass.mp3');
  songs.E.others=loadSound('songD/DOthers.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  splash = new Splash();
  
  amp=new p5.Amplitude();
  
  fft=new p5.FFT();
  reverb=new p5.Reverb(RT,DR);
  
  imageMode(CENTER);
  angleMode(DEGREES);
  
  vocal= {
    name: 'vocal',
    img1: imgV1,
    img2: imgV2,
    img3: imgV3,
    x: width*1/5-30,
    y: height/1.35,
    isShaking: true,
    angle: 0,
    size:0,
    fft: new p5.FFT(),
  };

  guitar= {
    name: 'guitar',
    img1: imgG1,
    img2: imgG2,
    img3: imgG3,
    x: width*2/5,
    y: height/1.4,
    isShaking: true,
    angle: 0,
    size:0,
    fft: new p5.FFT(),
  };

  drum= {
    name: 'drum',
    img1: imgD1,
    img2: imgD2,
    img3: imgD3,
    x: width*3/5+20,
    y: height/1.4,
    isShaking: true,
    angle: 0,
    size:0,
    fft: new p5.FFT(),
  };

  bass= {
    name: 'bass',
    img1: imgB1,
    img2: imgB2,
    img3: imgB3,
    x: width*4/5+30,
    y: height/1.35,
    isShaking: true,
    angle: 0,
    size:0,
    fft: new p5.FFT(),
  };
  BG=createSelect();
  BG.position(0,100);
  
  BG.option('WallPaper1','1');
  BG.option('WallPaper2','2');
  BG.option('FriedBurgerHall','3');
  BG.option('Studio','4');
  BG.option('OuterHarbor','5');
}

function drawCharacter(ch) {
  
  let currentImg;
  
  if (ch.isShaking) {
    if (ch.name === 'vocal' || ch.name === 'drum') {
      if(directionA==1){
        ch.angle=-5;
        currentImg = ch.img1;
      }else{
        ch.angle=5;
        currentImg = ch.img2;
      }
    } else {
      if(directionB==1){
        ch.angle=-5;
        currentImg = ch.img1;
      }else{
        ch.angle=5;
        currentImg = ch.img2;
      }
    }
  } else {
    ch.angle = 0;
    currentImg = ch.img3;
  }
  
  push();
  translate(ch.x, ch.y);
  rotate(ch.angle);
  
  let h = windowHeight / 3 + ch.size;
  let aspectRatio = currentImg.width / currentImg.height;
  let w = h * aspectRatio;
  
  let scaleFactor = 1;

  if (
    //currentImg === imgV3 ||
    currentImg === imgG3 ||
    currentImg === imgD3 ||
    currentImg === imgB3
  ) {
    scaleFactor = 4; // 根据你希望放大的倍数调整
  }

  // 3. 应用等比例放大后的尺寸
  image(currentImg, 0, 0, w * scaleFactor, h * scaleFactor);
  pop();
}

function draw(){
  background(200); // 黑色背景或你原有的背景

  if (splashShowing) {
    splash.show(); // 显示 splash 页面
  } else {
    // 渲染你的 3D 场景或主界面
  
  if (mouseIsPressed == true && splash.update() == true) {
    mode = 1;
  }
  
  if (mode == 1) {
    splash.hide();
    
    // your code here
    background(255);
    fill(100);
    noStroke();
    rect(50, 50, windowWidth - 100, windowHeight - 100);
    fill(0);
    ellipse(mouseX, mouseY, 20, 20);
  }
  
  //let spectrum = fft.analyze(); 
  vocal.fft.setInput(songs[currentSongKey].vocal);
  let volVocal = getVolume(vocal.fft);
  vocal.size = map(volVocal, 0, 255, 0, 100);
  
  guitar.fft.setInput(songs[currentSongKey].guitar);
  let volGuitar = getVolume(guitar.fft);
  guitar.size = map(volGuitar, 0, 255, 0, 100);
  
  drum.fft.setInput(songs[currentSongKey].drum);
  let volDrum = getVolume(drum.fft);
  drum.size = map(volDrum, 0, 255, 0, 100);
  
  bass.fft.setInput(songs[currentSongKey].bass);
  let volBass = getVolume(bass.fft);
  bass.size = map(volBass, 0, 255, 0, 100);
  
  let bg = BG.selected();
  
  if (bg == 1&&change!=bg) {
    bgImg = WP1;
    isWallpaperChanged = true;
    reverb.disconnect();
    reverb.process(songs[currentSongKey].vocal, 0.1,0.1);
    reverb.process(songs[currentSongKey].guitar,  0.1,0.1);
    reverb.process(songs[currentSongKey].drum,  0.1,0.1);
    reverb.process(songs[currentSongKey].bass,  0.1,0.1);
    reverb.connect();
    change=bg;
  }
  else if (bg == 2&&change!=bg) {
    bgImg = WP2;
    isWallpaperChanged = true;
    reverb.disconnect();
    reverb.process(songs[currentSongKey].vocal, 0.1,0.1);
    reverb.process(songs[currentSongKey].guitar,  0.1,0.1);
    reverb.process(songs[currentSongKey].drum,  0.1,0.1);
    reverb.process(songs[currentSongKey].bass,  0.1,0.1);
    reverb.connect();
    change=bg;
  }
  else if (bg == 3&&change!=bg) {
    bgImg = FriedBergHall;
    isWallpaperChanged = true;
    reverb.disconnect();
    reverb.process(songs[currentSongKey].vocal, 6,6);
    reverb.process(songs[currentSongKey].guitar, 6,6);
    reverb.process(songs[currentSongKey].drum, 6,6);
    reverb.process(songs[currentSongKey].bass, 6,6);
    reverb.connect();
    change=bg;
  }
  else if (bg == 4&&change!=bg) {
    bgImg = Studio;
    isWallpaperChanged = true;
    reverb.disconnect();
    reverb.process(songs[currentSongKey].vocal, 0.5,0.5);
    reverb.process(songs[currentSongKey].guitar, 0.5,0.5);
    reverb.process(songs[currentSongKey].drum, 0.5,0.5);
    reverb.process(songs[currentSongKey].bass, 0.5,0.5);
    reverb.connect();
    change=bg;
  }
  else if (bg == 5&&change!=bg) {
    bgImg = OuterHarbor;
    isWallpaperChanged = true;
    reverb.disconnect();
    reverb.process(songs[currentSongKey].vocal, 0.5,0.5);
    reverb.process(songs[currentSongKey].guitar, 0.5,0.5);
    reverb.process(songs[currentSongKey].drum, 0.5,0.5);
    reverb.process(songs[currentSongKey].bass, 0.5,0.5);
    reverb.connect();
    change=bg;
    sea.loop();
  }

  if (bgImg) {
    let aspectRatio = bgImg.width / bgImg.height;
    let h = height;
    let w = h * aspectRatio;

  if (w < width) {
    w = width;
    h = w / aspectRatio;
  }

  imageMode(CENTER);
  image(bgImg, width / 2, height / 2, w, h);
}

   // 始终更新摇摆计数器
  if (counterA >= 60) directionA = -1;
  if (counterA <= 0) directionA = 1;
  counterA += directionA;

  // 让B组始终与A组相反方向，同步计数
  counterB = counterA;
  directionB = -directionA;
  
  //柱状图
  
  /*let spectrum = fft.analyze(); 
  
  strokeWeight(4);
  let numBars=40; 
  let barWidth=width/numBars; // 600/40
  
  for (let i=0;i<numBars;i++) {
    let barHeight=spectrum[i*10]/255*height*0.3;
    fill(i*4,100-i*3,200-i*6);
    rect(i*barWidth, height-barHeight,barWidth,barHeight);
  }*/
  
  let targetSizeV = map(volVocal, 0, 255, -10, 10);
  vocal.size = lerp(vocal.size, targetSizeV, 0.1);
  
  let targetSizeG = map(volVocal, 0, 255, -10, 10);
  guitar.size = lerp(guitar.size, targetSizeG, 0.1);
  
  let targetSizeD = map(volDrum, 0, 255, -10, 10);
  drum.size = lerp(drum.size, targetSizeD, 0.1);
  
  let targetSizeB = map(volBass, 0, 255, -10, 10);
  bass.size = lerp(bass.size, targetSizeB, 0.1);

  drawCharacter(vocal);
  drawCharacter(guitar);
  drawCharacter(drum);
  drawCharacter(bass);

  updateVolume(vocal, songs[currentSongKey].vocal);
  updateVolume(guitar, songs[currentSongKey].guitar);
  updateVolume(drum, songs[currentSongKey].drum);
  updateVolume(bass, songs[currentSongKey].bass);
  
  push();
  
  //renderMainScene(); 
  }
}

function updateVolume(character, sound) {
  if (!sound) return; // 防止切歌后音轨还没加载报错

  if (character.isShaking) {
    sound.setVolume(1);
  } else {
    sound.setVolume(0);
  }
}

function getVolume(fft) {
  let spectrum = fft.analyze();
  let sum = 0;
  for (let i = 0; i < spectrum.length; i++) {
    sum += spectrum[i];
  }
  return sum / spectrum.length;
}

function mousePressed() {
  
  if (splashShowing && splash.update()) {
    splash.hide();
    splashShowing = false;
  }
  
  checkClick(vocal);
  checkClick(guitar);
  checkClick(drum);
  checkClick(bass);
  
   if (!audioStarted) {
      userStartAudio();
      audioStarted = true;
      playSong(currentSongKey);
    }
}

function checkClick(ch) {
  let d = dist(mouseX, mouseY, ch.x, ch.y);
  if (d < 80) {  // 点到角色图像区域就切换摇摆状态
    ch.isShaking = !ch.isShaking;
  }
}
  

function keyPressed() {
  if (key === "1") {
    playSong("A"); // 不提前修改 currentSongKey
  }
  if (key === "2") {
    playSong("B");
  }
  if (key === "3") {
    playSong("E");
  }
}

function playSong(songKey) {
  // 提前更新当前歌曲键
  let oldKey = currentSongKey;
  currentSongKey = songKey;

  // 停止老歌
  if (songs[oldKey].vocal && songs[oldKey].vocal.isPlaying()) {
    songs[oldKey].vocal.stop();
  }
  if (songs[oldKey].guitar && songs[oldKey].guitar.isPlaying()) {
    songs[oldKey].guitar.stop();
  }
  if (songs[oldKey].drum && songs[oldKey].drum.isPlaying()) {
    songs[oldKey].drum.stop();
  }
  if (songs[oldKey].bass && songs[oldKey].bass.isPlaying()) {
    songs[oldKey].bass.stop();
  }
  if (songs[oldKey].others && songs[oldKey].others.isPlaying()) {
    songs[oldKey].others.stop();
  }

  songs[songKey].others.loop();
  songs[songKey].others.setVolume(1);
  
   if (!songs[songKey].vocal.isPlaying()) {
    songs[songKey].vocal.loop();
    songs[songKey].vocal.setVolume(1);
  }

  if (!songs[songKey].guitar.isPlaying()) {
    songs[songKey].guitar.loop();
    songs[songKey].guitar.setVolume(1);
  }

  if (!songs[songKey].drum.isPlaying()) {
    songs[songKey].drum.loop();
    songs[songKey].drum.setVolume(1);
  }

  if (!songs[songKey].bass.isPlaying()) {
    songs[songKey].bass.loop();
    songs[songKey].bass.setVolume(1);
    
  } 
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // 更新角色位置，让她们始终居中分布
  vocal.x  = width * 1 / 5;
  guitar.x = width * 2 / 5;
  drum.x   = width * 3 / 5;
  bass.x   = width * 4 / 5;

  vocal.y = guitar.y = drum.y = bass.y = height / 2;
}