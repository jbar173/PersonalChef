import React from 'react';
import { StyleSheet, Text, View, Button, TouchableWithoutFeedback, Pressable, SafeAreaView, ScrollView } from 'react-native';
import { NativeRouter, Route, Link, Redirect } from "react-router-native";
import { PantryCheckList } from "./checklists/pantry.js";


class UserPantry extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        pantry: [],
        favourites: [],
        ingredients_rough: {},
        updated: false,
      }
      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentWillUnmount = this.componentWillUnmount.bind(this)
      this.updateListHandler = this.updateListHandler.bind(this)
    };

    componentDidMount(){
      console.log("UserPantry mounted")
      // var initial_data = this.props.location.state.initial_data
      // var either = this.props.location.state.either
      // var times = this.props.location.state.times
    }

    componentWillUnmount(){
      console.log("UserPantry unmounted")
    }

    updateListHandler(current_pantry){
      console.log("function")
    }


    render(){


      return(
              <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View>
                        <Text accessible={true} accessibilityLabel="In Your pantry!"
                          accessibilityRole="text" style={styles.mainTitle}>My pantry</Text>

                        <PantryCheckList updateListHandler={this.updateListHandler} />
                    </View>
                </ScrollView>
              </SafeAreaView>
      );

    }

};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  mainTitle: {
    fontSize:28,
    marginBottom:20,
    textAlign:'center',
  },
  greenButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'white',
    backgroundColor:'lightgreen',
    textAlign: "center",
    marginHorizontal: 128,
  },
  blueButton: {
    padding: 7,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "white",
    backgroundColor:'lightblue',
    textAlign: "center",
    marginHorizontal: 128,
  },
});


export { UserPantry };
