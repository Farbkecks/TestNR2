import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Button, Image, TextInput } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  useCameraDevices,
  CameraRoll
} from 'react-native-vision-camera';

const API = 'https://api.bytescale.com/v2/accounts/kW15c2A/uploads/form_data'
const TOKEN = "Bearer public_kW15c2ABxFwnD3VMy73bF2tHqc49"

export default function App() {
  const camera = useRef(null);
  const [cameraPermission, setCameraPermission] = useState();
  const [photoPath, setPhotoPath] = useState();
  const [api, onChangeApi] = React.useState(API);
  const [token, onChangeToken] = React.useState(TOKEN);
  const devices = Camera.getAvailableCameraDevices()
  const cameraDevice = devices.find((d) => d.position === 'back')

  useEffect(() => {
    (async () => {
      const cameraPermissionStatus = await Camera.requestCameraPermission();
      setCameraPermission(cameraPermissionStatus);
    })();
  }, []);

  const handleTakePhoto = async () => {
    try {
      const photo = await camera.current.takePhoto({
        flash: 'off',
      });
      const uri = "file://" + photo.path
      const data = new FormData();
      // data.append("api", api)
      data.append('file', {
        uri: uri,
        type: "image/jpeg",
        name: "Test.jpg"
      });

      let res = await fetch(
        api,
        {
          method: 'POST',
          body: data,
          headers: {
            "Authorization": token,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      console.log(res)
      let responseJson = await res.json();
      if (responseJson.status == 1) {
        console.log("Upload fertig");
      }


    } catch (e) {
      console.error(e);
    }
  };

  const test = () => {
    console.log("Test")
  }
  const renderTakingPhoto = () => {
    if (cameraPermission !== 'granted') {
      return <Text>keine camera Rechte {cameraPermission}</Text>;
    }
    return (
      <View>
        <Camera
          ref={camera}
          style={[styles.camera, styles.photoAndVideoCamera]}
          device={cameraDevice}
          isActive
          photo
        />
        <TouchableOpacity style={styles.btn} onPress={handleTakePhoto}>
          <Text style={styles.btnText}>Take Photo</Text>
        </TouchableOpacity>
        {/* <Button
          title="Press me"
          onPress={handleTakePhoto}
        /> */}
        {/* {photoPath && (
          <Image style={styles.image} source={{ uri: photoPath }} />
        )} */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* <Text>{cameraPermission}</Text> */}
      {renderTakingPhoto()}
      <TextInput
        style={styles.input}
        onChangeText={onChangeApi}
        value={api}
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeToken}
        value={token}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EEF2E6',
  },
  saveArea: {
    backgroundColor: '#3D8361',
  },
  header: {
    height: 50,
    backgroundColor: '#3D8361',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: '#ffffff',
    fontSize: 20,
  },
  caption: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captionText: {
    color: '#100F0F',
    fontSize: 16,
    fontWeight: '600',
  },
  camera: {
    height: 460,
    width: '92%',
    alignSelf: 'center',
  },
  photoAndVideoCamera: {
    height: 360,
  },
  barcodeText: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    textAlign: 'center',
    color: '#100F0F',
    fontSize: 24,
  },
  pickerSelect: {
    paddingVertical: 12,
  },
  image: {
    marginHorizontal: 16,
    paddingTop: 8,
    width: 80,
    height: 80,
  },
  dropdownPickerWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    zIndex: 9,
  },
  btnGroup: {
    margin: 16,
    flexDirection: 'row',
  },
  btn: {
    backgroundColor: '#63995f',
    margin: 13,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 8,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 20,
    textAlign: 'center',
  },
  video: {
    marginHorizontal: 16,
    height: 100,
    width: 80,
    position: 'absolute',
    right: 0,
    bottom: -80,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});