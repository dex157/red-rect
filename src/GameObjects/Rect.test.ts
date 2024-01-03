import { describe, expect, it } from "vitest"
import { Rect } from "./Rect"
import { GameDisplayObject } from "../GameInterfaces"

describe("Rect", () => {
  it("shouldn't move in idle state", () => {
    const mockDisplayObject: GameDisplayObject = { x: 0, y: 0 }
    const rect = new Rect(0, 0, 100, 100, mockDisplayObject)

    rect.tick(100)

    expect(mockDisplayObject).toStrictEqual({ x: 0, y: 0 })
  })

  it("should move to the right after call moveRight", () => {
    const mockDisplayObject: GameDisplayObject = { x: 0, y: 0 }
    const rect = new Rect(0, 0, 100, 100, mockDisplayObject)

    rect.moveRight()
    rect.tick(10)

    expect(mockDisplayObject).toStrictEqual({ x: 40, y: 0 })
  })

  it("should be idle if moveRight was called after moveLeft", () => {
    const mockDisplayObject: GameDisplayObject = { x: 0, y: 0 }
    const rect = new Rect(0, 0, 100, 100, mockDisplayObject)

    rect.moveRight()
    rect.moveLeft()
    rect.tick(10)

    expect(mockDisplayObject).toStrictEqual({ x: 0, y: 0 })
  })

  it("should move to the start position after cross opposite border", () => {
    const mockDisplayObject: GameDisplayObject = { x: 0, y: 0 }
    const rect = new Rect(0, 0, 100, 100, mockDisplayObject)

    rect.moveRight()
    rect.tick(24)
    expect(mockDisplayObject).toStrictEqual({ x: 96, y: 0 })
    rect.tick(1)
    expect(mockDisplayObject).toStrictEqual({ x: 0, y: 0 })
  })
})
