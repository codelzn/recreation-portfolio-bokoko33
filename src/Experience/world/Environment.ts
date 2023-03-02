import * as THREE from "three"
import Experience from ".."
import Resources from "../utils/Resources"
export default class Room {
	private scene: THREE.Scene
	private resources: Resources
	private sunLight?: THREE.DirectionalLight
	private ambientLight?: THREE.AmbientLight
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
		this.sunLight.shadow.mapSize.set(2048, 2048)
		this.sunLight.position.set(-1.5, 7, 3)
		this.scene.add(this.sunLight)

		this.ambientLight = new THREE.AmbientLight(0xffffff, 1)
		this.scene.add(this.ambientLight)
	}

	public resize() {}
	public update() {}
}
