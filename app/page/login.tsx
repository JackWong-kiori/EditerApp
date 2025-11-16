import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput } from "react-native";
import Layout from '../components/node/layout';

export default function Login() {
    const [inputText, setInputText] = useState('');
    const router = useRouter();

    const handleInputText = (text: string) => {
        setInputText(text);
    };

    const handleEnter = async () => {
        if (!inputText.trim()) {
            Alert.alert('請輸入暱稱');
            return;
        }

        try {
            await AsyncStorage.setItem('nickname', inputText);
            router.replace('./page/main');
        } catch (e) {
            console.log('Failed to save nickname', e);
        }
    };

    return (
        <Layout>
            <Text style={styles.fieldName}>您的暱稱</Text>
            <TextInput
                value={inputText}
                style={styles.fieldValue}
                placeholder='請輸入暱稱'
                onChangeText={handleInputText}
                onSubmitEditing={handleEnter}
                returnKeyType="done"
            />
            <Button title="進入" onPress={handleEnter} />
        </Layout>
    );
}

const styles = StyleSheet.create({
    screen: {
        margin: 5,
        padding: 5,
        paddingTop: 15,
    },
    fieldName: {
        margin: 0,
        padding: 0,
    },
    fieldValue: {
        margin: 0,
        padding: 0,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 5,
        marginVertical: 10,
    }
});
