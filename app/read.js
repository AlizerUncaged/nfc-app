// app/read.js
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { globalStyles } from '../styles/globalStyles';

export default function ReadNFC() {
     const [tagData, setTagData] = useState(null);

     const formatNdefRecord = (record) => {
          const tnf = record.tnf;
          const type = record.type ? new Uint8Array(record.type) : null;
          const id = record.id ? new Uint8Array(record.id) : null;
          const payload = record.payload ? new Uint8Array(record.payload) : null;

          // Try to convert payload to text if possible
          let payloadText = 'Unable to decode';
          if (payload) {
               try {
                    // Skip first byte (language code length) for Text Records
                    const payloadString = String.fromCharCode.apply(null, payload.slice(1));
                    payloadText = decodeURIComponent(escape(payloadString));
               } catch (e) {
                    console.warn('Failed to decode payload', e);
               }
          }

          return {
               tnf: tnf || 'Not available',
               type: type ? Array.from(type).join(',') : 'Not available',
               id: id ? Array.from(id).join(',') : 'Not available',
               payload: payload ? Array.from(payload).join(',') : 'Not available',
               payloadAsText: payloadText
          };
     };

     const parseTagData = (tag) => {
          if (!tag) return null;

          let parsedData = {
               basicInfo: {
                    techTypes: tag.techTypes || [],
                    maxSize: tag.maxSize || 'Not available',
                    isWritable: tag.isWritable !== undefined ? tag.isWritable.toString() : 'Unknown',
                    id: tag.id ? Array.from(new Uint8Array(tag.id)).map(b => b.toString(16).padStart(2, '0')).join(':') : 'Not available',
                    type: tag.type || 'Not available'
               },
               ndefMessage: tag.ndefMessage ? tag.ndefMessage.map(formatNdefRecord) : [],
               canMakeReadOnly: tag.canMakeReadOnly !== undefined ? tag.canMakeReadOnly.toString() : 'Unknown',
               isWriteable: tag.isWriteable !== undefined ? tag.isWriteable.toString() : 'Unknown'
          };

          return parsedData;
     };

     const DataSection = ({ title, data }) => (
          <View style={styles.section}>
               <Text style={styles.sectionTitle}>{title}</Text>
               {Object.entries(data).map(([key, value]) => (
                    <View key={key} style={styles.dataRow}>
                         <Text style={styles.dataLabel}>{key}:</Text>
                         <Text style={styles.dataValue}>
                              {Array.isArray(value) ? value.join(', ') : value.toString()}
                         </Text>
                    </View>
               ))}
          </View>
     );

     const NdefRecordView = ({ record, index }) => (
          <View style={styles.ndefRecord}>
               <Text style={styles.recordTitle}>Record {index + 1}</Text>
               <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>TNF:</Text>
                    <Text style={styles.dataValue}>{record.tnf}</Text>
               </View>
               <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>Type:</Text>
                    <Text style={styles.dataValue}>{record.type}</Text>
               </View>
               <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>ID:</Text>
                    <Text style={styles.dataValue}>{record.id}</Text>
               </View>
               <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>Payload:</Text>
                    <Text style={styles.dataValue}>{record.payload}</Text>
               </View>
               <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>Payload as Text:</Text>
                    <Text style={styles.dataValue}>{record.payloadAsText}</Text>
               </View>
          </View>
     );

     async function readNdef() {
          try {
               await NfcManager.requestTechnology(NfcTech.Ndef);
               const tag = await NfcManager.getTag();
               const parsedTag = parseTagData(tag);
               setTagData(parsedTag);
          } catch (ex) {
               console.warn('Oops!', ex);
               setTagData(null);
          } finally {
               NfcManager.cancelTechnologyRequest();
          }
     }

     return (
          <View style={globalStyles.container}>
               <TouchableOpacity style={globalStyles.button} onPress={readNdef}>
                    <Text style={globalStyles.buttonText}>Scan NFC Tag</Text>
               </TouchableOpacity>

               {tagData && (
                    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                         <DataSection title="Basic Information" data={tagData.basicInfo} />

                         <View style={styles.section}>
                              <Text style={styles.sectionTitle}>NDEF Message</Text>
                              {tagData.ndefMessage.length > 0 ? (
                                   tagData.ndefMessage.map((record, index) => (
                                        <NdefRecordView key={index} record={record} index={index} />
                                   ))
                              ) : (
                                   <Text style={styles.emptyMessage}>No NDEF messages found</Text>
                              )}
                         </View>

                         <DataSection
                              title="Additional Properties"
                              data={{
                                   canMakeReadOnly: tagData.canMakeReadOnly,
                                   isWriteable: tagData.isWriteable
                              }}
                         />
                    </ScrollView>
               )}
          </View>
     );
}

const styles = StyleSheet.create({
     scrollView: {
          flex: 1,
          width: '100%',
          marginTop: 20,
     },
     scrollContent: {
          padding: 16,
     },
     section: {
          backgroundColor: '#fff',
          borderRadius: 8,
          padding: 16,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
     },
     sectionTitle: {
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 12,
          color: '#2196F3',
     },
     dataRow: {
          flexDirection: 'row',
          marginBottom: 8,
          flexWrap: 'wrap',
     },
     dataLabel: {
          fontWeight: '600',
          width: 120,
          color: '#666',
     },
     dataValue: {
          flex: 1,
          color: '#333',
     },
     ndefRecord: {
          backgroundColor: '#f5f5f5',
          borderRadius: 4,
          padding: 12,
          marginTop: 8,
     },
     recordTitle: {
          fontSize: 16,
          fontWeight: '600',
          marginBottom: 8,
          color: '#2196F3',
     },
     emptyMessage: {
          fontStyle: 'italic',
          color: '#666',
          textAlign: 'center',
          paddingVertical: 12,
     },
});