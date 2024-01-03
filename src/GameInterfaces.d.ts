export interface Interactive {
  moveLeft(): void
  moveRight(): void
  moveUp(): void
  moveDown(): void
}

export interface Animated {
  tick(delta: number): void
}

export interface Asset {
  x: number
  y: number
}
