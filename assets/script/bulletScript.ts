// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Init from './init'

const { ccclass, property } = cc._decorator

@ccclass
export default class BulletScript extends cc.Component {
    @property(cc.SpriteFrame)
    bulletIcon: cc.SpriteFrame = null

    //子弹上限
    maxCount: number = 10

    //当前剩余子弹数量
    currentCount: number = 10

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //
        let space = this.node.width / this.maxCount

        for (let k = 0; k < this.currentCount; k++) {
            //动态创建子弹，并且添加到节点中
            let node: cc.Node = new cc.Node()
            let sp: cc.Sprite = node.addComponent(cc.Sprite)
            sp.spriteFrame = this.bulletIcon
            node.x = space * k + 10
            this.node.addChild(node)
        }

        console.log(this.node.children, '1111this.node.children')
    }

    // start() {
    //     this.createBullet()
    // }

    // createBullet() {
    //     //循环添加多颗
    // }
    consume(n: number) {
        this.currentCount -= n
        if (this.currentCount <= 0) {
            this.currentCount = 0
            //当没有子弹之后，需要弹出游戏结束弹窗，并且显示总得分
            Init.gameOver.active = true
            cc.find('Canvas/gameOver/分数框/score').getComponent(cc.Label).string = Init.totalScore.toString()
        }
        this.display()
    }
    display() {
        let nodes: cc.Node[] = this.node.children
        console.log(this.node.children, '222this.node.children')

        let i: number = 0
        for (i = 0; i < nodes.length; i++) {
            if (this.currentCount > i) {
                nodes[i].active = true
            } else {
                nodes[i].active = false
            }
        }
    }
    reset() {
        this.currentCount = this.maxCount
        this.display()
    }

    // update (dt) {}
}
