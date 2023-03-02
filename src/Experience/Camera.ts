import * as THREE from "three"
import type Sizes from "./utils/Sizes"
import Experience from "."

export default class Camera {
	private sizes: Sizes
	private scene: THREE.Scene
	public orthographicCamera?: THREE.OrthographicCamera
	public constructor(private readonly experience: Experience) {
		this.sizes = this.experience.sizes
		this.scene = this.experience.scene

		this.createOrthographicCamera()
	}

	private createOrthographicCamera() {
		this.orthographicCamera = new THREE.OrthographicCamera(
			(-this.sizes.aspect * this.sizes.frustum) / 2,
			(this.sizes.aspect * this.sizes.frustum) / 2,
			this.sizes.frustum / 2,
			-this.sizes.frustum / 2,
			-50,
			50
		)
		this.orthographicCamera.position.y = 6.65
		this.orthographicCamera.position.z = 10
		this.orthographicCamera.rotation.x = -Math.PI / 6
		this.scene.add(this.orthographicCamera)
	}
	public resize() {
		this.orthographicCamera!.left =
			(-this.sizes.aspect * this.sizes.frustum) / 2
		this.orthographicCamera!.right =
			(this.sizes.aspect * this.sizes.frustum) / 2
		this.orthographicCamera!.top = this.sizes.frustum / 2
		this.orthographicCamera!.bottom = -this.sizes.frustum / 2
		this.orthographicCamera!.updateProjectionMatrix()
	}
	public update() {}
}
