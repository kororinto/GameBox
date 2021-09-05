import { Block } from "./Block";
import { GameStart } from "../GameStart";

export class BlockWall {
    public constructor(gameBox: GameStart) {
        this.gameBox = gameBox
        this.parentStage = gameBox.parentStage
        this.originX = gameBox.screenX
        this.originY = gameBox.screenY
        this.screenW = gameBox.screenW
        this.screenH = gameBox.screenH
        this.side = this.screenW / 10
        this.shape = new egret.Shape()
        this.parentStage.addChild(this.shape)
    }

    private gameBox: GameStart

    private shape: egret.Shape
    private coords: Array < Array < number >> = []
    private side: number

    private parentStage: egret.Stage

    // 屏幕位置大小
    private originX: number
    private originY: number
    private screenW: number
    private screenH: number

    public fixBlock(block: Block) {
        this.coords.push(...[...block.coords].map(item => item.concat(block.blockColor)))
        // new Block(this.gameBox)
        this.drawFixedBlock()
    }

    private drawFixedBlock() {
        this.shape.graphics.clear()
        console.log(this.coords)
        this.coords.forEach(item => {
            this.shape.graphics.beginFill(item[2])
            this.shape.graphics.drawRect(item[0] * this.side + this.originX, item[1] * this.side + this.originY, this.side, this.side)
            this.shape.graphics.endFill()
        })
        this.parentStage.addChild(this.shape)
    }
}