// app/write.js
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import React, { useState } from 'react';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import { globalStyles } from '../styles/globalStyles';

export default function WriteNFC() {
     const [text, setText] = useState('');
     const [status, setStatus] = useState(null);

     async function writeNdef() {
          try {
               await NfcManager.requestTechnology(NfcTech.Ndef);
               const bytes = Ndef.encodeMessage([Ndef.textRecord(text)]);

               if (bytes) {
                    await NfcManager.ndefHandler.writeNdefMessage(bytes);
                    setStatus('Successfully wrote to tag!');
               }
          } catch (ex) {
               console.warn('Oops!', ex);
               setStatus('Failed to write to tag.');
          } finally {
               NfcManager.cancelTechnologyRequest();
          }
     }

     return (
          <View style={globalStyles.container}>
               <TextInput
                    style={globalStyles.input}
                    value={text}
                    onChangeText={setText}
                    placeholder="Enter text to write to NFC tag"
                    placeholderTextColor="#999"
               />

               <TouchableOpacity style={globalStyles.button} onPress={writeNdef}>
                    <Text style={globalStyles.buttonText}>Write to NFC Tag</Text>
               </TouchableOpacity>

               {status && (
                    <Text style={globalStyles.status}>{status}</Text>
               )}
          </View>
     );
}