import { game } from './../../creator.d'
import Init from './init'
// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator

@ccclass
export default class PlayAgain extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.node.on('touchstart', this.onTouchstart, this)
    }
    onTouchstart() {
        //再玩一次
        // Init.gameOver.actions
        // cc.find('Canvas/gameOver').active = false
        //初始化数据
        Init.bullet.reset()
        Init.totalScore = 0
        Init.gameOver.active = false
    }

    // update (dt) {}
}
