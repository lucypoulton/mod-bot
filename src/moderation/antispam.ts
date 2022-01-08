import {ClientEvents, Message, TextChannel} from "discord.js";
import {punisher, PunishReason} from "./punisher";
import {config} from "../../config";
import {Listener} from "../listener";

export default class Antispam implements Listener {
    private lastMessages = new Map<string, number>();

    event: keyof ClientEvents = "messageCreate";
    once = false;

    executes(msg: Message) {
        if (msg.author.bot) return;
        if (msg.mentions.everyone) {
            punisher.punish(msg.member, PunishReason.PING, msg.channel as TextChannel);
        }
        let lastMessage = this.lastMessages[msg.member.id];
        if (lastMessage && Date.now() - lastMessage <= config.millisBetweenMessages) {
            punisher.punish(msg.member, PunishReason.RATELIMIT, msg.channel as TextChannel);
        }
        this.lastMessages[msg.member.id] = Date.now();
    }
}
