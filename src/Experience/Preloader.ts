import { EventEmitter } from "events"
import * as THREE from "three"
import Experience from "."
import World from "./world/World"
import gsap from "gsap"
import Sizes from "./utils/Sizes"

export default class Preloader extends EventEmitter {
	private world: World
	private sizes: Sizes
	private orthographicCamera: THREE.OrthographicCamera
	private device: "desktop" | "mobile"
	private room?: THREE.Object3D
	private roomChildren: { [key: string]: THREE.Object3D } = {}
	private firstTimeline?: gsap.core.Timeline
	private secondTimeline?: gsap.core.Timeline
	private scrollOnceEvent?: (e: WheelEvent) => void
	constructor(private readonly experience: Experience) {
		super()
		this.world = this.experience.world
		this.sizes = this.experience.sizes
		this.orthographicCamera = this.experience.camera.orthographicCamera!
		this.device = this.sizes.device
		this.sizes.on("switchdevice", (device: "desktop" | "mobile") => {
			this.device = device
		})
		this.world.on("worldready", () => {
			this.setAssets()
			this.playIntro()
		})
	}

	private setAssets() {
		this.room = this.experience.world.room?.actualRoom
		this.roomChildren = this.experience.world.room!.roomChildren
	}

	private firstIntro() {
		return new Promise(resolve => {
			this.firstTimeline = gsap.timeline()
			if (this.device === "desktop") {
				this.firstTimeline
					.to(this.roomChildren.cube.scale, {
						x: 1.4,
						y: 1.4,
						z: 1.4,
						ease: "back.out(2.5)",
						duration: 0.7,
					})
					.to(this.room!.position, {
						x: -1,
						ease: "power1.out",
						duration: 0.7,
						onComplete: resolve,
					})
			} else {
				this.firstTimeline
					.to(this.roomChildren.cube.scale, {
						x: 1.4,
						y: 1.4,
						z: 1.4,
						ease: "back.out(2.5)",
						duration: 0.7,
					})
					.to(this.room!.position, {
						z: -1,
						ease: "power1.out",
						duration: 0.7,
					})
			}
		})
	}

	private onScroll(e: WheelEvent) {
		if (e.deltaY > 0 && this.scrollOnceEvent) {
			window.removeEventListener("wheel", this.scrollOnceEvent)
			this.PlaysecondIntro()
		}
	}

	private async playIntro() {
		await this.firstIntro()
		this.scrollOnceEvent = this.onScroll.bind(this)
		window.addEventListener("wheel", this.scrollOnceEvent)
	}

	private async PlaysecondIntro() {
		await this.secondIntro()
	}

	private secondIntro() {
		return new Promise(() => {
			this.secondTimeline = gsap.timeline()
			if (this.device === "desktop") {
				this.secondTimeline
					.to(
						this.room!.position,
						{
							x: 0,
							y: 0,
							z: 0,
							ease: "power1.out",
						},
						"same"
					)
					.to(
						this.roomChildren.cube.rotation,
						{
							y: 2 * Math.PI + Math.PI / 4,
						},
						"same"
					)
					.to(
						this.roomChildren.cube.scale,
						{
							x: 10,
							y: 10,
							z: 10,
						},
						"same"
					)
					.to(
						this.orthographicCamera.position,
						{
							y: 6.5,
						},
						"same"
					)
					.to(
						this.roomChildren.cube.position,
						{
							x: 0.638711,
							y: 8.5618,
							z: 1.3243,
						},
						"same"
					)
					.set(this.roomChildren.body.scale, {
						x: 1,
						y: 1,
						z: 1,
					})
					.to(this.roomChildren.cube.scale, {
						x: 0,
						y: 0,
						z: 0,
					})
					.to(this.roomChildren.aquarium.scale, {
						x: 1,
						y: 1,
						z: 1,
						ease: "back.out(2.2)",
						duration: 0.5,
					})
			} else {
				this.secondTimeline.to(this.room!.position, {
					x: 0,
					y: 0,
					z: 0,
					ease: "power1.out",
					duration: 0.7,
				})
			}
		})
	}
}
