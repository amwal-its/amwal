import { prisma } from './prisma';

export interface CreateNotificationInput {
  userId: string;
  type: string;
  title: string;
  body?: string;
  relatedEntityId?: string;
}

/**
 * Creates an in-app notification record and attempts optional FCM push notification dispatch.
 */
export async function createNotification(input: CreateNotificationInput) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        title: input.title,
        body: input.body,
        relatedEntityId: input.relatedEntityId,
      },
    });

    // Optional FCM Push Notification Trigger (Graceful Fallback if credentials not present)
    sendFcmPushNotification(input).catch((err) => {
      console.warn('FCM Push Notification fallback:', err.message);
    });

    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error);
    throw error;
  }
}

async function sendFcmPushNotification(input: CreateNotificationInput) {
  // Placeholder for Firebase Cloud Messaging (FCM) push notification integration.
  // In staging/production with FCM_SERVER_KEY or GOOGLE_APPLICATION_CREDENTIALS, this will send Web Push / Device Push.
  if (!process.env.FCM_SERVER_KEY) {
    return;
  }
  // Simulated FCM network dispatch...
}
