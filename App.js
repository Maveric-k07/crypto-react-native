/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import { View, Text, TextInput, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Title, Paragraph } from 'react-native-paper';
import { FaCheckCircle } from 'react-icons/fa';
import { GiCancel } from 'react-icons/gi';
import { ActivityIndicator } from 'react-native-paper';
import { Provider as PaperProvider } from 'react-native-paper';
import axios from 'axios';


const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


const App = () => {
  const [transactionAddress, setTransactionAddress] = useState('');
  const [Amount, setAmount] = useState('');
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState('');
  const [hash,setHash] = useState('');
  const handleDialogClose = () => setOpen(false);
  


  const checkTransaction = () => {
    console.log(1);
    setLoading(true);
    let data = JSON.stringify({
      "hash": hash
    });
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://crypto-backend-8vxe.onrender.com/check-transaction',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    console.log(2);
    axios.request(config)
    .then((response) => {
      console.log(response.data.status)
      setLoading(false);
    setResponse(response.data.status);
    setOpen(true);
    })
    .catch((error) => {
      console.log(4);
      console.log(error);
      setLoading(false);
      setResponse(false);
      setOpen(true);
    });
    
}
  const sendTransaction = () => {
    setLoading(true);
    let data = JSON.stringify({
      "address": transactionAddress,
      "value": Amount
    });
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://crypto-backend-8vxe.onrender.com/send-transaction',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    axios.request(config)
    .then((response) => {
      console.log(response.data.hash)
      setHash(response.data.hash)
      checkTransaction();
      setLoading(false);
    })
    .catch((error) => {
      console.log(error);
      setLoading(false);
    });
    
  }
  





 const getBalance = () => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://crypto-backend-8vxe.onrender.com/get-balance',
    headers: { }
  };
  
  axios.request(config)
  .then((response) => {
    console.log(response.data.balance)
    setBalance(response.data.balance)
  })
  .catch((error) => {
    console.log(error);
  });
 }

  const checkAgain = () => {
    checkTransaction(hash)
  };
  
  useEffect(() => {
    getBalance();
  }, []);
  useEffect(() => {
    getBalance();
  }, [hash]);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
          <Title style={{ textAlign: 'center', paddingBottom: 20, fontWeight: 'bold' }}>Send Ethereum to anyone</Title>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <TextInput
                label="Transaction Address"
                name="Address"
                value={transactionAddress}
                onChangeText={setTransactionAddress}
                style={{ backgroundColor: '#fff', padding: 10 }}
              />
            </View>
            <View style={{ flex: 1, paddingLeft: 10 }}>
              <TextInput
                label="Amount"
                name="amount"
                value={Amount}
                onChangeText={setAmount}
                style={{ backgroundColor: '#fff', padding: 10 }}
              />
            </View>
          </View>
          <TouchableOpacity onPress={() => { setLoading(true);  sendTransaction();}}>
            <Button mode="contained" style={{ backgroundColor: '#B00020', marginTop: 20 }}>
              Submit
            </Button>
          </TouchableOpacity>
          <View style={{ marginTop: 20 }}>
            <Text style={{ textAlign: 'center' }}>{`Balance:  ${balance}`}</Text>
          </View>
        </View>


        <Portal>
          {loading && <LoadingScreen />}
          <Dialog visible={open} onDismiss={handleDialogClose}>
            <Dialog.Title>Response</Dialog.Title>
            <Dialog.Content>
              <Text variant='h6' align='center'>
                {response? (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {/* <FaCheckCircle color="green" paddingRight="10px" /> */}
                    <Text>{"Successfull Transaction"}</Text>
                  </View>
                ) : (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {/* <GiCancel color="red" paddingRight="10px" /> */}
                    <Text>{"Pending or Unknown Transaction"}</Text>
                  </View>
                )}
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={handleDialogClose} color="primary">
                Close
              </Button>
              {response && (
                <Button
                  onPress={() => {
                    Linking.openURL(
                      "https://sepolia.etherscan.io/address/0xd94fed42719db4e9ac48a587ad25bd14fc19b697"
                    );
                  }}
                  buttonColor="primary"
                >
                  Check Transactions
                </Button>
              )}
              {!response && (
                <Button onPress={checkAgain} color="primary">
                  Check Again
                </Button>
              )}
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </PaperProvider>
  )
}


export default App;

