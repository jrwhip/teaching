import {
  DynamoDBDocumentClient,
  QueryCommand,
  BatchWriteCommand,
  type BatchWriteCommandOutput,
} from '@aws-sdk/lib-dynamodb';

interface FanOutTarget {
  tableName: string;
  indexName: string;
}

/**
 * Add a Cognito sub to the `readAccess` array on all records matching
 * a student's ID across one or more DynamoDB tables.
 *
 * Paginates through the GSI using `LastEvaluatedKey` and retries
 * `UnprocessedItems` from `BatchWriteItem`.
 */
export async function fanOutReadAccess(
  ddbClient: DynamoDBDocumentClient,
  studentId: string,
  subToAdd: string,
  targets: FanOutTarget[]
): Promise<void> {
  for (const { tableName, indexName } of targets) {
    let lastKey: Record<string, unknown> | undefined;

    do {
      const result = await ddbClient.send(
        new QueryCommand({
          TableName: tableName,
          IndexName: indexName,
          KeyConditionExpression: 'studentId = :sid',
          ExpressionAttributeValues: { ':sid': studentId },
          ExclusiveStartKey: lastKey,
        })
      );

      const items = result.Items ?? [];
      if (items.length === 0) break;

      // BatchWriteItem supports max 25 items per request
      for (let i = 0; i < items.length; i += 25) {
        const batch = items.slice(i, i + 25);

        const writeRequests = batch
          .filter((item) => {
            const access = (item['readAccess'] as string[] | undefined) ?? [];
            return !access.includes(subToAdd);
          })
          .map((item) => {
            const access = (item['readAccess'] as string[] | undefined) ?? [];
            access.push(subToAdd);
            return {
              PutRequest: {
                Item: { ...item, readAccess: access, updatedAt: new Date().toISOString() },
              },
            };
          });

        if (writeRequests.length > 0) {
          await batchWriteWithRetry(ddbClient, tableName, writeRequests);
        }
      }

      lastKey = result.LastEvaluatedKey as Record<string, unknown> | undefined;
    } while (lastKey);
  }
}

/** Retry BatchWriteCommand until all items are processed. */
async function batchWriteWithRetry(
  ddbClient: DynamoDBDocumentClient,
  tableName: string,
  writeRequests: Record<string, unknown>[]
): Promise<void> {
  type RequestItems = NonNullable<BatchWriteCommandOutput['UnprocessedItems']>;

  let requestItems: RequestItems = {
    [tableName]: writeRequests as RequestItems[string],
  };
  let backoffMs = 50;

  while (Object.keys(requestItems).length > 0) {
    const result = await ddbClient.send(
      new BatchWriteCommand({ RequestItems: requestItems })
    );

    requestItems = result.UnprocessedItems ?? {};

    if (Object.keys(requestItems).length > 0) {
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
      backoffMs = Math.min(backoffMs * 2, 1000);
    }
  }
}
