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

      this.abortController = new AbortController()

      Animated.loop(
        Animated.sequence([
          Animated.timing(this.opacity, {
            duration: 1000,
            toValue: 1,
            easing: Easing.linear,
            useNativeDriver: false,
            signal: this.abortController.signal,
          }),
          Animated.delay(2000),
          Animated.timing(this.opacity, {
            duration: 0,
            toValue: 0,
            easing: Easing.linear,
            useNativeDriver: false,
            signal: this.abortController.signal,
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
            signal: this.abortController.signal,
          }),
          Animated.delay(994),
          Animated.timing(this.opacityOne, {
            duration: 0,
            toValue: 0,
            easing: Easing.linear,
            useNativeDriver: false,
            signal: this.abortController.signal,
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
            useNativeDriver: false,
            signal: this.abortController.signal,
          }),
          Animated.timing(this.opacityTwo, {
            duration: 0,
            toValue: 0,
            easing: Easing.linear,
            useNativeDriver: false,
            signal: this.abortController.signal,
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
    this.abortController.abort()
    // this.opacity = 0
    // this.opacityOne = 0
    // this.opacityTwo = 0
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


class SearchingPageAnimation extends React.Component{
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


class SavingRecipeAnimation extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        fiveSecondsOver: false,
      }
      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentDidUpdate = this.componentDidUpdate.bind(this)
      this.componentWillUnmount = this.componentWillUnmount.bind(this)
      this.fiveSecondStopwatch = this.fiveSecondStopwatch.bind(this)
      this.finish = this.finish.bind(this)

      this.opacity = new Animated.Value(0.01);
      this.abortController = new AbortController()

      Animated.loop(
        Animated.sequence([
          Animated.timing(this.opacity, {
            duration: 1000,
            toValue: 1,
            easing: Easing.linear,
            useNativeDriver: false,
            signal: this.abortController.signal,
          }),
          Animated.delay(1000),
          Animated.timing(this.opacity, {
            duration: 1000,
            toValue: 0,
            easing: Easing.linear,
            useNativeDriver: false,
            signal: this.abortController.signal,
          }),
        ]),
      ).start()

    };

    componentDidMount(){
      console.log("SavingRecipeAnimation mounted")
      this.fiveSecondStopwatch()
    }

    componentDidUpdate(){
      console.log("SavingRecipeAnimation updated")
      console.log("Five seconds over?: " + this.state.fiveSecondsOver)
    }

    componentWillUnmount(){
      console.log("SavingRecipeAnimation unmounted")
      this.abortController.abort()
    }

    fiveSecondStopwatch(){
      console.log("FIVE SECONDS started")
      var cmponent = this
      setTimeout(function(){
        console.log("FIVE SECONDS finished")
        cmponent.setState({
          fiveSecondsOver: true,
        }),
        cmponent.finish()
      }, 5000);
    }

    finish(){
      var state = false
      try{
        this.props.finishedAnimation(state)
      }catch(error){
        console.log("error: " + error.message)
      }
    }

    render(){
      console.log("SavingRecipeAnimation rendered")
      var five_seconds_over = this.state.fiveSecondsOver

      return(
            <View>

                {five_seconds_over === false &&
                    <Animated.Text style={{
                      opacity: this.opacity.interpolate({
                        inputRange: [0,1],
                        outputRange: [0,1],
                      }),
                      fontSize: 18,
                      marginTop: 10,
                      fontWeight:'bold',
                      textAlign: 'center',
                      color: 'lightseagreen'
                    }} > Saving recipe... </Animated.Text>
                 }

                {five_seconds_over &&
                   <Text style={styles.greenTitle}> Saved! </Text>
                }

            </View>
      );

    }

};


class ChangingTabsAnimation extends React.Component{
    constructor(props){
      super(props);
      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentDidUpdate = this.componentDidUpdate.bind(this)
      this.componentWillUnmount = this.componentWillUnmount.bind(this)

      this.opacity = new Animated.Value(0.01);
      this.abortController = new AbortController()

      Animated.loop(
        Animated.sequence([
          Animated.timing(this.opacity, {
            duration: 1000,
            toValue: 1,
            easing: Easing.linear,
            useNativeDriver: false,
            signal: this.abortController.signal,
          }),
          Animated.delay(1000),
          Animated.timing(this.opacity, {
            duration: 1000,
            toValue: 0,
            easing: Easing.linear,
            useNativeDriver: false,
            signal: this.abortController.signal,
          }),
        ]),
      ).start()

    };

    componentDidMount(){
      console.log("ChangingTabsAnimation mounted")
    }

    componentDidUpdate(){
      console.log("ChangingTabsAnimation updated")
    }

    componentWillUnmount(){
      console.log("ChangingTabsAnimation unmounted")
      this.abortController.abort()
    }

    render(){
      console.log("ChangingTabsAnimation rendered")

      return(
            <View>
                    <Animated.Text style={{
                      opacity: this.opacity.interpolate({
                        inputRange: [0,1],
                        outputRange: [0,1],
                      }),
                      fontSize: 18,
                      marginTop: 10,
                      fontWeight:'bold',
                      textAlign: 'center',
                      color: 'lightseagreen'
                    }} > One moment please... </Animated.Text>

            </View>
      );

    }

};


const styles = StyleSheet.create({
  greenTitle: {
    fontSize:18,
    marginTop: 10,
    fontWeight:'bold',
    textAlign: 'center',
    color: 'green'
  },
});


export { SearchingPageAnimation, FilteringAnimation, ThreeDots, SavingRecipeAnimation, ChangingTabsAnimation };
