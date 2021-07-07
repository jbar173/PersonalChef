import React from 'react';
import { StyleSheet, Text, View, Button, TouchableWithoutFeedback, Pressable } from 'react-native';
import { NativeRouter, Route, Link } from "react-router-native";


class ConfirmList extends React.Component {
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
    this.fetchInitialList = this.fetchInitialList.bind(this)
  };

  componentDidMount(){
    console.log("confirm list mounted")
  }

  fetchInitialList(){
    console.log("fetching recipes")
    var list = this.state.initialRecipeList
    list.push("first recipe")
    list.push("second recipe")
    this.setState({
      initialRecipeList:list
    })
  }

  render(){
    var initial = this.state.initialData
    var either = this.state.both
    var recipe_list = this.state.initialRecipeList
    console.log("recipe_list.length: " + recipe_list.length)

    return(

      <View style={styles.container}>
          <Text style={styles.mainTitle}>Confirm ingredients</Text>
          <Pressable onPress={this.fetchInitialList}>
            <Text style={styles.blueButton}>Confirm</Text>
          </Pressable>
          <Link to={{pathname:"/both-tinned/", state:{ initial_data: initial, either: either } }}>
            <Text style={styles.blueButton}>Back to tinned ingredients list</Text>
          </Link>

        {recipe_list.length !== 0 ?
          (
            <Link to={{pathname:"/results-initial/", state:{ initial_data: initial, either: either } }}>
              <Text style={styles.blueButton}>See results</Text>
            </Link>
          )
          :
          (
            <TouchableWithoutFeedback underlayColor="white">
              <Text style={styles.palerBlueButton}>See results</Text>
            </TouchableWithoutFeedback>
          )
        }
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
  palerBlueButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "white",
    backgroundColor:'#d4ebf2',
  },
});

export { ConfirmList };
