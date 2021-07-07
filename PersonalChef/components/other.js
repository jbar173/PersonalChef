import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NativeRouter, Route, Link } from "react-router-native";
import { MeatChecklist } from "./checklists/meat.js";
import { FishChecklist } from "./checklists/fish.js";



class MeatIngredientsList extends React.Component {
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
      initialRecipeList: [],
      refinedRecipeList:[],
      times: {
        "hours":'0',
        "mins":'0'
      },
      ingredients_rough: {},
      meats: [],
      meats_updated: false,
      visit_number:0,
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.updateListHandler = this.updateListHandler.bind(this)
  };

    componentDidMount(){
      console.log("meats mounted")
      console.log("meats.length: " + this.state.meats.length)
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
      console.log("meats updated")
      console.log("ingredients_rough[0]: " + this.state.ingredients_rough[0])

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
    }

    updateListHandler(confirmed_list){
      console.log("update list handler other.js")
      this.setState({
        meats: confirmed_list,
        meats_updated: true
      })
    }

    render(){
      var recipe_type = this.state.initialData.type
      var initial = this.state.initialData
      var either = this.state.both

        return(

          <View style={styles.container}>

                <Text style={styles.mainTitle}>Meats checklist</Text>

                <MeatChecklist updateListHandler={this.updateListHandler} />

                <View>
                    <Link to={{pathname:"/other-fish/", state:{ initial_data: initial, either: either } }} >
                       <Text style={styles.greenButton}>Link to fish ingredients</Text>
                    </Link>
                    <Link to={{pathname:"/type-time/", state:{ initial_data: initial, either: either } }}>
                      <Text style={styles.blueButton}>Back to type and time</Text>
                    </Link>
                </View>

          </View>

        );
     }
};


class FishIngredientsList extends React.Component {
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
      initialRecipeList: [],
      refinedRecipeList:[],
      ingredients_rough: {},
      fishes: [],
      fish_updated: false,
      visit_number:0,
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.updateListHandler = this.updateListHandler.bind(this)
  };

  componentDidMount(){
    console.log("fish ingredients mounted")
    var initial_data = this.props.location.state.initial_data
    var either = this.props.location.state.either
    this.setState({
      initialData:initial_data,
      both:either
    })
   }

   updateListHandler(confirmed_list){
     console.log("update list handler other.js")
     this.setState({
       fishes: confirmed_list,
       fish_updated: true
     })
   }


    render(){
      var recipe_type = this.state.initialData.type
      var initial = this.state.initialData
      var either = this.state.both

        return(

          <View style={styles.container}>
            <Text style={styles.mediTitle}>Fish ingredients checklist</Text>

            <FishChecklist updateListHandler={this.updateListHandler} />

              { either === false ?

                (
                  <View>
                      <Link to={{pathname:"/both-dry/", state:{ initial_data: initial, either: either } }} >
                         <Text style={styles.greenButton}>Link to dry ingredients</Text>
                      </Link>
                      <Link to={{pathname:"/other-meat/", state:{ initial_data: initial, either: either } }}>
                        <Text style={styles.blueButton}>Back to meat list</Text>
                      </Link>
                  </View>
                )
                :
                (
                  <View>
                      <Link to={{pathname:"/dessert-confectionary/", state:{ initial_data: initial, either: either} }} >
                          <Text style={styles.greenButton}>link to confectionary list</Text>
                      </Link>
                      <Link to={{pathname:"/other-meat/", state:{ initial_data: initial, either: either } }}>
                        <Text style={styles.blueButton}>Back to meat list</Text>
                      </Link>
                  </View>
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


export { MeatIngredientsList, FishIngredientsList };
