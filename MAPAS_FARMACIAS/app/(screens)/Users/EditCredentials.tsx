// screens/EditCredentials.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { apiFetch } from '../../(ApiRes)/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';




interface FormData {
  userName: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const EditCredentials: React.FC = () => {
  const router = useRouter();
  const { control, handleSubmit, watch, formState: { errors }, setError } = useForm<FormData>();
  const [backendMessage, setBackendMessage] = useState<string | null>(null);
  const newPassword = watch('newPassword');

  const onSubmit = async (data: FormData) => {
    try {
      const storedUserString = await AsyncStorage.getItem('user');
      const storedUser = storedUserString ? JSON.parse(storedUserString) : null;

     


      if (!storedUser || !storedUser.id) {
        console.error("No se encontró el usuario almacenado o el ID es inválido");
        return null;
      }

      console.log("Datos del Usuario:", storedUser)
      const id = storedUser.id;
      
       const response = await apiFetch("/CredentialsChang", {
         method: "POST",
         body: JSON.stringify({
           id: id,
           userName: data.userName,
           currentPassword: data.currentPassword,
           newPassword: data.newPassword,
           confirmPassword: data.confirmPassword,
           passwordActual: storedUser.password
         }),
       });

       if (response) {
         console.info("Credenciales actualizadas correctamente");
         router.replace('/login');
         alert("Credenciales actualizadas correctamente, por favor inicie sesión nuevamente.");
         return data;
       } else {
         setBackendMessage(response?.error || "Hubo un error al actualizar las credenciales");
         console.error("Error en la actualización:", response.statusText);
         return null;
       }


    } catch (error) {
      setBackendMessage(""+error);
      //console.error("Error en la solicitud:", error);
      return null;
    }
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Actualizar Usuario y Contraseña</Text>

      <Controller
        control={control}
        name="userName"
        rules={{
          required: 'El nombre de usuario es requerido',
          minLength: { value: 3, message: 'Debe tener al menos 3 caracteres' },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.userName && styles.inputError]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Nombre de usuario"
          />
        )}
      />
      {errors.userName && <Text style={styles.errorText}>{errors.userName.message}</Text>}

      <Controller
        control={control}
        name="currentPassword"
        rules={{ required: 'La contraseña actual es requerida' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.currentPassword && styles.inputError]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Contraseña actual"
            secureTextEntry
          />
        )}
      />
      {errors.currentPassword && <Text style={styles.errorText}>{errors.currentPassword.message}</Text>}





      <Controller
        control={control}
        name="newPassword"
        rules={{
          required: 'La nueva contraseña es requerida',
          minLength: { value: 6, message: 'Debe tener al menos 6 caracteres' },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.newPassword && styles.inputError]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Nueva contraseña"
            secureTextEntry
          />
        )}
      />
      {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword.message}</Text>}

      <Controller
        control={control}
        name="confirmPassword"
        rules={{
          required: 'La confirmación es requerida',
          validate: (value) =>
            value === newPassword || 'Las contraseñas no coinciden',
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.confirmPassword && styles.inputError]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Confirmar contraseña"
            secureTextEntry
          />
        )}
      />
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}


       {/* Mostrar el mensaje del backend debajo del formulario */}
       {backendMessage && <Text style={styles.backendMessage}>{backendMessage}</Text>}



      <Button title="Actualizar Credenciales" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 12,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  backendMessage: {
    color: 'green',
    marginTop: 20,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default EditCredentials;
