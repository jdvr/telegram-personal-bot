import * as ytdl from 'ytdl-core';
import {RemoteDownloader, AudioMetadata} from './downloader';
import {Readable} from 'stream';

export class YoutubeDownloader implements RemoteDownloader {
    public async downloadAudioFile(youtubeUrl: string): Promise<AudioMetadata> {
        const info = await ytdl.getInfo(youtubeUrl);
        console.log('got info');
        if (!info) {
            throw Error('failed to get video info');
        }

        const audioFormat = YoutubeDownloader.selectFormat(info);

        const filename = `${info.title}.${audioFormat.container}`;
        try {
            const readableStream = await this.downloadFormat(youtubeUrl, audioFormat);
            return new AudioMetadata(readableStream, filename);
        } catch (err) {
            console.log("here1");
            throw err;
        }
    }

    private static selectFormat(info: ytdl.videoInfo): ytdl.videoFormat {
        const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
        if (!audioFormats || audioFormats.length == 0) {
            throw new Error('failed to get audio format of the video');
        }
        return audioFormats[0];
    }

    private async downloadFormat(youtubeUrl: string, format: ytdl.videoFormat): Promise<Readable> {
        const stream = ytdl(youtubeUrl, {format: format});

        stream.on('progress', (chuck_size, total_downloaded, total_exists) => {
            console.log(`total_downloaded: ${total_downloaded} - total_exists: ${total_exists}`);
        });

        return stream;
    }
}
