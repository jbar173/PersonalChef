import React from 'react';
import { StyleSheet, Text, View, Button, TouchableWithoutFeedback, Pressable } from 'react-native';
import { NativeRouter, Route, Link } from "react-router-native";
import { Searching } from "./SearchingAnimation.js";


class ConfirmList extends React.Component {
    constructor(props){
    super(props);
    this.state = {
      userId: 12345,
      initialData: {
        "time": '0',
        "ingredients": [],
        "ingredientCount": 0,
        "type": '',
      },
      both: false,
      confirmed: false,
      ingredients_rough: {},
      apiCall: false,
      timerStarted: false,
      go: false,
      firstResponse: [],
      redirect: false,
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.confirmIngredients = this.confirmIngredients.bind(this)
    this.populateInitialData = this.populateInitialData.bind(this)
    this.startStopwatch = this.startStopwatch.bind(this)
  };

  componentDidMount(){
    console.log("confirm list mounted")
    var initial_data = this.props.location.state.initial_data
    var ingreds = this.props.location.state.ingreds
    var either = this.props.location.state.either
    this.setState({
      initialData: initial_data,
      ingredients_rough: ingreds,
      both: either
    })
  }

  componentDidUpdate(){
    console.log("updated")
    if(this.state.timer_started && this.state.go){
      this.startStopwatch()
      this.setState({
        go: false
      })
    }
    if(this.state.confirmed){
      this.populateInitialData()
    }
  }

  startStopwatch(){
    console.log("starting stopwatch")
    // **** After a minute, set timerStarted to false
    //        and redirect to true *****
  }

  confirmIngredients(){
    console.log("confirm ingredients")
    this.setState({
      confirmed: true
    })
  }

  populateInitialData(){
    console.log("populating initial data")
    var rough = this.state.ingredients_rough
    var final = []
    for([key,value] of Object.entries(rough)){
      final.push(rough[key])
    }
    final = final.flat()
    this.setState({
      initialData: {
        ...this.state.initialData,
        ingredients: final,
        ingredientCount: final.length
      },
      apiCall: true,
      timerStarted: true
    })
  }

  apiCallFinished(initial){
    console.log("api call finished function")
      this.setState({
        apiCall: false,
        firstResponse: initial
      })
    // **** Set redirect to true here
     console.log("Set redirect to true here")
    }


  render(){
    var initial = this.state.initialData
    var either = this.state.both
    var ingreds = this.state.ingredients_rough
    var response = this.state.firstResponse

    var confirmed = this.state.confirmed
    var api_call = this.state.apiCall
    var redirect = this.state.redirect

    return(

      <View style={styles.container}>
          <Text accessible={true} accessibilityLabel="Confirm your ingredients here, or click go back to edit them."
            accessibilityRole="text" style={styles.mainTitle}>Confirm ingredients</Text>

          {Object.entries(ingreds).map(function(item){
            return(
                <View key={item} style={{ alignItems:"center", marginBottom:10 }}>
                  <Text style={{fontSize:20,fontWeight:"bold"}}>{item[0]}:</Text>
                      {item[1].map(function(ingredient){
                        return(
                            <Text accessible={true} accessibilityLabel={ingredient} accessibilityRole="text"
                              key={ingredient} >{ingredient}</Text>
                          )
                        })
                      }
                </View>
               )
            }
          )}

          <Pressable onPress={this.confirmIngredients}>
            <Text accessible={true} accessibilityLabel="Confirm" accessibilityRole="button"
             style={styles.blueButton}>Confirm</Text>
          </Pressable>

          <Link to={{pathname:"/both-tinned/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}>
            <Text accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
              style={styles.blueButton}>Back</Text>
          </Link>

          {confirmed === true ?

              (
                <Pressable onPress={ this.setState({ api_call:true }) }>
                  <Text accessible={true} accessibilityLabel="See results" accessibilityRole="button"
                   style={styles.blueButton}>See results</Text>
                </Pressable>
              )

              :

              (
                <TouchableWithoutFeedback underlayColor="white">
                  <Text style={styles.palerBlueButton}>See results</Text>
                </TouchableWithoutFeedback>
              )

          }

          {call_api === true && <ApiCalls
            keywords={this.state.initialData.ingredients}
            passDataBack = {this.apiCallFinished} />}

          {timer_started === true && <Searching />}

          {redirect === true && <Redirect to={{ pathname:'/results-initial/',
            state:{ initial_data: initial, either: either,
                    ingreds: ingreds, first_response: response } }} />}

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
