import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'
import * as jwksClient from 'jwks-rsa';
const logger = createLogger('auth')

const jwksUrl = 'https://dev-motawy.eu.auth0.com/.well-known/jwks.json'

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  logger.info(event)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info(jwtToken)
    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error("Error with the token: " + e)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token: string = getToken(authHeader)
  const jwt: Jwt = decode(token.toString(), { complete: true }) as Jwt
  if (!jwt) throw new Error('Invalid Token')
  const client: jwksClient.JwksClient = jwksClient({
    jwksUri: jwksUrl,
  });
  const kid: string = jwt.header.kid
  client.getSigningKey(kid, (err: Error, key: jwksClient.SigningKey) => {
    if (err) logger.error("Error in Signing key.")
    const signingKey: string = key.getPublicKey()
    verify(token, signingKey);
  })
  return jwt.payload as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')
  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')
  const split: string[] = authHeader.split(' ')
  return split[1].trim() as string
}
