import { StyleSheet } from 'react-native';

import { Image, ImageNativeProps } from 'expo-image';
import icons from '@/utils/load-icons';
import type { IconName } from 'generated-icons';

type IconProps = ImageNativeProps & {
  name: IconName;
  color: string;
};

export default function components({ name, style, color, ...otherProps }: IconProps) {
  return (
    <Image tintColor={color} style={styles.icon} source={icons[name]} {...otherProps}></Image>
  );
}

const styles = StyleSheet.create(
  {
    icon: { flex: 1, width: '100%', color: "#fff" }
  }
)

