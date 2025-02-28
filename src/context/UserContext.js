import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

import {MAP_API_KEY} from '@env';
export const UserContext = createContext();
console.log(MAP_API_KEY);
export default function UserProvider({children}) {
  const [theme, setTheme] = useState('#000000');
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);
  const [logged, setLogged] = useState(true);
  const [name, setName] = useState('Maxsuel Gomes');
  const [email, setEmail] = useState('maxgps@hotmail.com');
  const [phone, setPhone] = useState('81982276506');
  const [birth, setBirth] = useState('17/04/2001');
  const [password, setPassword] = useState('12345678');
  const [cards, setCards] = useState();
  //const [isFirstTimeHome, setFirstTimeHome] = useState(false)
  useEffect(() => {
    getTheme();
    //login()
  }, []);
  async function login() {
    await AsyncStorage.getItem('user_info')
      .then((r) => {
        const res = JSON.parse(r);
        setName(res.name);
        setEmail(res.name);
        setPhone(res.phone);
        setBirth(res.birth);
        setLogged(true);
      })
      .catch((e) => {
        console.log(e.message);
        setLogged(false);
      });
  }
  async function setUser(user) {
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
    setBirth(user.birth);
  }
  async function getTheme() {
    const themeAsync = await AsyncStorage.getItem('theme');
    setTheme(themeAsync);
  }

  async function getNearRestaurants(setFirstTimeHome, latitude, longitude) {
    // var latitude = -8.0306
    // var longitude = -34.9160
    console.log('latitude: ' + latitude);
    console.log('longitude: ' + longitude);
    const restaurants = [];

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=2000&type=restaurant&key=${MAP_API_KEY}`;
    const photoUrl =
      'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400';
    return await axios
      .get(url)
      .then((resp) => {
        setLoadingRestaurants(true);
        resp.data.results.map(async (item) => {
          restaurants.push({
            id: item.place_id,
            geometry: item.geometry,
            status: item.business_status,
            icon: item.icon,
            name: item.name,
            photo: await `${photoUrl}&photoreference=${item.photos[0].photo_reference}&key=${MAP_API_KEY}`,
            rating: item.rating,
            vicinity: item.vicinity,
          });
        });
        setLoadingRestaurants(false);
        setFirstTimeHome(false);
        setCards(restaurants);
        return restaurants;
      })
      .catch((err) => {
        setLoadingRestaurants(false);
        console.log(err.message);
      });
  }
  return (
    <UserContext.Provider
      value={{
        theme,
        setTheme,
        logged,
        setLogged,
        name,
        setName,
        email,
        setEmail,
        phone,
        setPhone,
        birth,
        setBirth,
        password,
        setPassword,
        setUser,
        getNearRestaurants,
        loadingRestaurants,
        cards,
        //isFirstTimeHome
      }}>
      {children}
    </UserContext.Provider>
  );
}
