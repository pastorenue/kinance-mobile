import * as FileSystem from 'expo-file-system';
import { apiService } from './api';

// This function uploads the image to the backend for OCR/AI extraction
export async function extractReceiptDetails(imageUri: string): Promise<any> {
  // Read the image as a blob
  const fileInfo = await FileSystem.getInfoAsync(imageUri);
  if (!fileInfo.exists) throw new Error('File does not exist');

  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    name: 'receipt.jpg',
    type: 'image/jpeg',
  } as any);

  // You may need to adjust the endpoint to match your backend
  const response = await apiService.upload<any>('/api/v1/receipts/ocr', formData);
  return response.data;
}
