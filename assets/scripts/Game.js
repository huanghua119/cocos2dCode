cc.Class({
    extends: cc.Component,

    properties: {
        //这个属性引用了星星预制资源
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        //星星产生后消失时间的随机范围
        maxStarDuration: 0,
        minStarDuration: 0,
        //地面节点，用于确定星星生成的高度
        ground: {
            default: null,
            type: cc.Node
        },
        //player节点，用于获取主角弹跳的高度，和控制主角行动开关
        player: {
            default: null,
            type: cc.Node
        },
        //score label的引用
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        //得分音效资源
        scoreAudio: {
            default: null,
            url: cc.AudioClip
        },
        //开始按钮节点
        btnNode: {
            default: null,
            type: cc.Node
        },
    },

    // use this for initialization
    onLoad: function () {
        this.groundY = this.ground.y + this.ground.height / 2;
        //初始化计时器
        this.timer = 0;
        this.starDuration = 0;
        this.isRunning = false;
    },

    onStartGame: function() {
        //初始化计分
        this.resetScore();

        this.isRunning = true;

        //设置开始按钮到屏幕以外
        this.btnNode.setPositionX(3000);
        this.player.startMoveAt(cc.p(0, this.groundY));

        //生成一个新的星星
        this.spawnNewStar();
    },

    resetScore: function() {
        //初始化计分
        this.score = 0;
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
    },

    spawnNewStar: function() {
        //使用给定的模块在场景中生成一个新节点 
        var newStar = cc.instantiate(this.starPrefab);
        //将新增的节点添加到Canvas节点上面
        this.node.addChild(newStar);
        //为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());
        //将Game组件的实例传入星星组件
        newStar.getComponent('Star').game = this;

        //重置计时器，根据消失时间范围随机取一个值
        this.starDuration = this.minStarDuration + cc.random0To1() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },

    getNewStarPosition: function() {
        var randX = 0;
        //根据地平面位置和主角跳跃高度，随机得到一个星星的y坐标
        var randY = this.groundY + cc.random0To1() * this.player.getComponent('Player').jumpHeight + 50;
        //根据屏幕宽度，随机得到一个星星的x坐标
        var maxX = this.node.width / 2;
        randX = cc.randomMinus1To1() * maxX;
        //返回星星坐标
        return cc.p(randX,randY);
    },

    gainScore: function() {
        this.score += 1;
        //更新scoreDisplay Label的文字
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
        //播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    gameOver: function() {
       this.player.stopMove();
       this.isRunning = false;
       this.btnNode.setPositionX(0);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (!this.isRunning) return;
        // 每帧更新计时器，超过限度还没有生成新的星星
        // 就会调用游戏失败逻辑
        if (this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
    },
});
