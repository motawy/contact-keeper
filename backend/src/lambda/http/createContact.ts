import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { CreateContactRequest } from '../../requests/CreateContactRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { createContact } from '../../businessLogic/contacts'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const logger = createLogger('create-post')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newContact: CreateContactRequest = JSON.parse(event.body)
  const userId = getUserId(event)
  if (!userId) logger.error("Error with the User ID")
  const contact = await createContact(newContact, userId)
  if (!contact) logger.error("Error with the post")
  return {
    statusCode: 201,
    body: JSON.stringify({
      contact
    })
  }

}).use(cors({ credentials: true }))
