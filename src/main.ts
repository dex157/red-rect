import { Game } from "./Game"
import "./style.css"

let game: Game | undefined
window.addEventListener("load", () => (game = new Game(500, 500)))
window.addEventListener("unload", () => game?.[Symbol.dispose]())
