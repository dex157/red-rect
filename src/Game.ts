import { KeyboardInteractable, Rect, Tickable } from "./GameObjects/Rect"
import { Direction, KeyboardController } from "./KeyboardController"
import { Entity, Render } from "./Render"

export class Game implements Disposable {
  private renderModule: Render
  private keyboardController: KeyboardController
  private tickableObjects: Tickable[] = []
  private keyboardInteractableObjects: KeyboardInteractable[] = []

  constructor(width: number, height: number) {
    this.renderModule = new Render(window, width, height)
    this.renderModule.onTick(this.handleTick)

    this.keyboardController = new KeyboardController(window)
    this.keyboardController.subscribe(this.handleInput)

    const graphicEntity = this.renderModule.createEntity(Entity.RedRect)
    const rect = new Rect(0, 0, width, height, graphicEntity)

    this.tickableObjects.push(rect)
    this.keyboardInteractableObjects.push(rect)
  }

  private handleInput = (direction: Direction) => {
    this.keyboardInteractableObjects.forEach((object) => {
      switch (direction) {
        case Direction.Left:
          object.moveLeft()
          break
        case Direction.Right:
          object.moveRight()
          break
        case Direction.Up:
          object.moveUp()
          break
        case Direction.Down:
          object.moveDown()
          break
      }
    })
  }

  private handleTick = (delta: number) => {
    this.tickableObjects.forEach((object) => object.tick(delta))
  }

  public [Symbol.dispose]() {
    this.renderModule[Symbol.dispose]()
    this.keyboardController[Symbol.dispose]()
  }
}
