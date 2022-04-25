import React from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, ScrollView } from 'react-native';
import { NativeRouter, Route, Link } from "react-router-native";

import { DryIngredientsChecklist } from "./checklists/dry.js";
import { SauceIngredientsChecklist } from "./checklists/sauces.js";
import { TheRestIngredientsChecklist } from "./checklists/the_rest.js";
import { FruitAndVegChecklist } from "./checklists/fruit_veg.js";
import { HerbsAndSpicesChecklist } from "./checklists/herbs_spices.js";
import { TinnedChecklist } from "./checklists/tinned.js";
import { AlcoholChecklist } from "./checklists/alcohol.js";
import { CheeseChecklist } from "./checklists/cheese.js";


class DryIngredientsList extends React.Component {
    constructor(props){
    super(props);
    this.state = {
      userId: 12345,
      initialData: {
        "time":'0',
        "ingredients":[],
        "ingredientCount":0,
        "type":'',
        "searchMethod": '',
      },
      both: false,
      ingredients_rough: {},
      dries: [],
      dries_updated: false,
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)

    this.updateListHandler = this.updateListHandler.bind(this)
    this.updateIngredientsRoughHandler = this.updateIngredientsRoughHandler.bind(this)
  };

  componentDidMount(){
    console.log("dry ingredients mounted")
    var initial_data = this.props.location.state.initial_data
    var either = this.props.location.state.either
    var ingreds = this.props.location.state.ingreds
    this.setState({
      initialData: initial_data,
      ingredients_rough:ingreds,
      both:either
    })
   }

   componentWillUnmount(){
     console.log("dries unmounted")
   }

   componentDidUpdate(){
     console.log("dries updated")
     console.log("~~~~this.state.initialData.searchMethod: " + this.state.initialData.searchMethod)
     if(this.state.dries_updated === true){
       console.log("updating ingredients_rough")
       this.updateIngredientsRoughHandler()
     }
   }

   updateListHandler(confirmed_list){
     console.log("update list handler in_both.js dry")
     this.setState({
       dries: confirmed_list,
       dries_updated: true
     })
   }

   updateIngredientsRoughHandler(){
     var new_key = "Dry Ingredients"
     var final_list = this.state.ingredients_rough
     for([key,value] of Object.entries(final_list)){
        if(key === new_key){
            console.log(new_key + " replaced")
            delete final_list[key]
          }
     }
     final_list[new_key] = this.state.dries
     this.setState({
       ingredients_rough: final_list,
       dries_updated: false
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
                  <Text accessible={true} accessibilityLabel="Dry ingredients checklist"
                    accessibilityRole="text" style={styles.mainTitle}>Dry ingredients checklist</Text>

                  <DryIngredientsChecklist updateListHandler={this.updateListHandler} />

                  <Link style={{marginTop:30}} to={{pathname:"/both-sauce/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}
                   underlayColor="transparent">
                      <Text accessible={true} accessibilityLabel="Next page" accessibilityRole="button"
                       style={styles.greenNextButton}>Next</Text>
                  </Link>

                  {recipe_type === "dessert" || either === true ?

                    (
                      <Link to={{pathname:"/dessert-confectionary/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}
                       underlayColor="transparent">
                          <Text accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                            style={styles.blueBackButton}>Back</Text>
                      </Link>
                    )
                    :
                    (
                      <Link to={{pathname:"/other-fish/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}
                       underlayColor="transparent">
                          <Text accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                           style={styles.blueBackButton}>Back</Text>
                      </Link>
                    )

                  }

            </ScrollView>
          </SafeAreaView>

        );
     }
};


class SauceIngredientsList extends React.Component {
    constructor(props){
    super(props);
    this.state = {
      userId: 12345,
      initialData: {
        "time":'0',
        "ingredients":[],
        "ingredientCount":0,
        "type":'',
        "searchMethod": '',
      },
      both: false,
      ingredients_rough: {},
      sauces: [],
      sauces_updated: false,
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)

    this.updateListHandler = this.updateListHandler.bind(this)
    this.updateIngredientsRoughHandler = this.updateIngredientsRoughHandler.bind(this)
  };

  componentDidMount(){
    console.log("sauce ingredients mounted")
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
    console.log("sauces unmounted")
  }

  componentDidUpdate(){
    console.log("sauces updated")
    if(this.state.sauces_updated === true){
      console.log("updating ingredients_rough")
      this.updateIngredientsRoughHandler()
    }
  }

  updateListHandler(confirmed_list){
    console.log("update list handler in_both.js sauces")
    this.setState({
      sauces: confirmed_list,
      sauces_updated: true
    })
  }

  updateIngredientsRoughHandler(){
    var new_key = "Sauce Ingredients"
    var final_list = this.state.ingredients_rough
    for([key,value] of Object.entries(final_list)){
       if(key === new_key){
           console.log(new_key + " replaced")
           delete final_list[key]
         }
    }
    final_list[new_key] = this.state.sauces
    this.setState({
      ingredients_rough: final_list,
      sauces_updated: false
    })
  }


  render(){
    var initial = this.state.initialData
    var either = this.state.both
    var ingreds = this.state.ingredients_rough

      return(

        <SafeAreaView style={styles.container}>
          <ScrollView>
                <Text accessible={true} accessibilityLabel="Oils, Sauces and Condiments ingredients checklist" accessibilityRole="text"
                  style={styles.mainTitle}>Oils, Sauces and Condiments ingredients checklist</Text>

                <SauceIngredientsChecklist updateListHandler={this.updateListHandler} />

                <Link style={{marginTop:30}} to={{pathname:"/both-fruit/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}
                 underlayColor="transparent">
                   <Text accessible={true} accessibilityLabel="Next page" accessibilityRole="button" style={styles.greenNextButton}>Next</Text>
                </Link>
                <Link to={{pathname:"/both-dry/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}
                 underlayColor="transparent">
                   <Text accessible={true} accessibilityLabel="Go back" accessibilityRole="button" style={styles.blueBackButton}>Back</Text>
                </Link>
          </ScrollView>
        </SafeAreaView>

      );
   }
};


class FruitAndVegList extends React.Component {
    constructor(props){
    super(props);
    this.state = {
      userId: 12345,
      initialData: {
        "time":'0',
        "ingredients":[],
        "ingredientCount":0,
        "type":'',
        "searchMethod": '',
      },
      both:false,
      ingredients_rough: {},
      fruits: [],
      fruits_updated: false,
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)

    this.updateListHandler = this.updateListHandler.bind(this)
    this.updateIngredientsRoughHandler = this.updateIngredientsRoughHandler.bind(this)
  };

  componentDidMount(){
    console.log("fruit and veg mounted")
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
    console.log("fruits unmounted")
  }

  componentDidUpdate(){
    console.log("fruits updated")
    if(this.state.fruits_updated === true){
      console.log("updating ingredients_rough")
      this.updateIngredientsRoughHandler()
    }
  }

  updateListHandler(confirmed_list){
    console.log("update list handler in_both.js fruit/veg")
    this.setState({
      fruits: confirmed_list,
      fruits_updated: true
    })
  }

  updateIngredientsRoughHandler(){
    var new_key = "Fruit and Vegetables"
    var final_list = this.state.ingredients_rough
    for([key,value] of Object.entries(final_list)){
       if(key === new_key){
           console.log(new_key + " replaced")
           delete final_list[key]
         }
    }
    final_list[new_key] = this.state.fruits
    this.setState({
      ingredients_rough: final_list,
      fruits_updated: false
    })
  }




    render(){
      var initial = this.state.initialData
      var either = this.state.both
      var ingreds = this.state.ingredients_rough

        return(

          <SafeAreaView style={styles.container}>
            <ScrollView>
                  <Text accessible={true} accessibilityLabel="Fruits and Vegetables checklist"
                    accessibilityRole="text" style={styles.mainTitle}>Fruits and Vegetables checklist</Text>

                  <FruitAndVegChecklist updateListHandler={this.updateListHandler} />

                  <Link style={{marginTop:30}} to={{pathname:"/both-spices/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}
                   underlayColor="transparent">
                      <Text accessible={true} accessibilityLabel="Next page" accessibilityRole="button"
                        style={styles.greenNextButton}>Next</Text>
                  </Link>
                  <Link to={{pathname:"/both-sauce/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}
                   underlayColor="transparent">
                      <Text accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                       style={styles.blueBackButton}>Back</Text>
                  </Link>
            </ScrollView>
          </SafeAreaView>

        );
     }
};


class HerbsAndSpicesList extends React.Component {
    constructor(props){
    super(props);
    this.state = {
      userId: 12345,
      initialData: {
        "time":'0',
        "ingredients":[],
        "ingredientCount":0,
        "type":'',
        "searchMethod": '',
      },
      both: false,
      ingredients_rough: {},
      herbs: [],
      herbs_updated: false,
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)

    this.updateListHandler = this.updateListHandler.bind(this)
    this.updateIngredientsRoughHandler = this.updateIngredientsRoughHandler.bind(this)
    };

    componentDidMount(){
      console.log("herbs and spices mounted")
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
      console.log("herbs unmounted")
    }

    componentDidUpdate(){
      console.log("herbs updated")
      if(this.state.herbs_updated === true){
        console.log("updating ingredients_rough")
        this.updateIngredientsRoughHandler()
      }
    }

    updateListHandler(confirmed_list){
      console.log("update list handler in_both.js herbs/spices")
      this.setState({
        herbs: confirmed_list,
        herbs_updated: true
      })
    }

    updateIngredientsRoughHandler(){
      var new_key = "Herbs and Spices"
      var final_list = this.state.ingredients_rough
      for([key,value] of Object.entries(final_list)){
         if(key === new_key){
             console.log(new_key + " replaced")
             delete final_list[key]
           }
      }
      final_list[new_key] = this.state.herbs
      this.setState({
        ingredients_rough: final_list,
        herbs_updated: false
      })
    }


    render(){
      var initial = this.state.initialData
      var either = this.state.both
      var ingreds = this.state.ingredients_rough

        return(

          <SafeAreaView style={styles.container}>
            <ScrollView>
                  <Text accessible={true} accessibilityLabel="Herbs and spices checklist" accessibilityRole="text"
                    style={styles.mainTitle}>Herbs and spices checklist</Text>

                  <HerbsAndSpicesChecklist updateListHandler={this.updateListHandler} />

                  <Link style={{marginTop:30}} to={{pathname:"/both-tinned/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}
                   underlayColor="transparent">
                      <Text accessible={true} accessibilityLabel="Next page" accessibilityRole="button"
                       style={styles.greenNextButton}>Next</Text>
                  </Link>
                  <Link to={{pathname:"/both-fruit/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}
                   underlayColor="transparent">
                      <Text accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                       style={styles.blueBackButton}>Back</Text>
                  </Link>
            </ScrollView>
          </SafeAreaView>

        );
     }
};


class TinnedGoodsList extends React.Component {
    constructor(props){
    super(props);
    this.state = {
      userId: 12345,
      initialData: {
        "time":'0',
        "ingredients":[],
        "ingredientCount":0,
        "type":'',
        "searchMethod": '',
      },
      both:false,
      ingredients_rough: {},
      tins: [],
      tins_updated: false,
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)

    this.updateListHandler = this.updateListHandler.bind(this)
    this.updateIngredientsRoughHandler = this.updateIngredientsRoughHandler.bind(this)
  };

  componentDidMount(){
    console.log("tins mounted")
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
    console.log("tins unmounted")
  }

  componentDidUpdate(){
    console.log("tins updated")
    if(this.state.tins_updated === true){
      console.log("updating ingredients_rough")
      this.updateIngredientsRoughHandler()
    }
  }

  updateListHandler(confirmed_list){
    console.log("update list handler in_both.js tinned")
    this.setState({
      tins: confirmed_list,
      tins_updated: true
    })
  }

  updateIngredientsRoughHandler(){
    var new_key = "Tinned Ingredients"
    var final_list = this.state.ingredients_rough
    for([key,value] of Object.entries(final_list)){
       if(key === new_key){
           console.log(new_key + " replaced")
           delete final_list[key]
         }
    }
    final_list[new_key] = this.state.tins
    this.setState({
      ingredients_rough: final_list,
      tins_updated: false
    })
  }


  render(){
    var initial = this.state.initialData
    var either = this.state.both
    var ingreds = this.state.ingredients_rough

      return(

        <SafeAreaView style={styles.container}>
          <ScrollView>
                <Text accessible={true} accessibilityLabel="Tinned ingredients checklist"
                  accessibilityRole="text" style={styles.mainTitle}>Tinned ingredients checklist</Text>

                <TinnedChecklist updateListHandler={this.updateListHandler} />

                <Link style={{marginTop:30}} to={{pathname:"/both-cheese/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}
                 underlayColor="transparent">
                    <Text accessible={true} accessibilityLabel="Next page" accessibilityRole="button"
                     style={styles.greenNextButton}>Next</Text>
                </Link>
                <Link to={{pathname:"/both-spices/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}
                 underlayColor="transparent">
                    <Text accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                     style={styles.blueBackButton}>Back</Text>
                </Link>
          </ScrollView>
        </SafeAreaView>

      );
   }
};


class CheeseList extends React.Component {
    constructor(props){
    super(props);
    this.state = {
      userId: 12345,
      initialData: {
        "time":'0',
        "ingredients":[],
        "ingredientCount":0,
        "type":'',
        "searchMethod": '',
      },
      both:false,
      ingredients_rough: {},
      cheese: [],
      cheese_updated: false,
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)

    this.updateListHandler = this.updateListHandler.bind(this)
    this.updateIngredientsRoughHandler = this.updateIngredientsRoughHandler.bind(this)
  };

  componentDidMount(){
    console.log("tinned mounted")
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
    console.log("cheese unmounted")
  }

  componentDidUpdate(){
    console.log("cheese updated")
    if(this.state.cheese_updated === true){
      console.log("updating ingredients_rough")
      this.updateIngredientsRoughHandler()
    }
  }

  updateListHandler(confirmed_list){
    console.log("update list handler in_both.js cheese")
    this.setState({
      cheese: confirmed_list,
      cheese_updated: true
    })
  }

  updateIngredientsRoughHandler(){
    var new_key = "Cheese"
    var final_list = this.state.ingredients_rough
    for([key,value] of Object.entries(final_list)){
       if(key === new_key){
           console.log(new_key + " replaced")
           delete final_list[key]
         }
    }
    final_list[new_key] = this.state.cheese
    this.setState({
      ingredients_rough: final_list,
      cheese_updated: false
    })
  }


  render(){
    var initial = this.state.initialData
    var either = this.state.both
    var ingreds = this.state.ingredients_rough

      return(

        <SafeAreaView style={styles.container}>
          <ScrollView>
                <Text accessible={true} accessibilityLabel="Cheese checklist"
                  accessibilityRole="text" style={styles.mainTitle}>Cheese checklist</Text>

                <CheeseChecklist updateListHandler={this.updateListHandler} />

                <Link style={{marginTop:30}} to={{pathname:"/both-the-rest/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}
                 underlayColor="transparent">
                    <Text accessible={true} accessibilityLabel="Next page" accessibilityRole="button"
                     style={styles.greenNextButton}>Next</Text>
                </Link>
                <Link to={{pathname:"/both-tinned/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}
                 underlayColor="transparent">
                    <Text accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                     style={styles.blueBackButton}>Back</Text>
                </Link>
          </ScrollView>
        </SafeAreaView>

      );
   }
};


class TheRestList extends React.Component {
    constructor(props){
    super(props);
    this.state = {
      userId: 12345,
      initialData: {
        "time":'0',
        "ingredients":[],
        "ingredientCount":0,
        "type":'',
        "searchMethod": '',
      },
      both:false,
      ingredients_rough: {},
      the_rest: [],
      the_rest_updated: false,
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)

    this.updateListHandler = this.updateListHandler.bind(this)
    this.updateIngredientsRoughHandler = this.updateIngredientsRoughHandler.bind(this)
  };

  componentDidMount(){
    console.log("the rest mounted")
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
    console.log("the rest unmounted")
  }

  componentDidUpdate(){
    console.log("the rest updated")
    if(this.state.the_rest_updated === true){
      console.log("updating ingredients_rough")
      this.updateIngredientsRoughHandler()
    }
  }

  updateListHandler(confirmed_list){
    console.log("update list handler in_both.js The Rest")
    this.setState({
      the_rest: confirmed_list,
      the_rest_updated: true
    })
  }

  updateIngredientsRoughHandler(){
    var new_key = "The Rest"
    var final_list = this.state.ingredients_rough
    for([key,value] of Object.entries(final_list)){
       if(key === new_key){
           console.log(new_key + " replaced")
           delete final_list[key]
         }
    }
    final_list[new_key] = this.state.the_rest
    this.setState({
      ingredients_rough: final_list,
      the_rest_updated: false
    })
  }


  render(){
    var initial = this.state.initialData
    var either = this.state.both
    var ingreds = this.state.ingredients_rough

      return(

        <SafeAreaView style={styles.container}>
          <ScrollView>
                <Text accessible={true} accessibilityLabel="The Rest checklist"
                  accessibilityRole="text" style={styles.mainTitle}>The Rest checklist</Text>

                <TheRestIngredientsChecklist updateListHandler={this.updateListHandler} />

                <Link style={{marginTop:30}} to={{pathname:"/both-alcohol/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}
                 underlayColor="transparent">
                    <Text accessible={true} accessibilityLabel="Next page" accessibilityRole="button"
                     style={styles.greenNextButton}>Next</Text>
                </Link>
                <Link to={{pathname:"/both-cheese/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}
                 underlayColor="transparent">
                    <Text accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                     style={styles.blueBackButton}>Back</Text>
                </Link>
          </ScrollView>
        </SafeAreaView>

      );
   }
};



class AlcoholList extends React.Component {
    constructor(props){
    super(props);
    this.state = {
      userId: 12345,
      initialData: {
        "time":'0',
        "ingredients":[],
        "ingredientCount":0,
        "type":'',
        "searchMethod": '',
      },
      both:false,
      ingredients_rough: {},
      alcohol: [],
      alcohol_updated: false,
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)

    this.updateListHandler = this.updateListHandler.bind(this)
    this.updateIngredientsRoughHandler = this.updateIngredientsRoughHandler.bind(this)

  };

  componentDidMount(){
    console.log("alcohol mounted")
    var initial_data = this.props.location.state.initial_data
    var either = this.props.location.state.either
    var ingreds = this.props.location.state.ingreds
    this.setState({
      initialData:initial_data,
      ingredients_rough:ingreds,
      both:either,
    })
  }

  componentWillUnmount(){
    console.log("alcohol unmounted")
  }

  componentDidUpdate(){
    console.log("alcohol updated")
    if(this.state.alcohol_updated === true){
      console.log("updating ingredients_rough")
      this.updateIngredientsRoughHandler()
    }
  }

  updateListHandler(confirmed_list){
    console.log("update list handler in_both.js tinned")
    this.setState({
      alcohol: confirmed_list,
      alcohol_updated: true
    })
  }

  updateIngredientsRoughHandler(){
    var new_key = "Alcohol"
    var final_list = this.state.ingredients_rough
    for([key,value] of Object.entries(final_list)){
       if(key === new_key){
           console.log(new_key + " replaced")
           delete final_list[key]
         }
    }
    final_list[new_key] = this.state.alcohol
    this.setState({
      ingredients_rough: final_list,
      alcohol_updated: false,
    })
  }


  render(){
    var initial = this.state.initialData
    var either = this.state.both
    var ingreds = this.state.ingredients_rough

    return(

            <SafeAreaView style={styles.container}>
              <ScrollView>
                    <Text accessible={true} accessibilityLabel="Alcohol checklist"
                      accessibilityRole="text" style={styles.mainTitle}>Alcohol checklist</Text>

                    <AlcoholChecklist updateListHandler={this.updateListHandler} />

                    <Link style={{marginTop:30}} to={{pathname:"/confirm/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}
                     underlayColor="transparent">
                        <Text accessible={true} accessibilityLabel="Next page" accessibilityRole="button"
                         style={styles.greenNextButton}>Next</Text>
                    </Link>

                    <Link to={{pathname:"/both-the-rest/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}
                     underlayColor="transparent">
                        <Text accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                         style={styles.blueBackButton}>Back</Text>
                    </Link>
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


export { DryIngredientsList, SauceIngredientsList, FruitAndVegList, HerbsAndSpicesList, TinnedGoodsList, AlcoholList, CheeseList, TheRestList } ;
