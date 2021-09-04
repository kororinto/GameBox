import { Block } from './tetris/Block'

interface GameBoxParam {
    gameName: string
    stage: egret.Stage
    screenX: number
    screenY: number
    screenW: number
    screenH: number
}

export class GameStart extends egret.DisplayObjectContainer {
    public constructor(param: GameBoxParam) {
        super()
        this.gameName = param.gameName
        this.parentStage = param.stage
        this.screenX = param.screenX
        this.screenY = param.screenY
        this.screenW = param.screenW
        this.screenH = param.screenH
        this.startBtnRadius = 50
        this.directionBtnSize = 40
        this.actionBtnSize = 30

        this.drawBg()
        this.drawBtn()
        this.drawScreen()
    }

    // 当前进行的游戏
    public gameName: string

    // 屏幕位置大小
    public parentStage: egret.Stage
    public screenX: number
    public screenY: number
    public screenW: number
    public screenH: number

    // 外壳
    public case: egret.Shape

    // 按钮背景 与按钮同色
    public btnBg: egret.Shape

    // 开始、重启按钮
    public startBtn: egret.Shape
    public startBtnRadius: number

    // 方向按钮
    public directionBtnSize: number
    public topBtn: egret.Shape
    public leftBtn: egret.Shape
    public downBtn: egret.Shape
    public rightBtn: egret.Shape

    // 操作按钮
    public actionBtnSize: number
    public leftRotateBtn: egret.Shape
    public rightRotateBtn: egret.Shape
    public dropDownBtn: egret.Shape

    // 游戏屏幕
    public screen: egret.Shape
    public tips: egret.Shape

    /**
    * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
    * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of
    resources/resource.json.
    */
    private createBitmapByName(name: string) {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    private drawBg() {
        this.case = new egret.Shape()
        this.case.graphics.beginFill(0x007acb)
        this.case.graphics.drawRect(0, 0, this.parentStage.stageWidth, this.parentStage.stageHeight)
        this.case.graphics.endFill()
        this.parentStage.addChild(this.case)
    }

    private drawBtn() {
        // 重置、开始 按钮
        this.startBtn = new egret.Shape()
        this.startBtn.graphics.beginFill(0x333333)
        this.startBtn.graphics.drawCircle(this.parentStage.stageWidth / 2, this.screenY + this.screenH + 60, this.startBtnRadius)
        this.startBtn.graphics.endFill()
        this.parentStage.addChild(this.startBtn)
        this.startBtn.touchEnabled = true
        this.startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startBtnClick, this)

        // 方向按钮底色
        this.btnBg = new egret.Shape()
        this.parentStage.addChild(this.btnBg)
        // 方向按钮中心
        let directionBtnCenterX = this.screenX / 2 + this.directionBtnSize
        let directionBtnCenterY = this.screenY + this.screenH + 150
        this.btnBg.graphics.beginFill(0x333333)
        this.btnBg.graphics.drawRoundRect(directionBtnCenterX - this.directionBtnSize, directionBtnCenterY, this.directionBtnSize * 3, this.directionBtnSize, this.directionBtnSize * 4 / 5)
        this.btnBg.graphics.drawRoundRect(directionBtnCenterX, directionBtnCenterY - this.directionBtnSize, this.directionBtnSize, this.directionBtnSize * 3, this.directionBtnSize * 4 / 5)
        this.btnBg.graphics.endFill()
        
        // 上下左右箭头图片夹层
        let top = this.createBitmapByName('arrow_top_png')
        let left = this.createBitmapByName('arrow_left_png')
        let down = this.createBitmapByName('arrow_down_png')
        let right = this.createBitmapByName('arrow_right_png')
        this.parentStage.addChild(top)
        this.parentStage.addChild(left)
        this.parentStage.addChild(down)
        this.parentStage.addChild(right)
        let delta = 12
        top.x = this.screenX / 2 + this.directionBtnSize + delta
        top.y = this.screenY + this.screenH + 150 - this.directionBtnSize + delta
        left.x = top.x - this.directionBtnSize
        left.y = top.y + this.directionBtnSize
        down.x = top.x
        down.y = top.y + 2 * this.directionBtnSize
        right.x = left.x + 2 * this.directionBtnSize
        right.y = left.y

        // 上下左右按钮
        this.topBtn = new egret.Shape()
        this.leftBtn = new egret.Shape()
        this.downBtn = new egret.Shape()
        this.rightBtn = new egret.Shape()
        this.parentStage.addChild(this.topBtn)
        this.parentStage.addChild(this.leftBtn)
        this.parentStage.addChild(this.downBtn)
        this.parentStage.addChild(this.rightBtn)
        this.topBtn.touchEnabled = true
        this.leftBtn.touchEnabled = true
        this.downBtn.touchEnabled = true
        this.rightBtn.touchEnabled = true
        this.topBtn.graphics.beginFill(0x333333, 0.3)
        this.topBtn.graphics.drawRoundRect(top.x - delta, top.y - delta, this.directionBtnSize, this.directionBtnSize, this.directionBtnSize * 4 / 5)
        this.topBtn.graphics.endFill()
        this.leftBtn.graphics.beginFill(0x333333, 0.3)
        this.leftBtn.graphics.drawRoundRect(left.x - delta, left.y - delta, this.directionBtnSize, this.directionBtnSize, this.directionBtnSize * 4 / 5)
        this.leftBtn.graphics.endFill()
        this.downBtn.graphics.beginFill(0x333333, 0.3)
        this.downBtn.graphics.drawRoundRect(down.x - delta, down.y - delta, this.directionBtnSize, this.directionBtnSize, this.directionBtnSize * 4 / 5)
        this.downBtn.graphics.endFill()
        this.rightBtn.graphics.beginFill(0x333333, 0.3)
        this.rightBtn.graphics.drawRoundRect(right.x - delta, right.y - delta, this.directionBtnSize, this.directionBtnSize, this.directionBtnSize * 4 / 5)
        this.rightBtn.graphics.endFill()

        // 左旋转 有旋转 掉落按钮
        this.leftRotateBtn = new egret.Shape()
        this.rightRotateBtn = new egret.Shape()
        this.dropDownBtn = new egret.Shape()
        this.leftRotateBtn.touchEnabled = true
        this.rightRotateBtn.touchEnabled = true
        this.dropDownBtn.touchEnabled = true
        this.leftRotateBtn.graphics.beginFill(0x333333)
        this.leftRotateBtn.graphics.drawCircle(this.parentStage.stageWidth - this.screenX - 3 * this.actionBtnSize, this.screenY + this.screenH + 250 - 3 * this.actionBtnSize, this.actionBtnSize)
        this.leftRotateBtn.graphics.endFill()
        this.rightRotateBtn.graphics.beginFill(0x333333)
        this.rightRotateBtn.graphics.drawCircle(this.parentStage.stageWidth - this.screenX + this.actionBtnSize, this.screenY + this.screenH + 250 - 3 * this.actionBtnSize, this.actionBtnSize)
        this.rightRotateBtn.graphics.endFill()
        this.dropDownBtn.graphics.beginFill(0x333333)
        this.dropDownBtn.graphics.drawCircle(this.parentStage.stageWidth - this.screenX - this.actionBtnSize, this.screenY + this.screenH + 250 - this.actionBtnSize, this.actionBtnSize)
        this.dropDownBtn.graphics.endFill()
        this.parentStage.addChild(this.leftRotateBtn)
        this.parentStage.addChild(this.rightRotateBtn)
        this.parentStage.addChild(this.dropDownBtn)
    }

    private drawScreen() {
        // 方块界面
        this.screen = new egret.Shape()
        this.screen.graphics.beginFill(0x333333)
        this.screen.graphics.drawRect(this.screenX, this.screenY, this.screenW, this.screenH)
        this.screen.graphics.endFill()
        this.parentStage.addChild(this.screen)

        // tips栏
        this.tips = new egret.Shape()
        this.tips.graphics.beginFill(0x666666)
        this.tips.graphics.drawRect(this.screenX + this.screenW, this.screenY, 100, this.screenH)
        this.tips.graphics.endFill()
        this.parentStage.addChild(this.tips)

        // let blockSize = this.screenW / 10
        // this.screen.graphics.lineStyle(1, 0xcccccc)
        // for (let i = 0; i < 10; i++) {
        //     this.screen.graphics.moveTo(this.screenX + blockSize * i, this.screenY)
        //     this.screen.graphics.lineTo(this.screenX + blockSize * i, this.screenY + this.screenH)
        // }
        // for (let i = 0; i < 20; i++) {
        //     this.screen.graphics.moveTo(this.screenX, this.screenY + blockSize * i)
        //     this.screen.graphics.lineTo(this.screenX + this.screenW, this.screenY + blockSize * i)
        // }
    }

    private startBtnClick() {
        // todo: 开始对应游戏
        switch (this.gameName) {
            case 'Tetris': {
                this.startTetris()
                break
            }
        }
    }

    private startTetris() {
        console.log('游戏开始')
        // 绑定按键事件
        // 初始化方块强
        let blockWall = new BlockWall()
        // 随机生成一种方块
        let block = new Block(this)
        // 启动定时器 方块向下移动
    }
}