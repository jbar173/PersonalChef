import React from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, ScrollView } from 'react-native';
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
    this.componentWillUnmount = this.componentWillUnmount.bind(this)

    this.updateListHandler = this.updateListHandler.bind(this)
    this.updateIngredientsRoughHandler = this.updateIngredientsRoughHandler.bind(this)
  };

    componentDidMount(){
      console.log("meats mounted")
      var initial_data = this.props.location.state.initial_data
      var either = this.props.location.state.either
      var times = this.props.location.state.times
      var ingreds = this.props.location.state.ingreds
      this.setState({
        initialData:initial_data,
        both:either,
        times:times,
        ingredients_rough: ingreds
      })
    }

    componentWillUnmount(){
      console.log("meats unmounted")
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
      var new_key = "Meat"
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

          <SafeAreaView style={styles.container}>
            <ScrollView>

                  <Text accessible={true} accessibilityLabel="Meats checklist"
                    accessibilityRole="text" style={styles.mainTitle}>Meats checklist</Text>

                  <MeatChecklist updateListHandler={this.updateListHandler} />

                  <Link style={{marginTop:30}} to={{pathname:"/other-fish/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}
                   underlayColor="transparent">
                       <Text accessible={true} accessibilityLabel="Next page"
                        accessibilityRole="button" style={styles.greenNextButton}>Next
                       </Text>
                  </Link>
                  <Link to={{pathname:"/type-time/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}
                   underlayColor="transparent">
                      <Text accessible={true} accessibilityLabel="Go back"
                        accessibilityRole="button" style={styles.blueBackButton}>Back
                      </Text>
                  </Link>

            </ScrollView>
          </SafeAreaView>

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
      ingredients_rough: {},
      fish: [],
      fish_updated: false,
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)

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

   componentWillUnmount(){
     console.log("fish unmounted")
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
     var new_key = "Fish"
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

          <SafeAreaView style={styles.container}>
            <ScrollView>
                  <Text accessible={true} accessibilityLabel="Fish checklist" accessibilityRole="text"
                    style={styles.mainTitle}>Fish checklist</Text>

                  <FishChecklist updateListHandler={this.updateListHandler} />

                    { either === false ?

                      (
                        <View>
                            <Link style={{marginTop:30}} to={{pathname:"/both-dry/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}
                             underlayColor="transparent">
                               <Text accessible={true} accessibilityLabel="Next page"
                                 accessibilityRole="button" style={styles.greenNextButton}>Next</Text>
                            </Link>
                            <Link to={{pathname:"/other-meat/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}
                             underlayColor="transparent">
                                <Text accessible={true} accessibilityLabel="Go back"
                                  accessibilityRole="button" style={styles.blueBackButton}>Back</Text>
                            </Link>
                        </View>
                      )
                      :
                      (
                        <View>
                            <Link style={{marginTop:30}} to={{pathname:"/dessert-confectionary/", state:{ initial_data: initial, either: either, ingreds: ingreds} }}
                             underlayColor="transparent">
                                <Text accessible={true} accessibilityLabel="Next page"
                                  accessibilityRole="button" style={styles.greenNextButton}>Next</Text>
                            </Link>
                            <Link to={{pathname:"/other-meat/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}
                             underlayColor="transparent">
                              <Text accessible={true} accessibilityLabel="Go back"
                                accessibilityRole="button" style={styles.blueBackButton}>Back</Text>
                            </Link>
                        </View>
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
  mediTitle: {
    fontSize:24,
    marginBottom:20
  },
  blueBackButton: {
    padding: 10,
    marginTop: 5,
    marginHorizontal: 128,
    minWidth: 100,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "white",
    backgroundColor:'lightblue',
    textAlign: "center",
  },
  greenNextButton: {
    padding: 10,
    marginTop: 50,
    marginHorizontal: 128,
    minWidth: 100,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "white",
    backgroundColor:'lightgreen',
    textAlign: "center",
  },
});


export { MeatIngredientsList, FishIngredientsList };
