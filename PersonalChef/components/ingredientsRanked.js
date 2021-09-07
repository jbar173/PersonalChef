import React from 'react';
import * as data from './checklists/json_ingredient_lists/all.json';
import { StyleSheet, Text, Pressable, View, SafeAreaView, ScrollView } from 'react-native';


class RankedDictionary extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        initialData: {
          "ingredients": [],
          "ingredientCount": 0,
        },
        rankedIngredients: {},
        finished: true,
      },
      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentDidUpdate = this.componentDidUpdate.bind(this)
      this.componentWillUnmount = this.componentWillUnmount.bind(this)
      this.sortByCountFunction = this.sortByCountFunction.bind(this)
      this.sendIngredientsDict = this.sendIngredientsDict.bind(this)
   };

  // Gets json data from imported 'all.json', sorts by count (or rank), highest at the top:
  componentDidMount(){
    console.log("Ranked ingredients mounted")
    var ingrs_json = data.children
    var ranked_ingrs =  ingrs_json.sort(this.sortByCountFunction);
    this.setState({
      rankedIngredients: ranked_ingrs,
      finished: false,
    })
  }

  componentDidUpdate(){
    console.log("ranked updated")
  // Triggers function that sends ranked dictionary to < AlterKeywords />:
    if(this.state.finished === false){
      this.sendIngredientsDict()
    }
  }

  componentWillUnmount(){
    console.log("RankedDict unmounted")
  }

  // Function used to sort initial data (in componentDidMount):
  sortByCountFunction(a,b){
    if (a.count < b.count) {
        return 1;
    }
    if (a.count > b.count) {
        return -1;
    }
    return 0;
  }

  // Function that sends rankedIngredients to < AlterKeywords />:
  sendIngredientsDict(){
    var ranked_dictionary = this.state.rankedIngredients
    console.log("ranked ingredients.length: " + ranked_dictionary.length )
    this.props.rankedIngs(ranked_dictionary)
    this.setState({
      finished: true,
    })
  }

 render(){

   return(
         <View>
            <Text></Text>
         </View>
        );
   }

 };


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal:20,
  },
})




export { RankedDictionary };
