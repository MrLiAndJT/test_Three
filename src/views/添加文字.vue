<template>
  <div ref="warpDom" class="wrap"></div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'

const warpDom = ref<HTMLDivElement>()

const render = () => {
  // 1、创建场景
  const scene = new THREE.Scene()

  // 2、创建摄像机
  const camera = new THREE.PerspectiveCamera()
  camera.position.z = 80

  // 3、创建渲染器
  const renderer = new THREE.WebGLRenderer({
    // antialias: true,
    // alpha: true
  })
  // 设置渲染器宽高
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 把渲染器通过canvas标签，渲染到浏览器上
  warpDom.value?.appendChild(renderer.domElement)

  // 加载模型文件
  const loader = new GLTFLoader()
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('./draco/gltf/')
  loader.setDRACOLoader(dracoLoader)
  loader.load('/public/printer.glb', (gltf) => {
    gltf.scene.lookAt(new THREE.Vector3(0, 0, 0))
    gltf.scene.traverse((child) => {
      // const tag = createTag(child.position)
      // gltf.scene.add(tag) //添加到指定的场景里
      if (child.name === 'SDP24喷墨打印机2-192,192,192_46') {
        const tag = createTag({
          ...child.position,
          x: 13,
          y: 7,
          z: 8
        })
        const gui = new dat.GUI()
        gui.add(tag.position, 'x', 0, 20).name('x位置')
        gui.add(tag.position, 'y', 0, 20).name('y位置')
        gui.add(tag.position, 'z', 0, 20).name('z位置')
        console.log('position: ', child.position)
        gltf.scene.add(tag) //添加到指定的场景里
      }
    })
    scene.add(gltf.scene)
  })

  // 添加辅助轴线
  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)

  // 添加轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.update()

  // 添加灯光效果
  // const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  // scene.add(directionalLight)

  // 添加灯光
  const addLight = () => {
    const light1 = new THREE.DirectionalLight(0xffffff, 1)
    light1.position.set(0, 0, 10)
    scene.add(light1)
    const light2 = new THREE.DirectionalLight(0xffffff, 1)
    light2.position.set(0, 0, -10)
    scene.add(light2)
    const light3 = new THREE.DirectionalLight(0xffffff, 1)
    light3.position.set(10, 0, 0)
    scene.add(light3)
    const light4 = new THREE.DirectionalLight(0xffffff, 1)
    light4.position.set(-10, 0, 0)
    scene.add(light4)
    const light5 = new THREE.DirectionalLight(0xffffff, 1)
    light5.position.set(0, 10, 0)
    scene.add(light5)
    const light6 = new THREE.DirectionalLight(0xffffff, 0.3)
    light6.position.set(5, 10, 0)
    scene.add(light6)
    const light7 = new THREE.DirectionalLight(0xffffff, 0.3)
    light7.position.set(0, 10, 5)
    scene.add(light7)
    const light8 = new THREE.DirectionalLight(0xffffff, 0.3)
    light8.position.set(0, 10, -5)
    scene.add(light8)
    const light9 = new THREE.DirectionalLight(0xffffff, 0.3)
    light9.position.set(-5, 10, 0)
    scene.add(light9)
  }
  addLight()

  //创建标签元素
  function createTag(obj: any) {
    const element = document.createElement('div')
    element.className = 'tag'
    element.innerHTML = `<p>名称:测试123</p><p>温度：22°</p><p>湿度：29%</p>`
    element.style.color = '#fff'
    element.style.fontSize = '12px'
    element.style.transform = 'scale(0.3)'
    const object = new CSS3DObject(element)
    element.style.backgroundColor = 'rgb(0 227 255 / 30%)'
    element.style.padding = '10px 30px'
    element.style.borderRadius = '10px'
    object.visible = true
    //缩放比例
    object.scale.set(0.07, 0.07, 0.07)
    //指定摆放位置
    object.position.copy(obj)
    return object
  }

  const renderer2 = new CSS3DRenderer()
  renderer2.setSize(window.innerWidth, window.innerHeight)
  renderer2.domElement.style.position = 'absolute'
  renderer2.domElement.style.top = '0'
  warpDom.value?.appendChild(renderer2.domElement)
  var controls2 = new OrbitControls(camera, renderer2.domElement)

  function animate() {
    requestAnimationFrame(animate)
    controls.update()

    renderer.render(scene, camera)
    renderer2.render(scene, camera)
    controls2.update()
  }
  animate()
}

onMounted(() => {
  render()
})
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 100%;
}
:deep(.container-test) {
  background-color: #abcdef;
  color: #fff;
  font-size: 60px;
}
</style>
