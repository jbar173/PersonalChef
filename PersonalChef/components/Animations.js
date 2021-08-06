import React from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';



class ThreeDots extends React.Component{
    constructor(props){
      super(props);
      this.state ={
        count:0,
      }
      this.opacity = new Animated.Value(0);
      this.opacityOne = new Animated.Value(0);
      this.opacityTwo = new Animated.Value(0);

      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentDidUpdate = this.componentDidUpdate.bind(this)

      this.firstDotAnimation = this.firstDotAnimation.bind(this)
      this.secondDotAnimation = this.secondDotAnimation.bind(this)
      this.thirdDotAnimation = this.thirdDotAnimation.bind(this)

    };


  componentDidMount(){
    console.log("ThreeDots mounted")
    this.firstDotAnimation()
    this.secondDotAnimation()
    this.thirdDotAnimation()
  }


  componentDidUpdate(){
    console.log("ThreeDots updated")
  }


  firstDotAnimation(){
    return(
              Animated.loop(
                Animated.sequence([
                  Animated.timing(this.opacity, {
                    duration: 500,
                    toValue: 1,
                    useNativeDriver: false,
                  }),
                  Animated.delay(1500),
                ]),
              ).start()
          );
    }


  secondDotAnimation(){
    return(
              Animated.loop(
                Animated.sequence([
                  Animated.delay(750),
                  Animated.timing(this.opacityOne, {
                    duration: 500,
                    toValue: 1,
                    useNativeDriver: false,
                  }),
                  Animated.delay(750)
                ]),
              ).start()
          );
      }


  thirdDotAnimation(){
    return(
              Animated.loop(
                Animated.sequence([
                  Animated.delay(1500),
                  Animated.timing(this.opacityTwo, {
                    duration: 500,
                    toValue: 1,
                    useNativeDriver: false
                  }),
                ]),
              ).start()
          );
      }


  render(){
    console.log("rendered")

      return(
              <View style={{display:'flex'}}>
                  <View style={{flexWrap:"wrap", flexDirection:"row"}}>

                          <Animated.Text style={{
                            opacity: this.opacity.interpolate({
                              inputRange: [0,1],
                              outputRange: [0,1],
                            }),
                            fontSize: 30,
                          }} >.</Animated.Text>

                          <Animated.Text style={{
                            opacity: this.opacityOne.interpolate({
                              inputRange: [0,1],
                              outputRange: [0,1],
                            }),
                            fontSize: 30,
                          }} >.</Animated.Text>

                          <Animated.Text style={{
                            opacity: this.opacityTwo.interpolate({
                              inputRange: [0,1],
                              outputRange: [0,1],
                            }),
                            fontSize: 30,
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
      this.componentWillUnmount = this.componentWillUnmount.bind(this)
    };

    componentDidMount(){
      console.log("Searching mounted")
    }

    componentWillUnmount(){
      console.log("Searching unmounted")
    }

    render(){

      return(
              <View style={{display:'flex'}}>
                <View style={{flexWrap:"wrap", flexDirection:"row"}}>
                    <Text style={{fontSize:30}}>Searching</Text>
                    <ThreeDots />
                </View>
              </View>
            );

        }

};


class LoadingPage extends React.Component{
    constructor(props){
      super(props);
      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentWillUnmount = this.componentWillUnmount.bind(this)
    };

    componentDidMount(){
      console.log("Loading mounted")
    }

    componentWillUnmount(){
      console.log("Loading unmounted")
    }

    render(){

      return(
              <View style={{display:'flex'}}>
                <View style={{flexFlow:"row wrap"}}>
                    <Text style={{fontSize:30}}>Loading</Text>
                    <ThreeDots />
                </View>
              </View>
            );

        }

};



export { SearchingPage, LoadingPage, ThreeDots };
