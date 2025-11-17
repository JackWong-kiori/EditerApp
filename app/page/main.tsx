import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import {
  Alert, FlatList, Modal, StyleSheet, Text, TextInput,
  TouchableOpacity, View
} from "react-native";
import { Customer, CustomerApiService, CustomerDataItemsService } from "../api";
import Layout from "../components/node/layout";
import { safeApi, safeApiWithFallback } from "../components/utils/safeApi";

const StoargeKey_AllCustomers = "all_customers";

export default function Main() {
  const [nickname, setNickname] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [Customers, setCustomers] = useState<Customer[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCustomerName, setnewCustomerName] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // 先將本地的推上去，再把遠端的資料一起抓下來
  const syncCustomers = async () => {
    var local = Customers;

    //若沒有資料嘗試取得本地的
    if (local.length == 0) {
      var json = await AsyncStorage.getItem(StoargeKey_AllCustomers);
      local = JSON.parse(json ?? '[]');
      setCustomers(customers => local);
    }

    const queue: Customer[] = local.filter((item) => item.id! < 0);

    for (const item of queue) {
      try {
        const customer = await safeApi(
          CustomerApiService.postApiCustomersCreateCustomer,
          [{
            name: item.name
          }]
        );

        // 更新 UI（把負 ID 換成真 ID）
        local = local.map(c => (c.id === item.id ? customer : c));
      } catch (e) {
        console.log("單筆同步失敗，保留於隊列");
      }
    }

    setCustomers(() => {
      AsyncStorage.setItem(StoargeKey_AllCustomers, JSON.stringify(local));
      return local;
    });

    // 客戶清單資料
    const apiCustomers = await safeApiWithFallback(
      CustomerApiService.getApiCustomersGetAll,
      [],
      StoargeKey_AllCustomers
    );

    setCustomers(() => {
      AsyncStorage.setItem(StoargeKey_AllCustomers, JSON.stringify(apiCustomers));
      return apiCustomers;
    });
  };

  //伺服器不斷確認同步
  useEffect(() => {
    let interval = setInterval(async () => {
      try {
        await safeApi(CustomerDataItemsService.getApiCustomerDataItemsCheck);
        console.log("伺服器可用 → 嘗試同步");
        await syncCustomers();
      } catch (e) {
        console.log("伺服器離線!!", e);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);


  // 客戶清單載入
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // 登入者
        const nickname = await AsyncStorage.getItem('nickname');
        setNickname(nickname);

        //同步 本地與遠端資料
        await syncCustomers();
      } catch (err) {
        console.error("資料讀取失敗", err);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // 打開新增客戶視窗
  const handleOpenModal = () => {
    setnewCustomerName('');
    setModalVisible(true);
  };

  // 儲存並新增客戶
  const handleSaveNewCustomer = async () => {
    if (!newCustomerName.trim()) {
      Alert.alert("請輸入專案名稱");
      return;
    }
    setLoading(true);

    try {
      const newCustomer: Customer = {
        id: Date.now() * -1,
        name: newCustomerName.trim(),
      };

      let savedCustomer = newCustomer;

      try {
        // 嘗試呼叫 API
        const apiCustomer = await safeApi(
          CustomerApiService.postApiCustomersCreateCustomer,
          [{
            name: newCustomer.name
          }]
        );

        // 上傳成功
        savedCustomer = apiCustomer;
      } catch (err) {
        console.log(err)
      }

      // 更新客戶列表
      setCustomers(customers => {
        const list = [...customers, savedCustomer];
        AsyncStorage.setItem(StoargeKey_AllCustomers, JSON.stringify(list));
        return list;
      });


      // 關閉 modal
      setModalVisible(false);

      // 延遲滾動到底
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

    } catch (err) {
      console.error("Create customer failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // TODO 要刪除的CODE 
  // 清空客戶列表
  const handleClearCustomers = () => setCustomers([]);

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
        <TouchableOpacity style={styles.addButton} onPress={handleOpenModal}>
          <Text style={styles.addButtonText}>新增</Text>
        </TouchableOpacity>

        <Text style={styles.title}>專案主頁</Text>

        {/* TODO 要刪除的CODE  */}
        <TouchableOpacity style={styles.clearButton} onPress={handleClearCustomers}>
          <Text style={styles.clearButtonText}>清除</Text>
        </TouchableOpacity>
      </View>

      {/* 專案方格列表 */}
      <FlatList
        ref={flatListRef}
        data={Customers}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.customerList}
        renderItem={({ item }) => (
          <View style={styles.customerBox}>
            <View style={styles.displayRow}>
              <Text style={styles.displayLabel}>專案名稱:</Text>
              <Text style={styles.displayName}>
                {item.name}
                {item.id < 0 ? "（待同步）" : ""}
              </Text>
            </View>
          </View>
        )}
      />

      {/* 新增專案 Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>新增專案</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="請輸入專案名稱"
              value={newCustomerName}
              onChangeText={setnewCustomerName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleSaveNewCustomer}>
                <Text style={styles.modalButtonText}>儲存</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>取消</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  // TODO 要刪除的CODE
  clearButton: {
    backgroundColor: '#FF3B30',
    width: 80,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // TODO 要刪除的CODE
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  customerList: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  customerBox: {
    backgroundColor: '#e6f0ff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 12,
    minHeight: 100,
    justifyContent: 'center',
  },
  projectName: {
    fontSize: 18,
    fontWeight: '600',
  },
  // Modal 樣式
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'stretch',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#28a745',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  displayRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  displayLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 2,
    width: 70,
  },
  displayName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
});
