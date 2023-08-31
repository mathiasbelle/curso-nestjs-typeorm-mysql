import { ReadStream, createReadStream } from 'fs';

export const getFileToBuffer = (filename: string) => {
    const readStream = createReadStream(filename);
    const chunks = [];

    return new Promise<{ buffer: Buffer; stream: ReadStream }>(
        (resolver, reject) => {
            readStream.on('data', (chunk) => chunks.push(chunk));

            readStream.on('error', (err) => reject(err));

            readStream.on('close', () => {
                resolver({
                    buffer: Buffer.concat(chunks) as Buffer,
                    stream: readStream,
                });
            });
        },
    );
};
