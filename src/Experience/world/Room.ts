import * as THREE from "three"
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader"
import Experience from ".."
import Resources from "../utils/Resources"
export default class Room {
  private scene: THREE.Scene
  private resources: Resources
  private room: GLTF
  private actualRoom: THREE.Object3D
	constructor(private readonly experience: Experience) {
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.room = this.resources.items.room as GLTF
    this.actualRoom = this.room.scene
    this.setModel()
  }
  private setModel() {
    this.scene.add(this.actualRoom)
  }

	public resize() {}
	public update() {}
}
