import * as THREE from "three"
import Experience from ".."
import Resources from "../utils/Resources"
import gsap from "gsap"
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

	public switchTheme(theme: "light" | "dark") {
		if (theme === "dark") {
			gsap.to(this.sunLight!.color, {
				r: 0.17254901960784313,
				g: 0.23137254901960785,
				b: 0.6862745098039216,
			})
			gsap.to(this.ambientLight!.color, {
				r: 0.17254901960784313,
				g: 0.23137254901960785,
				b: 0.6862745098039216,
			})
			gsap.to(this.sunLight!, {
				intensity: 0.78,
			})
			gsap.to(this.ambientLight!, {
				intensity: 0.78,
			})
		} else {
			gsap.to(this.sunLight!.color, {
				r: 255 / 255,
				g: 255 / 255,
				b: 255 / 255,
			})
			gsap.to(this.ambientLight!.color, {
				r: 255 / 255,
				g: 255 / 255,
				b: 255 / 255,
			})
			gsap.to(this.sunLight!, {
				intensity: 3,
			})
			gsap.to(this.ambientLight!, {
				intensity: 1,
			})
		}
	}

	public resize() {}
	public update() {}
}
