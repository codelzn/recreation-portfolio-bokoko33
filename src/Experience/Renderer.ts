import Experience from "."
import * as THREE from "three"
import Camera from "./Camera"
import Sizes from "./utils/Sizes"
export default class Renderer {
	private sizes: Sizes
	private canvas: HTMLCanvasElement
	private scene: THREE.Scene
	private camera: Camera
	private renderer?: THREE.WebGLRenderer
	constructor(private readonly experience: Experience) {
		this.sizes = this.experience.sizes
		this.canvas = this.experience.canvas
		this.scene = this.experience.scene
		this.camera = this.experience.camera
		this.setRenderer()
	}

	private setRenderer() {
		this.renderer = new THREE.WebGLRenderer({
			canvas: this.canvas,
			antialias: true,
		})
		this.renderer.outputEncoding = THREE.sRGBEncoding
		this.renderer.toneMapping = THREE.CineonToneMapping
		this.renderer.toneMappingExposure = 1.75
		this.renderer.shadowMap.enabled = true
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
		this.renderer.setSize(this.sizes.width, this.sizes.height)
		this.renderer.setPixelRatio(this.sizes.pixelRatio)
	}

	public resize() {
		this.renderer!.setSize(this.sizes.width, this.sizes.height)
		this.renderer!.setPixelRatio(this.sizes.pixelRatio)
	}
	update() {
		this.renderer!.render(this.scene, this.camera.perspectiveCamera!)
	}
}
