import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme, View, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

/**
 * Tab Bar Icon component using Feather icons
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Feather>["name"];
  color: string;
}) {
  return <Feather size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === "dark" ? "#fff" : "#fff",
        tabBarInactiveTintColor: colorScheme === "dark" ? "#888" : "#aaa",
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginTop: 4,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="my-work"
        options={{
          title: "My Work",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="briefcase" color={color} />
          ),
        }}
      />

      {/* Center Post Tab - Uses Icon + Listener for stability */}
      <Tabs.Screen
        name="post"
        options={{
          title: "",
          // Create the White Plus Button using the standard Icon prop
          tabBarIcon: () => (
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Feather name="plus" size={28} color="#000" />
            </View>
          ),
        }}
        listeners={() => ({
          tabPress: (e) => {
            // Prevent default action (switching tabs)
            e.preventDefault();
            // Navigate manually
            router.push("/post-gig");
          },
        })}
      />

      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="message-circle" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}

// Remove unused styles
const styles = StyleSheet.create({});
