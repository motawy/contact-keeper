// import * as AWS from 'aws-sdk'
import * as uuid from 'uuid';
import { ContactItem } from '../models/ContactItem';
import { ContactsAccess } from '../dataLayer/contactsAccess';
import { CreateContactRequest } from '../requests/CreateContactRequest';
import { createLogger } from '../utils/logger';
// import { UpdateContactRequest } from '../requests/UpdateContactRequest';
const logger = createLogger("business-logic")
// const AWSXRay = require('aws-xray-sdk')
// const XAWS = AWSXRay.captureAWS(AWS)
const contactsAccess = new ContactsAccess();

// const bucketName = process.env.S3_BUCKET
// const urlExpiration = process.env.SIGNED_URL_EXPIRATION
// const s3 = new XAWS.S3({
//     signatureVersion: 'v4'
// })

export async function getContacts(userId: string): Promise<ContactItem[]> {
    return await contactsAccess.getContacts(userId);
}

export async function createContact(createContactRequest: CreateContactRequest, userID: string, ): Promise<ContactItem> {
    logger.info("Create contact request.")
    const contact: ContactItem = {
        userId: userID,
        contactId: uuid.v4(),
        createdAt: new Date().toISOString(),
        name: createContactRequest.name,
        email: createContactRequest.email,
        phone: createContactRequest.phone,
        type: createContactRequest.type
    }
    logger.info(contact)
    return await contactsAccess.createContact(contact);
}

export async function deleteContact(contactId: string, userId: string): Promise<void> {
    return await contactsAccess.deleteContact(contactId, userId)
}

// export async function updateTodo(todoID: string, UpdateContactRequest: UpdateContactRequest, createdAt:string): Promise<void> {
//     return await postsAccess.updateTodo(updatedContact, todoID, createdAt)
// }

// export async function setAttachmentUrl(todoId: string, imageId: string, createdAt: string): Promise<void> {
//     const imageUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`
//     return await postsAccess.setAttachmentUrl(todoId, imageUrl, createdAt)
// }

// export async function getUploadUrl(imageId: string): Promise<string> {
//     const attachmentUrl = await s3.getSignedUrl('putObject', {
//         Bucket: bucketName,
//         Key: imageId,
//         Expires: parseInt(urlExpiration)
//     })
//     return attachmentUrl;
// }

