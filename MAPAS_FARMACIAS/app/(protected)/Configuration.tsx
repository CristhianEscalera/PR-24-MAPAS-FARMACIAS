// screens/Configuration.js
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Configuration = () => {

    const router = useRouter();
    
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración</Text>

      <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/Users/EditCredentials') }>
        <View style={styles.menuContent}>
          <FontAwesome5 name="user-edit" size={20} color="#333" />
          <Text style={styles.menuText}>Actualizar Credenciales</Text>
        </View>
        <FontAwesome5 name="chevron-right" size={16} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuContent}>
          <FontAwesome5 name="lock" size={20} color="#333" />
          <Text style={styles.menuText}>Privacidad</Text>
        </View>
        <FontAwesome5 name="chevron-right" size={16} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuContent}>
          <FontAwesome5 name="question-circle" size={20} color="#333" />
          <Text style={styles.menuText}>Ayuda</Text>
        </View>
        <FontAwesome5 name="chevron-right" size={16} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

export default Configuration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    alignSelf: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
});
