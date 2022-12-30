const AWS = require('aws-sdk')

class AWSClient extends AWS {
    constructor() {
        super();
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
            region: process.env.AWS_REGION,
        })
    }
}

export default AWSClient;