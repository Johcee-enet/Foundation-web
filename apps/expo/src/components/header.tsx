import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { TouchableOpacity, View, Text } from "react-native";

export default function Header({
  top,
  title,
}: {
  top: number;
  title?: string;
}) {
  return (
    <View
      className="flex h-10 w-full flex-row items-center justify-between px-4"
      style={{ marginTop: top + 10 }}
    >
      <View className="flex flex-row items-center justify-start gap-6">
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        {title && (
          <Text className="font-[nunito] text-xl font-medium text-black">
            {title}
          </Text>
        )}
      </View>
    </View>
  );
}
