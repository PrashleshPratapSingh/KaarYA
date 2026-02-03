import { Modal, View, Text, Pressable, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

export interface FileUploadModalProps {
    visible: boolean;
    onClose: () => void;
    gigId: string;
    gigTitle: string;
    onUpload: () => void;
}

export function FileUploadModal({ visible, onClose, gigTitle, onUpload }: FileUploadModalProps) {
    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need access to your gallery to upload work.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            onUpload(); // Simulate completion after pick
        }
    };

    const handleCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need camera access to capture your work.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            onUpload(); // Simulate completion after capture
        }
    };

    const handlePickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
            });

            if (!result.canceled) {
                onUpload(); // Simulate completion after selection
            }
        } catch (err) {
            Alert.alert('Error', 'Could not access file system.');
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
            <View className="flex-1 bg-black/50 justify-end">
                <View className="bg-white rounded-t-[40px] p-8 pb-12">
                    <View className="w-12 h-1 bg-gray-200 rounded-full self-center mb-8" />

                    <Text className="text-xl font-extrabold text-gray-900 text-center mb-2">
                        Upload Assets
                    </Text>
                    <Text className="text-sm text-gray-500 text-center mb-8 px-8">
                        {gigTitle}
                    </Text>

                    <View className="flex-row flex-wrap gap-4 mb-8">
                        <Pressable
                            onPress={handleCamera}
                            className="flex-1 min-w-[40%] bg-gray-50 border border-gray-100 rounded-3xl p-6 items-center justify-center active:scale-95 active:bg-gray-100"
                        >
                            <View className="w-12 h-12 bg-white rounded-2xl shadow-sm items-center justify-center mb-3">
                                <Feather name="video" size={24} color="#FFE500" />
                            </View>
                            <Text className="text-xs font-bold text-karya-black">CAMERA</Text>
                        </Pressable>

                        <Pressable
                            onPress={handlePickImage}
                            className="flex-1 min-w-[40%] bg-gray-50 border border-gray-100 rounded-3xl p-6 items-center justify-center active:scale-95 active:bg-gray-100"
                        >
                            <View className="w-12 h-12 bg-white rounded-2xl shadow-sm items-center justify-center mb-3">
                                <Feather name="image" size={24} color="#FFE500" />
                            </View>
                            <Text className="text-xs font-bold text-karya-black">GALLERY</Text>
                        </Pressable>

                        <Pressable
                            onPress={handlePickDocument}
                            className="w-full bg-gray-50 border border-gray-100 rounded-3xl p-6 flex-row items-center justify-center gap-4 active:scale-95 active:bg-gray-100"
                        >
                            <View className="w-12 h-12 bg-white rounded-2xl shadow-sm items-center justify-center">
                                <Feather name="file-text" size={24} color="#FFE500" />
                            </View>
                            <Text className="text-xs font-bold text-karya-black">CHOOSE DOCUMENT / FILE</Text>
                        </Pressable>
                    </View>

                    <Pressable onPress={onClose} className="py-2 items-center">
                        <Text className="text-gray-400 font-bold text-xs">CANCEL</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}
