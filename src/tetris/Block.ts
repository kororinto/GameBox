import { GameStart } from '../GameStart'

export class Block extends egret.DisplayObjectContainer {
    public constructor(gameBox: GameStart) {
        super()
        this.parentStage = gameBox.parentStage
        this.originX = gameBox.screenX
        this.originY = gameBox.screenY
        this.screenW = gameBox.screenW
        this.screenH = gameBox.screenH
        this.side = gameBox.screenW / 10
        this.createBlock()
        this.drawBlock()
    }

    static blockTypes: Object = {
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

    static blockColors: object = {
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
        console.log(this.coords)
        this.shape = new egret.Shape()
        this.shape.graphics.beginFill(this.blockColor)
        this.coords.forEach(item => {
            this.shape.graphics.drawRect(item[0] * this.side + this.originX, item[1] * this.side + this.originY, this.side, this.side)
        })
        this.shape.graphics.endFill()
        this.parentStage.addChild(this.shape)
    }

    public parentStage: egret.Stage
    public blockType: string
    public blockColor: number
    public coords: Array < Array < number >>
    public shape: egret.Shape
    public side: number

    // 屏幕位置大小
    private originX: number
    private originY: number
    private screenW: number
    private screenH: number

    private createBlock() {
        let types = Object.keys(Block.blockTypes)
        this.blockType = types[types.length * Math.random() << 0]
        this.coords = Block.blockTypes[this.blockType][Block.blockTypes[this.blockType].length * Math.random() << 0]
        this.blockColor = Block.blockColors[this.blockType]
    }

    private drawBlock() {
        let blockSize = this.screenW / 10
        this.drawCoords()
    }
}