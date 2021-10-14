import React from 'react';
import { StyleSheet, Text, View, Animated, Easing } from 'react-native';



class ThreeDots extends React.Component{
    constructor(props){
      super(props);

      this.opacity = new Animated.Value(0.01);
      this.opacityOne = new Animated.Value(0.01);
      this.opacityTwo = new Animated.Value(0.01);

      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentDidUpdate = this.componentDidUpdate.bind(this)
      this.componentWillUnmount = this.componentWillUnmount.bind(this)

      Animated.loop(
        Animated.sequence([
          Animated.timing(this.opacity, {
            duration: 1000,
            toValue: 1,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.delay(2000),
          Animated.timing(this.opacity, {
            duration: 0,
            toValue: 0,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ]),
      ).start(),


      Animated.loop(
        Animated.sequence([
          Animated.delay(1000),
          Animated.timing(this.opacityOne, {
            duration: 1000,
            toValue: 1,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.delay(994),
          Animated.timing(this.opacityOne, {
            duration: 0,
            toValue: 0,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ]),
        ).start(),


      Animated.loop(
        Animated.sequence([
          Animated.delay(2000),
          Animated.timing(this.opacityTwo, {
            duration: 1000,
            toValue: 1,
            easing: Easing.linear,
            useNativeDriver: false
          }),
          Animated.timing(this.opacityTwo, {
            duration: 0,
            toValue: 0,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ]),
        ).start()

    };


  componentDidMount(){
      console.log("ThreeDots mounted")
    }

  componentDidUpdate(){
      console.log("ThreeDots updated")
    }

  componentWillUnmount(){
    console.log("ThreeDots unmounted")
    this.opacity = 0
    this.opacityOne = 0
    this.opacityTwo = 0
    console.log("end of ThreeDots")
  }


  render(){
      console.log("ThreeDots rendered")

      return(
              <View style={{display:'flex'}}>
                  <View style={{flexWrap:"wrap", flexDirection:"row"}}>

                          <Animated.Text style={{
                            opacity: this.opacity.interpolate({
                              inputRange: [0,1],
                              outputRange: [0,1],
                            }),
                            fontSize: 20,
                          }} >.</Animated.Text>

                          <Animated.Text style={{
                            opacity: this.opacityOne.interpolate({
                              inputRange: [0,1],
                              outputRange: [0,1],
                            }),
                            fontSize: 20,
                          }} >.</Animated.Text>

                          <Animated.Text style={{
                            opacity: this.opacityTwo.interpolate({
                              inputRange: [0,1],
                              outputRange: [0,1],
                            }),
                            fontSize: 20,
                          }} >.</Animated.Text>

                    </View>
                </View>
            );

      }

};


class SearchingPage extends React.Component{
    constructor(props){
      super(props);
      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentDidUpdate = this.componentDidUpdate.bind(this)
      this.componentWillUnmount = this.componentWillUnmount.bind(this)
    };

    componentDidMount(){
      console.log("Searching mounted")
    }

    componentDidUpdate(){
        console.log("Searching updated")
    }

    componentWillUnmount(){
      console.log("Searching unmounted")
    }

    render(){
      console.log("Searching rendered")

      return(
              <View style={{display:'flex'}}>
                <View style={{flexWrap:"wrap", flexDirection:"row"}}>
                    <Text accessibilityLabel="Searching" accessibilityHint="Loading page"
                     style={{fontSize:20}}>Searching</Text>
                    <ThreeDots />
                </View>
              </View>
            );

        }

};


class FilteringAnimation extends React.Component{
    constructor(props){
      super(props);
      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentDidUpdate = this.componentDidUpdate.bind(this)
      this.componentWillUnmount = this.componentWillUnmount.bind(this)
    };

    componentDidMount(){
      console.log("Filtering mounted")
    }

    componentDidUpdate(){
        console.log("Filtering updated")
    }

    componentWillUnmount(){
      console.log("Filtering unmounted")
    }

    render(){
      console.log("Filtering rendered")

      return(
              <View style={{display:'flex'}}>
                <View style={{flexWrap:"wrap", flexDirection:"row"}}>
                    <Text accessibilityLabel="Loading" accessibilityHint="Loading page"
                     style={{fontSize:20}}>Filtering</Text>
                    <ThreeDots />
                </View>
              </View>
            );

        }

};



export { SearchingPage, FilteringAnimation, ThreeDots };
