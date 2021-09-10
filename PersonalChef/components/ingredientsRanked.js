import React from 'react';

import ranked_files from './directory.js';
import * as zero from './checklists/json_ingredient_lists/ranked_lists/zero.json';

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
        rankWord: this.props.rankWord,
        rank: this.props.rank
      },
      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentDidUpdate = this.componentDidUpdate.bind(this)
      this.componentWillUnmount = this.componentWillUnmount.bind(this)
      this.sendIngredientsDict = this.sendIngredientsDict.bind(this)
   };

  // Gets location for relevant rank list from directory, gets the list from that location,
  //   assigns to rankedIngredients:
  componentDidMount(){
    console.log("Ranked ingredients mounted")

    var this_rank = this.state.rankWord
    console.log("this.state.rank: " + this.state.rank)
    var ingrs_list = ranked_files[`${this_rank}`]
    // console.log("ingrs_list: " + ingrs_list)
    // var ingrs_json = ingrs_list
    var list = ingrs_list.children
    this.setState({
      rankedIngredients: list,
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

  // Function that sends rankedIngredients to < AlterKeywords />:
  sendIngredientsDict(){
    var ranked_dictionary = this.state.rankedIngredients
    var rank = this.state.rank
    console.log("ranked ingredients.length: " + ranked_dictionary.length )
    this.props.rankedIngs(ranked_dictionary,rank)
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
