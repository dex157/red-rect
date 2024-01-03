import { expect, it, describe, vi, afterEach } from "vitest"
import { KeyboardController } from "./KeyboardController"

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

  it("listen window keydown after initialize", () => {
    new KeyboardController(windowMock)
    expect(addEventListenerMock).toBeCalledWith("keydown", expect.anything())
  })

  it("call subscribe function after fire event", () => {
    using kc = new KeyboardController(windowMock)
    const subscriber = vi.fn()

    kc.subscribe(subscriber)

    addEventListenerMock.mock.calls[0][1]({ key: "ArrowUp" })

    expect(subscriber).toBeCalledWith("ArrowUp")
  })

  it.each([
    ["ArrowUp"],
    ["ArrowDown"],
    ["ArrowLeft"],
    ["ArrowRight"],
  ])(
    "event %s call listener with proper Direction",
    (keyName) => {
      using kc = new KeyboardController(windowMock)
      const subscriber = vi.fn()
      kc.subscribe(subscriber)
      addEventListenerMock.mock.calls[0][1]({ key: keyName })
      expect(subscriber).toBeCalledWith(keyName)
    },
  )

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
