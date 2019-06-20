export interface FileExplorer {
    list(directory?: string): Promise<FileInfo[]>;
    link(filePath: string): Promise<string>;
}

export class FileInfo {
    public sizeInBytes: number;
    public path: string;

    public constructor(sizeInBytes: number, path: string) {
        this.sizeInBytes = sizeInBytes;
        this.path = path;
    }
}
