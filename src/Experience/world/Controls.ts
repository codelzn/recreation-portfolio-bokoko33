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
	private firstMoveTimeline?: gsap.core.Timeline
	private secondMoveTimeline?: gsap.core.Timeline
	private thirdMoveTimeline?: gsap.core.Timeline
	private room: THREE.Object3D
	private rectLight?: THREE.RectAreaLight
	constructor(private readonly experience: Experience) {
		this.scene = this.experience.scene
		this.sizes = this.experience.sizes
		this.room = this.experience.world.room!.actualRoom
		this.orthographicCamera = this.experience.camera.orthographicCamera
		this.room.children.forEach(child => {
			if (child.type === "RectAreaLight") {
				this.rectLight = child as THREE.RectAreaLight
			}
		})
		gsap.registerPlugin(ScrollTrigger)
		document.querySelector<HTMLDivElement>(".page")!.style.overflow = "visible"
		this.setScrollTrigger()
	}
	private setScrollTrigger() {
		ScrollTrigger.matchMedia({
			"(min-width: 969px)": () => {
				this.firstMoveTimeline = gsap.timeline({
					scrollTrigger: {
						trigger: ".first-move",
						start: "top top",
						end: "bottom bottom",
						scrub: 0.6,
						invalidateOnRefresh: true,
					},
				})
				this.firstMoveTimeline.to(this.room.position, {
					x: () => this.sizes.width * 0.0014,
				})

				this.secondMoveTimeline = gsap
					.timeline({
						scrollTrigger: {
							trigger: ".second-move",
							start: "top top",
							end: "bottom bottom",
							scrub: 0.6,
							invalidateOnRefresh: true,
						},
					})
					.to(
						this.room.position,
						{
							x: () => 1,
							z: () => this.sizes.height * 0.0032,
						},
						"same"
					)
					.to(
						this.room.scale,
						{
							x: 0.4,
							y: 0.4,
							z: 0.4,
						},
						"same"
					)
					.to(
						this.rectLight!,
						{
							width: 0.5 * 4,
							height: 0.7 * 4,
						},
						"same"
					)
				this.thirdMoveTimeline = gsap
					.timeline({
						scrollTrigger: {
							trigger: ".third-move",
							start: "top top",
							end: "bottom bottom",
							scrub: 0.6,
							invalidateOnRefresh: true,
						},
					})
          .to(this.orthographicCamera!.position, {
            y: 1.5,
            x: -4.1
          })
			},
			"(max-width: 968px)": () => {
				console.log("mobile")
			},
		})
	}
	public resize() {}
	public update() {}
}
