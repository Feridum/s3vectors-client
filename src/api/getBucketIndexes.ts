import { invoke } from '@tauri-apps/api/core';

// Define the return type based on the Rust implementation
type BucketIndex = {
  indexName: string;
  vectorBucketName: string;
  indexArn: string;
  index_name: string;
};

/**
 * Fetches the list of indexes for a specific S3 vector bucket
 * @param region AWS region to use
 * @param bucket Name of the bucket to get indexes from
 * @returns Promise with the list of bucket indexes
 */
export const getBucketIndexes = async (region: string = 'us-east-1', bucket: string): Promise<BucketIndex[]> => {
  const response = await invoke<string>('get_bucket_indexes', { region, bucket });
  return JSON.parse(response);
};
