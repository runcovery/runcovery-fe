import Button from "@/components/ui/Button";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

export type SelectedImage = {
  uri: string;
  fileName?: string | null;
  mimeType?: string;
};

export default function SkinAnalysisScreen({
  isLoading,
  error,
  onSubmit,
}: {
  isLoading: boolean;
  error?: string | null;
  onSubmit: (image: SelectedImage) => void;
}) {
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null,
  );
  const [pickerError, setPickerError] = useState<string | null>(null);

  const handlePickImage = async () => {
    try {
      setPickerError(null);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.9,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedImage({
          uri: asset.uri,
          fileName: asset.fileName,
          mimeType: asset.mimeType,
        });
      }
    } catch {
      setPickerError("이미지를 불러오지 못했어요. 다시 선택해 주세요.");
    }
  };

  return (
    <View className="flex-1 w-full items-center px-8 pt-8 pb-5">
      <View className="gap-2">
        <Text className="text-center text-[20px] font-semibold text-black">
          얼굴이 잘 나온 사진을 선택해 주세요.
        </Text>
        <Text className="text-center text-[14px] font-medium text-neutral-400">
          메이크업을 지우고 밝은 조명에서 찍은 사진일수록{"\n"}
          피부 상태를 더 정확하게 분석할 수 있어요.
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          selectedImage
            ? "피부 분석 이미지 다시 선택하기"
            : "피부 분석 이미지 선택하기"
        }
        disabled={isLoading}
        onPress={() => void handlePickImage()}
        // shadow-[0_4px_4px_rgba(0,0,0,0.12)]
        className="my-7 h-80 w-60 overflow-hidden rounded-[50%] bg-neutral-100"
      >
        {selectedImage ? (
          <Image
            source={{ uri: selectedImage.uri }}
            className="h-full w-full"
            resizeMode="cover"
          />
        ) : (
          <View className="h-full w-full items-center justify-center px-7">
            <Text className="text-center text-[16px] font-medium text-neutral-400">
              눌러서 이미지 파일 선택
            </Text>
          </View>
        )}
      </Pressable>

      {(pickerError || error) && (
        <Text className="mt-2 text-center text-[13px] text-error">
          {pickerError || error}
        </Text>
      )}

      <View className="mt-auto w-full gap-3 pt-5">
        <Button
          disabled={!selectedImage}
          isLoading={isLoading}
          onPress={() => selectedImage && onSubmit(selectedImage)}
        >
          피부 분석하기
        </Button>
        {selectedImage && (
          <Button
            isWhite
            disabled={isLoading}
            onPress={() => void handlePickImage()}
          >
            다른 이미지 선택
          </Button>
        )}
      </View>
    </View>
  );
}
