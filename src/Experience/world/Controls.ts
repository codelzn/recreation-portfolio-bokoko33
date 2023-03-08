import * as THREE from "three"
import gsap from "gsap"
import Experience from ".."
import Sizes from "../utils/Sizes"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import ASScroll from "@ashthornton/asscroll"
export default class Controls {
	private orthographicCamera?: THREE.OrthographicCamera
	private sizes: Sizes
	private firstMoveTimeline?: gsap.core.Timeline
	private secondMoveTimeline?: gsap.core.Timeline
	private thirdMoveTimeline?: gsap.core.Timeline
	private secondPartTimeline?: gsap.core.Timeline
	private room: THREE.Object3D
	private rectLight?: THREE.RectAreaLight
	private progressWrapper?: HTMLDivElement
	private progressBar?: HTMLDivElement
	// private asscroll?: ASScroll
	constructor(private readonly experience: Experience) {
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
		this.setSmoothScroll()
		this.setScrollTrigger()
	}
	setupASScroll() {
		// https://github.com/ashthornton/asscroll
		const asscroll = new ASScroll({
			ease: 0.1,
			disableRaf: true,
		})

		gsap.ticker.add(asscroll.update)

		ScrollTrigger.defaults({
			scroller: asscroll.containerElement,
		})

		ScrollTrigger.scrollerProxy(asscroll.containerElement, {
			scrollTop(value) {
				if (arguments.length) {
					asscroll.currentPos = value!
					return
				}
				return asscroll.currentPos
			},
			getBoundingClientRect() {
				return {
					top: 0,
					left: 0,
					width: window.innerWidth,
					height: window.innerHeight,
				}
			},
			fixedMarkers: true,
		})

		asscroll.on("update", ScrollTrigger.update)
		ScrollTrigger.addEventListener("refresh", asscroll.resize)

		requestAnimationFrame(() => {
			asscroll.enable({
				newScrollElements: document.querySelectorAll(
					".gsap-marker-start, .gsap-marker-end, [asscroll]"
				),
			})
		})
		return asscroll
	}

	private setSmoothScroll() {
		this.setupASScroll()
	}

	private setScrollTrigger() {
		ScrollTrigger.matchMedia({
			"(min-width: 969px)": () => {
				this.room.scale.set(0.11, 0.11, 0.11)
				this.rectLight!.width = 0.5
				this.rectLight!.height = 0.7
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
						x: -4.1,
					})
			},
			"(max-width: 968px)": () => {
				this.room.scale.set(0.07, 0.07, 0.07)
				this.room.position.set(0, 0, 0)
				this.rectLight!.width = 0.3
				this.rectLight!.height = 0.4
				this.firstMoveTimeline = gsap
					.timeline({
						scrollTrigger: {
							trigger: ".first-move",
							start: "top top",
							end: "bottom bottom",
							scrub: 0.6,
							invalidateOnRefresh: true,
						},
					})
					.to(this.room.scale, {
						x: 0.1,
						y: 0.1,
						z: 0.1,
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
						this.room.scale,
						{
							x: 0.25,
							y: 0.25,
							z: 0.25,
						},
						"same"
					)
					.to(
						this.rectLight!,
						{
							width: 0.3 * 3.4,
							height: 0.4 * 3.4,
						},
						"same"
					)
					.to(
						this.room.position,
						{
							x: 1.5,
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
					.to(this.room.position, {
						z: -4.5,
					})
			},
			all: () => {
				const sections = document.querySelectorAll(".section")
				sections.forEach(section => {
					this.progressWrapper = section.querySelector(".progress-wrapper")!
					this.progressBar = section.querySelector(".progress-bar")!
					if (section.classList.contains("right")) {
						gsap.to(section, {
							borderTopLeftRadius: 10,
							scrollTrigger: {
								trigger: section,
								start: "top bottom",
								end: "top top",
								scrub: 0.6,
							},
						})
						gsap.to(section, {
							borderBottomLeftRadius: 700,
							scrollTrigger: {
								trigger: section,
								start: "bottom bottom",
								end: "buttom top",
								scrub: 0.6,
							},
						})
					} else {
						gsap.to(section, {
							borderTopRightRadius: 10,
							scrollTrigger: {
								trigger: section,
								start: "top bottom",
								end: "top top",
								scrub: 0.6,
							},
						})
						gsap.to(section, {
							borderBottomRightRadius: 700,
							scrollTrigger: {
								trigger: section,
								start: "bottom bottom",
								end: "buttom top",
								scrub: 0.6,
							},
						})
					}
					gsap.from(this.progressBar, {
						scaleY: 0,
						scrollTrigger: {
							trigger: section,
							start: "top top",
							end: "bottom bottom",
							scrub: 0.4,
							pin: this.progressWrapper,
							pinSpacing: false,
						},
					})
				})
				const animeObj: { [key: string]: gsap.core.Tween } = {}
				this.secondPartTimeline = gsap.timeline({
					scrollTrigger: {
						trigger: ".third-move",
						start: "center center",
					},
				})
				this.room.children.forEach(child => {
					if (child.name === "Mini_Floor") {
						animeObj.first = gsap.to(child.position, {
							x: -5.44055,
							z: 13.6135,
							duration: 0.3,
						})
					}
					if (child.name === "Mailbox") {
						animeObj.second = gsap.to(child.scale, {
							x: 1,
							y: 1,
							z: 1,
							duration: 0.3,
						})
					}
					if (child.name === "Lamp") {
						animeObj.third = gsap.to(child.scale, {
							x: 1,
							y: 1,
							z: 1,
							ease: "back.out(2)",
							duration: 0.3,
						})
					}
					if (child.name === "FloorFirst") {
						animeObj.fourth = gsap.to(child.scale, {
							x: 1,
							y: 1,
							z: 1,
							ease: "back.out(2)",
							duration: 0.3,
						})
					}
					if (child.name === "FloorSecond") {
						animeObj.fifth = gsap.to(child.scale, {
							x: 1,
							y: 1,
							z: 1,
							duration: 0.3,
						})
					}
					if (child.name === "FloorThird") {
						animeObj.sixth = gsap.to(child.scale, {
							x: 1,
							y: 1,
							z: 1,
							ease: "back.out(2)",
							duration: 0.3,
						})
					}
					if (child.name === "Dirt") {
						animeObj.seventh = gsap.to(child.scale, {
							x: 1,
							y: 1,
							z: 1,
							ease: "back.out(2)",
							duration: 0.3,
						})
					}
					if (child.name === "Flower1") {
						animeObj.eighth = gsap.to(child.scale, {
							x: 1,
							y: 1,
							z: 1,
							ease: "back.out(2)",
							duration: 0.3,
						})
					}
					if (child.name === "Flower2") {
						animeObj.ninth = gsap.to(child.scale, {
							x: 1,
							y: 1,
							z: 1,
							ease: "back.out(2)",
							duration: 0.3,
						})
					}
				})
				this.secondPartTimeline.add(animeObj.first)
				this.secondPartTimeline.add(animeObj.second)
				this.secondPartTimeline.add(animeObj.third)
				this.secondPartTimeline.add(animeObj.fourth, "-=0.2")
				this.secondPartTimeline.add(animeObj.fifth, "-=0.2")
				this.secondPartTimeline.add(animeObj.sixth, "-=0.2")
				this.secondPartTimeline.add(animeObj.seventh, "-=0.2")
				this.secondPartTimeline.add(animeObj.eighth)
				this.secondPartTimeline.add(animeObj.ninth, "-=0.1")
			},
		})
  }
  public log() {
    console.log(this.secondMoveTimeline)
    console.log(this.thirdMoveTimeline)
  }
	public resize() {}
	public update() {}
}
