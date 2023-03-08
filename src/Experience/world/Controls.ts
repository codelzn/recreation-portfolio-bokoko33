import * as THREE from "three"
import gsap from "gsap"
import Experience from ".."
import Sizes from "../utils/Sizes"
import Room from "./Room"
import { ScrollTrigger } from "gsap/ScrollTrigger"
export default class Controls {
	private scene: THREE.Scene
	private orthographicCamera?: THREE.OrthographicCamera
	private sizes: Sizes
	private timeline?: gsap.core.Timeline
	private room: THREE.Object3D
	constructor(private readonly experience: Experience) {
		this.scene = this.experience.scene
		this.sizes = this.experience.sizes
		this.room = this.experience.world.room!.actualRoom
		this.orthographicCamera = this.experience.camera.orthographicCamera
		gsap.registerPlugin(ScrollTrigger)
		document.querySelector<HTMLDivElement>(".page")!.style.overflow = "visible"
		this.setPath()
	}
	private setPath() {
		this.timeline = gsap.timeline()
		this.timeline.to(this.room.position, {
			x: () => this.sizes.width * 0.00094,
			scrollTrigger: {
				trigger: ".first-move",
				markers: true,
				start: "top top",
				end: "bottom bottom",
        scrub: 0.6,
        invalidateOnRefresh: true,
			},
		})
	}
	public resize() {}
	public update() {}
}
