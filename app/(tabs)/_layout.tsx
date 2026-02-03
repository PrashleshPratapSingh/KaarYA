import { Tabs } from "expo-router";
import { useColorScheme, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import CustomTabBar from "../../components/navigation/CustomTabBar";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="my-work"
        options={{
          title: "My Work",
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          title: "Post",
        }}
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault();
            router.push("/post-gig");
          },
        })}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}

// Remove unused styles
const styles = StyleSheet.create({});
