import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
  Linking,
} from 'react-native';
import MapView, {
  Marker,
  Circle,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
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

const API_KEY = 'AIzaSyDk7HXk170Nm7NhhS2F8rbirdowYBQT5Vk';
const MAP_REGION_DELTA = {
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};
const ROUTE_REFRESH_DISTANCE_METERS = 20;

type LatLng = {
  latitude: number;
  longitude: number;
};

type RouteData = {
  coordinates: LatLng[];
  distanceMeters: number;
};

/* eslint-disable no-bitwise */
const decodePolyline = (t: string): LatLng[] => {
  let points: LatLng[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < t.length) {
    let b;
    let shift = 0;
    let result = 0;

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
/* eslint-enable no-bitwise */

const fetchRoute = async (
  origin: LatLng,
  destination: LatLng,
): Promise<RouteData> => {
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=driving&alternatives=false&units=metric&departure_time=now&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.routes?.length) {
    return {
      coordinates: [],
      distanceMeters: 0,
    };
  }

  const route = data.routes[0];
  const distanceMeters =
    route.legs?.reduce(
      (total: number, leg: { distance?: { value?: number } }) =>
        total + (leg.distance?.value ?? 0),
      0,
    ) ?? 0;

  return {
    coordinates: decodePolyline(route.overview_polyline.points),
    distanceMeters,
  };
};

const Tracking = () => {
  const mapRef = useRef<MapView | null>(null);
  const routeFetchInFlightRef = useRef(false);
  const lastRouteOriginRef = useRef<LatLng | null>(null);
  const [location, setLocation] = useState<LatLng | null>(null);
  const [startLocation, setStartLocation] = useState<LatLng | null>(null);
  const [inside, setInside] = useState(false);
  const [distance, setDistance] = useState(0);
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const [, setTrackingPath] = useState<LatLng[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalDistance, setTotalDistance] = useState(0);
  const [mapReady, setMapReady] = useState(false);
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

          const officeDistance = getDistance(userLoc, OFFICE_LOCATION);
          setInside(officeDistance <= 100);

          if (!lastRouteOriginRef.current) {
            setDistance(officeDistance);
          }

          const shouldRefreshRoute =
            !lastRouteOriginRef.current ||
            getDistance(lastRouteOriginRef.current, userLoc) >=
              ROUTE_REFRESH_DISTANCE_METERS;

          if (shouldRefreshRoute && !routeFetchInFlightRef.current) {
            routeFetchInFlightRef.current = true;
            fetchRoute(userLoc, OFFICE_LOCATION)
              .then(route => {
                if (route.coordinates.length > 0) {
                  setRouteCoords(route.coordinates);
                }

                if (route.distanceMeters > 0) {
                  setDistance(route.distanceMeters);
                  lastRouteOriginRef.current = userLoc;
                } else {
                  setDistance(officeDistance);
                }
              })
              .catch(e => {
                console.log(e);
              })
              .finally(() => {
                routeFetchInFlightRef.current = false;
              });
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

  useEffect(() => {
    if (!location || !mapReady || !mapRef.current) {
      return;
    }

    mapRef.current.animateToRegion(
      {
        ...location,
        ...MAP_REGION_DELTA,
      },
      500,
    );
  }, [location, mapReady]);

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
  const mapRegion = {
    ...currentLocation,
    ...MAP_REGION_DELTA,
  };

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
    <SafeAreaView style={styles.safeArea}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        googleRenderer={Platform.OS === 'android' ? 'LEGACY' : undefined}
        mapType="standard"
        userInterfaceStyle="light"
        loadingEnabled={true}
        showsUserLocation={true}
        showsMyLocationButton={true}
        initialRegion={mapRegion}
        onMapReady={() => setMapReady(true)}
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
          Route Distance: {Math.round(distance)} m ({(distance / 1000).toFixed(2)} km)
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
  safeArea: {
    flex: 1,
    backgroundColor: color.white,
  },
  map: {
    flex: 1,
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
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
