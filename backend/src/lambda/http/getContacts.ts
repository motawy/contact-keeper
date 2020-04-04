import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { getContacts } from '../../businessLogic/contacts'
import { getUserId } from '../utils'

const logger = createLogger('get-public-posts')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)
    logger.info("UserID: " + userId)
    try {
        const contacts = await getContacts(userId)
        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                items: contacts,
            }),
        };
    } catch (error) {
        logger.error(error)
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                message: "Error: " + error,
            }),
        };
    }
})
    .use(cors({ credentials: true }))