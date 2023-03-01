import * as THREE from "three"
import type Sizes from "./utils/Sizes"
import Experience from "."

export default class Camera {
	private sizes: Sizes
	private scene: THREE.Scene
	private canvas: HTMLCanvasElement
	public perspectiveCamera?: THREE.PerspectiveCamera
	public orthographicCamera?: THREE.OrthographicCamera
	private frustum: number = 5
	public constructor(private readonly experience: Experience) {
		this.sizes = this.experience.sizes
		this.scene = this.experience.scene
		this.canvas = this.experience.canvas

		this.createPerspectiveCamera()
		this.createOrthographicCamera()
	}
	private createPerspectiveCamera() {
		this.perspectiveCamera = new THREE.PerspectiveCamera(
			35,
			this.sizes.aspect,
			0.1,
			100
		)
		this.scene.add(this.perspectiveCamera)
	}

	private createOrthographicCamera() {
		this.orthographicCamera = new THREE.OrthographicCamera(
			(-this.sizes.aspect * this.frustum) / 2,
			(this.sizes.aspect * this.frustum) / 2,
			this.frustum / 2,
			-this.frustum / 2,
			-100,
			100
		)
		this.scene.add(this.orthographicCamera)
	}
	public resize() {
		this.perspectiveCamera!.aspect = this.sizes.aspect
		this.perspectiveCamera!.updateProjectionMatrix()

		this.orthographicCamera!.left = (-this.sizes.aspect * this.frustum) / 2
		this.orthographicCamera!.right = (this.sizes.aspect * this.frustum) / 2
		this.orthographicCamera!.top = this.frustum / 2
		this.orthographicCamera!.bottom = -this.frustum / 2
		this.orthographicCamera!.updateProjectionMatrix()
	}
	public update() {}
}
