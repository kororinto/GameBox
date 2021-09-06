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
        let wallBlock = block.coords.map(item => item.concat(block.blockColor))
        this.coords.push(...wallBlock)
        console.log(this.coords)
        this.eliminateRow()
        this.drawBlockWall()
    }

    private eliminateRow() {
        let rows = Array.from(new Set(this.coords.map(item => item[1])))
        rows.forEach(y => {
            let thisRowCoords = this.coords.filter(item => item[1] === y)
            console.log(thisRowCoords)
            if (thisRowCoords.length === 10) {
                let upper = this.coords.filter(item => item[1] < y)
                let under = this.coords.filter(item => item[1] > y)
                this.coords = upper.map(item => [item[0], item[1] + 1, item[2]]).concat(under)
            }
        })
    }

    private drawBlockWall() {
        this.shape.graphics.clear()
        this.coords.forEach(item => {
            this.shape.graphics.beginFill(item[2])
            this.shape.graphics.drawRect(item[0] * this.side + this.originX, item[1] * this.side + this.originY, this.side, this.side)
            this.shape.graphics.endFill()
        })
    }

    public checkTheBottom(block: Block): boolean {
        // 计算每个块所载列的最低位置
        return block.coords.some(blockCoord => {
            let sameColumnWallCoords = this.coords.filter(wallCoord => wallCoord[0] === blockCoord[0])
            let limit: number
            if (sameColumnWallCoords.length) {
                limit = Math.min(...sameColumnWallCoords.map(wallCoord => wallCoord[1]))
            } else {
                limit = 20
            }
            return blockCoord[1] >= limit - 1
        })
    }

    public getTheBottom(block: Block) {
        let limit: Array<Array<number>> = []
        block.coords.forEach(blockCoord => {
            let sameColumnWallCoords = this.coords.filter(wallCoord => wallCoord[0] === blockCoord[0])
            let limitY: number
            if (sameColumnWallCoords.length) {
                limitY = Math.min(...sameColumnWallCoords.map(wallCoord => wallCoord[1]))
            } else {
                limitY = 20
            }
            if (!limit.some(item => item[0] === blockCoord[0])) {
                limit.push([blockCoord[0], limitY - 1])
            }
        })
        return limit
    }

    public checkTheRight(block: Block): boolean {
        // 计算每个块所载行的右边的最左位置
        return block.coords.some(blockCoord => {
            let sameRowWallCoords = this.coords.filter(wallCoord => wallCoord[0] > blockCoord[0] && wallCoord[1] === blockCoord[1])
            let limit: number
            if (sameRowWallCoords.length) {
                limit = Math.min(...sameRowWallCoords.map(wallCoord => wallCoord[0]))
            } else {
                limit = 10
            }
            return blockCoord[0] >= limit - 1
        })
    }
    public checkTheLeft(block: Block): boolean {
        // 计算每个块所载行的左位的最右边置
        return block.coords.some(blockCoord => {
            let sameRowWallCoords = this.coords.filter(wallCoord => wallCoord[0] < blockCoord[0] && wallCoord[1] === blockCoord[1])
            let limit: number
            if (sameRowWallCoords.length) {
                limit = Math.max(...sameRowWallCoords.map(wallCoord => wallCoord[0]))
            } else {
                limit = -1
            }
            return blockCoord[0] <= limit + 1
        })
    }
}