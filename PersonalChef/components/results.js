import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NativeRouter, Route, Link } from "react-router-native";


class ResultsInitial extends React.Component {
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
        update_initial: false,
        apiCall: false,
        ingredients_rough: {},
        initialRecipeList: [],
        refinedRecipeList:[],
      }
      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentDidUpdate = this.componentDidUpdate.bind(this)
      this.firstAPICall = this.firstAPICall.bind(this)
    };


    componentDidMount(){
      console.log("Results mounted")
      var initial_data = this.props.location.state.initial_data
      var either = this.props.location.state.either
      var ingreds = this.props.location.state.ingreds
      this.setState({
        initialData:initial_data,
        ingredients_rough:ingreds,
        both:either,
        update_initial: true
      })
    }


    componentDidUpdate(){
      console.log("results did update")
      if(this.state.update_initial === true){
        var rough = this.state.ingredients_rough
        var final = []
        for([key,value] of Object.entries(rough)){
          // console.log("key: " + rough[key])
          final.push(rough[key])
        }
        final = final.flat()
        var length = final.length
        this.setState({
          initialData: {
            ...this.state.initialData,
            ingredients:final,
            ingredientCount:length
          },
          update_initial: false,
          apiCall: true
        })
      }
      if(this.state.apiCall === true){
        // console.log("calling the api")
        // console.log("this.state.initialData.ingredients[0]: " + this.state.initialData.ingredients[0])
        // console.log("this.state.initialData.ingredientCount: " + this.state.initialData.ingredientCount)
        this.setState({
          apiCall: false
        })
          // call the api:
        this.firstAPICall()
      }
    }

    firstAPICall(){
      console.log("recipe list call")
    }

  render(){
    var initial = this.state.initialData
    var either = this.state.both
    var initial = this.state.initialRecipeList
    var refined = this.state.refinedRecipeList

    return(

          <View style={styles.container}>
            <Text style={styles.mainTitle}>Your recipes!</Text>
            <Link to="/"><Text style={styles.blueButton}>Start again</Text></Link>
          </View>

      );
    }

};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediTitle: {
    fontSize:24,
    marginBottom:20
  },
  title: {
    fontSize:18,
  },
  mainTitle: {
    fontSize:28,
    marginBottom:20
  },
  greenButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'white',
    backgroundColor:'lightgreen',
  },
  blueButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "white",
    backgroundColor:'lightblue',
  },
});


export { ResultsInitial };
