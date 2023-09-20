import { Canvas } from './../../creator.d'
// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator
import BulletScript from './bulletScript'

@ccclass
export default class Init extends cc.Component {
    static bullet: BulletScript = null
    static gameOver: cc.Node = null
    static totalScore: number = 0

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Init.bullet = cc.find('Canvas/弹夹').getComponent(BulletScript)
        Init.gameOver = cc.find('Canvas/gameOver')
        // Init.totalScore = 0
    }

    start() {}

    // update (dt) {}
}
