import {DiscordAPIError, GuildMember, MessageEmbed, TextChannel} from "discord.js";
import {config} from "../../config";

export enum PunishReason {
    PING = "ping",
    RATELIMIT = "ratelimit"
}

export type Punishment = {
    action: "warn" | "kick" | "ban",
    message: string
}

export class Punisher {

    private punishmentsIssued = new Map<string, number>();

    async sendMessage(title: string, message: string, member: GuildMember, channel?: TextChannel) {
        let embed = {
            embeds: [new MessageEmbed()
                .setTitle(title)
                .setDescription(message)
                .setTimestamp()],
            content: `<@${member.id}>`
        }
        await (channel || member).send(embed);
    }

    async punish(member: GuildMember, reason: PunishReason, channel?: TextChannel) {
        for (let exemption of config.exemptions) {
            if (exemption["user"] == member.id ||
                member.roles.cache.has(exemption["role"])) {
                return;
            }
        }

        const index = this.punishmentsIssued.get(member.id + reason) || 0;
        const punishments = config.punishments[reason];
        if (!punishments || punishments.length == 0) return;
        const punishment: Punishment = punishments[index >= punishments.length ? punishments.length - 1 : index];

        try {
            switch (punishment.action) {
                case "warn":
                    await this.sendMessage("You have been warned", `${punishment.message}\nInfraction #${index + 1}.`,
                        member, channel);
                    break;
                case "kick":
                    await this.sendMessage("User kicked", punishment.message, member, channel);
                    await member.kick(punishment.action);
                    break;
                case "ban":
                    await this.sendMessage("User banned", punishment.message, member, channel);
                    await member.ban({reason: punishment.message});
                    break;
            }
            this.punishmentsIssued.set(member.id + reason, index + 1);
        } catch (error) {
            if (error instanceof DiscordAPIError)
                console.warn(`Error while punishing ${member.displayName}: ${error.message}`);
        }
    }
}

export const punisher = new Punisher();