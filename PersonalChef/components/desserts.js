import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
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
      both:false,
      initialRecipeList: [],
      refinedRecipeList:[],
      times: {
        "hours":'0',
        "mins":'0'
      },
      ingredients_rough: {},
      sweets: [],
      sweets_updated: false,
      visit_number:0,
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.updateListHandler = this.updateListHandler.bind(this)
  };

    componentDidMount(){
      console.log("confectionary mounted")
      var initial_data = this.props.location.state.initial_data
      var ingreds = initial_data.ingredients
      var either = this.props.location.state.either
      var times = this.props.location.state.times
      this.setState({
        initialData:initial_data,
        ingredients_rough:ingreds,
        both:either,
        times:times
      })
    }

    componentDidUpdate(){
      console.log("confectionary updated")
      console.log("ingredients_rough[0]: " + this.state.ingredients_rough[0])

      if(this.state.initialData.time === '0'){
        console.log("!!updating time in initial data")
        var hrs = parseInt(this.state.times.hours)
        var mins = parseInt(this.state.times.mins)
        var added = hrs + mins
        var sum = added.toString()
        console.log("sum: " + sum)
        this.setState({
          initialData: {
            ...this.state.initialData,
            time:sum
          }
        })
      }
    }

    updateListHandler(confirmed_list){
      console.log("update list handler desserts.js")
      this.setState({
        sweets: confirmed_list,
        sweets_updated: true
      })
    }

    render(){
      var recipe_type = this.state.initialData.type
      var initial = this.state.initialData
      var either = this.state.both

        return(

          <View style={styles.container}>
            <Text style={styles.mainTitle}>Confectionary checklist</Text>

            <ConfectionaryChecklist updateListHandler={this.updateListHandler} />

            <Link to={{pathname:"/both-dry/", state:{ initial_data: initial, either: either } }}>
              <Text style={styles.blueButton}>Link to dry ingredients</Text>
            </Link>

            {recipe_type === "dessert" ?

              (
                <Link to={{pathname:"/type-time/", state:{ initial_data: initial, either: either } }}>
                  <Text style={styles.blueButton}>Back to type and time</Text>
                </Link>
              )

              :

              (
                <Link to={{pathname:"/other-fish/", state:{ initial_data: initial, either: either } }}>
                  <Text style={styles.blueButton}>Back to fish</Text>
                </Link>
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
  mainTitle: {
    fontSize:28,
    marginBottom:20
  },
  mediTitle: {
    fontSize:24,
    marginBottom:20
  },
  title: {
    fontSize:18,
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


export { ConfectionaryIngredientsList } ;
