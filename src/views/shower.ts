export default class Shower {
  private ctx: CanvasRenderingContext2D
  static readonly marginLeft = 10 // 左侧第一组喷头离左侧的位置
  static readonly marginTop = 10 // 左侧第一组喷头离上面的位置
  static readonly sprayerWidth = 45 // 整体喷头的宽度
  static readonly circleWrapWidth = 15 // 外层圆的半径
  static readonly circleWrapMarginTop = 10 // 外层圆离上一个圆的位置
  static readonly circleInside = 12 // 内层圆的半径
  private circleNum = 6 // 画圆的数量
  private transformX = 0 // 画布往左偏移的位置 (实例都基于这个偏移量去画)
  private transformY = 0 // 画布往上偏移的位置 (实例都基于这个偏移量去画)

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
  }

  // 每一个喷口的高度(含自身margin)
  static getItemHeight() {
    // 离上一个圆的margin + 圆的直径(半径 * 2)
    return this.circleWrapMarginTop + this.circleWrapWidth * 2
  }

  // 画布偏移移动
  transform(x: number, y: number) {
    this.ctx.save()
    this.transformX = x
    this.transformY = y
    this.ctx.transform(1, 0, 0, 1, x, y)
  }

  // 获取整个矩形的高度
  getRectHeight() {
    return (
      (this.circleNum + 1) * Shower.circleWrapMarginTop +
      Shower.circleWrapWidth * 2 * this.circleNum
    )
  }

  // 绘制矩形
  private drawRect() {
    this.ctx.strokeRect(0, 0, Shower.sprayerWidth, this.getRectHeight())
  }

  // 绘制内圆(实心圆)
  private drawInnerCircle(x: number, y: number, color = "#f00") {
    this.ctx.beginPath()
    this.ctx.arc(x, y, Shower.circleInside, 0, Math.PI * 360)
    this.ctx.closePath()
    this.ctx.fillStyle = color
    this.ctx.strokeStyle = "#000"
    this.ctx.fill()
    this.ctx.stroke()
  }

  // 绘制外圆(空心圆)
  private drawOuterCircle(x: number, y: number, color = "#000") {
    this.ctx.beginPath()
    this.ctx.arc(x, y, Shower.circleWrapWidth, 0, Math.PI * 360)
    this.ctx.strokeStyle = color
    this.ctx.closePath()
    this.ctx.stroke()
  }

  /**
   * 绘制 circleNum -> 绘制圆
   * @param circleNum  绘制圆的数量
   * @param hollowCircleNum 实心圆的颜色为白色的数组下标(从 1 开始)
   */
  draw(circleNum: number, hollowCircleNum?: number[]) {
    this.circleNum = circleNum
    this.drawRect()
    for (let i = 0; i < circleNum; i++) {
      const x = Shower.sprayerWidth / 2 // 圆的X位置
      const y =
        (i + 1) * Shower.circleWrapMarginTop +
        Shower.circleWrapWidth * 2 * i +
        Shower.circleWrapWidth // 圆的Y位置
      // 判断是否渲染白色的实心圆 (因为从1开始的，所以要 + 1)
      if (hollowCircleNum?.includes(i + 1)) {
        this.drawInnerCircle(x, y, "#fff")
      } else {
        this.drawInnerCircle(x, y, "#000")
      }
      this.drawOuterCircle(x, y)
    }
  }

  /**
   * 添加喷头编号
   * @param name  编号名称
   * @param position 编号位置 top -> 上面, bottom -> 下面
   */
  writeName(name: string, position: "top" | "bottom") {
    let y = -(Shower.circleWrapWidth / 2)
    if (position === "bottom") {
      y = this.getRectHeight() + Shower.marginTop + Shower.circleWrapMarginTop
    }
    this.ctx.font = "15px Arial"
    this.ctx.textAlign = "left"
    this.ctx.fillStyle = "#999"
    this.ctx.fillText(name, this.ctx.measureText(name).width / 2, y, Shower.sprayerWidth)
  }

  /**
   * 添加线条位置标点
   * @param circleNum 第几个圆开始
   * @param text 添加的标记文字
   * @param order positive -> 升序, inverted -> 降序
   * @param color 标记的颜色
   */
  addMark(
    circleNum: number,
    text: string | number,
    order: "positive" | "inverted" = "positive",
    color = "#000"
  ) {
    if (circleNum > this.circleNum) {
      throw new Error("标点圆的位置, 不能小于生成的圆数量")
    }
    if (circleNum <= 0) {
      throw new Error("标点圆的位置, 不能小于等于0位")
    }
    // 标记的 y 位置 默认升序
    let y = Shower.getItemHeight() * circleNum - Shower.circleWrapWidth
    if (order === "positive") {
      // 降序
      y = Shower.getItemHeight() * (this.circleNum - circleNum + 1) - Shower.circleWrapWidth
    }
    // 画横行需要从画布最左侧去画，所以先把之前设置的x轴偏移量调回去
    this.ctx.save()
    this.ctx.transform(1, 0, 0, 1, -this.transformX, 0)
    // 画横线
    this.ctx.beginPath()
    this.ctx.moveTo(0, y)
    this.ctx.lineTo(250, y)
    this.ctx.strokeStyle = color
    this.ctx.stroke()
    this.ctx.closePath()

    // 添加标记文字
    this.ctx.font = "16px Arial"
    this.ctx.fillStyle = color
    this.ctx.fillText(
      String(text),
      Shower.marginLeft * 2 + Shower.sprayerWidth * 2 + Shower.marginLeft,
      y - Shower.marginTop
    )

    // 画完横线, 添加完标记文字后恢复之前的偏移
    this.ctx.restore()
  }

  // 画笔恢复: 实例使用后的最后一步调用(也就是生成下一个实例之前调用)
  end() {
    // 把画笔恢复过来，以免影响生成下一个实例的位置
    this.ctx.restore()
  }
}
