import { S3 } from "aws-sdk";
import { HTTPMethods } from 'types/HTTPMethods';

class AWSS3Client {
    private client: S3;
    private bucket: string = '';

    private defaultParameters: object = {
        Bucket: this.bucket,
        Expires: 60,
        Key: 'test.txt',
    }

    constructor(targetBucket: string | null = null, options: S3.ClientConfiguration | undefined = undefined) {

        this.client = new S3(options || {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
            region: process.env.AWS_REGION,
        });

        this.defaultParameters = {
            ...this.defaultParameters,
            Bucket: targetBucket,
        }
        // if (targetBucket) {
        //     this.bucket = targetBucket;
        // }
    }

    /**
     * getBucketID provides a means to obtain the S3 Bucket this is connected to.
     * @returns Read-Only BucketID for the configured S3 Bucket.
     */
    public getBucketID(): string {
        return this.bucket;
    }

    public getSignedURL(type: HTTPMethods, params: object | null = null): string {
        let URL = '';
        params = {
            ...this.defaultParameters,
            ...params,
        }

        switch (type) {
            case HTTPMethods.PUT:
                URL = this.getSignedPutURL(params || this.defaultParameters);
                break;
            default:
                URL = this.getSignedGetURL(params || this.defaultParameters);
                break;
        }

        return URL;
    }

    private getSignedPutURL(params: object | null = null): string {
        return this.client.getSignedUrl('putObject', params || this.defaultParameters);
    }

    private getSignedGetURL(params: object | null = null): string {
        return this.client.getSignedUrl('getObject', params || this.defaultParameters);
    }
}

export default AWSS3Client;
