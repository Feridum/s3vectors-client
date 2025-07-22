# S3 Vectors Client

A desktop application for exploring and managing AWS S3 Vector Stores. Built with Tauri, React, and TypeScript.

## Overview

S3 Vectors Client is a cross-platform desktop application that allows you to browse, visualize, and manage your AWS S3 Vector Stores. It provides an intuitive interface for exploring buckets, indexes, and vector data with metadata visualization capabilities.

## Demo


## Features

- **Multi-region Support**: Connect to different AWS regions and browse vector stores
- **Bucket Exploration**: View all S3 buckets with vector capabilities in your account
- **Index Browsing**: Explore vector indexes within each bucket
- **Vector Visualization**: View vector data including dimensions and metadata
- **Metadata Inspection**: Easily inspect JSON metadata associated with vectors
- **Cross-platform**: Works on Windows, macOS, and Linux

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Rust](https://www.rust-lang.org/tools/install) (v1.88.0 or higher)
- AWS credentials configured on your system (via AWS CLI or environment variables)

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/s3vectors-client.git
   cd s3vectors-client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run tauri:dev
   ```

### Building for Production

To build a production version of the application:

```bash
npm run tauri build
```

This will create platform-specific executables in the `src-tauri/target/release` directory.

## AWS Configuration

The application uses the AWS SDK for Rust and requires credentials to be configured on your system. You can set up credentials using:

1. AWS CLI: Run `aws configure`
2. Environment variables: Set `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_REGION`
3. Credentials file: Create or update `~/.aws/credentials`

## Development

This project uses:

- **Tauri**: For building the native desktop application
- **React**: For the frontend UI
- **TypeScript**: For type-safe JavaScript
- **TanStack Router**: For client-side routing
- **TanStack Table**: For data tables
- **Radix UI**: For accessible UI components
- **Tailwind CSS**: For styling

## License

MIT
