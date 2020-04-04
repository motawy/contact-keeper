import * as AWS from 'aws-sdk'
import { ContactItem } from '../models/ContactItem'
import { createLogger } from '../utils/logger'
//import { UpdatePostRequest } from '../requests/UpdatePostRequest'
//const AWSXRay = require('aws-xray-sdk')
// const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('contacts-access')

export class ContactsAccess {
    constructor(
        private readonly docClient: AWS.DynamoDB.DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly contactsTable: string = process.env.CONTACTS_TABLE
    ) { }

    async getContacts(userId: string): Promise<ContactItem[]> {
        logger.info("Querying table to get contacts.")
        const result = await this.docClient.query({
            TableName: this.contactsTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId,
            }
        }).promise()
        return result.Items as ContactItem[]
    }

    async createContact(contact: ContactItem): Promise<ContactItem> {
        logger.info("Writing contact in DB.")
        await this.docClient.put({
            TableName: this.contactsTable,
            Item: contact
        }).promise()
        return contact
    }

    // async getTodo(todoId: string, userId: string): Promise<ContactItem> {
    //     const result = await this.docClient
    //         .query({
    //             TableName: this.todosTable,
    //             IndexName: this.userIdIndex,
    //             KeyConditionExpression: 'todoId = :todoId and userId = :userId',
    //             ExpressionAttributeValues: {
    //                 ':todoId': todoId,
    //                 ':userId': userId,
    //             },
    //         })
    //         .promise();

    //     const item = result.Items[0];
    //     return item as ContactItem;
    // }

    async deleteContact(contactId: string, userId: string): Promise<void> {
        this.docClient
            .delete({
                TableName: this.contactsTable,
                Key: {
                    "contactId": contactId,
                    "userId": userId
                },
            })
            .promise();
    }

    // async updateTodo(updatedTodo: UpdatePostRequest, todoID: string, createdAt: string): Promise<void> {
    //     await this.docClient.update({
    //         TableName: this.todosTable,
    //         Key: {
    //             "todoId": todoID,
    //             "createdAt": createdAt
    //         },
    //         UpdateExpression: 'set #n = :t, dueDate = :d, done = :n',
    //         ExpressionAttributeValues: {
    //             ':t': updatedTodo.name,
    //             ':d': updatedTodo.dueDate,
    //             ':n': updatedTodo.done
    //         },
    //         ExpressionAttributeNames: {
    //             "#n": "name"
    //         },
    //         ReturnValues: 'UPDATED_NEW',
    //     }).promise()
    // }

    // async setAttachmentUrl(todoId: string, attachmentUrl: string, createdAt: string): Promise<void> {
    //     this.docClient
    //         .update({
    //             TableName: this.todosTable,
    //             Key: {
    //                 "todoId": todoId,
    //                 "createdAt": createdAt
    //             },
    //             UpdateExpression: 'set attachmentUrl = :attachmentUrl',
    //             ExpressionAttributeValues: {
    //                 ':attachmentUrl': attachmentUrl,
    //             },
    //             ReturnValues: 'UPDATED_NEW',
    //         })
    //         .promise();
    // }
}

