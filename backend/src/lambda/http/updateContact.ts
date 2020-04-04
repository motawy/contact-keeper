import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { ContactRequest } from '../../requests/ContactRequest'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { updateContact } from '../../businessLogic/contacts'
import { getUserId } from '../utils'

const logger = createLogger('update-contact')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const contactId = event.pathParameters.contactId
    const updatedContact: ContactRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    try {
        const contact = await updateContact(updatedContact, contactId, userId)
        logger.info("Contact: " + contact)
        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                "message": "Contact updated successfully.",
                'contact': contact
            })
        }
    } catch (error) {
        logger.error("Update function failed. " + error)
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                "message": "There was an error updating the contact."
            })
        }
    }
}).use(cors({ credentials: true }))
