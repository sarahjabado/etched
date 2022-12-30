import Client from './AWSS3Client';
import { HTTPMethods } from 'types/HTTPMethods';

class AWSS3StorageClient {
    private client: Client;

    constructor(bucketId: string = '') {
        this.client = new Client(bucketId);
    }

    /**
     * getStorageURL will generate a pre-signed URL for a seperate filestorage request.
     * @returns Pre-Signed URL for uploading files to the given client.
     */
    public getStorageURL(key: string): string {
        return this.client.getSignedURL(HTTPMethods.PUT, { Key: key });
    }

    /**
     * getFile returns with a signed URL to download the given file.
     * @param fileName the absolute filename and path of the file to be retrieved.
     * @returns a signed URL enabling the download of the given file.
     */
    public getFile(fileName: string): string {
        return this.client.getSignedURL(HTTPMethods.GET, {
            Bucket: this.client.getBucketID(),
            Key: fileName,
            Expires: 60,
        });
    }
}

export default AWSS3StorageClient;