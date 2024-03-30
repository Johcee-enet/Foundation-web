import type { ComponentPropsWithRef } from "react";
import { Text, TextInput, View } from "react-native";

interface InputProps extends ComponentPropsWithRef<typeof TextInput> {
  label?: string;
}
export default function Input({ label, ...props }: InputProps) {
  return (
    <View className="flex w-full flex-col">
      {label && (
        <Text className="mb-2 font-[nunito] text-sm font-light text-black">
          {label}
        </Text>
      )}
      <TextInput {...props} />
    </View>
  );
}
