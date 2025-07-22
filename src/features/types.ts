// Common types used across features

// S3 Bucket type
export type Bucket = {
  name: string;
  arn: string;
};

// Bucket Index type
export type BucketIndex = {
  indexName: string;
  vectorBucketName: string;
  indexArn: string;
  index_name: string;
};

// Vector Data type
export type VectorData = {
  key: string;
  data: number[];
  metadata: any | null;
};
