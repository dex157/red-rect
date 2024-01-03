type Subscriber = (key: GameKey) => void

export const gameKeys = [
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
] as const
export type GameKey = (typeof gameKeys)[number]

const isGameKey = (key: string): key is GameKey =>
  (gameKeys as ReadonlyArray<string>).includes(key)

export class KeyboardController implements Disposable {
  private subscribers: Subscriber[]

  public constructor(private window: Window) {
    this.subscribers = []
    this.window.addEventListener("keydown", this.handleKeyPress)
  }

  private handleKeyPress = (event: KeyboardEvent) => {
    if (isGameKey(event.key)) this.emitKeyPress(event.key as GameKey)
  }

  public subscribe(sb: Subscriber): () => void {
    this.subscribers.push(sb)
    return () => {
      this.subscribers = this.subscribers.filter((_sb) => _sb != sb)
    }
  }

  private emitKeyPress(key: GameKey) {
    this.subscribers.forEach((listener) => listener(key))
  }

  public [Symbol.dispose]() {
    this.window.removeEventListener("keydown", this.handleKeyPress)
  }
}
