import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as uuid from 'uuid';
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { setAttachmentUrl, getUploadUrl } from '../../businessLogic/contacts'
import { getUserId } from '../utils'

const logger = createLogger('generate-upload-url')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const contactId = event.pathParameters.contactId
    logger.info("Getting attachment URL")
    const imageId = uuid.v4()
    const userId = getUserId(event)
    try {
        await setAttachmentUrl(contactId, userId, imageId)
        const uploadUrl = getUploadUrl(imageId)
        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                uploadUrl
            })
        }
    } catch (error) {
        logger.error("Failed to generate url.")
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                "message": "There was an error deleting the todo: " + error
            })
        }
    }
}).use(cors({ credentials: true }))
