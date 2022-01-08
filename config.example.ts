import {PunishReason} from "./src/moderation/punisher";
import Config from "./src/config.interface";

export const config: Config = {
  botToken: "token",
  millisBetweenMessages: 1000,
  punishments: {
    [PunishReason.PING]: [
      {action: "warn", message: "Please don't mention here or everyone."},
      {action: "kick", message: "Please don't mention here or everyone."},
      {action: "ban", message: "Please don't mention here or everyone."},
    ],
    [PunishReason.RATELIMIT]: [
      {action: "warn", message: "Please slow down!"},
      {action: "warn", message: "Please slow down!"},
      {action: "kick", message: "Spam"},
      {action: "ban", message: "Spam"}
    ]
  },
  exemptions: [{role: "817403713378844762"}],
  auditChannel: "830707775222317076"
}