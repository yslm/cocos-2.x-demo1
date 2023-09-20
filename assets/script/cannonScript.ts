import { EventTouch } from './../../creator.d'
import BulletScript from './bulletScript'
import FireScript from './fireScript'
import Init from './init'
// import BulletScript from './bulletScript'
// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator

@ccclass
export default class CannonScript extends cc.Component {
    // LIFE-CYCLE CALLBACKS:
    startPos: cc.Vec2 = null
    startAngle: number = 0

    //子弹
    @property(cc.SpriteFrame)
    bulletIcon: cc.SpriteFrame = null
    //爆炸效果
    @property(cc.SpriteFrame)
    boomIcon: cc.SpriteFrame = null

    @property(cc.AudioClip)
    fireMusic: cc.AudioClip = null

    @property(cc.AudioClip)
    boomMusic: cc.AudioClip = null

    //炮塔-普通
    @property(cc.SpriteFrame)
    cannon: cc.SpriteFrame = null

    //炮塔-激活
    @property(cc.SpriteFrame)
    cannonActive: cc.SpriteFrame = null

    cannonSp: cc.Sprite = null

    onLoad() {
        this.node.angle = 90
        //需要让炮塔旋转
        this.cannonSp = this.node.getComponent(cc.Sprite)
    }

    start() {
        this.node.on('touchstart', this.onTouchstart, this)
        this.node.on('touchmove', this.onTouchmove, this)
        this.node.on('touchend', this.onTouchend, this)
        this.node.on('touchcancel', this.onTouchend, this)

        //
    }
    onTouchstart(e: cc.Event.EventTouch) {
        //记录初始位置
        this.startPos = this.node.parent.convertToNodeSpaceAR(e.getLocation())
        //记录初始角度
        this.startAngle = this.node.angle
        //获取sprite组件
        this.cannonSp.spriteFrame = this.cannonActive
    }
    onTouchmove(e: cc.Event.EventTouch) {
        let pos = this.node.parent.convertToNodeSpaceAR(e.getLocation())
        //记录需要摆动的角度，就是当前位置与初始位置之间的夹角，单位是弧度
        let sweep_radian = pos.signAngle(this.startPos)
        //根据上面的弧度计算出角度
        let sweep_angle = (sweep_radian * 180) / Math.PI // (a*180/π)
        // cc.log(sweep_angle, '转动的角度')

        //设置炮口的指向
        // 比如，原来炮口90度，向右摆动15度，则炮口应指向75度
        //向右转，正数，向左转，负数
        let angle = this.startAngle - sweep_angle
        //需要对炮口角度做限制
        // if (angle <= 45) angle = 45
        // if (angle > 135) angle = 135
        this.node.angle = angle
    }
    onTouchend() {
        //松开手时，发射炮弹
        this.fire()
        this.cannonSp.spriteFrame = this.cannon
    }

    //开火
    fire() {
        if (!this.bulletIcon) {
            cc.log('请设置bulletIcon图片')
            return
        }

        cc.audioEngine.play(this.fireMusic, false, 1)
        //炮口指向，就是子弹的运行
        let angle: number = this.node.angle
        let radian = (angle * Math.PI) / 180
        let direction = cc.v2(Math.cos(radian), Math.sin(radian)) //标准化向量

        //先创建一个新节点
        let bulletNode: cc.Node = new cc.Node()
        //获取精灵组件
        let sprite: cc.Sprite = bulletNode.addComponent(cc.Sprite)
        //设置精灵组件的图片
        sprite.spriteFrame = this.bulletIcon
        //指定父节点
        bulletNode.parent = this.node.parent

        //角度以及初始化位置
        bulletNode.angle = this.node.angle
        let r = 140 //子弹与射击基准的距离
        let bullet_x = r * direction.x
        let bullet_y = r * direction.y
        bulletNode.setPosition(cc.v2(bullet_x, bullet_y))
        //加载爆炸脚本
        // let script = bulletNode.addComponent(FireScript)
        // script.boom = this.boomIcon
        //给子弹添加脚本
        let bullet: FireScript = bulletNode.addComponent(FireScript)
        bullet.boom = this.boomIcon
        bullet.direction = direction
        //获取靶标
        let target = cc.find('Canvas/靶子')
        bullet.target = target

        bullet.boomMusic = this.boomMusic

        //减少控制弹匣显示

        // let bulletScrip: BulletScript = cc.find('Canvas/弹夹').getComponent(BulletScript)
        // bulletScrip.consume(1)
        // Init.bullet.consume(1)
        Init.bullet.consume(1)
    }

    // update (dt) {}
}
