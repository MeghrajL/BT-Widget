import React, { useEffect, useState } from 'react';

import SharedGroupPreferences from 'react-native-shared-group-preferences';

const group = 'group.asap';

const SharedStorage = NativeModules.SharedStorage;
import BleManager from 'react-native-ble-manager';

import {
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  TextInput,
  StyleSheet,
  Platform,
  NativeModules,
  useColorScheme,
  NativeEventEmitter,
  PermissionsAndroid,
  SafeAreaView,
  Dimensions,
  FlatList,
} from 'react-native';

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const Example = () => {
  const [isScanning, setIsScanning] = useState(false);

  const [text, setText] = useState('Hello');
  const widgetData = {
    text,
  };

  const handleSubmit = async () => {
    try {
      // iOS
      await SharedGroupPreferences.setItem('widgetKey', widgetData, group);
    } catch (error) {
      console.log({ error });
    }
    // Android
    SharedStorage.set(JSON.stringify({ text }));
  };

  useEffect(() => {
    // turn on bluetooth if it is not on
    BleManager.enableBluetooth().then(() => {
      console.log('Bluetooth is turned on!');
    });

    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(result => {
        if (result) {
          console.log('Permission is OK');
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(result => {
            if (result) {
              console.log('User accept');
            } else {
              console.log('User refuse');
            }
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    // start bluetooth manager
    BleManager.start({ showAlert: false }).then(() => {
      console.log('BleManager initialized');
    });
  }, []);

  useEffect(() => {
    let stopListener = BleManagerEmitter.addListener(
      'BleManagerStopScan',
      () => {
        setIsScanning(false);
        console.log('Scan is stopped');
      },
    );
  }, []);

  const startScan = () => {
    if (!isScanning) {
      BleManager.scan([], 5, true)
        .then(() => {
          console.log('Scanning...');
          setIsScanning(true);
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  const peripherals = new Map();
  const [connectedDevices, setConnectedDevices] = useState([]);

  const handleGetConnectedDevices = () => {
    BleManager.getConnectedPeripherals([]).then(results => {
      if (results.length === 0) {
        console.log('No connected bluetooth devices');
      } else {
        for (let i = 0; i < results.length; i++) {
          let peripheral = results[i];
          // peripheral.connected = true;
          // peripherals.set(peripheral.id, peripheral);
          // setConnectedDevices(Array.from(peripherals.values()));
        }
      }
    });
  };

  useEffect(() => {
    BleManager.start({ showAlert: false }).then(() => {
      console.log('BleManager initialized');
      handleGetConnectedDevices();
    });
  }, []);

  // const RenderItem = ({ peripheral }) => {
  //   const { name, rssi, connected } = peripheral;
  //   return (
  //     <>
  //       {name && (
  //         <View
  //           style={{
  //             flexDirection: 'row',
  //             justifyContent: 'space-between',
  //             marginBottom: 10,
  //           }}
  //         >
  //           <View style={styles.deviceItem}>
  //             <Text style={styles.deviceName}>{name}</Text>
  //             <Text style={styles.deviceInfo}>RSSI: {rssi}</Text>
  //           </View>
  //           <TouchableOpacity
  //             // onPress={}
  //             style={styles.deviceButton}
  //           >
  //             <Text
  //               style={[
  //                 styles.scanButtonText,
  //                 { fontWeight: 'bold', fontSize: 16 },
  //               ]}
  //             >
  //               {connected ? 'Disconnect' : 'Connect'}
  //             </Text>
  //           </TouchableOpacity>
  //         </View>
  //       )}
  //     </>
  //   );
  // };

  return (
    // <ScrollView
    //   style={Layout.fill}
    //   contentContainerStyle={[
    //     Layout.fullSize,
    //     Layout.fill,
    //     Layout.colCenter,
    //     Layout.scrollSpaceBetween,
    //   ]}
    // >
    //   <View
    //     style={[
    //       Layout.fill,
    //       Layout.relative,
    //       Layout.fullWidth,
    //       Layout.justifyContentCenter,
    //       Layout.alignItemsCenter,
    //     ]}
    //   >
    //     <View
    //       style={[
    //         Layout.absolute,
    //         {
    //           height: 250,
    //           width: 250,
    //           backgroundColor: isDark ? '#000000' : '#DFDFDF',
    //           borderRadius: 140,
    //         },
    //       ]}
    //     />
    //     <Image
    //       style={[
    //         Layout.absolute,
    //         {
    //           bottom: '-30%',
    //           left: 0,
    //         },
    //       ]}
    //       source={Images.sparkles.bottomLeft}
    //       resizeMode={'contain'}
    //     />
    //     <View
    //       style={[
    //         Layout.absolute,
    //         {
    //           height: 300,
    //           width: 300,
    //           transform: [{ translateY: 40 }],
    //         },
    //       ]}
    //     >
    //       <Brand height={300} width={300} />
    //     </View>
    //     <Image
    //       style={[
    //         Layout.absolute,
    //         Layout.fill,
    //         {
    //           top: 0,
    //           left: 0,
    //         },
    //       ]}
    //       source={Images.sparkles.topLeft}
    //       resizeMode={'contain'}
    //     />
    //     <Image
    //       style={[
    //         Layout.absolute,
    //         {
    //           top: '-5%',
    //           right: 0,
    //         },
    //       ]}
    //       source={Images.sparkles.top}
    //       resizeMode={'contain'}
    //     />
    //     <Image
    //       style={[
    //         Layout.absolute,
    //         {
    //           top: '15%',
    //           right: 20,
    //         },
    //       ]}
    //       source={Images.sparkles.topRight}
    //       resizeMode={'contain'}
    //     />
    //     <Image
    //       style={[
    //         Layout.absolute,
    //         {
    //           bottom: '-10%',
    //           right: 0,
    //         },
    //       ]}
    //       source={Images.sparkles.right}
    //       resizeMode={'contain'}
    //     />

    //     <Image
    //       style={[
    //         Layout.absolute,
    //         {
    //           top: '75%',
    //           right: 0,
    //         },
    //       ]}
    //       source={Images.sparkles.bottom}
    //       resizeMode={'contain'}
    //     />
    //     <Image
    //       style={[
    //         Layout.absolute,
    //         {
    //           top: '60%',
    //           right: 0,
    //         },
    //       ]}
    //       source={Images.sparkles.bottomRight}
    //       resizeMode={'contain'}
    //     />
    //   </View>
    //   <View
    //     style={[
    //       Layout.fill,
    //       Layout.justifyContentBetween,
    //       Layout.alignItemsStart,
    //       Layout.fullWidth,
    //       Gutters.regularHPadding,
    //     ]}
    //   >
    //     <View>
    //       <Text style={[Fonts.titleRegular]}>{t('welcome:title')}</Text>
    //       <Text
    //         style={[Fonts.textBold, Fonts.textRegular, Gutters.regularBMargin]}
    //       >
    //         {t('welcome:subtitle')}
    //       </Text>
    //       <Text style={[Fonts.textSmall, Fonts.textLight]}>
    //         {t('welcome:description')}
    //       </Text>
    //       {data && <Text>{data.title}</Text>}
    //     </View>

    //     <View
    //       style={[
    //         Layout.row,
    //         Layout.justifyContentBetween,
    //         Layout.fullWidth,
    //         Gutters.smallTMargin,
    //       ]}
    //     >
    //       <TouchableOpacity
    //         style={[Common.button.circle, Gutters.regularBMargin]}
    //         onPress={() => {
    //           // fetchOne(`${Math.ceil(Math.random() * 10 + 1)}`);
    //           fetchComments(7);
    //         }}
    //       >
    //         {isFetching || isLoading ? (
    //           <ActivityIndicator />
    //         ) : (
    //           <Image
    //             source={Images.icons.send}
    //             style={{ tintColor: isDark ? '#A6A4F0' : '#44427D' }}
    //           />
    //         )}
    //       </TouchableOpacity>

    //       <TouchableOpacity
    //         style={[Common.button.circle, Gutters.regularBMargin]}
    //         onPress={() => onChangeTheme({ darkMode: !isDark })}
    //       >
    //         <Image
    //           source={Images.icons.colors}
    //           style={{ tintColor: isDark ? '#A6A4F0' : '#44427D' }}
    //         />
    //       </TouchableOpacity>

    //       <TouchableOpacity
    //         style={[Common.button.circle, Gutters.regularBMargin]}
    //         onPress={() =>
    //           onChangeLanguage(i18next.language === 'fr' ? 'en' : 'fr')
    //         }
    //       >
    //         <Image
    //           source={Images.icons.translate}
    //           style={{ tintColor: isDark ? '#A6A4F0' : '#44427D' }}
    //         />
    //       </TouchableOpacity>
    //     </View>
    //   </View>
    // </ScrollView>
    <SafeAreaView>
      <TouchableOpacity activeOpacity={0.5} style={styles.buttonStyle}>
        <Text style={styles.buttonTextStyle}>Scan Bluetooth Devices </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.buttonStyle}
        onPress={startScan}
      >
        <Text style={styles.buttonTextStyle}>
          {isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'}
        </Text>
      </TouchableOpacity>

      {/* {connectedDevices.length > 0 ? (
        <FlatList
          data={connectedDevices}
          renderItem={({ item }) => <RenderItem peripheral={item} />}
          keyExtractor={item => item.id}
        />
      ) : (
        <Text style={styles.noDevicesText}>No connected devices</Text>
      )} */}
    </SafeAreaView>
  );
};

export default Example;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    marginTop: '50%',
    paddingHorizontal: 24,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    fontSize: 20,
    minHeight: 40,
  },

  mainBody: {
    flex: 1,
    justifyContent: 'center',
    height: windowHeight,
  },
  buttonStyle: {
    backgroundColor: '#307ecc',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#307ecc',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 15,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },

  scrollContainer: {
    padding: 16,
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 24,
    marginBottom: 10,
    marginTop: 20,
  },
  scanButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  scanButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  noDevicesText: {
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  deviceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  deviceItem: {
    marginBottom: 10,
  },
  deviceName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  deviceInfo: {
    fontSize: 14,
  },
  deviceButton: {
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
});
