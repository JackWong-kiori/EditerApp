import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default function Index() {
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      const nickname = await AsyncStorage.getItem("nickname");
      setLoggedIn(!!nickname);
      setReady(true);
    })();
  }, []);

  if (!ready) return null;

  return loggedIn ? <Redirect href="/page/main" /> : <Redirect href="/page/login" />;
}
