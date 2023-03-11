import { EventEmitter } from "events"
import * as THREE from "three"
import Experience from "."
import World from "./world/World"
import gsap from "gsap"
import convert from "./utils/covertDivsToSpans"
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
	private touchStart?: (e: TouchEvent) => void
	private touchMove?: (e: TouchEvent) => void
	private initalY: number | null = null
	private moveFlag: boolean = false
	private scaleFlag: boolean = false
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
		convert(document.querySelector(".intro-text")!)
		convert(document.querySelector(".hero-main-title")!)
		convert(document.querySelector(".hero-main-description")!)
		convert(document.querySelector(".hero-second-subheading")!)
		convert(document.querySelector(".second-sub")!)
		this.room = this.experience.world.room?.actualRoom
		this.roomChildren = this.experience.world.room!.roomChildren
	}

	private firstIntro() {
		return new Promise(resolve => {
			this.firstTimeline = gsap.timeline()
			this.firstTimeline.set(".animatedis", { y: 0, yPercent: 100 })
			this.firstTimeline.to(".preloader", {
				opacity: 0,
				onComplete: () => {
					document.querySelector(".preloader")!.classList.add("hidden")
				},
			})
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
			this.firstTimeline
				.to(".intro-text .animatedis", {
					yPercent: 0,
					stagger: 0.05,
					ease: "back.out(1.7)",
				})
				.to(
					".arrow-svg-wrapper",
					{
						opacity: 1,
					},
					"same"
				)
				.to(
					".toggle-bar",
					{
						opacity: 1,
						onComplete: resolve,
					},
					"same"
				)
		})
	}

	private onScroll(e: WheelEvent) {
		if (e.deltaY > 0) {
			this.removeEventListeners()
			this.PlaysecondIntro()
		}
	}

	private onTouch(e: TouchEvent) {
		this.initalY = e.touches[0].clientY
	}

	private onTouchMove(e: TouchEvent) {
		let currentY = e.touches[0].clientY
		let difference = currentY - this.initalY!
		if (difference > 0) {
			this.removeEventListeners()
			this.PlaysecondIntro()
		}
		this.initalY = null
	}

	private removeEventListeners() {
		window.removeEventListener("wheel", this.scrollOnceEvent!)
		window.removeEventListener("touchstart", this.touchStart!)
		window.removeEventListener("touchmove", this.touchMove!)
	}

	private async playIntro() {
		this.scaleFlag = true
		await this.firstIntro()
		this.moveFlag = true
		this.scrollOnceEvent = this.onScroll.bind(this)
		this.touchStart = this.onTouch.bind(this)
		this.touchMove = this.onTouchMove.bind(this)
		window.addEventListener("wheel", this.scrollOnceEvent)
		window.addEventListener("touchstart", this.touchStart)
		window.addEventListener("touchmove", this.touchMove)
	}

	private async PlaysecondIntro() {
		this.moveFlag = false
		this.scaleFlag = false
		await this.secondIntro()
		this.scaleFlag = false
		this.emit("enablecontrols")
	}

	private secondIntro() {
		return new Promise(resolve => {
			this.secondTimeline = gsap.timeline()
			this.secondTimeline
				.to(
					".intro-text .animatedis",
					{
						yPercent: 100,
						stagger: 0.05,
						ease: "back.in(1.7)",
					},
					"fadeout"
				)
				.to(
					".arrow-svg-wrapper",
					{
						opacity: 0,
					},
					"fadeout"
				)
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
				.to(
					this.roomChildren.cube.scale,
					{
						x: 0,
						y: 0,
						z: 0,
						duration: 1,
					},
					"introtext"
				)
				.to(
					".hero-main-title .animatedis",
					{
						yPercent: 0,
						stagger: 0.07,
						ease: "back.out(1.7)",
					},
					"introtext"
				)
				.to(
					".hero-main-description .animatedis",
					{
						yPercent: 0,
						stagger: 0.07,
						ease: "back.out(1.7)",
					},
					"introtext"
				)
				.to(
					".first-sub .animatedis",
					{
						yPercent: 0,
						stagger: 0.07,
						ease: "back.out(1.7)",
					},
					"introtext"
				)
				.to(
					".second-sub .animatedis",
					{
						yPercent: 0,
						stagger: 0.07,
						ease: "back.out(1.7)",
					},
					"introtext"
				)
				.to(
					this.roomChildren.aquarium.scale,
					{
						x: 1,
						y: 1,
						z: 1,
						ease: "back.out(2.2)",
						duration: 0.5,
					},
					">-0.5"
				)
				.to(
					this.roomChildren.clock.scale,
					{
						x: 1,
						y: 1,
						z: 1,
						ease: "back.out(2.2)",
						duration: 0.5,
					},
					">-0.4"
				)
				.to(
					this.roomChildren.shelves.scale,
					{
						x: 1,
						y: 1,
						z: 1,
						ease: "back.out(2.2)",
						duration: 0.5,
					},
					">-0.3"
				)
				.to(
					this.roomChildren.floor_items.scale,
					{
						x: 1,
						y: 1,
						z: 1,
						ease: "back.out(2.2)",
						duration: 0.5,
					},
					">-0.2"
				)
				.to(
					this.roomChildren.desks.scale,
					{
						x: 1,
						y: 1,
						z: 1,
						ease: "back.out(2.2)",
						duration: 0.5,
					},
					">-0.1"
				)
				.to(
					this.roomChildren.table_stuff.scale,
					{
						x: 1,
						y: 1,
						z: 1,
						ease: "back.out(2.2)",
						duration: 0.5,
					},
					">-0.1"
				)
				.to(this.roomChildren.computer.scale, {
					x: 1,
					y: 1,
					z: 1,
					ease: "back.out(2.2)",
					duration: 0.5,
				})
				.set(this.roomChildren.mini_floor.scale, {
					x: 1,
					y: 1,
					z: 1,
				})
				.to(
					this.roomChildren.chair.scale,
					{
						x: 1,
						y: 1,
						z: 1,
						ease: "back.out(2.2)",
						duration: 0.5,
					},
					"chair"
				)
				.to(
					this.roomChildren.fish.scale,
					{
						x: 1,
						y: 1,
						z: 1,
						ease: "back.out(2.2)",
						duration: 0.5,
					},
					"chair"
				)
				.to(
					this.roomChildren.chair.rotation,
					{
						y: 4 * Math.PI + Math.PI / 4,
						ease: "power2.out",
						duration: 1,
					},
					"chair"
				)
				.to(".arrow-svg-wrapper", {
					opacity: 1,
					onComplete: resolve,
				})
		})
	}
	private move() {
		if (this.device === "desktop") {
			this.room?.position.set(-1, 0, 0)
		} else {
			this.room?.position.set(0, 0, -1)
		}
	}

	private scale() {
		// @ts-ignore
		this.roomChildren.rectLight.width = 0
		// @ts-ignore
		this.roomChildren.rectLight.height = 0
		if (this.device === "desktop") {
			this.room?.scale.set(0.11, 0.11, 0.11)
		} else {
			this.room?.scale.set(0.07, 0.07, 0.07)
		}
	}
	public update() {
		if (this.moveFlag) {
			this.move()
		}
		if (this.scaleFlag) {
			this.scale()
		}
	}
}
