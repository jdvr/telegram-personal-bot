import {TelegramAPI} from 'telegram/api';
import {UpdatesPuller} from 'bot/updates-puller';
import {BotCommands} from 'domain/bot-commands';
import {startHandler} from 'commands/static';
import {MessageProcessor} from 'bot/message-processor';
import {YoutubeCommandHandler} from 'commands/youtube';
import {YoutubeDownloader} from 'adapters/youtube';
import {listDirectoryFactory} from './commands/list-directory';
import {RcloneFileExplorer} from './adapters/rclone-file-explorer';
import {linkFileFactory} from './commands/link-file';

if (process.env.TELEGRAM_TOKEN == undefined || process.env.TELEGRAM_TOKEN == '') {
    console.log('Environment variable TELEGRAM_TOKEN is mandatory.');
    process.exit(1);
}

function processUpdates(update) {
    processor.Process(update);
    return false;
}

const telegramApi = new TelegramAPI(process.env.TELEGRAM_TOKEN);
const youtube = new YoutubeCommandHandler(new YoutubeDownloader());
const listDirectory = listDirectoryFactory(new RcloneFileExplorer(process.env.RCLONE_REMOTE));
const linkFile = linkFileFactory(new RcloneFileExplorer(process.env.RCLONE_REMOTE));

const commands = new BotCommands({
    '/start': {handler: startHandler, helpText: 'shows welcome message'},
    '/audio': {handler: youtube.AudioDownload, helpText: 'download audio file'},
    '/list': {handler: listDirectory, helpText: 'list directory'},
    '/link': {handler: linkFile, helpText: 'send download link for a given file full path'},
});

const processor = new MessageProcessor(telegramApi, commands);
const puller = new UpdatesPuller(telegramApi, processUpdates);

puller.getUpdates();
