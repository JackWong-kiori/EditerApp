import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import CheckLogin from "../components/checkLogin";
import Layout from "../components/node/layout";

export default function Main() {
    const [nickname, setNickname] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AsyncStorage.getItem('nickname')
            .then(value => {
                setNickname(value);
            })
            .catch(err => {
                console.error("讀取暱稱失敗: ", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);
    // roomName="my-room" myName={nickname!} myColor="black"
    return (
        <Layout>
            <CheckLogin />
            <Text>Hello</Text>
            {/* <CollaborativeTextInput /> */}
        </Layout>
    );
}