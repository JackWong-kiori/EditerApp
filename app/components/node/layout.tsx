import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  children?: ReactNode;
};

export default function Layout({ children }: Props) {
  return <View style={styles.screen}>{children}</View>;
}

const styles = StyleSheet.create({
  screen: {
    padding: 10,
    flex: 1,
    // backgroundColor: "skyblue"
  },
});
