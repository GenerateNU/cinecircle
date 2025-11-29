import { S3ServiceImpl } from './s3';
import { promises as fs } from 'fs';

/**
 * Will send the list of files to the s3 bucket and return the urls in a list with the same index.
 *
 * @param files The list of files put into the S3 bucket
 * @param folder Optional folder path within the bucket (e.g., 'posts', 'movies', 'profiles')
 */
export default async function sendFilesToS3(
  base64s: any[], 
  folder?: string
): Promise<(string | null)[]> {
    const s3Service = new S3ServiceImpl();
  
    const uploads = base64s.map(async (pd) => {
      const buffer = Buffer.from(pd.base64.split(",")[1], "base64");
      return await s3Service.upload({
        buffer,
        filename: pd.name,
        mimetype: pd.fileType,
        folder,
      });
    });
  
    return Promise.all(uploads);
  }

//This function should be moved.
export function base64ToFile(
  base64String: string,
  fileName: string,
  fileType: string,
): File {
  const base64Data = base64String.split(',')[1];
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  const blob = new Blob([byteArray], { type: fileType });

  const file = new File([blob], fileName, { type: fileType });

  return file;
}