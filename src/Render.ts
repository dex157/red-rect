import * as PIXI from "pixi.js"

export enum Entity {
  RedRect,
}

export class Render implements Disposable {
  private app: PIXI.Application<HTMLCanvasElement>
  private subscribers: ((delta: number) => void)[]

  public constructor(
    private window: Window,
    private width: number,
    private height: number,
  ) {
    this.subscribers = []
    this.app = new PIXI.Application({
      width: width,
      height: height,
      background: 0x2980b9,
    })

    window.document.body.appendChild(this.app.view)

    this.app.ticker.add((delta) => {
      this.subscribers.forEach((subscriber) => subscriber(delta))
    })
  }

  public createEntity(name: Entity): PIXI.DisplayObject {
    switch (name) {
      case Entity.RedRect:
        const redRect = new PIXI.Graphics()
        this.app.stage.addChild(redRect)

        redRect.beginFill(0xff0000)
        redRect.drawRect(0, 0, 100, 100)
        redRect.drawRect(-this.width, 0, 100, 100)
        redRect.drawRect(0, -this.height, 100, 100)
        redRect.drawRect(-this.width, -this.height, 100, 100)

        return redRect

      default:
        const neverValue: never = name
        throw new Error(`Never value is assigned ${neverValue}`)
    }
  }

  public onTick(callback: (delta: number) => void) {
    this.subscribers.push(callback)

    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback)
    }
  }

  [Symbol.dispose]() {
    this.window.document.body.removeChild(this.app.view)
    this.app.destroy()
  }
}
