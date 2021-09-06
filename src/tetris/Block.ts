import { GameStart } from '../GameStart'
import { BlockWall } from './BlockWall'

export class Block {
    public constructor(gameBox: GameStart) {
        this.gameBox = gameBox
        this.parentStage = gameBox.parentStage
        this.parentBlockWall = gameBox.blockWall
        this.originX = gameBox.screenX
        this.originY = gameBox.screenY
        this.screenW = gameBox.screenW
        this.screenH = gameBox.screenH
        this.side = gameBox.screenW / 10

        this.shape = new egret.Shape()
        this.parentStage.addChild(this.shape)

        this.fallTimer = new egret.Timer(500, 0)
        this.fallTimer.addEventListener(egret.TimerEvent.TIMER, this.blockDown, this)
        this.gameBox.rightBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.blockRight, this)
        this.gameBox.leftBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.blockLeft, this)
        this.gameBox.downBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.blockDown, this)
        this.gameBox.topBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.blockRightRotate, this)

        this.gameBox.rightRotateBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.blockRightRotate, this)
        this.gameBox.leftRotateBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.blockLeftRotate, this)
        this.gameBox.dropDownBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.blockDropDown, this)

        this.resetBlock()
    }

    static blockTypes = {
        // Z: [
        //     [[0, 0], [0, 1], [-1, 1], [-1, 2]],
        //     [[-2, 0], [-1, 0], [-1, 1], [0, 1]]
        // ],
        // RZ: [
        //     [[0, 0], [0, 1], [1, 1], [1, 2]],
        //     [[0, 0], [1, 0], [0, 1], [-1, 1]]
        // ],
        // L: [
        //     [[0, 0], [0, 1], [0, 2], [1, 2]],
        //     [[-1, 0], [0, 0], [1, 0], [-1, 1]],
        //     [[-1, 0], [0, 0], [0, 1], [0, 2]],
        //     [[1, 0], [-1, 1], [0, 1], [1, 1]]
        // ],
        // RL: [
        //     [[0, 0], [0, 1], [0, 2], [-1, 2]],
        //     [[-1, 0], [-1, 1], [0, 1], [1, 1]],
        //     [[1, 0], [0, 0], [0, 1], [0, 2]],
        //     [[1, 2], [-1, 1], [0, 1], [1, 1]]
        // ],
        // I: [
        //     [[0, 0], [1, 0], [2, 0], [3, 0]],
        //     [[2, -2], [2, -1], [2, 0], [2, 1]]
        // ],
        // G: [
        //     [[0, 0], [1, 0], [0, 1], [1, 1]],
        // ],
        T: [
            [[0, 0], [-1, 1], [0, 1], [1, 1]],
            [[0, 0], [0, 1], [1, 1], [0, 2]],
            [[-1, 1], [0, 1], [1, 1], [0, 2]],
            [[0, 0], [0, 1], [-1, 1], [0, 2]]
        ]
    }

    static blockColors = {
        // Z字型 橙色
        Z: 0xee7f30,
        // 反Z型 黄色
        RZ: 0xf7ce46,
        // L字型 红色
        L: 0xba3722,
        // 反L型 粉色
        RL: 0xdd789c,
        // 一字型 蓝色
        I: 0x4499f0,
        // 田字型 绿色
        G: 0x4faf3c,
        // 土字型 紫色
        T: 0xb52eef
    }

    private drawCoords() {
        this.shape.graphics.clear()
        this.shape.graphics.beginFill(this.blockColor)
        this.coords.forEach(item => {
            this.shape.graphics.drawRect(item[0] * this.side + this.originX, item[1] * this.side + this.originY, this.side, this.side)
        })
        this.shape.graphics.endFill()
    }

    public gameBox: GameStart

    private parentStage: egret.Stage // 舞台
    private parentBlockWall: BlockWall // 方块墙
    private blockType: string // 类型
    private typeNum: number // 方向
    public blockColor: number // 颜色
    public coords: Array < Array < number >> // 坐标
    private shape: egret.Shape // Shape对象
    private side: number // 单块边长

    // 屏幕位置大小
    private originX: number
    private originY: number
    private screenW: number
    private screenH: number

    private fallTimer: egret.Timer

    // 随机生成方块种类
    public createBlock() {
        let types = Object.keys(Block.blockTypes)
        this.blockType = types[types.length * Math.random() << 0]
        this.typeNum = Block.blockTypes[this.blockType].length * Math.random() << 0
        let thisType = Block.blockTypes[this.blockType][this.typeNum]
        // 数组必须深拷贝，用JSON方法比较取巧 2021.9.6 一个BUG卡了我3个小时，原因就是这个！
        this.coords = JSON.parse(JSON.stringify(thisType))
        this.blockColor = Block.blockColors[this.blockType]
    }

    public resetBlock() {
        this.fallTimer.stop()
        this.createBlock()
        this.drawCoords()
        this.fallTimer.start()
    }

    // 方块下落
    private blockDown(): void {
        if (this.parentBlockWall.checkTheBottom(this)) {
            this.parentBlockWall.fixBlock(this)
            this.resetBlock()
            return
        }

        this.coords.forEach(item => {
            item[1]++
        })
        this.drawCoords()

    }

    // 方块掉落
    private blockDropDown(): void {
        let limit = this.parentBlockWall.getTheBottom(this)
        let deltaY: any = []
        this.coords.forEach(item => {
            let y = limit.find(item2 => item2[0] === item[0])[1] - item[1]
            deltaY.push(y)
        })
        deltaY = Math.min(...deltaY)
        this.coords = this.coords.map(item => [item[0], item[1] + deltaY])
        this.drawCoords()
    }

    // 方块右移
    private blockRight(): void {
        if (this.parentBlockWall.checkTheRight(this)) {
            return
        }
        this.coords.forEach(item => {
            item[0]++
        })
        this.drawCoords()
    }

    // 方块左移
    private blockLeft(): void {
        if (this.parentBlockWall.checkTheLeft(this)) {
            return
        }
        this.coords.forEach(item => {
            item[0]--
        })
        this.drawCoords()
    }

    // 方块右旋转
    private blockRightRotate(e): void {
        console.log(e)
        if (this.blockType === 'G') {
            return
        }
        let len = Block.blockTypes[this.blockType].length
        let oldType = Block.blockTypes[this.blockType][this.typeNum]
        this.typeNum = this.typeNum + 1 >= len ? 0 : this.typeNum + 1
        let coords: Array<Array<number>> = JSON.parse(JSON.stringify(Block.blockTypes[this.blockType][this.typeNum]))
        let deltaX = this.coords[0][0] - oldType[0][0]
        let deltaY = this.coords[0][1] - oldType[0][1]
        this.coords = coords.map(item => [item[0] + deltaX, item[1] + deltaY])
        this.drawCoords()
    }

    // 方块左旋转
    private blockLeftRotate(): void {
        if (this.blockType === 'G') {
            return
        }
        let len = Block.blockTypes[this.blockType].length
        let oldType = Block.blockTypes[this.blockType][this.typeNum]
        this.typeNum = this.typeNum - 1 < 0 ? len - 1 : this.typeNum - 1
        let coords: Array < Array < number >> = JSON.parse(JSON.stringify(Block.blockTypes[this.blockType][this.typeNum]))
        let deltaX = this.coords[0][0] - oldType[0][0]
        let deltaY = this.coords[0][1] - oldType[0][1]
        this.coords = coords.map(item => [item[0] + deltaX, item[1] + deltaY])
        this.drawCoords()
    }
}