import * as AWS from 'aws-sdk'
import { ContactItem } from '../models/ContactItem'
//import { UpdateContactRequest } from '../requests/UpdateContactRequest'
//const AWSXRay = require('aws-xray-sdk')
// const XAWS = AWSXRay.captureAWS(AWS)

export class ContactsAccess {
    constructor(
        private readonly docClient: AWS.DynamoDB.DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly contactsTable: string = process.env.CONTACTS_TABLE
    ) { }

    async getContacts(userId: string): Promise<ContactItem[]> {
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
        await this.docClient.put({
            TableName: this.contactsTable,
            Item: contact
        }).promise()
        return contact
    }

    async deleteContact(contactId: string, userId: string): Promise<void> {
        this.docClient
            .delete({
                TableName: this.contactsTable,
                Key: {
                    "userId": userId,
                    "contactId": contactId
                },
            })
            .promise();
    }

    async updateContact(updatedContact: ContactItem, contactId: string, userId: string): Promise<ContactItem> {
        await this.docClient.update({
            TableName: this.contactsTable,
            Key: {
                "contactId": contactId,
                "userId": userId
            },
            UpdateExpression: 'set #n = :n, phone = :p, email = :e, #t = :t',
            ExpressionAttributeValues: {
                ':n': updatedContact.name,
                ':p': updatedContact.phone,
                ':e': updatedContact.email,
                ':t': updatedContact.type

            },
            ExpressionAttributeNames: {
                "#n": "name",
                "#t": "type"
            },
            ReturnValues: 'UPDATED_NEW',
        }).promise()
        return updatedContact;
    }

    async setAttachmentUrl(contactId: string, userId: string, attachmentUrl: string): Promise<void> {
        this.docClient
            .update({
                TableName: this.contactsTable,
                Key: {
                    "contactId": contactId,
                    "userId": userId
                },
                UpdateExpression: 'set attachmentUrl = :attachmentUrl',
                ExpressionAttributeValues: {
                    ':attachmentUrl': attachmentUrl,
                },
                ReturnValues: 'UPDATED_NEW',
            })
            .promise();
    }
}

