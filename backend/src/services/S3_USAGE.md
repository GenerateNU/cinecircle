# S3 Image Upload

## Overview

Images are organized in S3 by entity type using folder prefixes for better organization and management.

## Folder Structure

```
cinecircle-bucket/
├── posts/
├── movies/
├── profiles/
├── events/
└── reviews/
```

## Usage Examples

### 1. Upload Post Images

```typescript
import sendFilesToS3 from '../services/sendFiles.js';
import { S3_FOLDERS } from '../services/s3-folders.js';

const images = [
  {
    base64: 'data:image/jpeg;base64,...',
    name: 'photo.jpg',
    fileType: 'image/jpeg',
  },
];

const urls = await sendFilesToS3(images, S3_FOLDERS.POSTS);
// Returns: ["https://bucket.s3.region.amazonaws.com/posts/uuid-photo.jpg"]
```

### 2. Upload Movie Posters

```typescript
const posters = [
  {
    base64: 'data:image/png;base64,...',
    name: 'poster.png',
    fileType: 'image/png',
  },
];

const urls = await sendFilesToS3(posters, S3_FOLDERS.MOVIES);
// Returns: ["https://bucket.s3.region.amazonaws.com/movies/uuid-poster.png"]
```

### 3. Upload Profile Pictures

```typescript
const profilePic = [
  {
    base64: 'data:image/jpeg;base64,...',
    name: 'avatar.jpg',
    fileType: 'image/jpeg',
  },
];

const urls = await sendFilesToS3(profilePic, S3_FOLDERS.PROFILES);
// Returns: ["https://bucket.s3.region.amazonaws.com/profiles/uuid-avatar.jpg"]
```

### 4. Upload Event Images

```typescript
const eventImages = [
  {
    base64: 'data:image/jpeg;base64,...',
    name: 'event-banner.jpg',
    fileType: 'image/jpeg',
  },
];

const urls = await sendFilesToS3(eventImages, S3_FOLDERS.EVENTS);
// Returns: ["https://bucket.s3.region.amazonaws.com/events/uuid-event-banner.jpg"]
```

## Adding New Entity Types

1. Add to `s3-folders.ts`:

```typescript
export const S3_FOLDERS = {
  // ... existing
  NEW_TYPE: 'new-type',
} as const;
```

2. Use in controller:

```typescript
import { S3_FOLDERS } from '../services/s3-folders.js';

const urls = await sendFilesToS3(files, S3_FOLDERS.NEW_TYPE);
```
