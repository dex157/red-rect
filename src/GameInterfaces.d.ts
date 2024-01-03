export interface Interactive {
  moveLeft(): void
  moveRight(): void
  moveUp(): void
  moveDown(): void
}

export interface Animated {
  tick(delta: number): void
}

export interface GameDisplayObject {
  x: number
  y: number
}
