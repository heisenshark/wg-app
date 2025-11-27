import React from 'react';
import { StyleSheet, TextInput, View, useColorScheme, ViewStyle, StyleProp, TextInputProps } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import Icon from './icon';
import { Colors } from '@/constants/theme';

type SearchBoxProps = {
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  value?: string;
  onChangeText?: (text: string) => void;
} & TextInputProps;

export function SearchBox({ style, ...restProps }: SearchBoxProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[colorScheme ?? 'light'];

  const borderColor = isDark ? '#353636' : '#334155';
  const iconColor = isDark ? '#A1CEDC' : '#1e293b';
  const textColor = isDark ? '#fff' : '#000';
  const placeholderColor = '#888';

  return (
    <View style={[styles.container, { borderColor }, style]}>

      <View style={{ width: 24, display: "flex" }}>
        <Icon name='search' color={colors.text} ></Icon>
      </View>
      <TextInput
        style={[styles.input, { color: textColor }]}
        placeholderTextColor={placeholderColor}
        {...restProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    backgroundColor: 'transparent', // Can change if you want a background fill
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
});
