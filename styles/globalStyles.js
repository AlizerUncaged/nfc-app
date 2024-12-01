// styles/globalStyles.js
import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
     container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
     },
     button: {
          backgroundColor: '#2196F3',
          padding: 15,
          borderRadius: 8,
          marginVertical: 10,
     },
     buttonText: {
          color: 'white',
          fontSize: 16,
          fontWeight: 'bold',
     },
     input: {
          width: '100%',
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 15,
          marginBottom: 20,
          fontSize: 16,
     },
     tagDataContainer: {
          marginTop: 20,
          padding: 15,
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          width: '100%',
     },
     tagDataText: {
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 10,
     },
     tagDataContent: {
          fontSize: 14,
     },
     status: {
          marginTop: 20,
          fontSize: 16,
          color: '#666',
     }
});