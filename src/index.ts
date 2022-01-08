import * as fs from "fs";
import {Client} from "discord.js";

if (!fs.existsSync("config.ts")) {
    fs.copyFileSync("config.example.ts", "config.ts");
    console.log("Default config.ts created.");
    process.exit();
}

import {config} from "../config";
import Antispam from "./moderation/antispam";
import {Listener} from "./listener";

const client = new Client({intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"]})

const listeners: Listener[] = [new Antispam()]
client.once("ready", () => console.log("Ready"))

console.log("Starting...")
client.login(config.botToken);


console.log("Registering listeners...")
for (let listener of listeners) {
    client.on(listener.event, listener.executes.bind(listener));
}