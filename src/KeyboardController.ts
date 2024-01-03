export enum Direction {
  Left,
  Right,
  Up,
  Down,
}

type Subscriber = (direction: Direction) => void

export class KeyboardController implements Disposable {
  private listeners: Subscriber[]

  public constructor(private window: Window) {
    this.listeners = []
    this.window.addEventListener("keydown", this.handleKeyPress)
  }

  private handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "ArrowUp") this.fireEvent(Direction.Up)
    else if (event.key === "ArrowDown") this.fireEvent(Direction.Down)
    else if (event.key === "ArrowLeft") this.fireEvent(Direction.Left)
    else if (event.key === "ArrowRight") this.fireEvent(Direction.Right)
  }

  public subscribe(sb: Subscriber): () => void {
    this.listeners.push(sb)
    return () => {
      this.listeners = this.listeners.filter((_sb) => _sb != sb)
    }
  }

  private fireEvent(direction: Direction) {
    this.listeners.forEach((listener) => listener(direction))
  }

  public [Symbol.dispose]() {
    this.window.removeEventListener("keydown", this.handleKeyPress)
  }
}
