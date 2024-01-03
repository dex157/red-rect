export interface Asset {
  x: number
  y: number
}

export interface KeyboardInteractable {
  moveLeft(): void
  moveRight(): void
  moveUp(): void
  moveDown(): void
}

export interface Tickable {
  tick(delta: number): void
}

export class Rect implements KeyboardInteractable, Tickable {
  private state: RectState
  private movingVector: Vector2d
  private speed = 4

  public constructor(
    private x: number,
    private y: number,
    private fieldWidth: number,
    private fieldHeight: number,
    private asset: Asset,
  ) {
    this.movingVector = { x: 0, y: 0 }
    this.state = new IdleState(this.changeState, this.movingVector)
  }

  public moveLeft() {
    this.state.moveLeft()
  }
  public moveRight() {
    this.state.moveRight()
  }
  public moveUp() {
    this.state.moveUp()
  }
  public moveDown() {
    this.state.moveDown()
  }

  public tick(delta: number) {
    this.x =
      (this.x + this.movingVector.x * this.speed * delta) % this.fieldWidth
    this.y =
      (this.y + this.movingVector.y * this.speed * delta) % this.fieldHeight
    if (this.y < 0) this.y += this.fieldHeight
    if (this.x < 0) this.x += this.fieldWidth

    this.asset.x = this.x
    this.asset.y = this.y
  }

  private changeState = (state: RectState) => {
    this.state = state
  }
}

abstract class RectState {
  constructor(
    protected changeState: (state: RectState) => void,
    protected movingVector: Vector2d,
  ) {}
  moveLeft(): void {
    this.movingVector.x = -1
    this.movingVector.y = 0
    this.changeState(new MovingLeftState(this.changeState, this.movingVector))
  }
  moveRight(): void {
    this.movingVector.x = 1
    this.movingVector.y = 0
    this.changeState(new MovingRightState(this.changeState, this.movingVector))
  }
  moveUp(): void {
    this.movingVector.x = 0
    this.movingVector.y = -1
    this.changeState(new MovingUpState(this.changeState, this.movingVector))
  }
  moveDown(): void {
    this.movingVector.x = 0
    this.movingVector.y = 1
    this.changeState(new MovingDownState(this.changeState, this.movingVector))
  }
  protected setIdle(): void {
    this.movingVector.x = 0
    this.movingVector.y = 0
    this.changeState(new IdleState(this.changeState, this.movingVector))
  }
}

class IdleState extends RectState {}

class MovingLeftState extends RectState {
  override moveLeft(): void {}
  override moveRight(): void {
    this.setIdle()
  }
}

class MovingRightState extends RectState {
  override moveRight(): void {}
  override moveLeft(): void {
    this.setIdle()
  }
}

class MovingUpState extends RectState {
  override moveUp(): void {}
  override moveDown(): void {
    this.setIdle()
  }
}

class MovingDownState extends RectState {
  override moveDown(): void {}
  override moveUp(): void {
    this.setIdle()
  }
}
