import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
  Linking,
} from 'react-native';
import MapView, { Marker, Circle, Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { getDistance } from 'geolib';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../../component/customButton/CustomButton';
import { color } from '../../../styles/styles';
import navigationService from '../../../routes/navigationService';
import { routes } from '../../../routes/stacks';

const OFFICE_LOCATION = {
  latitude: 26.874,
  longitude: 75.80971,
};

const API_KEY = 'ADD_YOUR_GOOGLE_MAPS_API_KEY_HERE';

type LatLng = {
  latitude: number;
  longitude: number;
};

const Tracking = () => {
  const [location, setLocation] = useState<LatLng | null>(null);
  const [startLocation, setStartLocation] = useState<LatLng | null>(null);
  const [inside, setInside] = useState(false);
  const [distance, setDistance] = useState(0);
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const [trackingPath, setTrackingPath] = useState<LatLng[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
const [totalDistance, setTotalDistance] = useState(0);
  // 🔐 Permission
  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'GeoAttendance needs location access to check-in and track movement',
          buttonPositive: 'Allow',
          buttonNegative: 'Deny',
        },
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        setError('Location permission denied. Go to settings to enable it.');
        return false;
      }
      return true;
    }
    return true;
  };

  useEffect(() => {
    let watchId: number | null = null;

    const init = async () => {
      const ok = await requestPermission();
      if (!ok) {
        setLoading(false);
        return;
      }

      watchId = Geolocation.watchPosition(
        pos => {
          const userLoc = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };

          setLocation(userLoc);
          setStartLocation(prev => prev ?? userLoc);
          setLoading(false);

          // 🔥 TRACKING PATH ADD
          // setTrackingPath(prev => [...prev, userLoc]);
          setTrackingPath(prev => {
  if (prev.length > 0) {
    const last = prev[prev.length - 1];
    const d = getDistance(last, userLoc);

    if (d > 3) { // ignore small movement
      setTotalDistance(prevDist => prevDist + d);
      return [...prev, userLoc];
    }

    return prev;
  }

  return [userLoc];
});

          const dist = getDistance(userLoc, OFFICE_LOCATION);
          setDistance(dist);
          setInside(dist <= 100);

          // Load route once
          if (routeCoords.length === 0) {
            getRoute(userLoc, OFFICE_LOCATION);
          }
        },
        err => {
          console.log(err);
          if (err.code === 1) {
            setError('Location permission denied.');
          } else if (err.code === 2) {
            setError(
              'Location provider disabled (GPS off). Please enable GPS.',
            );
          } else {
            setError(err.message || 'Unknown location error');
          }
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 5,
          interval: 5000,
          fastestInterval: 2000,
        },
      );
    };

    init();

    return () => {
      if (watchId) Geolocation.clearWatch(watchId);
    };
  }, []);

  // 🧠 Directions API
  const getRoute = async (origin: LatLng, destination: LatLng) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${API_KEY}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.routes.length) {
        const points = decodePolyline(data.routes[0].overview_polyline.points);
        setRouteCoords(points);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // 🔓 Decode polyline
  const decodePolyline = (t: string): LatLng[] => {
    let points: LatLng[] = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < t.length) {
      let b,
        shift = 0,
        result = 0;

      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      let dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;

      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      let dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }

    return points;
  };

  // 📍 Open Google Maps
  const openGoogleMaps = () => {
    if (!location) {
      Alert.alert(
        'Waiting for location',
        'Please wait while GPS fixes your position.',
      );
      return;
    }

    const url = `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.latitude},${currentLocation.longitude}&destination=${OFFICE_LOCATION.latitude},${OFFICE_LOCATION.longitude}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open Google Maps.');
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Fetching location...</Text>
      </View>
    );
  }

  if (error && !location) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <CustomButton
          text="Open Settings"
          onPress={() => Linking.openSettings()}
          height={45}
          width={'80%'}
          borderRadius={10}
        />
      </View>
    );
  }

  const currentLocation = location as LatLng;

  const handleStart = async () => {
    if (!currentLocation) {
      Alert.alert(
        'Location not ready',
        'Please wait for GPS fix before starting.',
      );
      return;
    }

    setStartLocation(currentLocation);
    Alert.alert(
      'Start saved',
      'Your start location is saved. Now move and Check In!',
    );
  };

  const handleCheckIn = async () => {
    if (!location) {
      Alert.alert(
        'Location not ready',
        'Please wait for the GPS to get a fix.',
      );
      return;
    }

    if (!startLocation) {
      Alert.alert(
        'Start missing',
        'Please tap Start first so history can calculate start->checkin distance.',
      );
      return;
    }

    if (!inside) {
      Alert.alert('Outside office');
      return;
    }

    const startToCheckInDistance = getDistance(startLocation, currentLocation);

    const record = {
      id: `${Date.now()}`,
      time: new Date().toISOString(),
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      distanceMeters: distance,
      startLatitude: startLocation.latitude,
      startLongitude: startLocation.longitude,
      startToCheckInMeters: startToCheckInDistance,
      totalTravelDistance: totalDistance,
      startToCheckInKm: (startToCheckInDistance / 1000).toFixed(2),
    };

    const prev = await AsyncStorage.getItem('attendance');
    const data = prev ? JSON.parse(prev) : [];

    data.push(record);
    await AsyncStorage.setItem('attendance', JSON.stringify(data));

    Alert.alert(
  'Checked in!',
  'Attendance saved successfully',
  [
    {
      text: 'OK',
      onPress: () => {
        navigationService.navigate(routes.TAB_STACK, {
          screen: routes.History,
        });
      },
    },
  ]
);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.white }}>
      <MapView
        style={{ flex: 1 }}
        showsUserLocation={true}
        region={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* User */}
        <Marker coordinate={currentLocation} pinColor="green" />

        {/* Office */}
        <Marker coordinate={OFFICE_LOCATION} pinColor="red" />

        {/* {startLocation && (
          <>
            <Polyline
              coordinates={[startLocation, OFFICE_LOCATION]}
              strokeColor="orange"
              strokeWidth={2}
              lineDashPattern={[5, 5]}
            />
          </>
        )} */}

        {/* Geofence */}
        <Circle
          center={OFFICE_LOCATION}
          radius={100}
          strokeColor="blue"
          fillColor="rgba(0,0,255,0.2)"
        />

        {/* 🔥 ROAD ROUTE */}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={4}
            strokeColor="green"
          />
        )}

        {/* 🔥 LIVE TRACKING PATH */}
        {/* {trackingPath.length > 0 && (
          <Polyline
            coordinates={trackingPath}
            strokeWidth={4}
            strokeColor="red"
          />
        )} */}
      </MapView>

      <View style={styles.bottom}>
        <Text style={styles.text}>
          Distance: {Math.round(distance)} m ({(distance / 1000).toFixed(2)} km)
        </Text>
        {!startLocation ? (
          <CustomButton
            text="Start"
            onPress={handleStart}
            height={45}
            width={'100%'}
            marginVertical={10}
            borderRadius={10}
          />
        ) : null

        // <Text style={styles.text}>Start set: {startLocation.latitude.toFixed(4)}, {startLocation.longitude.toFixed(4)}</Text>
        }

        {inside && startLocation && (
          <CustomButton
            text="Check In"
            onPress={handleCheckIn}
            height={45}
            width={'100%'}
            marginVertical={10}
            borderRadius={10}
          />
        )}
        <CustomButton
          text="Open in Google Maps"
          onPress={openGoogleMaps}
          height={45}
          width={'100%'}
          marginVertical={10}
          borderRadius={10}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bottom: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    backgroundColor: 'white',
    padding: 15,
  },
  text: {
    textAlign: 'center',
    marginBottom: 5,
  },
  errorText: {
    color: '#B00020',
    marginBottom: 10,
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Tracking;
