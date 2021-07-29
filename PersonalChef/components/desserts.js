import React from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, ScrollView } from 'react-native';
import { NativeRouter, Route, Link } from "react-router-native";

import { ConfectionaryChecklist } from "./checklists/confectionary.js";


class ConfectionaryIngredientsList extends React.Component {
      constructor(props){
      super(props);
      this.state = {
        userId: 12345,
        initialData: {
          "time":'0',
          "ingredients":[],
          "ingredientCount":0,
          "type":'',
        },
        both: false,
        times: {
          "hours":'0',
          "mins":'0'
        },
        ingredients_rough: {},
        sweets: [],
        sweets_updated: false,
      }
      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentDidUpdate = this.componentDidUpdate.bind(this)
      this.updateListHandler = this.updateListHandler.bind(this)
      this.updateIngredientsRoughHandler = this.updateIngredientsRoughHandler.bind(this)
    };

    componentDidMount(){
      console.log("confectionary mounted")
      var initial_data = this.props.location.state.initial_data
      var either = this.props.location.state.either
      var times = this.props.location.state.times
      if(either === true){
        var ingreds = this.props.location.state.ingreds
        this.setState({
          initialData:initial_data,
          ingredients_rough: ingreds,
          both:either,
          times:times
        })
      }else{
        this.setState({
          initialData:initial_data,
          both:either,
          times:times
        })
      }
     }

    componentDidUpdate(){
      console.log("confectionary updated")
      if(this.state.initialData.time === '0'){
        var hrs = parseInt(this.state.times.hours)
        var mins = parseInt(this.state.times.mins)
        var added = hrs + mins
        var sum = added.toString()
        this.setState({
          initialData: {
            ...this.state.initialData,
            time:sum
          }
        })
      }
      if(this.state.sweets_updated === true){
        this.updateIngredientsRoughHandler()
      }
    }

    updateListHandler(confirmed_list){
      console.log("update list handler desserts.js")
      this.setState({
        sweets: confirmed_list,
        sweets_updated: true
      })
     }

    updateIngredientsRoughHandler(){
      var new_key = "sweets"
      var final_list = this.state.ingredients_rough
      for([key,value] of Object.entries(final_list)){
         if(key === new_key){
             delete final_list[key]
           }
      }
      final_list[new_key] = this.state.sweets
      this.setState({
        ingredients_rough: final_list,
        sweets_updated: false
      })
    }

    render(){
      var recipe_type = this.state.initialData.type
      var initial = this.state.initialData
      var either = this.state.both
      var ingreds = this.state.ingredients_rough

        return(

          <SafeAreaView style={styles.container}>
            <ScrollView>
                  <Text accessible={true} accessibilityLabel="Confectionary checklist"
                    accessibilityRole="text" style={styles.mainTitle}>Confectionary checklist</Text>

                  <ConfectionaryChecklist updateListHandler={this.updateListHandler} />

                  <Link style={{marginTop:30}} to={{pathname:"/both-dry/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}>
                      <Text accessible={true} accessibilityLabel="Next page" accessibilityRole="button"
                      style={styles.blueButton}>Next</Text>
                  </Link>

                  {recipe_type === "dessert" ?

                      (
                        <Link to={{pathname:"/type-time/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}>
                          <Text accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                          style={styles.blueButton}>Back</Text>
                        </Link>
                      )

                      :

                      (
                        <Link to={{pathname:"/other-fish/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}>
                          <Text accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                          style={styles.blueButton}>Back</Text>
                        </Link>
                      )

                   }

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


export { ConfectionaryIngredientsList } ;
