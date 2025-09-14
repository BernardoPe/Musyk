import { CommandsLangConfig } from "./commands.ts"
import { EmbedsLangConfig } from "./embeds.ts"

export interface Language {
    tag: string;
    shared: SharedLangConfig;
    commands: CommandsLangConfig;
    embeds: EmbedsLangConfig;
}

interface SharedLangConfig {
    not_playing: string;
    current_prefix: string;
    current_lang: string;
    set_lang: string;
    set_lang_error: string;
    set_prefix: string;
    set_prefix_error: string;
}
