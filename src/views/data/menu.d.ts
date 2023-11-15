export type menuTtemType = {
  id: string
  type: string // 类型
  position: {
    width: number
    height: number
    left: number
    top: number
    rotate: number
  }
  data: {
    imgSrc: string,
    addRotateAnimation?: boolean;
  }
}