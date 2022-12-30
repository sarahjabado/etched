import AWSS3StorageClient from './AWSS3StorageClient';

class FileStorageClient extends AWSS3StorageClient {
    constructor(bucketId: string) {
        super(bucketId);
        console.log(bucketId);
    }

    /**
     * storeFile stores the given file in the storage system via a single request to the API.
     * @todo not yet implemented.
     */
    public storeFile(): void { }


    /**
     * deleteFile deletes the given file.
     * @todo not yet implemented.
     */
    public deleteFile(): void { }
}

export default FileStorageClient;