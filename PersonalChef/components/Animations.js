import React from 'react';
import { StyleSheet, Text, View } from 'react-native';



class Searching extends React.Component {
    constructor(props){
      super(props);
      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentWillUnmount = this.componentWillUnmount.bind(this)
    };

  componentDidMount(){
    console.log("Trigger animation here")
  }

  componentWillUnmount(){
    console.log("stop animation here")
  }


  render(){

    return(
            <View>
              <Text>Searching animation here...</Text>
            </View>

          );

   }

};


class Loading extends React.Component {
    constructor(props){
      super(props);
      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentWillUnmount = this.componentWillUnmount.bind(this)
    };

  componentDidMount(){
    console.log("Trigger animation here")
  }

  componentWillUnmount(){
    console.log("stop animation here")
  }


  render(){

    return(
            <View>
              <Text>Loading animation here...</Text>
            </View>

          );

   }

};



export { Searching, Loading };
