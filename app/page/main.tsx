import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useRef } from "react";
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Layout from "../components/node/layout";

interface Project {
  id: number;
  name: string;
  editingName: string;
}

export default function Main() {
  const [nickname, setNickname] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [projects, setProjects] = useState<Project[]>([]);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    AsyncStorage.getItem('nickname')
      .then(value => setNickname(value))
      .catch(err => console.error("讀取暱稱失敗: ", err))
      .finally(() => setLoading(false));
  }, []);

  // 新增專案方格
  const handleAddProject = () => {
    const newProject: Project = {
      id: projects.length + 1,
      name: '',
      editingName: '',
    };
    setProjects(prev => [...prev, newProject]);
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // 清空專案列表
  const handleClearProjects = () => {
    setProjects([]);
  };

  // 更新專案輸入文字
  const handleChangeText = (id: number, text: string) => {
    setProjects(prev =>
      prev.map(p => p.id === id ? { ...p, editingName: text } : p)
    );
  };

  // 儲存專案名稱
  const handleSaveProjectName = (id: number) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id === id) {
          if (!p.editingName.trim()) {
            Alert.alert("請輸入專案名稱");
            return p;
          }
          return { ...p, name: p.editingName };
        }
        return p;
      })
    );
  };

  if (loading) {
    return (
      <Layout>
        <Text style={styles.loadingText}>讀取中...</Text>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* 頂部標題 + 按鈕 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddProject}>
          <Text style={styles.addButtonText}>新增</Text>
        </TouchableOpacity>

        <Text style={styles.title}>專案主頁</Text>

        <TouchableOpacity style={styles.clearButton} onPress={handleClearProjects}>
          <Text style={styles.clearButtonText}>清除</Text>
        </TouchableOpacity>
      </View>

      {/* 專案方格列表 */}
      <FlatList
        ref={flatListRef}
        data={projects}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.projectList}
        renderItem={({ item }) => (
          <View style={styles.projectBox}>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>專案名稱:</Text>
              <TextInput
                style={styles.projectInput}
                placeholder="請輸入專案名稱"
                value={item.editingName}
                onChangeText={(text) => handleChangeText(item.id, text)}
              />
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => handleSaveProjectName(item.id)}
            >
              <Text style={styles.saveButtonText}>儲存</Text>
            </TouchableOpacity>

            {item.name ? (
              <Text style={styles.savedName}>已儲存名稱: {item.name}</Text>
            ) : null}
          </View>
        )}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  loadingText: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 20,
    height: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 80,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    width: 80,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  projectList: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  projectBox: {
    backgroundColor: '#e6f0ff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 12,
    position: 'relative',
    minHeight: 140, // 方格高度增大
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
    width: 90, // 固定寬度
    textAlign: 'left',
  },
  projectInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  saveButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: '#28a745',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  savedName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
  },
});
