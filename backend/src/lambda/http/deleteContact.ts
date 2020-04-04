import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { deleteContact } from '../../businessLogic/contacts'
import { getUserId } from '../utils'

const logger = createLogger('delete-todo')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("Delete function called")
  const contactId = event.pathParameters.contactId
  const userId = getUserId(event)
  try {
    await deleteContact(userId, contactId)
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        "message": "Contact deleted successfully."
      })
    }
  } catch (error) {
    logger.error("Delete function failed.")
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        "message": "There was an error deleting the contact."
      })
    }
  }

}).use(cors({ credentials: true }))
