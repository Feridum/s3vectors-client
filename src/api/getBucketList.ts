import { invoke } from '@tauri-apps/api/core';

// Define the return type based on the Rust implementation
type Bucket = {
  name: string;
  arn: string;
};
/**
 * Fetches the list of S3 vector buckets
 * @param region AWS region to use
 * @returns Promise with the list of buckets
 */
export const getBucketList = async (region: string = 'us-east-1'): Promise<Bucket[]> => {
  const response = await invoke<string>('get_bucket_list', { region });
  return JSON.parse(response);
};
