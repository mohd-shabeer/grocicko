import theme from '@/utils/theme';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SafeAreaWrapper = ({ children, style, backgroundColor }) => {
  return (
    <View style={[
      styles.container, 
      style,
      backgroundColor && { backgroundColor }
    ]}>
      <SafeAreaView style={styles.safeArea}>
        {children}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  safeArea: {
    flex: 1,
  },
});

export default SafeAreaWrapper;