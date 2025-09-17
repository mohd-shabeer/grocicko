import BrandsList from '@/components/BrandsList';
import FeaturedProducts from '@/components/FeaturedProducts';
import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import MainCategories from '@/components/MainCategories';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import theme from '@/utils/theme';
import { ScrollView, StyleSheet } from 'react-native';

const HomePage = () => {
  return (
    <SafeAreaWrapper>
      <Header />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <HeroSlider />
        <MainCategories />
        <FeaturedProducts />
        <BrandsList />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  contentContainer: {
    paddingBottom: theme.spacing.xxxl,
  },
});

export default HomePage;