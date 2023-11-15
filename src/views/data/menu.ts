import type {menuTtemType} from "./menu.d";
const menuList: menuTtemType[] = [
  {
    type: 'img',
    id: '',
    position: {
      width: 50,
      height: 50,
      left: 200,
      top: 200,
      rotate: 0
    },
    data: {
      imgSrc: 'https://topo.thingjs.com/rsm/1672120633041/fcuq1g4y3ecyyt47-20221018.svg'
    }
  },
  {
    type: 'table',
    id: '',
    position: {
      width: 50,
      height: 50,
      left: 200,
      top: 200,
      rotate: 0
    },
    data: {
      imgSrc: 'https://topo.thingjs.com/rsm/1672120633177/s4sgohysbv6jte72-20221018.svg'
    }
  },
  {
    type: 'fan',
    id: '',
    position: {
      width: 50,
      height: 50,
      left: 200,
      top: 200,
      rotate: 0
    },
    data: {
      imgSrc: 'https://topo.thingjs.com/rsm/1672120632799/yimgevesmxi6h47t-20221018.svg',
      addRotateAnimation: true
    }
  },
  {
    type: 'text',
    id: '',
    position: {
      width: 50,
      height: 50,
      left: 200,
      top: 200,
      rotate: 0
    },
    data: {
      imgSrc: 'https://topo.thingjs.com/topo-static/images/standard/Text.png?x-oss-process=image/resize,w_60/quality,q_90'
    }
  }
]

export {
  menuList
}