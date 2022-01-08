import {Awaitable, ClientEvents} from "discord.js";

export interface Listener {
    event: keyof ClientEvents,
    once: boolean,
    executes: (...args: ClientEvents[keyof ClientEvents]) => Awaitable<void>
}