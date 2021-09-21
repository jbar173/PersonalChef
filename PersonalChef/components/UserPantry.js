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
        pantryUpdated: false,
        final: false,
        empty: false,
        reRender: false
      }
      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentDidUpdate = this.componentDidUpdate.bind(this)
      this.updateListHandler = this.updateListHandler.bind(this)
      this.updateIngredientsRoughHandler = this.updateIngredientsRoughHandler.bind(this)
    };

    componentDidMount(){
      console.log("UserPantry mounted")
    }

    componentDidUpdate(){
      console.log("UserPantry updated")
      if(this.state.pantryUpdated){
        this.updateIngredientsRoughHandler()
      }
    }

    updateListHandler(current_pantry){
      console.log("UserPantry list updated")
      console.log("**current_pantry.length: " + current_pantry.length)
      this.setState({
        pantry: current_pantry,
        pantryUpdated: true
      })
    }

    updateIngredientsRoughHandler(){
      console.log("UserPantry is updating recipe ingredients")
      var new_key = "Already in pantry"
      var final_list = this.state.ingredients_rough
      for([key,value] of Object.entries(final_list)){
         if(key === new_key){
             delete final_list[key]
           }
      }
      final_list[new_key] = this.state.pantry

      this.setState({
        ingredients_rough: final_list,
        pantryUpdated: false,
        final: true
      })

    }

    render(){
      var ingreds = this.state.ingredients_rough
      var final = this.state.final
      var empty = this.state.empty

      return(
              <SafeAreaView>
                <ScrollView>
                    <View style={styles.container}>
                        <Text accessible={true} accessibilityLabel="My pantry"
                          accessibilityRole="text" style={styles.mainTitle}>My pantry</Text>

                        <PantryCheckList updateListHandler={this.updateListHandler} />

                        {final &&
                             <Link accessible={true} accessibilityLabel= "Continue"
                               accessibilityHint="Pantry confirmed - continue to next page"
                               to={{ pathname:"/type-time/", state:{ ingreds: ingreds,} }}
                               accessibilityRole="button" underlayColor="transparent">
                                <Text style={styles.blueButton}>Continue</Text>
                             </Link>
                         }

                        <Link style={{alignItems:"center"}} to="/" underlayColor="transparent">
                            <Text accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                            style={styles.blueButton}>Start again</Text>
                        </Link>
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
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "white",
    backgroundColor:'lightblue',
  },
});


export { UserPantry };
