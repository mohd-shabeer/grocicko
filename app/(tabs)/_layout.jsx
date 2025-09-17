import CustomTabBar from "@/components/CustomTabBar";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen 
        name="home" 
        options={{ 
          title: "Home",
          tabBarLabel: "Home",
        }} 
      />
      <Tabs.Screen 
        name="favourites" 
        options={{ 
          title: "Favourites",
          tabBarLabel: "Favourites",
        }} 
      />
      <Tabs.Screen 
        name="search" 
        options={{ 
          title: "Search",
          tabBarLabel: "Search",
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: "Profile",
          tabBarLabel: "Profile",
        }} 
      />
      <Tabs.Screen 
        name="cart" 
        options={{ 
          title: "Cart",
          tabBarLabel: "Cart",
        }} 
      />
    </Tabs>
  );
}