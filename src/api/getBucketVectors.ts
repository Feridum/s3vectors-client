import { invoke } from '@tauri-apps/api/core';

// Define the return type based on the Rust implementation
type VectorData = {
  key: string;
  data: number[];
  metadata: any | null;
};

/**
 * Fetches vectors from a specific bucket and index
 * @param region AWS region to use
 * @param bucket Name of the bucket to get vectors from
 * @param index Name of the index to get vectors from
 * @returns Promise with the list of vectors
 */
export const getBucketVectors = async (
  region: string = 'us-east-1',
  bucket: string,
  index: string
): Promise<VectorData[]> => {
  const response = await invoke<string>('get_bucket_vectors', { region, bucket, index });
  return JSON.parse(response);
};
