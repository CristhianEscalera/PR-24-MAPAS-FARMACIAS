import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { apiFetch } from '../(ApiRes)/apiConfig';
import { MaterialIcons } from '@expo/vector-icons';
import PharmacyCar from '../components/PharmacyCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type Pharmacy = {
  id: number;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  phone: string;
  codeZona: string;
  status: number;
  sectorName: string;
  typePharmacy: string;
  zonaName: string;
  healthNetwork: string;
  townName: string;
  userName: string;
  personName: string;
  personLastName: string;
  profilePicture?: string;
};

const Branches: React.FC = () => {
  const [dataPharmacy, setDataPharmacy] = useState<Pharmacy[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  // Obtener las farmacias asociadas al usuario
  const fetchPharmacies = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const userData = JSON.parse(storedUser); // Asegúrate de parsear el objeto almacenado
      console.info(userData)
      const bodyData = {
        id: userData.id,
        role: userData.role,
      };

      const data = await apiFetch('/getFarmacyByUser', {
        method: 'POST',
        body: JSON.stringify(bodyData),
      });

      if (data) {
        setDataPharmacy(data); // Guardar las farmacias en el estado
      } else {
        console.log('No se encontraron farmacias.');
      }
    } catch (error) {
      console.error('Error al recuperar las farmacias:', error);
    }
  };

  // Abrir el BottomSheet y seleccionar la farmacia
  const openBottomSheet = (pharmacy: Pharmacy) => {
    setSelectedPharmacy(pharmacy);
    bottomSheetRef.current?.expand();
  };

  // Cerrar el BottomSheet
  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  useEffect(() => {
    fetchPharmacies()
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Mis Farmacias</Text>

        <ScrollView>
          {dataPharmacy.map((pharmacy) => (
            <PharmacyCar key={pharmacy.id} pharmacy={pharmacy} onPress={() => openBottomSheet(pharmacy)} />
          ))}
        </ScrollView>

        {/* Bottom Sheet */}
        <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={['1%', '50%']} onClose={closeBottomSheet}>
          <BottomSheetView style={styles.sheetContent}>
            {selectedPharmacy && (
              <>
                <Text style={styles.pharmacyName}>{selectedPharmacy.name}</Text>
                <Text style={styles.pharmacyAddress}>{selectedPharmacy.address}</Text>
                <Text style={styles.pharmacyPhone}>
                  <MaterialIcons name="phone" size={16} color="#4A90E2" />
                  {selectedPharmacy.phone}
                </Text>

                <View style={styles.infoContainer}>
                  <MaterialIcons name="location-city" size={16} color="#4A90E2" />
                  <Text style={styles.additionalInfo}>{selectedPharmacy.townName}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <MaterialIcons name="business" size={16} color="#4A90E2" />
                  <Text style={styles.additionalInfo}>Sector: {selectedPharmacy.sectorName}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <MaterialIcons name="local-pharmacy" size={16} color="#4A90E2" />
                  <Text style={styles.additionalInfo}>Tipo: {selectedPharmacy.typePharmacy}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <MaterialIcons name="place" size={16} color="#4A90E2" />
                  <Text style={styles.additionalInfo}>Zona: {selectedPharmacy.zonaName}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <MaterialIcons name="health-and-safety" size={16} color="#4A90E2" />
                  <Text style={styles.additionalInfo}>Red de Salud: {selectedPharmacy.healthNetwork}</Text>
                </View>
                <Text style={styles.additionalInfo}>
                  Persona Responsable: {selectedPharmacy.personName} {selectedPharmacy.personLastName}
                </Text>

              </>
            )}
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sheetContent: {
    padding: 16,
    backgroundColor: '#F9F9F9',
  },
  pharmacyName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  pharmacyAddress: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  pharmacyPhone: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  additionalInfo: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  buttonGroup: {
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
});

export default Branches;
