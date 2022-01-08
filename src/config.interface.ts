import {Punishment, PunishReason} from "./moderation/punisher";

export default interface Config {
    botToken: string,
    millisBetweenMessages: number,
    punishments: {[key in PunishReason]?: Array<Punishment>},
    exemptions: Array<{role: string} | {user: string}>,
    auditChannel: string
}