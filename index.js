
var birdgame = {
  
    skyposition:100,
    skystep:2,
    birdTop:220,
    birdposition:100,
    birdstep:80,
    birdStepY:0,
    startFlag:false,
    startcolor:'blue',

    minTop:0, //最小值
    maxTop:570, //最大值

   init:function(){
     this.initData();
     this.animaate();
     this.handle();
   },
   //初始化所有选择到的DOM元素
   initData:function(){
      this.el = document.getElementById('game');
      this.obird = this.el.getElementsByClassName('bird')[0]; 
      this.ostart = this.el.getElementsByClassName('start')[0];
      this.oscore = this.el.getElementsByClassName('score')[0];
      this.oend = this.el.getElementsByClassName('end')[0];
      this.omask = this.el.getElementsByClassName('mask')[0];

   },

   //动画定时器函数集中处理
   animaate:function(){
    var self = this;
    var count = 0;
    this.time = setInterval(function (){
         self.skymove(); 
         if(self.startFlag)
         {
           self.birdDrop();
         }
         if(++count %10 ===0){
             if(!self.startFlag)
             {
               self.startBount();
               self.birdJump(); 
             }
             self.birdFlay(count); 
            
         }
        
     },30)
   },
   skymove:function(){
       this.skyposition -= this.skystep;
       this.el.style.backgroundPositionX =  this.skyposition +'px';

   },

   birdJump:function(){
      
     this.birdTop = this.birdTop === 220 ? 260 : 220;
     this.obird.style.top = this.birdTop +'px';
       
   
   },

   //小鸟蹦跶的过程
   birdFlay:function (count) {
       this.obird.style.backgroundPositionX = count % 3 * -30 +'px';
   },
   
   birdDrop:function(){
      this.birdTop += ++this.birdStepY;
      this.obird.style.top =  this.birdTop + 'px';
      this.jugdgeKnock();
   },
    
   //碰撞检测函数执行
   jugdgeKnock:function(){
      this.judgeBoundary();
      this.judgePipe();
   },
   
   //进行边界碰撞检测
   judgeBoundary:function(){
      if(this.birdTop< this.minTop || this.birdTop>this.maxTop){
         this.failGame();

      }
     
   },

   //进行柱子碰撞检测
   judgePipe:function(){},


   //开始文字的放大缩小效果
   startBount:function(){

      var provercolor = this.starecolor;
   
      this.starecolor = provercolor=== 'blue'? 'white' : 'blue';

      this.ostart.classList.remove('start-'+provercolor);
      this.ostart.classList.add('start-'+  this.starecolor);
   
   },

   //监听事件
   handle:function(){
     this.handleStart();
     
   },

   //点击开始游戏执行事件
   handleStart:function(){
       var self = this;
      this.ostart.onclick = function(){
        self.startFlag = true;
        self.obird.style.left = '80px'; 
        self.ostart.style.display = 'none';
        self.oscore.style.display = 'block';
        self.skystep = 5;
        
    }
   },

   failGame:function(){

     clearInterval(this.time);
     this.oend.style.display = 'block';
     this.omask.style.display = 'block';
     this.obird.style.display = 'none';
     this.oscore.style.display = 'none';
   },
   

}