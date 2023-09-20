import { Tween } from './../../creator.d'
import Init from './init'
// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator

@ccclass
export default class FireScript extends cc.Component {
    @property(cc.SpriteFrame)
    boom: cc.SpriteFrame = null

    boomMusic: cc.AudioClip = null

    //子弹飞行方向
    direction: cc.Vec2 = null

    //靶标
    target: cc.Node = null

    //总得分
    totalScore: number = 0

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    start() {
        if (!this.target) {
            console.warn('请设置target')
            return
        }
        this.schedule(this.onTimer, 0.016)
    }
    onTimer() {
        if (this.node.y > 500) {
            this.unschedule(this.onTimer)
            //这里需要判断是否命中目标，如果命中，那么需要有爆炸效果，否则就没有

            let hit = this.isHit()
            console.log(hit)

            if (hit) {
                this.success()
                this.totalScore += 10
            } else {
                this.fail()
                return
            }
        }
        let speed: number = 15 //步长
        let dx = speed * this.direction.x
        let dy = speed * this.direction.y
        this.node.x += dx
        this.node.y += dy
    }
    beginBoom() {
        let sp: cc.Sprite = this.node.getComponent(cc.Sprite)
        sp.spriteFrame = this.boom

        let self = this
        this.node.scale = 0
        cc.tween(this.node)
            .to(0.25, { scale: 1.5, opacity: 0 })
            .call(function () {
                self.afterBoom()
            })
            .start()
        cc.audioEngine.play(this.boomMusic, false, 1)
    }
    afterBoom() {
        this.node.destroy()
    }
    //加分效果
    /**
     * 和爆炸效果类似，也是需要动态创建节点，然后缓动，然后销毁
     */
    addScore() {
        let node: cc.Node = new cc.Node()
        let label: cc.Label = node.addComponent(cc.Label)
        label.string = '+10分'
        label.fontSize = 60
        node.color = new cc.Color(255, 0, 0)
        // node.x = 100
        // node.height = 100
        node.parent = this.node.parent
        node.setPosition(cc.v2(0, 255)) //重要，创建之后，需要设置它的位置
        node.opacity = 200

        let self = this
        node.scale = 0
        cc.tween(node)
            .to(0.5, { scale: 1.5 })
            .to(0.4, { opacity: 0 })
            .call(function () {
                node.destroy()
            })
            .start()
    }

    //检测是否命中目标
    isHit(): boolean {
        //获取目标的世界坐标
        let targetPos: cc.Vec2 = this.getWorldLocation(this.target)
        //获取自身的世界坐标
        let selfPos: cc.Vec2 = this.getWorldLocation(this.node)
        let distance: number = Math.abs(targetPos.x - selfPos.x) //x方向的距离
        cc.log('靶标x=' + targetPos.x + ', 子弹x=' + selfPos.x)
        return distance < 50
    }
    //获取一个节点的世界坐标
    getWorldLocation(node: cc.Node): cc.Vec2 {
        let pos = node.getPosition()
        return node.parent.convertToWorldSpaceAR(pos)
    }
    success() {
        //爆炸效果
        this.beginBoom()
        this.addScore()
        Init.totalScore += 10
    }
    fail() {
        this.afterBoom()
    }

    // update (dt) {}
}
