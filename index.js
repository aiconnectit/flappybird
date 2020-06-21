
var birdgame = {
  
    skyposition:100,
    skystep:2,
    birdTop:220,
    birdposition:100,
    birdstep:80,
    birdStepY:0,
    startFlag:false,
    startcolor:'blue',
    score:0,

    minTop:0, //最小值
    maxTop:570, //最大值

    pipeLength:7, //创建柱子的个数
    pipeArr:[], //创建一个数组让后将每一对柱子的对象放进去
    pipeLastIndex:6,

   init:function(){
     this.initData();
     this.animaate();
     this.handle();
     this.getsession();
   },
   //初始化所有选择到的DOM元素
   initData:function(){
      this.el = document.getElementById('game');
      this.obird = this.el.getElementsByClassName('bird')[0]; 
      this.ostart = this.el.getElementsByClassName('start')[0];
      this.oscore = this.el.getElementsByClassName('score')[0];
      this.oend = this.el.getElementsByClassName('end')[0];
      this.omask = this.el.getElementsByClassName('mask')[0];
      this.ofinalscore = this.el.getElementsByClassName('final-score')[0];
      this.orankList = this.el.getElementsByClassName('rank-list')[0];
      this.orestart = this.el.getElementsByClassName('restart')[0];

      this.scoreArr  = this.getScore();
      
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
            self.pipeMove();
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
      this.addScore();
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
   judgePipe:function(){
       //pipex = 95 pipex =13 柱子在13~95这个区域相遇
       
       var index = this.score % this.pipeLength;
       var pipeX = this.pipeArr[index].up.offsetLeft;
       var pipeY = this.pipeArr[index].y;
      
       var birdY = this.birdTop;

       if((pipeX <= 95 && pipeX >= 13)&&(birdY <= pipeY[0] || birdY >= pipeY[1])){
         
         this.failGame();
  
       }
        
   },
   
    //添加分数
    addScore:function(){
      var index = this.score % this.pipeLength;
      var pipeX = this.pipeArr[index].up.offsetLeft; //当小鸟离开柱子的时候就让分数加一

      if(pipeX < 13){
        
        this.oscore.innerText = ++this.score;
      }

    },
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
     this.handleCloick();
     this.handleRestart();
   },

   //点击开始游戏执行事件
   handleStart:function(){
      
      this.ostart.onclick = this.playgame.bind(this);
   },

   playgame:function(){
       
      this.startFlag = true;
      this.obird.style.left = '80px'; 
      this.obird.style.transition = 'none'; 
      this.ostart.style.display = 'none';
      this.oscore.style.display = 'block';
      this.skystep = 5;
      for(var i=0;i< this.pipeLength;i++)
      {
        this.createPipe((i+1)*300); //这条语句是去创建出pipeLength对柱子
      }
      
  },

  handleRestart:function(){
    this.orestart.onclick = function(){
       sessionStorage.setItem('play',true);
        window.location.reload();
    }
    
  },

  getsession:function(){
    if(sessionStorage.getItem('play')){
        this.playgame();
    }
  },
    //生成柱子
  createPipe:function(x){
      /* 观察得出条件
       * 1、上下两个柱子的空隙为150px，
       * 2、上下两个柱子的高度是随机的，界面的高度为：600px 600px - 150 =  450 450px 由一对柱子平分，就得出一个柱子的最大高度为225，所以可以使用随机数生成0~225px高度的柱子
       * 3、由于柱子不能小于50像素，不然柱子都看不见了，所以柱子的最低高度应该为50px，然而最高就应该减小个50px所以柱子的高度在50~175
       */
      
      var pipeHeight = this.getPipeHeight();
      var upHeight = pipeHeight.up;
      var downHeight = pipeHeight.down;
  
       var oUpPipe = createEle('div',['pipe','pipe-up'] , {
         height:upHeight+'px',
         left: x+'px'
        });
       
       var oDownPipe = createEle('div',['pipe','pipe-buttom'],{
         height:downHeight+'px',
         left:x+'px'
        });
      
       this.el.appendChild(oUpPipe);
       this.el.appendChild(oDownPipe);

     // 将创建出的柱子信息放到数组里面，以便下次用来移动每一对柱子
      this.pipeArr.push({
          up:oUpPipe,
          down:oDownPipe,
          y:[upHeight,upHeight + 150]
      })

    },

    //让柱子移动
   pipeMove:function(){
    //让创建出的7个柱子去移动
    for(var i=0;i< this.pipeLength;i++)
    {
      //循环一次就能往pipeArr这个数组里面添加一对柱子
      var oUpPipe = this.pipeArr[i].up;
      var oDownPipe = this.pipeArr[i].down;

      //oUpPipe.offsetLeft 取到当前元素的left的值，这个取出来的值就是一个单纯的数字，
      var x = oUpPipe.offsetLeft - this.skystep;
      //由于主子的移动速度需要同天空移动的速度是一样的，所以应该让柱子当前的位置减去的值和天空减去的值是一样的

      if(x < -52){
        var lastPipeLast = this.pipeArr[this.pipeLastIndex].up.offsetLeft;
        var pipeHeight = this.getPipeHeight();
        var upHeight = pipeHeight.up;
        var downHeight = pipeHeight.down;
   
        //下面两句可以让柱子的高度在循环一圈之后重新改变柱子的高度，这里封装了一个函数在获取柱子的高度
        oUpPipe.style.height = upHeight + 'px';
        oDownPipe.style.height = downHeight + 'px';

        oUpPipe.style.left = lastPipeLast + 300 + 'px';
        oDownPipe.style.left = lastPipeLast+ 300 + 'px';
        this.pipeLastIndex = ++this.pipeLastIndex % this.pipeLength;
        
        continue;
      }
      oUpPipe.style.left = x +'px';
      oDownPipe.style.left = x +'px';
     
    }
    
   },

   //获取柱子的高度
   getPipeHeight:function(){

      var upHeight = 50 + Math.floor(Math.random()*175);
      var downHeight = 600 - 150 - upHeight;

      return {
        up:upHeight,
        down:downHeight,
      }
   },

   handleCloick:function(){
      var self = this;
       this.el.onclick = function(e){
        //  e.target 可是找到点击的那个元素是什么
        // classList 能够获取到一个元素的类名的类表 有三个方法，remove ,add , contains ,然后contains('state')这个方法可以判断点击的那个元素是否是括号里面的那个元素

        //  console.log(e.target.classList.contains('start')) 调试用
          
          if(!e.target.classList.contains('start'))
          {
            self.birdStepY =  -10;
          }
          
       }
   },

   getScore:function(){
    var scoreArr = getLocal('score');//键值不存在，值为空
   
    return scoreArr ? scoreArr : [];
   },

   setScore:function(){
      this.scoreArr.push({
        score:this.score,
        time:this.getDate(),
      })

      this.scoreArr.sort(function(a,b){
        return b.score-a.score;
      })
      setLocal('score',this.scoreArr);
      // console.log(this.scoreArr);
   },

   getDate:function(){

      var d = new Date();
      var yer = formatNum(d.getFullYear());
      var month = formatNum(d.getMonth()+1);
      var day = formatNum(d.getDate());
      var hour = formatNum(d.getHours());
      var minute = formatNum(d.getMinutes());
      var second = formatNum(d.getSeconds());

      return `${yer}.${month}.${day} ${hour}:${minute}:${second}`;

   },
  //边界碰撞到了就结束游戏
   failGame:function(){

     clearInterval(this.time);
     this.setScore();
     this.oend.style.display = 'block';
     this.omask.style.display = 'block';
     this.obird.style.display = 'none';
     this.oscore.style.display = 'none';
     this.ofinalscore.innerText = this.score;
     this.renderRankList();
   },

   //渲染数据到页面
   renderRankList:function(){
     //innerHTML = '<div></div>'
       var template ='';
       for(var i = 0;i<this.scoreArr.length;i++)
       {
         if( i < 8)
         {
            degreeClass = '';
          switch(i+1){
            case 1: degreeClass = 'first';
            break;

            case 2: degreeClass = 'secound';
            break;

            case 3: degreeClass = 'third';
            break;
          }

          template += ` <li class="rank-item">
              <span class="rank-degree ${degreeClass}">${i+1}</span>
              <span class="rank-score">${this.scoreArr[i].score}</span>
              <span class="rank-time">${this.scoreArr[i].time}</span>
          </li>`
         }
         
       }

      this.orankList.innerHTML = template;
   }
 
  
}