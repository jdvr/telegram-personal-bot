import {HandlerResponse, CommandHandlerInput, CreateSendMessageRequest} from 'domain/command-handlers';
import {getAbsoluteMappingEntries} from 'tsconfig-paths/lib/mapping-entry';

export type BotCommandHandler = (input: CommandHandlerInput) => Promise<HandlerResponse>;
export interface BotCommand {
    handler: BotCommandHandler;
    helpText?: string;
}

interface CommandsHash {
    [key: string]: BotCommand;
}

const generateHelpCommandHandler = (commands: CommandsHash) => (
    input: CommandHandlerInput
): Promise<HandlerResponse> => {
    const message = Object.entries(commands)
        .map(([key, value]) => {
            return `${key} - ${value.helpText}\n`;
        })
        .join('\n');
    return Promise.resolve(CreateSendMessageRequest(message, ''));
};

export class BotCommands {
    private readonly commands: CommandsHash;

    public constructor(commands: CommandsHash) {
        this.commands = {
            '/help': {handler: generateHelpCommandHandler(commands)},
            ...commands,
        };
    }

    public getCommandHandler(command: string): BotCommandHandler {
        if (command in this.commands) {
            return this.commands[command].handler;
        }

        for (const key in this.commands) {
            if (command.startsWith(key)) {
                return this.commands[key].handler;
            }
        }

        return null;
    }
}
