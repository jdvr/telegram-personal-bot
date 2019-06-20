import {FileExplorer, FileInfo} from './file-explorer';

const nodeCmd = require('node-cmd');
const {promisify} = require('util');

const exec = promisify(nodeCmd.get);

export class RcloneFileExplorer implements FileExplorer {
    private readonly remote: string;

    public constructor(remote: string) {
        this.remote = remote;
    }

    public async link(filePath: string): Promise<string> {
        try {
            return await exec(`rclone link ${this.remote}:${filePath}`);
        } catch (e) {
            return Promise.reject({
                message: `Error generating link for ${this.remote}:${filePath}`,
            });
        }
    }

    public async list(directory: string = '/'): Promise<FileInfo[]> {
        try {
            const output = await exec(`rclone ls ${this.remote}:${directory}`);
            return output
                .split('\n')
                .filter(s => Boolean(s))
                .map(p => {
                    const segments = p.trim().split(' ');
                    return new FileInfo(Number(segments[0]), segments[1]);
                });
        } catch (e) {
            return Promise.reject({
                message: `Error listing ${this.remote}:${directory}`,
            });
        }
    }
}
