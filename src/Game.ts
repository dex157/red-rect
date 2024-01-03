import { Animated, Interactive } from "./GameInterfaces"
import { Rect } from "./GameObjects/Rect"
import { GameKey, KeyboardController } from "./KeyboardController"
import { Entity, Render } from "./Render"

export class Game implements Disposable {
  private renderModule: Render
  private keyboardController: KeyboardController
  private animatedObjects: Animated[] = []
  private interactiveObjects: Interactive[] = []

  public constructor(width: number, height: number) {
    this.renderModule = new Render(window, width, height)
    this.renderModule.onTick(this.handleTick)

    this.keyboardController = new KeyboardController(window)
    this.keyboardController.subscribe(this.handleInput)

    const graphicEntity = this.renderModule.createEntity(Entity.RedRect)
    const rect = new Rect(0, 0, width, height, graphicEntity)

    this.animatedObjects.push(rect)
    this.interactiveObjects.push(rect)
  }

  private handleInput = (key: GameKey) => {
    this.interactiveObjects.forEach((object) => {
      switch (key) {
        case "ArrowLeft":
          object.moveLeft()
          break
        case "ArrowRight":
          object.moveRight()
          break
        case "ArrowUp":
          object.moveUp()
          break
        case "ArrowDown":
          object.moveDown()
          break
      }
    })
  }

  private handleTick = (delta: number) => {
    this.animatedObjects.forEach((object) => object.tick(delta))
  }

  public [Symbol.dispose]() {
    this.renderModule[Symbol.dispose]()
    this.keyboardController[Symbol.dispose]()
  }
}
