import * as THREE from "three"
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader"
import Experience from ".."
import Time from "../utils/Time"
import Resources from "../utils/Resources"
import gsap from "gsap"
export default class Room {
	private scene: THREE.Scene
	private time: Time
	private resources: Resources
	private room: GLTF
	public actualRoom: THREE.Object3D
	public roomChildren: { [key: string]: THREE.Object3D } = {}
	private mixer?: THREE.AnimationMixer
	private swim?: THREE.AnimationAction
	private lerp: { current: number; target: number; ease: number } = {
		current: 0,
		target: 0,
		ease: 0.1,
	}
	private rotation: number = 0
	constructor(private readonly experience: Experience) {
		this.scene = this.experience.scene
		this.time = this.experience.time
		this.resources = this.experience.resources
		this.room = this.resources.items.room as GLTF
		this.actualRoom = this.room.scene
		this.setModel()
		this.setAnimation()
		this.onMouseMove()
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
			child.scale.set(0, 0, 0);
      if (child.name === "Cube") {
				child.position.set(0, -1, 0)
				child.rotation.y = Math.PI / 4
			}
			this.roomChildren[child.name.toLowerCase()] = child
		})

		const width = 0.5
		const height = 0.7
		const intensity = 1
		const rectLight = new THREE.RectAreaLight(
			0xffffff,
			intensity,
			width,
			height
		)
		rectLight.position.set(7.68244, 7, 0.5)
		rectLight.rotation.x = -Math.PI / 2
		rectLight.rotation.z = Math.PI / 4
		this.actualRoom.add(rectLight)

		this.roomChildren["rectLight"] = rectLight
		this.scene.add(this.actualRoom)
		this.actualRoom.scale.set(0.11, 0.11, 0.11)
	}
	private setAnimation() {
		this.mixer = new THREE.AnimationMixer(this.actualRoom)
		this.swim = this.mixer.clipAction(this.room.animations[0])
		this.swim.play()
	}

	private onMouseMove() {
		window.addEventListener("mousemove", e => {
			this.rotation =
				((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth
			this.lerp.target = this.rotation * 0.01
		})
	}
	public resize() {}
	public update() {
		this.lerp.current = gsap.utils.interpolate(
			this.lerp.current,
			this.lerp.target,
			this.lerp.ease
		)
		this.actualRoom.rotation.y = this.lerp.current
		if (this.mixer) {
			this.mixer.update(this.time.delta * 0.0009)
		}
	}
}
