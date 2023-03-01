import * as THREE from "three"
import type Sizes from "./utils/Sizes"
import Experience from "."
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default class Camera {
	private sizes: Sizes
  private scene: THREE.Scene
  private canvas: HTMLCanvasElement
	public perspectiveCamera?: THREE.PerspectiveCamera
	public orthographicCamera?: THREE.OrthographicCamera
	private frustum: number = 5
	private controls?: OrbitControls
	public constructor(private readonly experience: Experience) {
		this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas

		this.createPerspectiveCamera()
		this.createOrthographicCamera()
		this.setOrbitControls()
	}
	private createPerspectiveCamera() {
		this.perspectiveCamera = new THREE.PerspectiveCamera(
			35,
			this.sizes.aspect,
			0.1,
			100
		)
		this.scene.add(this.perspectiveCamera)
		this.perspectiveCamera.position.set(0, 0, 5)
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

	private setOrbitControls() {
		this.controls = new OrbitControls(
			this.perspectiveCamera!,
			this.canvas
    )
    this.controls.enableDamping = true
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
  public update() {
    this.controls?.update()
  }
}
