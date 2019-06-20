import {CommandHandlerInput, CreateSendMessageRequest, HandlerResponse} from 'domain/command-handlers';
import {BotCommandHandler} from 'domain/bot-commands';
import {FileExplorer} from '../adapters/file-explorer';

const listDirectoryCommandHandler = (fileExplorer: FileExplorer) => async (
    input: CommandHandlerInput
): Promise<HandlerResponse> => {
    const [, directory] = input.text.split(' ');

    if (!directory) {
        return Promise.resolve(CreateSendMessageRequest('Invalid command, use /help.'));
    }

    if (input.progressListener !== undefined) {
        input.progressListener(CreateSendMessageRequest(`Checking ${directory}`));
    }

    try {
        const files = await fileExplorer.list(directory);
        return CreateSendMessageRequest(files.map(f => f.path).join('\n'));
    } catch (error) {
        return CreateSendMessageRequest(error.message);
    }
};

export const listDirectoryFactory = (fileExplorer: FileExplorer): BotCommandHandler =>
    listDirectoryCommandHandler(fileExplorer);
