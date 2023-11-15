<template>
  <div ref="renderDom" style="width: 100%; height: 100%"></div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
import { onMounted, ref } from 'vue'
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as dat from 'dat.gui'

const renderDom = ref<HTMLDivElement>()

onMounted(() => {
  // 1、创建场景
  const scene = new THREE.Scene()

  // 2、创建摄像机
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

  // 3、创建渲染器
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)

  // 创建立方体
  const geometry = new THREE.BoxGeometry(1, 1, 1)

  // 创建材质
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })

  // 根据几何体与材质创建物体
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)
  console.log('cube: ', cube)

  const params = {
    color: '#abcdef',
    fn() {
      gsap.to(cube.position, { x: 5, yoyo: true, repeat: -1, duration: 3 })
    }
  }
  // cube.material.color.set('#abcdef')

  const gui = new dat.GUI()
  gui.add(cube.position, 'x', 0, 5).name('x位置')
  gui
    .addColor(params, 'color')
    .name('颜色')
    .onChange((value) => {
      cube.material.color.set(value)
    })

  gui.add(params, 'fn').name('运动函数')

  //  创建三维辅助线
  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)

  // 添加轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.update()

  camera.position.z = 5

  renderDom.value?.appendChild(renderer.domElement)

  window.addEventListener('resize', () => {
    // 更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight
    // 更新摄像机投影矩阵
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    // 设置像素比
    renderer.setPixelRatio(window.devicePixelRatio)
  })

  function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }
  renderer.render(scene, camera)
  animate()
})
</script>

<style lang="scss" scoped></style>
