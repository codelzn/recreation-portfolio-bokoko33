import * as THREE from "three"
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader"
import Experience from ".."
import Time from "../utils/Time"
import Resources from "../utils/Resources"
export default class Room {
	private scene: THREE.Scene
	private time: Time
	private resources: Resources
	private room: GLTF
	private actualRoom: THREE.Object3D
	private mixer?: THREE.AnimationMixer
	private swim?: THREE.AnimationAction
	constructor(private readonly experience: Experience) {
		this.scene = this.experience.scene
		this.time = this.experience.time
		this.resources = this.experience.resources
		this.room = this.resources.items.room as GLTF
		this.actualRoom = this.room.scene
		this.setModel()
		this.setAnimation()
	}
	private setModel() {
    this.actualRoom.children.forEach(child => {
			child.castShadow = true
			child.receiveShadow = true
			if (child instanceof THREE.Group) {
				child.children.forEach(child => {
					child.castShadow = true
					child.receiveShadow = true
				})
			}
			if (child.name === "Aquarium") {
				const material = new THREE.MeshPhysicalMaterial()
				material.roughness = 0
				material.color.set(0x549dd2)
				material.ior = 3
				material.transmission = 1
				material.opacity = 1
				material.depthWrite = false
				material.depthTest = false
				// @ts-ignore
				child.children[0].material = material
			}
			if (child.name === "Computer") {
				// @ts-ignore
				child.children[1].material = new THREE.MeshBasicMaterial({
					map: this.resources.items.screen,
				})
			}
			if (child.name === "Mini_Floor") {
				child.position.x = -0.289521
				child.position.z = 8.83572
			}
			if (child.name === "Cube") {
				child.position.set(0, -1, 0)
				child.rotation.y = Math.PI / 4
			}
		})
		this.scene.add(this.actualRoom)
		this.actualRoom.scale.set(0.11, 0.11, 0.11)
	}
	private setAnimation() {
		this.mixer = new THREE.AnimationMixer(this.actualRoom)
		this.swim = this.mixer.clipAction(this.room.animations[0])
		this.swim.play()
	}

	public resize() {}
	public update() {
		if (this.mixer) {
			this.mixer.update(this.time.delta * 0.0009)
		}
	}
}
