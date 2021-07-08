import React from 'react';
import { StyleSheet, Text, View, Button, TouchableHighlight, TextInput } from 'react-native';
import { NativeRouter, Route, Link } from "react-router-native";
import { DryIngredientsChecklist } from "./checklists/dry.js";
import { WetIngredientsChecklist } from "./checklists/wet.js";
import { FruitAndVegChecklist } from "./checklists/fruit_veg.js";
import { HerbsAndSpicesChecklist } from "./checklists/herbs_spices.js";
import { TinnedChecklist } from "./checklists/tinned.js";



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
      },
      both: false,
      initialRecipeList: [],
      refinedRecipeList:[],
      ingredients_rough: {},
      dries: [],
      dries_updated: false,
      visit_number:0,
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.updateListHandler = this.updateListHandler.bind(this)
    this.updateIngredientsRoughHandler = this.updateIngredientsRoughHandler.bind(this)
  };

  componentDidMount(){
    console.log("dry ingredients mounted")
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
     console.log("dries updated")

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
     var new_key = "dries"
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

          <View style={styles.container}>
            <Text style={styles.mediTitle}>Dry ingredients checklist</Text>

            <DryIngredientsChecklist updateListHandler={this.updateListHandler} />

            <Link to={{pathname:"/both-wet/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}>
              <Text style={styles.blueButton}>Link to wet ingredients</Text>
            </Link>

            {recipe_type === "dessert" || either === true ?

              (
                <Link to={{pathname:"/dessert-confectionary/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}>
                  <Text style={styles.blueButton}>Back to confectionary list</Text>
                </Link>
              )
              :
              (
                <Link to={{pathname:"/other-fish/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}>
                  <Text style={styles.blueButton}>Back to fish list</Text>
                </Link>
              )

            }

          </View>

        );
     }
};


class WetIngredientsList extends React.Component {
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
      wets: [],
      wets_updated: false,
      visit_number:0,
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.updateListHandler = this.updateListHandler.bind(this)
    this.updateIngredientsRoughHandler = this.updateIngredientsRoughHandler.bind(this)
  };

  componentDidMount(){
    console.log("wet ingredients mounted")
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
    console.log("wets updated")

    if(this.state.wets_updated === true){
      console.log("updating ingredients_rough")
      this.updateIngredientsRoughHandler()
    }
  }

  updateListHandler(confirmed_list){
    console.log("update list handler in_both.js wet")
    this.setState({
      wets: confirmed_list,
      wets_updated: true
    })
  }

  updateIngredientsRoughHandler(){
    var new_key = "wets"
    var final_list = this.state.ingredients_rough
    for([key,value] of Object.entries(final_list)){
       if(key === new_key){
           console.log(new_key + " replaced")
           delete final_list[key]
         }
    }
    final_list[new_key] = this.state.wets
    this.setState({
      ingredients_rough: final_list,
      wets_updated: false
    })
  }


  render(){
    var initial = this.state.initialData
    var either = this.state.both
    var ingreds = this.state.ingredients_rough

      return(

        <View style={styles.container}>
          <Text style={styles.mediTitle}>Wet ingredients checklist</Text>

          <WetIngredientsChecklist updateListHandler={this.updateListHandler} />

          <Link to={{pathname:"/both-fruit/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}>
            <Text style={styles.blueButton}>Link to fruit and veg list</Text>
          </Link>
          <Link to={{pathname:"/both-dry/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}>
            <Text style={styles.blueButton}>Back to dry ingredients</Text>
          </Link>
        </View>

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
      },
      both:false,
      initialRecipeList: [],
      refinedRecipeList:[],
      ingredients_rough: {},
      fruits: [],
      fruits_updated: false,
      visit_number:0,
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
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
    var new_key = "fruits"
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

          <View style={styles.container}>
            <Text style={styles.mediTitle}>Fruit And Veg checklist</Text>

            <FruitAndVegChecklist updateListHandler={this.updateListHandler} />

            <Link to={{pathname:"/both-spices/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}>
              <Text style={styles.blueButton}>Link to herbs and spices list</Text>
            </Link>
            <Link to={{pathname:"/both-wet/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}>
              <Text style={styles.blueButton}>Back to wet ingredients</Text>
            </Link>
          </View>

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
      },
      both: false,
      initialRecipeList: [],
      refinedRecipeList:[],
      ingredients_rough: {},
      herbs: [],
      herbs_updated: false,
      visit_number:0,
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
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
      var new_key = "herbs"
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

          <View style={styles.container}>
            <Text style={styles.mediTitle}>Herbs and spices checklist</Text>

            <HerbsAndSpicesChecklist updateListHandler={this.updateListHandler} />

            <Link to={{pathname:"/both-tinned/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}>
              <Text style={styles.blueButton}>Link to tinned ingredients list</Text>
            </Link>
            <Link to={{pathname:"/both-fruit/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}>
              <Text style={styles.blueButton}>Back to fruit and veg list</Text>
            </Link>
          </View>

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
      },
      both:false,
      initialRecipeList: [],
      refinedRecipeList:[],
      ingredients_rough: {},
      tins: [],
      tins_updated: false,
      visit_number:0,
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
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
    var new_key = "tins"
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

        <View style={styles.container}>
          <Text style={styles.mediTitle}>Tinned ingredients checklist</Text>

          <TinnedChecklist updateListHandler={this.updateListHandler} />

          <Link to={{pathname:"/confirm/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}>
            <Text style={styles.blueButton}>Link to confirm ingredients</Text>
          </Link>
          <Link to={{pathname:"/both-spices/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}>
            <Text style={styles.blueButton}>Back to herbs and spices</Text>
          </Link>
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


export { DryIngredientsList, WetIngredientsList, FruitAndVegList, HerbsAndSpicesList, TinnedGoodsList } ;
