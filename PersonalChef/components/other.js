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
      meat: [],
      meat_updated: false,
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.updateListHandler = this.updateListHandler.bind(this)
    this.updateIngredientsRoughHandler = this.updateIngredientsRoughHandler.bind(this)
  };

    componentDidMount(){
      console.log("meats mounted")
      console.log("meat.length: " + this.state.meat.length)
      var initial_data = this.props.location.state.initial_data
      var either = this.props.location.state.either
      var times = this.props.location.state.times
      this.setState({
        initialData:initial_data,
        both:either,
        times:times
      })
    }

    componentDidUpdate(){
      console.log("meats updated")

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
      if(this.state.meat_updated === true){
        console.log("updating ingredients_rough")
        this.updateIngredientsRoughHandler()
      }
    }

    updateListHandler(confirmed_list){
      console.log("update list handler other.js meat")
      this.setState({
        meat: confirmed_list,
        meat_updated: true
      })
    }

    updateIngredientsRoughHandler(){
      var new_key = "meat"
      var final_list = this.state.ingredients_rough
      for([key,value] of Object.entries(final_list)){
         if(key === new_key){
             console.log(new_key + " replaced")
             delete final_list[key]
           }
      }
      final_list[new_key] = this.state.meat
      this.setState({
        ingredients_rough: final_list,
        meat_updated: false
      })
    }


    render(){
      var recipe_type = this.state.initialData.type
      var initial = this.state.initialData
      var either = this.state.both
      var ingreds = this.state.ingredients_rough

        return(

          <View style={styles.container}>

                <Text style={styles.mainTitle}>Meats checklist</Text>

                <MeatChecklist updateListHandler={this.updateListHandler} />

                <View>
                    <Link to={{pathname:"/other-fish/", state:{ initial_data: initial, either: either, ingreds: ingreds } }} >
                       <Text style={styles.greenButton}>Link to fish ingredients</Text>
                    </Link>
                    <Link to={{pathname:"/type-time/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}>
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
      fish: [],
      fish_updated: false,
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.updateListHandler = this.updateListHandler.bind(this)
    this.updateIngredientsRoughHandler = this.updateIngredientsRoughHandler.bind(this)
  };

  componentDidMount(){
    console.log("fish ingredients mounted")
    var initial_data = this.props.location.state.initial_data
    var either = this.props.location.state.either
    var ingreds = this.props.location.state.ingreds
    this.setState({
      initialData:initial_data,
      ingredients_rough:ingreds,
      both:either
    })
   }

   componentDidUpdate(){
     console.log("fish updated")

     if(this.state.fish_updated === true){
       console.log("updating ingredients_rough")
       this.updateIngredientsRoughHandler()
     }
   }

   updateListHandler(confirmed_list){
     console.log("update list handler other.js fish")
     this.setState({
       fish: confirmed_list,
       fish_updated: true
     })
   }

   updateIngredientsRoughHandler(){
     var new_key = "fish"
     var final_list = this.state.ingredients_rough
     for([key,value] of Object.entries(final_list)){
        if(key === new_key){
            console.log(new_key + " replaced")
            delete final_list[key]
          }
     }
     final_list[new_key] = this.state.fish
     this.setState({
       ingredients_rough: final_list,
       fish_updated: false
     })
   }


    render(){
      var recipe_type = this.state.initialData.type
      var initial = this.state.initialData
      var either = this.state.both
      var ingreds = this.state.ingredients_rough

        return(

          <View style={styles.container}>
            <Text style={styles.mediTitle}>Fish ingredients checklist</Text>

            <FishChecklist updateListHandler={this.updateListHandler} />

              { either === false ?

                (
                  <View>
                      <Link to={{pathname:"/both-dry/", state:{ initial_data: initial, either: either, ingreds: ingreds } }} >
                         <Text style={styles.greenButton}>Link to dry ingredients</Text>
                      </Link>
                      <Link to={{pathname:"/other-meat/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}>
                        <Text style={styles.blueButton}>Back to meat list</Text>
                      </Link>
                  </View>
                )
                :
                (
                  <View>
                      <Link to={{pathname:"/dessert-confectionary/", state:{ initial_data: initial, either: either, ingreds: ingreds} }} >
                          <Text style={styles.greenButton}>link to confectionary list</Text>
                      </Link>
                      <Link to={{pathname:"/other-meat/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}>
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
