import React, { useState } from 'react';
import { View, Text, Button, Image, ActivityIndicator, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { extractReceiptDetails } from '../../services/ocr';

const OCRScreen = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const pickImage = async () => {
    setError(null);
    setResult(null);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Permission to access gallery is required!');
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      setImage(pickerResult.assets[0].uri);
    }
  };

  const scanReceipt = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const details = await extractReceiptDetails(image);
      setResult(details);
    } catch (e: any) {
      setError(e.message || 'Failed to extract details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick Receipt Image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {image && <Button title="Scan Receipt" onPress={scanReceipt} />}
      {loading && <ActivityIndicator size="large" color="#007AFF" />}
      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Extracted Details:</Text>
          <Text selectable>{JSON.stringify(result, null, 2)}</Text>
        </View>
      )}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  image: { width: '100%', height: 250, marginVertical: 16, resizeMode: 'contain' },
  resultBox: { marginTop: 16, padding: 12, backgroundColor: '#f2f2f2', borderRadius: 8 },
  resultTitle: { fontWeight: 'bold', marginBottom: 8 },
  error: { color: 'red', marginTop: 12 },
});

export default OCRScreen;
