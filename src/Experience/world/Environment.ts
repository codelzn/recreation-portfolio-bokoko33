import * as THREE from "three"
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader"
import Experience from ".."
import Resources from "../utils/Resources"
export default class Room {
  private scene: THREE.Scene
  private resources: Resources
  private sunLight?: THREE.DirectionalLight
	constructor(private readonly experience: Experience) {
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.setSunLight()
  }
  private setSunLight() {
    this.sunLight = new THREE.DirectionalLight(0xffffff, 3)
    this.sunLight.castShadow = true
    this.sunLight.shadow.camera.far = 20
    this.sunLight.shadow.normalBias = 0.05
    this.sunLight.shadow.mapSize.set(1024, 1024)
    this.sunLight.position.set(1.5, 7, 3)
    this.scene.add(this.sunLight)
  }

	public resize() {}
	public update() {}
}
