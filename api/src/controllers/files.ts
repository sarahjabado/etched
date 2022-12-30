import { catchErrors } from 'errors';
import FileStorageClient from 'clients/FileStorageClient';

export const signedUpload = catchErrors(async (req, res) => {
    const client = new FileStorageClient(process.env.S3_FILE_STORAGE || '');
    res.respond({
        signedURL: client.getStorageURL(req.body.file),
    });
});

export const signedDownload = catchErrors(async (req, res) => {
    const client = new FileStorageClient(process.env.S3_FILE_STORAGE || '');
    res.respond({
        signedURL: client.getFile(req.body.file),
    });
});
