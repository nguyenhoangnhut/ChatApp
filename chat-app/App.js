import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [pinnedMessage, setPinnedMessage] = useState(null);
  const [reminderModalVisible, setReminderModalVisible] = useState(false);
  const [reminderText, setReminderText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [autoReply, setAutoReply] = useState(null);

  const onSend = () => {
    if (inputText.trim() !== "") {
      const newMessage = {
        id: messages.length + 1,
        text: inputText,
        timestamp: new Date().toLocaleTimeString(),
        sender: "user",
      };

      setMessages([...messages, newMessage]);
      setInputText("");
      setAutoReply(null);
    }
  };

  const onAutoReply = () => {
    const reply = "Chào bạn! Tôi là trả lời tự động.";
    const autoReplyMessage = {
      id: messages.length + 1,
      text: reply,
      timestamp: new Date().toLocaleTimeString(),
      sender: "bot",
    };

    setAutoReply(autoReplyMessage);
    setMessages([...messages, autoReplyMessage]);
  };

  const onDelete = (messageId) => {
    const updatedMessages = messages.filter((message) => message.id !== messageId);
    setMessages(updatedMessages);
    if (pinnedMessage?.id === messageId) {
      setPinnedMessage(null);
    }
  };

  const onPinMessage = (messageId) => {
    const pinnedMsg = messages.find((message) => message.id === messageId);
    setPinnedMessage(pinnedMsg);
  };

  const onUnpinMessage = () => {
    setPinnedMessage(null);
  };

  const onSetReminder = () => {
    if (reminderText.trim() !== "") {
      const reminderMessage = {
        id: messages.length + 1,
        text: `Nhắc nhở lúc ${new Date().toLocaleTimeString()}: ${reminderText}`,
        timestamp: new Date().toLocaleTimeString(),
        sender: "bot",
      };

      setMessages([...messages, reminderMessage]);
      setReminderText("");
      setReminderModalVisible(!reminderModalVisible);
    }
  };

  const onSearchMessages = () => {
    const results = messages.filter((message) =>
      message.text.toLowerCase().includes(searchText.toLowerCase())
    );
    setSearchResults(results);
  };

  const onCloseSearch = () => {
    setSearchText("");
    setSearchResults([]);
  };

  const onSelectFunction = (functionName) => {
    switch (functionName) {
      case "autoReply":
        onAutoReply();
        break;
      case "setReminder":
        setReminderModalVisible(true);
        break;
      case "search":
        onSearchMessages();
        break;
      case "closeSearch":
        onCloseSearch();
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      {autoReply && (
        <View style={styles.botMessage}>
          <Text style={styles.messageText}>{autoReply.text}</Text>
          <Text style={styles.timestamp}>{autoReply.timestamp}</Text>
        </View>
      )}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={
              item.id === (pinnedMessage?.id || 0)
                ? styles.pinnedMessage
                : item.sender === "user"
                ? styles.userMessage
                : styles.botMessage
            }
          >
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
            {item.sender === "user" && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => onDelete(item.id)}>
                  <Text style={styles.buttonText}>Xóa</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPinMessage(item.id)}>
                  <Text style={styles.buttonText}>Ghim</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
      <View style={styles.functionContainer}>
        <TouchableOpacity
          style={styles.functionButton}
          onPress={() => onSelectFunction("setReminder")}
        >
          <Text style={styles.buttonText}>Nhắc nhở</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.functionButton}
          onPress={() => onSelectFunction("search")}
        >
          <Text style={styles.buttonText}>Tìm kiếm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.functionButton}
          onPress={() => onSelectFunction("closeSearch")}
        >
          <Text style={styles.buttonText}>Đóng tìm kiếm</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập tin nhắn..."
          value={inputText}
          onChangeText={(text) => setInputText(text)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={() => onSend()}>
          <Text style={styles.sendButtonText}>&#10148;</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={reminderModalVisible}
        onRequestClose={() => setReminderModalVisible(!reminderModalVisible)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Nhập nội dung nhắc nhở:</Text>
            <TextInput
              style={styles.reminderInput}
              placeholder="Nội dung nhắc nhở"
              value={reminderText}
              onChangeText={(text) => setReminderText(text)}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                onSetReminder();
                setReminderModalVisible(!reminderModalVisible);
              }}
            >
              <Text style={styles.buttonText}>Đặt nhắc nhở</Text>
            </TouchableOpacity>
            <Pressable
              style={styles.modalButton}
              onPress={() => setReminderModalVisible(!reminderModalVisible)}
            >
              <Text style={styles.buttonText}>Đóng</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {searchResults.length > 0 && (
        <View style={styles.searchResultsContainer}>
          <Text style={styles.searchResultsText}>Kết quả tìm kiếm:</Text>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View
                style={
                  item.id === (pinnedMessage?.id || 0)
                    ? styles.pinnedMessage
                    : item.sender === "user"
                    ? styles.userMessage
                    : styles.botMessage
                }
              >
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightblue",
    padding: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#CCCCCC",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 10,
    marginRight: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    backgroundColor: "#E74C3C",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "pink",
    fontSize: 18,
  },
  functionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  functionButton: {
    width: 100,
    height: 40,
    backgroundColor: "#3498DB",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    marginHorizontal: 5,
  },
  userMessage: {
    backgroundColor: "#3498DB",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    alignSelf: "flex-end",
    maxWidth: "70%",
  },
  botMessage: {
    backgroundColor: "#2ECC71",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    alignSelf: "flex-start",
    maxWidth: "70%",
  },
  pinnedMessage: {
    backgroundColor: "#F39C12",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    alignSelf: "flex-start",
    maxWidth: "70%",
  },
  messageText: {
    color: "black",
  },
  timestamp: {
    color: "darkgray",
    fontSize: 12,
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 5,
  },
  reminderInput: {
    height: 40,
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 10,
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#3498DB",
    marginVertical: 5,
  },
  searchResultsContainer: {
    marginTop: 10,
  },
  searchResultsText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default ChatApp;
