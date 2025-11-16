import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function CheckLogin() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const check = async () => {
      const nickname = await AsyncStorage.getItem('nickname');
      if (!nickname && pathname !== "/page/login") {
        router.replace("/page/login");
      }
    };
    check();
  }, [pathname]);

  return null;
}
