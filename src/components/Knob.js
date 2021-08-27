import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  PanResponder,
  Animated,
  Image,
  Dimensions,
} from 'react-native';

export default class Knob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rotorValue: props.minRotorValue,
      rotate: new Animated.Value(0),
      outerImage: props.lightKnobRotorInActive,
      innerImage: props.knobRotorButtonInactive,
      startingAngle: props.initialAngle,
      rotateValue: '0deg',
    };
    this.minRotorValue = props.minRotorValue;
    this.maxRotorValue = props.maxRotorValue;
  }

  rotorStep = 1;
  lastTouchAngle = -1;
  rotorAngle = 0;
  static defaultProps = {
    initialRadius: 1,
    initialAngle: 0,
    precision: 0,
  };
  firstTouchEnabled = false;

  panOuterResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onPanResponderGrant: (evt, gestureState) => {
      this.lastTouchAngle = -1;
    },
    onPanResponderMove: (evt, gestureState) => {
      // Detect Touch Outside the circle radius
      let h = this.props.lightKnobBackHeight / 2;
      let k = this.props.lightKnobBackWidth / 2;
      let c = Math.pow(evt.nativeEvent.touches[0].locationX - h, 2);
      let p = Math.pow(evt.nativeEvent.touches[0].locationY - k, 2);
      let r = h * h;
      let cp = c + p;
      if (cp > r && this.firstTouchEnabled == false) {
        // Do nothing
      } else if (this.firstTouchEnabled) {
        this.setState({
          outerImage: this.props.lightKnobRotorActive,
        });
        this.changeRotation(
          // Gettimg first touch
          evt.nativeEvent.touches[0].pageX,
          evt.nativeEvent.touches[0].pageY,
        );
      } else if (cp == r || cp < r) {
        this.firstTouchEnabled = true;
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      this.setState({
        outerImage: this.props.lightKnobRotorInActive,
      });
      this.firstTouchEnabled = false;
    },
  });

  panInnerResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onPanResponderGrant: () => {
      this.setState({
        innerImage: this.props.knobRotorButtonActive,
      });
    },
    onPanResponderRelease: (evt, gestureState) => {
      this.setState({
        innerImage: this.props.knobRotorButtonInactive,
      });
    },
  });

  cartesianToPolar(x1, y1, x2, y2) {
    let dy = y2 - y1;
    let dx = x2 - x1;
    let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (angle < 0 && angle >= -180) {
      return -angle;
    } //Custom angle adjustment for knob
    else {
      return 180 + (180 - angle);
    } //Custom angle adjustment for knob to make angle to 360 degree
  }

  changeRotation = (mouseX, mouseY) => {
    let centerX = Dimensions.get('window').width / 2;
    let centerY = Dimensions.get('window').height / 2;
    let currentTouchAngle = this.cartesianToPolar(
      centerX,
      centerY,
      mouseX,
      mouseY,
    );
    if (currentTouchAngle != this.lastTouchAngle && this.lastTouchAngle != -1) {
      if (currentTouchAngle > this.lastTouchAngle) {
        let newRotorAngleCalc = currentTouchAngle - this.lastTouchAngle;
        this.rotorAngle -= newRotorAngleCalc;
        if (this.state.rotorValue > this.minRotorValue) {
          this.setState({
            rotorValue: this.state.rotorValue - this.rotorStep,
          });
        }
      } else {
        let newRotorAngleCalc = this.lastTouchAngle - currentTouchAngle;
        this.rotorAngle += newRotorAngleCalc;
        if (this.state.rotorValue < this.maxRotorValue) {
          this.setState({
            rotorValue: this.state.rotorValue + this.rotorStep,
          });
        }
      }
      this.setState({
        rotateValue: this.rotorAngle + 'deg',
      });
    }
    this.lastTouchAngle = currentTouchAngle;
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <View>
            <Image
              style={{
                height: this.props.lightKnobBackHeight,
                width: this.props.lightKnobBackWidth,
              }}
              source={this.props.lightKnobBack}
            />
          </View>
          <Image
            style={[
              {
                position: 'absolute',
                height: this.props.lightKnobRotorHeight,
                width: this.props.lightKnobRotorWidth,
              },
              {
                transform: [{rotate: this.state.rotateValue}],
              },
            ]}
            source={this.state.outerImage}
            {...this.panOuterResponder.panHandlers}
          />
          <Image
            style={{
              position: 'absolute',
              height: this.props.knobRotorButtonHeight,
              width: this.props.knobRotorButtonWidth,
            }}
            source={this.state.innerImage}
            {...this.panInnerResponder.panHandlers}
          />
        </View>
        <View>
          <Text>{this.state.rotorValue}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
