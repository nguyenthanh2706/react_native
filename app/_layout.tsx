import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tab1)" options={{ headerShown: false }} />
    </Stack>
  );
}