import { EventEmitter } from "events"
import * as THREE from "three"
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"

export default class Resources extends EventEmitter {
	private dracoLoader?: DRACOLoader
	private gltfLoader?: GLTFLoader
	public items: { [key: string]: any } = {}
	public video: { [key: string]: HTMLVideoElement } = {}
	public videoTexture: { [key: string]: THREE.VideoTexture } = {}
	public queue: number
	public loaded: number = 0
	constructor(private readonly assets: any[]) {
		super()
		this.queue = this.assets.length
		this.setLoaders()
		this.startLoading()
	}

	private setLoaders() {
		this.dracoLoader = new DRACOLoader()
		this.dracoLoader.setDecoderPath(
			"https://www.gstatic.com/draco/v1/decoders/"
		)
		this.dracoLoader.setDecoderConfig({ type: "js" })
		this.gltfLoader = new GLTFLoader()
		this.gltfLoader.setDRACOLoader(this.dracoLoader)
	}
	private startLoading() {
		for (const asset of this.assets) {
			if (asset.type === "glbModel") {
				this.gltfLoader!.load(asset.path, file =>
					this.singleAssetLoader(asset, file)
				)
			} else if (asset.type === "videoTexture") {
				this.video[asset.name] = document.createElement("video")
				this.video[asset.name].src = asset.path
				this.video[asset.name].playsInline = true
				this.video[asset.name].autoplay = true
				this.video[asset.name].loop = true
				this.video[asset.name].muted = true
				this.video[asset.name].play()
				this.videoTexture[asset.name] = new THREE.VideoTexture(
					this.video[asset.name]
				)
				this.videoTexture[asset.name].flipY = true
				this.videoTexture[asset.name].minFilter = THREE.NearestFilter
				this.videoTexture[asset.name].magFilter = THREE.NearestFilter
				this.videoTexture[asset.name].generateMipmaps = false
				this.videoTexture[asset.name].encoding = THREE.sRGBEncoding
				this.singleAssetLoader(asset, this.videoTexture[asset.name])
			}
		}
	}

	private singleAssetLoader(asset: any, file: GLTF | THREE.VideoTexture) {
		this.items[asset.name] = file
		this.loaded++
		if (this.loaded === this.queue) {
			this.emit("ready")
		}
	}
}
