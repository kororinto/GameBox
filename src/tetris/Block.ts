import { GameStart } from '../GameStart'
import { BlockWall } from './BlockWall'

export class Block {
    public constructor(gameBox: GameStart) {
        this.parentStage = gameBox.parentStage
        this.parentBlockWall = gameBox.blockWall
        this.originX = gameBox.screenX
        this.originY = gameBox.screenY
        this.screenW = gameBox.screenW
        this.screenH = gameBox.screenH
        this.side = gameBox.screenW / 10

        this.shape = new egret.Shape()
        this.parentStage.addChild(this.shape)
        this.createBlock()
        this.drawCoords()
        this.fallTimer = new egret.Timer(500, 0)
        this.fallTimer.addEventListener(egret.TimerEvent.TIMER, this.blockDown, this)
        // this.fallTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.checkTheLimit, this)
        this.fallTimer.start();
    }

    static blockTypes = {
        Z: [
            [[0, 0], [1, 0], [1, 1], [2, 1]],
            [[1, 0], [0, 1], [1, 1], [0, 2]]
        ],
        RZ: [
            [[1, 0], [2, 0], [0, 1], [1, 1]],
            [[0, 0], [0, 1], [1, 1], [1, 2]]
        ],
        L: [
            [[0, 0], [0, 1], [0, 2], [1, 2]],
            [[2, 0], [0, 1], [1, 1], [2, 1]],
            [[0, 0], [1, 0], [1, 1], [1, 2]],
            [[0, 0], [1, 0], [2, 0], [0, 1]]
        ],
        RL: [
            [[1, 0], [1, 1], [1, 2], [0, 2]],
            [[0, 0], [0, 1], [0, 2], [1, 2]],
            [[0, 0], [1, 0], [0, 1], [0, 2]],
            [[0, 0], [0, 1], [1 ,1], [2, 1]]
        ],
        I: [
            [[0, 0], [1, 0], [2, 0], [3, 0]],
            [[0, 0], [0, 1], [0, 2], [0, 3]]
        ],
        G: [
            [[0, 0], [1, 0], [0, 1], [1, 1]],
        ],
        T: [
            [[1, 0], [0, 1], [1, 1], [2, 1]],
            [[1, 0], [0, 1], [1, 1], [1, 2]],
            [[0, 0], [1, 0], [2, 0], [1, 1]],
            [[0, 0], [0 ,1], [1, 1], [0, 2]]
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

    public parentStage: egret.Stage // 舞台
    public parentBlockWall: BlockWall // 方块墙
    public blockType: string // 类型
    public blockColor: number // 颜色
    public coords: Array < Array < number >> // 坐标
    public shape: egret.Shape // Shape对象
    public side: number // 单块边长

    // 屏幕位置大小
    private originX: number
    private originY: number
    private screenW: number
    private screenH: number

    public fallTimer: egret.Timer

    // 随机生成方块种类
    private createBlock() {
        let types = Object.keys(Block.blockTypes)
        this.blockType = types[types.length * Math.random() << 0]
        this.coords = Block.blockTypes[this.blockType][Block.blockTypes[this.blockType].length * Math.random() << 0]
        this.blockColor = Block.blockColors[this.blockType]
    }

    // 方块下落
    private blockDown(): void {
        if (this.checkTheLimit()) {
            this.fallTimer.removeEventListener(egret.TimerEvent.TIMER, this.blockDown, this)
            this.parentBlockWall.fixBlock(this)
            this.parentStage.removeChild(this.shape)
            return
        }

        this.coords.forEach((item, index) => {
            item[1]++
        })
        this.drawCoords()
    }

    // 检查方块是否到底
    private checkTheLimit(): boolean {
        let maxY = Math.max(...this.coords.map(item => item[1]))
        return maxY === 5
    }
}