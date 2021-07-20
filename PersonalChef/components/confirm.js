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
      both:false,
      confirmed:false,
      ingredients_rough: {},
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.confirmIngredients = this.confirmIngredients.bind(this)
  };

  componentDidMount(){
    console.log("confirm list mounted")
    var initial_data = this.props.location.state.initial_data
    console.log("initial_data.type: " + initial_data.type)
    var ingreds = this.props.location.state.ingreds
    var either = this.props.location.state.either
    this.setState({
      initialData:initial_data,
      ingredients_rough:ingreds,
      both:either
    })
  }

  confirmIngredients(){
    console.log("confirm ingredients")
    this.setState({
      confirmed:true
    })
  }

  render(){
    var initial = this.state.initialData
    var either = this.state.both
    var ingreds = this.state.ingredients_rough
    var confirmed = this.state.confirmed

    return(

      <View style={styles.container}>
          <Text style={styles.mainTitle}>Confirm ingredients</Text>

          {Object.entries(ingreds).map(function(item){
            return(
                <View key={item} style={{ alignItems:"center", marginBottom:10 }}>
                  <Text style={{fontSize:20,fontWeight:"bold"}}>{item[0]}:</Text>
                      {item[1].map(function(ingredient){
                        return(
                            <Text key={ingredient} >{ingredient}</Text>
                          )
                        })
                      }
                </View>
               )
            }
          )}

          <Pressable onPress={this.confirmIngredients}>
            <Text style={styles.blueButton}>Confirm</Text>
          </Pressable>

          <Link to={{pathname:"/both-tinned/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}>
            <Text style={styles.blueButton}>Back to tinned ingredients list</Text>
          </Link>

          {confirmed === true ?

              (
                <Link to={{pathname:"/results-initial/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}>
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
