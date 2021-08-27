/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import Knob from './src/components/Knob';

const App = () => {
  return (
    <View style={styles.container}>
      <Knob
        minRotorValue={20}
        maxRotorValue={100}
        lightKnobBack={require('./src/assets/light_knob_back.png')}
        lightKnobBackHeight={300}
        lightKnobBackWidth={300}
        lightKnobRotorActive={require('./src/assets/light_knob_rotor.png')}
        lightKnobRotorInActive={require('./src/assets/light_knob_rotor_inactive.png')}
        lightKnobRotorHeight={340}
        lightKnobRotorWidth={340}
        knobRotorButtonActive={require('./src/assets/knob_rotor_btn_active.png')}
        knobRotorButtonInactive={require('./src/assets/knob_rotor_btn_inactive.png')}
        knobRotorButtonHeight={130}
        knobRotorButtonWidth={130}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
