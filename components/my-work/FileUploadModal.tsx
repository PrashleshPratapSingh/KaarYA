import React, { useState } from 'react';
import { Modal, View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
// import * as DocumentPicker from 'expo-document-picker';
import { FileAttachment } from '../../lib/types/mywork';

interface FileUploadModalProps {
    visible: boolean;
    onClose: () => void;
    gigId: string;
    gigTitle: string;
    onUpload: (files: Partial<FileAttachment>[]) => Promise<void>;
}

export function FileUploadModal({
    visible,
    onClose,
    gigId,
    gigTitle,
    onUpload,
}: FileUploadModalProps) {
    const [selectedFiles, setSelectedFiles] = useState<Partial<FileAttachment>[]>([]);
    const [uploading, setUploading] = useState(false);

    const pickFiles = async () => {
        try {
      // NOTE: Requires expo-document-picker installed
      // Uncomment when package is installed:
      /*
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/* ',
            multiple: true,
                copyToCacheDirectory: true,
      });

        if (result.type === 'success') {
            const newFiles: Partial<FileAttachment>[] = [{
                id: Date.now().toString(),
                name: result.name,
                uri: result.uri,
                size: result.size || 0,
                type: result.mimeType || 'application/octet-stream',
            }];
            setSelectedFiles([...selectedFiles, ...newFiles]);
        }
      */

        // Mock file selection for now
        const mockFile: Partial<FileAttachment> = {
            id: Date.now().toString(),
            name: 'sample_design.pdf',
            uri: 'file://mock-uri',
            size: 1024000,
            type: 'application/pdf',
        };
        setSelectedFiles([...selectedFiles, mockFile]);
    } catch (error) {
        Alert.alert('Error', 'Could not pick file');
    }
};

const removeFile = (fileId: string) => {
    setSelectedFiles(selectedFiles.filter(f => f.id !== fileId));
};

const handleUpload = async () => {
    if (selectedFiles.length === 0) {
        Alert.alert('No Files', 'Please select at least one file to upload');
        return;
    }

    setUploading(true);
    try {
        await onUpload(selectedFiles);
        setSelectedFiles([]);
        onClose();
    } catch (error) {
        Alert.alert('Upload Failed', 'Could not upload files. Please try again.');
    } finally {
        setUploading(false);
    }
};

const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

return (
    <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="formSheet"
    >
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="bg-karya-black border-b-brutal border-karya-black px-4 py-3 flex-row items-center justify-between">
                <View className="flex-1">
                    <Text className="text-lg font-bold text-karya-yellow tracking-tight">
                        Upload Deliverables
                    </Text>
                    <Text className="text-xs text-white/70">{gigTitle}</Text>
                </View>
                <Pressable onPress={onClose}>
                    <Feather name="x" size={24} color="#FFDE03" />
                </Pressable>
            </View>

            {/* Content */}
            <ScrollView className="flex-1 p-4">
                {/* File Selection Button */}
                <Pressable
                    onPress={pickFiles}
                    className="bg-karya-yellow border-brutal border-karya-black p-6 items-center mb-4"
                >
                    <Feather name="file-plus" size={48} color="#000000" />
                    <Text className="text-lg font-bold text-karya-black mt-3 tracking-tight">
                        SELECT FILES
                    </Text>
                    <Text className="text-sm text-karya-black/70 mt-1">
                        Tap to choose files from your device
                    </Text>
                </Pressable>

                {/* Selected Files List */}
                {selectedFiles.length > 0 && (
                    <View className="mb-4">
                        <Text className="text-sm font-bold text-gray-600 mb-3">
                            SELECTED FILES ({selectedFiles.length})
                        </Text>

                        {selectedFiles.map((file) => (
                            <View
                                key={file.id}
                                className="bg-white border-2 border-gray-300 p-3 mb-2 flex-row items-center"
                            >
                                <Feather name="file" size={24} color="#6B7280" />
                                <View className="flex-1 ml-3">
                                    <Text className="text-sm font-bold text-gray-800" numberOfLines={1}>
                                        {file.name}
                                    </Text>
                                    <Text className="text-xs text-gray-500">
                                        {formatFileSize(file.size || 0)}
                                    </Text>
                                </View>
                                <Pressable onPress={() => removeFile(file.id!)} className="p-2">
                                    <Feather name="trash-2" size={18} color="#EF4444" />
                                </Pressable>
                            </View>
                        ))}
                    </View>
                )}

                {/* Instructions */}
                <View className="bg-gray-100 border-2 border-gray-300 p-4">
                    <Text className="text-sm font-bold text-gray-700 mb-2">
                        Upload Guidelines:
                    </Text>
                    <Text className="text-xs text-gray-600 leading-5">
                        • Accepted formats: PDF, DOC, ZIP, images, videos{'\n'}
                        • Maximum file size: 50MB per file{'\n'}
                        • You can upload multiple files{'\n'}
                        • Files will be reviewed by the client
                    </Text>
                </View>
            </ScrollView>

            {/* Bottom Actions */}
            <View className="border-t-brutal border-gray-300 p-4 gap-3">
                <Pressable
                    onPress={handleUpload}
                    className={`py-4 border-brutal items-center ${selectedFiles.length > 0 && !uploading
                            ? 'bg-karya-yellow border-karya-black'
                            : 'bg-gray-300 border-gray-400'
                        }`}
                    disabled={selectedFiles.length === 0 || uploading}
                >
                    <Text className={`text-base font-bold ${selectedFiles.length > 0 && !uploading
                            ? 'text-karya-black'
                            : 'text-gray-500'
                        }`}>
                        {uploading ? 'UPLOADING...' : `UPLOAD ${selectedFiles.length} FILE(S)`}
                    </Text>
                </Pressable>

                <Pressable
                    onPress={onClose}
                    className="py-4 border-brutal border-karya-black bg-white items-center"
                >
                    <Text className="text-base font-bold text-karya-black">
                        CANCEL
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    </Modal>
);
}
