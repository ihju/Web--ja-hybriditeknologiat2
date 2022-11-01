import { useEffect, useState } from 'react';
import { StyleSheet, Text, View,Dimensions } from 'react-native';
import * as Location from 'expo-location'
import MapView,{ Callout, Marker } from 'react-native-maps'
import Constants from 'expo-constants';
import Modify from './Modify';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@markers_Key'

export default function App() {
  const [lat, setLat] = useState(0)
  const [lng, setLng] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [desc, setDesc] = useState('ripuli')
  const [currentDate, setCurrentDate] = useState('');
  const [time, setTime] = useState('')

  const [markers,setMarkers] = useState([
  ])

  useEffect(() => {
   (async() => {
    let { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      console.log('Location failed')
      return
    }
    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Lowest })
    console.log(location.coords)
    setLat(location.coords.latitude)
    setLng(location.coords.longitude)
    setIsLoading(false)
    getData()

    const date = new Date().getDate(); //Current Date
    const month = new Date().getMonth() + 1; //Current Month
    const year = new Date().getFullYear(); //Current Year
    const hours = new Date().getHours(); //Current Hours
    const min = new Date().getMinutes(); //Current Minutes
    const sec = new Date().getSeconds(); //Current Seconds
    const dateTime = (date + '/' + month + '/' + year 
    + ' ' + hours + ':' + min + ':' + sec)
    setCurrentDate(
      dateTime.toString()
    );
   })()
  }, [])
  
  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(STORAGE_KEY,jsonValue)
    } catch (error) {
      console.log(error)
    }
  }

  const getData = async() => {
    try {
      return AsyncStorage.getItem(STORAGE_KEY)
      .then(response=> JSON.parse(response))
      .then(data => {
        if (data === null) {
          data=[]
        }
        setMarkers(data)
      }).catch (e => {
        console.log(e)
      })
    } catch (error) {
      console.log(error)
    }
  }
  
  const addDesc = ((index) => { 
    console.log(currentDate)
    console.log("tyhjääää")
    console.log("tyhjääää")
    console.log("tyhjääää")
    console.log(markers)
    console.log(markers[index].date)
  })



  if (isLoading) {
    return  <View style={styles.container}><Text>Loading map....</Text></View>
  } else {
  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map} 
        showsUserLocation={true}
        followsUserLocation={true}
        mapType='standard'
        initialRegion={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
        onLongPress={(e) => {
          const newMarker = {"lat" : e.nativeEvent.coordinate.latitude,"lng":e.nativeEvent.coordinate.longitude, "date": currentDate}
          const updatedMarkers = [...markers,newMarker]
          setMarkers(updatedMarkers)
          storeData(updatedMarkers)
        }}
      >
       {markers.map((marker,index)=> (
          <Marker 
            key={index}
            coordinate={{latitude: marker.lat,longitude: marker.lng}}
            title="Mustikoita"
            description= "Paljon"
            draggable
            onPress={() => {setTime(markers[index].date)}}
          >
           <Callout tooltip = {false}>
              <View >
                <Text> Täälä olin mustikassa ajanhetkellä</Text>
                <Text > {time}</Text>
              </View>
              </Callout>
          </Marker>
        ))}
       
      </MapView>
    </View>
  );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - Constants.statusBarHeight,
  },
});


/* Tässä sovelluksessa saa litättyä käytyjä marjapaikkoa. 
Marjapaikan tietoihin tallentuu koordinaatit sekä aika, milloin piste on tehty
Tätä piti vielä muuttaa niin, että pistettä saisi siirrettyä ja se jäisi siirrettyyin paikkaa,
pisteen ponnahdusikkunassa näkyisin aika, jolloin piste on lisätty.
Perimmäinen tavoite oli saada muokattua pisteen ponnahdusikkunan tekstejä. *//*
onPress={() => {addDesc(index), setTime(markers[index].date)}}
*/

{/*  <Marker 
          key={1}
          title="Mustikoita"
          description="Testing"
          coordinate={{latitude: lat,longitude: lng}}
          onPress= {addDesc()}
      /> */}