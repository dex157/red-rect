import { expect, it, describe, vi, afterEach } from 'vitest'
import { KeyboardController, Direction } from "./KeyboardController"


describe("KeyboardControllerSingleton", () => {
  const addEventListenerMock = vi.fn()
  const removeEventListenerMock = vi.fn()

  const windowMock: Window = {
    addEventListener: addEventListenerMock,
    removeEventListener: removeEventListenerMock,
  } as unknown as Window

  afterEach(() => {
    vi.resetAllMocks()
  })

  it("listen window keypress after initialize", () => {
    new KeyboardController(windowMock)
    expect(addEventListenerMock).toBeCalledWith("keypress", expect.anything())
  })

  it("call subscribe function after fire event", () => {
    using kc = new KeyboardController(windowMock)
    const subscriber = vi.fn()

    kc.subscribe(subscriber)

    addEventListenerMock.mock.calls[0][1]({ key: "ArrowUp" })

    expect(subscriber).toBeCalledWith(Direction.Up)
  })

  it.each([
    ["ArrowUp", Direction.Up],
    ["ArrowDown", Direction.Down],
    ["ArrowLeft", Direction.Left],
    ["ArrowRight", Direction.Right]
  ])("event %s call listener with proper Direction", (keyName, expectedDirection) => {
    using kc = new KeyboardController(windowMock)
    const subscriber = vi.fn()
    kc.subscribe(subscriber)
    addEventListenerMock.mock.calls[0][1]({ key: keyName })
    expect(subscriber).toBeCalledWith(expectedDirection)
  })

  it("doesn't call subscriber after unsubscribe", () => {
    using kc = new KeyboardController(windowMock)
    const subscriber = vi.fn()

    const unsubscribe = kc.subscribe(subscriber)
    unsubscribe()

    addEventListenerMock.mock.calls[0][1]({ key: "ArrowUp" })
    expect(subscriber).not.toBeCalled()
  })
  
  it("dispose eventListeners", () => {
    function run() {
      using kc = new KeyboardController(windowMock)
      void kc // workaround with ts error about unusing variable
    }

    run()

    expect(removeEventListenerMock).toBeCalledTimes(1)
  })
})

