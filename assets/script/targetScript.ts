// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator

@ccclass
export default class TargetScript extends cc.Component {
    @property
    isLeft: boolean = true

    //移动的距离
    distance: number = 0

    //移动的上线
    @property
    distanceNum: number = 500

    @property
    step: number = 3

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        // this.schedule(this.onTimer, 0.016)
    }
    // onTimer() {
    //     //控制靶标左右移动
    //     this.distance += this.step
    //     if (this.distance >= this.distanceNum) {
    //         this.distance = 0
    //         //需要转换
    //         this.isLeft = !this.isLeft
    //     }
    //     if (this.isLeft) {
    //         this.node.x -= this.step
    //     } else {
    //         this.node.x += this.step
    //     }
    // }

    // update (dt) {}
    update(dt) {
        let dx: number = 3
        if (this.isLeft) {
            dx = 0 - dx
        }
        this.node.x += dx
        if (this.isLeft && this.node.x < -200) this.isLeft = false
        if (!this.isLeft && this.node.x > 200) this.isLeft = true
    }
}
