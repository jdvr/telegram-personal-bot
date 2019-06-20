import {CommandHandlerInput, CreateSendMessageRequest, HandlerResponse} from 'domain/command-handlers';
import {BotCommandHandler} from 'domain/bot-commands';
import {FileExplorer} from '../adapters/file-explorer';

const linkFileCommandHandler = (fileExplorer: FileExplorer) => async (
    input: CommandHandlerInput
): Promise<HandlerResponse> => {
    const [, filePath] = input.text.split(' ');

    if (!filePath) {
        return Promise.resolve(CreateSendMessageRequest('Invalid command, use /help.'));
    }

    if (input.progressListener !== undefined) {
        input.progressListener(CreateSendMessageRequest(`Checking ${filePath}`));
    }

    try {
        const link = await fileExplorer.link(filePath);
        return CreateSendMessageRequest(link);
    } catch (error) {
        return CreateSendMessageRequest(error.message);
    }
};

export const linkFileFactory = (fileExplorer: FileExplorer): BotCommandHandler =>
    linkFileCommandHandler(fileExplorer);
