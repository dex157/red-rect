import * as PIXI from "pixi.js"

export enum Entity {
  RedRect,
}

export class Render implements Disposable {
  private app: PIXI.Application<HTMLCanvasElement>
  private tickListeners: ((delta: number) => void)[]

  constructor(
    private window: Window,
    private width: number,
    private height: number,
  ) {
    this.tickListeners = []
    this.app = new PIXI.Application({
      width: width,
      height: height,
      background: 0x2980b9,
    })

    window.document.body.appendChild(this.app.view)

    this.app.ticker.add((delta) => {
      this.tickListeners.forEach((ticListener) => ticListener(delta))
    })
  }

  createEntity(name: Entity): PIXI.DisplayObject {
    switch (name) {
      case Entity.RedRect: {
        const redRect = new PIXI.Graphics()
        redRect.beginFill(0xff0000)
        redRect.drawRect(0, 0, 100, 100)
        redRect.drawRect(-this.width, 0, 100, 100)
        redRect.drawRect(0, -this.height, 100, 100)
        redRect.drawRect(-this.width, -this.height, 100, 100)
        this.app.stage.addChild(redRect)
        return redRect
      }
      default: {
        const neverValue: never = name
        throw new Error(`Never value is assigned ${neverValue}`)
      }
    }
  }

  onTick(callback: (delta: number) => void) {
    this.tickListeners.push(callback)

    return () => {
      this.tickListeners = this.tickListeners.filter((cb) => cb !== callback)
    }
  }

  [Symbol.dispose]() {
    this.window.document.body.removeChild(this.app.view)
    this.app.destroy()
  }
}
