import * as PIXI from 'pixi.js';
import type {Sprite, ICanvas, Text, Application, DisplayObject} from "pixi.js";
import type {menuTtemType} from "./menu.d";
import { computed, ref } from 'vue';

// app: Application<ICanvas>

// 舞台变量
let app: Application<ICanvas>;

const useCanvas = () => {

  // 渲染列表
  const list = ref<menuTtemType []>([]);

  // 拖拽中的元素
  let dragTarget: Sprite | null = null 

  // 全局舞台拖拽中事件
  const appDragMove = (event: PIXI.FederatedPointerEvent) => {
    if (!dragTarget) return
    dragTarget.parent.toLocal(event.global, undefined, dragTarget.position)
  }

  // 全局舞台拖拽完成事件
  const appDragEnd = () => {
    if (!dragTarget) return
    app.stage.off('pointermove', appDragMove)
    dragTarget.alpha = 1
    dragTarget = null
  }

  // 初始化舞台
  const init = (dom: HTMLDivElement) => {
    
    app = new PIXI.Application({
      width: 1920,
      height: 1080,
      background: '#fff'
    });

    // 打开舞台事件监听
    app.stage.eventMode = 'static';

    // 鼠标松开事件
    app.stage.on('pointerup', appDragEnd)
    // 移出事件
    app.stage.on('pointerupoutside', appDragEnd)

    putAppOnView(dom);

    renderTable()

  }

  // 添加元素
  const addElement = (element: menuTtemType) => {
    list.value.push(element);
    renderElement(element);
  };

  // 渲染元素
  const renderElement = (element: menuTtemType) => {
    let bunny: Text | Sprite;
    if (element.type === 'text') {
      // 文本类型
      bunny = new PIXI.Text('我是文本输入')
    } else {
      // 图片类型
      bunny = PIXI.Sprite.from(element.data.imgSrc)
    }

    // 设置锚点为中心
    bunny.anchor.set(0.5, 0.5)
    // 离x的距离
    bunny.x = element.position.left
    // 离y的距离
    bunny.y = element.position.top
    // 输入移入改变鼠标icon
    bunny.cursor = 'move'

    // 是否需要添加自转动画
    if(element.data.addRotateAnimation) {
      app.ticker.add((num) => {
        bunny.rotation += 0.03
      })
    }

    // 设置事件监听
    bunny.eventMode = 'static'
    bunny.addEventListener('pointerdown', (event) => {
      // 赋值
      dragTarget = bunny
      // 降低不透明度
      bunny.alpha = 0.5
      // 为画布添加鼠标移动事件
      app.stage.addEventListener('pointermove', appDragMove)
    })

    // 把元素添加到舞台中
    app.stage.addChild(bunny);

  }

  // 删除元素
  const removeElement = (element: menuTtemType) => {
    if(!dragTarget) return;
    app.stage.removeChild(dragTarget)
  }

  // 获取元素列表
  const getList = () => {
    return list.value;
  }

  // 获取舞台
  const getApp = () => {
    return app;
  }

  // 把舞台放到页面
  const putAppOnView = (dom: HTMLDivElement) => {
    dom.appendChild(app.view as HTMLCanvasElement)
  }

  // 返回拖动中的元素
  const getDragTarget = () => {
    return computed(() => {
      return dragTarget
    })
  }

  // 渲染表格
  const renderTable = () => {
    // 画一个表格，宽度 600px, 高: 300px, 6列, 3行
    const container = new PIXI.Container();
    const line = new PIXI.Graphics();
    const tableWidth = 800;
    const tableHeight = 150;
    const tableCol = 6;
    const tableRow = 3;
    line.x = 0;
    line.y = 0;
    line.lineStyle(2, "#f40", 1);
    // 竖
    for(let col = 0; col <= tableCol; col++) {
      line.moveTo((tableWidth / tableCol)*col, 0);
      line.lineTo((tableWidth / tableCol)*col, tableHeight);
    }
    // 横
    for(let row = 0; row <= tableRow; row++) {
      line.moveTo(0, (tableHeight / tableRow) * row);
      line.lineTo(tableWidth, (tableHeight / tableRow) * row)
    }

    container.x = 100;
    container.y = 100;

    // ===
    container.hitArea = line.getBounds()
    container.eventMode = 'static'
    container.addEventListener('pointerdown', (event) => {
      // 设置锚点
      container.pivot.set(container.width / 2, container.height / 2)
      // 赋值
      dragTarget = container as any
      // 降低不透明度
      container.alpha = 0.5
      // 为画布添加鼠标移动事件
      app.stage.addEventListener('pointermove', appDragMove)
    })

    container.addChild(line)
    app.stage.addChild(container);
  }


  return {
    init,
    addElement,
    removeElement,
    getList,
    getApp,
    putAppOnView,
    getDragTarget,
  }

};

export default useCanvas;