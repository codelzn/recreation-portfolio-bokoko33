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
	private helper?: THREE.CameraHelper
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
		this.perspectiveCamera.position.set(29, 14, 12)
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
		this.scene.add(this.orthographicCamera)
		this.helper = new THREE.CameraHelper(this.orthographicCamera)
		this.scene.add(this.helper)

		const size = 20
		const divisions = 20

		const gridHelper = new THREE.GridHelper(size, divisions)
		this.scene.add(gridHelper)

		const axesHelper = new THREE.AxesHelper(10)
		this.scene.add(axesHelper)
	}

	private setOrbitControls() {
		this.controls = new OrbitControls(this.perspectiveCamera!, this.canvas)
		this.controls.enableDamping = true
	}
	public resize() {
		this.perspectiveCamera!.aspect = this.sizes.aspect
		this.perspectiveCamera!.updateProjectionMatrix()

		this.orthographicCamera!.left =
			(-this.sizes.aspect * this.sizes.frustum) / 2
		this.orthographicCamera!.right =
			(this.sizes.aspect * this.sizes.frustum) / 2
		this.orthographicCamera!.top = this.sizes.frustum / 2
		this.orthographicCamera!.bottom = -this.sizes.frustum / 2
		this.orthographicCamera!.updateProjectionMatrix()
	}
	public update() {
		this.controls?.update()
		if (this.helper) {
			this.helper.matrixWorldNeedsUpdate = true
			this.helper.update()
			this.helper.position.copy(this.orthographicCamera!.position)
			this.helper.rotation.copy(this.orthographicCamera!.rotation)
		}
	}
}
