'use babel'
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ImageBackground,
  ActivityIndicator,
  StatusBar
} from 'react-native';

import {fetchWeather, fetchLocationId} from './utils/api'
import SearchInput from './components/SearchInput';
import getImageForWeather from './utils/getImageForWeather';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      error: false,//call fail or return unusable information
      location: '',
      temperature: 0,
      weather: '',//나머지 3개는 retrived from the API
    };
  }

  componentDidMount() {
    this.handleUpdateLocation('Seoul');
  }


  handleUpdateLocation = async city => {
    if(!city) return;

    this.setState({ loading: true }, async () => {
        try {
          const locationId = await fetchLocationId(city);
          const {location, weather, temperature} = await fetchWeather(locationId,);

          this.setState({
            loading: false,
            error: false,
            location,
            weather,
            temperature,
          });
        } catch (e) {
          this.setState({
            loading: false,
            error: true,
          });
        }
      }
    );
  };

  render() {
    const {loading, error, location, weather, temperature} = this.state;

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
       <StatusBar animated={true} barStyle="light-content"/>
       <ImageBackground
        source={getImageForWeather(weather)}
        style={styles.imageContainer}
        imageStyle={styles.image}
       >
        <View style={styles.detailsContainer}>
          <ActivityIndicator
           animating={loading}
           color='white'
           size='large'
          />

          {loading || (
            <View>
              {!error || (
                <Text style={[styles.smallText, styles.textStyle]}>
                 Could not load weather, please try a different city.
                </Text>
              )}

              {error || (
                <View>
                  <Text style = {[styles.textStyle, styles.largeText]}>{location}</Text>
                  <Text style={[styles.smallText, styles.textStyle]}>{weather}</Text>
                  <Text style={[styles.textStyle, styles.largeText]}>{`${Math.round(temperature*10)/10}°C`}</Text>
                </View>
              )}
              <SearchInput
                placeholder="Search any city"
                onSubmit={this.handleUpdateLocation}
              />
            </View>
          )}


          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495E',
  },
  imageContainer: {
    flex: 1
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover'
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 20,
  },
  textStyle: {
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular': 'Roboto',
    color: 'white'
  },
  largeText: {
    fontSize: 44
  },
  smallText: {
    fontSize: 18
  },
});
