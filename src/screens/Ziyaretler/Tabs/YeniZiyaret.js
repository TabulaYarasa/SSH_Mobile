

import React, { useState } from 'react';
import {
 View,
 TextInput,
 TouchableOpacity,
 Text,
 StyleSheet,
} from 'react-native';

const YeniZiyaret = () => {
 const [shortDesc, setShortDesc] = useState('');
 const [longDesc, setLongDesc] = useState('');

 const handleSubmit = () => {
   // Form gönderme işlemleri burada
   console.log('Kısa Açıklama:', shortDesc);
   console.log('Uzun Açıklama:', longDesc);
 };

 return (
  //  <View style={styles.container}>
  //    <TextInput
  //      style={styles.input}
  //      placeholder="Kısa Açıklama"
  //      value={shortDesc}
  //      onChangeText={setShortDesc}
  //    />

  //    <TextInput
  //      style={[styles.input, styles.textArea]}
  //      placeholder="Uzun Açıklama"
  //      value={longDesc}
  //      onChangeText={setLongDesc}
  //      multiline={true}
  //      numberOfLines={28}
  //    />

  //    <TouchableOpacity 
  //      style={styles.button}
  //      onPress={handleSubmit}
  //    >
  //      <Text style={styles.buttonText}>Gönder</Text>
  //    </TouchableOpacity>
  //  </View>
    <View style={styles.container}>
    

    <TouchableOpacity 
      style={styles.button}
      onPress={handleSubmit}
    >
      <Text style={styles.buttonText}>Gönder</Text>
    </TouchableOpacity>
  </View>
 );
};

const styles = StyleSheet.create({
 container: {
   padding: 20,
 },
 input: {
   borderWidth: 1,
   borderColor: '#ddd',
   borderRadius: 8,
   padding: 12,
   marginBottom: 16,
   backgroundColor: 'white',
 },
 textArea: {
   minHeight: 100,
   textAlignVertical: 'top',
 },
 button: {
   backgroundColor: '#007AFF',
   padding: 15,
   borderRadius: 8,
   alignItems: 'center',
 },
 buttonText: {
   color: 'white',
   fontSize: 16,
   fontWeight: '600',
 },
});

export default YeniZiyaret;