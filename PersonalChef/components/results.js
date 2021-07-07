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
        initialRecipeList: [],
        refinedRecipeList:[],
      }
      this.componentDidMount = this.componentDidMount.bind(this)
    };

    componentDidMount(){
      console.log("Initial results mounted")
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
