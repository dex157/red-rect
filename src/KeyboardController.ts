export enum Direction {
  Left,
  Right,
  Up,
  Down,
}

type Subscriber = (direction: Direction) => void

export class KeyboardController implements Disposable {
  private subscribers: Subscriber[]

  public constructor(private window: Window) {
    this.subscribers = []
    this.window.addEventListener("keydown", this.handleKeyPress)
  }

  private handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "ArrowUp") this.emitKeyPress(Direction.Up)
    else if (event.key === "ArrowDown") this.emitKeyPress(Direction.Down)
    else if (event.key === "ArrowLeft") this.emitKeyPress(Direction.Left)
    else if (event.key === "ArrowRight") this.emitKeyPress(Direction.Right)
  }

  public subscribe(sb: Subscriber): () => void {
    this.subscribers.push(sb)
    return () => {
      this.subscribers = this.subscribers.filter((_sb) => _sb != sb)
    }
  }

  private emitKeyPress(direction: Direction) {
    this.subscribers.forEach((listener) => listener(direction))
  }

  public [Symbol.dispose]() {
    this.window.removeEventListener("keydown", this.handleKeyPress)
  }
}
