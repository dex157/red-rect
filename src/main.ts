import './style.css'
import * as PIXI from "pixi.js";

const width = 500
const height = 500
const speed = 4

type Vector2d = [number, number]

function addDirectionListener(cb: (direction: Vector2d) => void) {
  const keyHandler = (event: KeyboardEvent) => {
    if (event.key === "ArrowUp") cb([0, -1])
    else if (event.key === "ArrowDown") cb([0, 1])
    else if (event.key === "ArrowLeft") cb([-1, 0])
    else if (event.key === "ArrowRight") cb([1, 0])
    else if (event.key === " ") cb([0, 0])
  }
  window.addEventListener("keydown", keyHandler)
  return () => window.removeEventListener("keydown", keyHandler)
}

function startGame() {
  let direction: Vector2d = [0, 0]
  let app = new PIXI.Application<HTMLCanvasElement>({
    width: width,
    height: height,
    backgroundColor: 0x2980b9,
  })

  document.body.appendChild(app.view)

  const redRect = new PIXI.Graphics()
  redRect.beginFill(0xff0000)
  redRect.drawRect(0, 0, 100, 100)
  redRect.drawRect(-width, 0, 100, 100)
  redRect.drawRect(0, -height, 100, 100)
  redRect.drawRect(-width, -height, 100, 100)

  app.stage.addChild(redRect)

  const disposeDirectionListener =
    addDirectionListener((nextDirection) => { direction = nextDirection })

  app.ticker.add((delta) => {
    redRect.x = (redRect.x + direction[0] * speed * delta) % width
    redRect.y = (redRect.y + direction[1] * speed * delta) % height
    if (redRect.y < 0) redRect.y += height
    if (redRect.x < 0) redRect.x += width
  })

  return () => {
    document.body.removeChild(app.view)
    app.destroy()
    disposeDirectionListener()
  }
}

window.requestIdleCallback(() => {
  const dispose = startGame()
  window.addEventListener("beforeunload", dispose)
})
