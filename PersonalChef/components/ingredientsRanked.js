import React from 'react';

import ranked_files from './directory.js';
import * as zero from './checklists/json_ingredient_lists/ranked_lists/zero.json';
import toWords from 'number-to-words';
import wordsToNumbers from 'words-to-numbers';

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
      this.sortByRankFunction = this.sortByRankFunction.bind(this)
      this.sendIngredientsDict = this.sendIngredientsDict.bind(this)
   };

  // Gets location for relevant rank list from directory, gets the list from that location,
  //   assigns to rankedIngredients:
  componentDidMount(){
    console.log("Ranked ingredients mounted")

    var this_rank = this.state.rankWord
    console.log("this.state.rank: " + this.state.rank)
    if(this.state.rank === null){
        var ranks = Object.keys(ranked_files)
        var numbers = []
        for(x in ranks){
          console.log(x + ". rank: " + ranks[x])
          var num = wordsToNumbers(ranks[x])
          numbers.push(num)
        }
        var sorted = numbers.sort(this.sortByRankFunction)
        var top_five = []
        for(x=0;x<5;x++){
          var num = sorted.pop()
          top_five.push(num)
        }
        for(x in top_five){
          console.log(x + ". top nums: " + top_five[x])
        }
        console.log("top_five[4]: " + top_five[4])
        var converter = require('number-to-words');
        var word = converter.toWords(top_five[4])
        this.setState({
          rank: top_five[4],
          rankWord: word
        })
        var ingrs_list = ranked_files[`${word}`]
    }else{
        var ingrs_list = ranked_files[`${this_rank}`]
    }

    var list = ingrs_list.children
    this.setState({
      rankedIngredients: list,
      finished: false,
    })
  }

  sortByRankFunction(a,b){
    if (a < b) {
        return 1;
    }
    if (a > b) {
        return -1;
    }
    return 0;
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
    var rank_word = this.state.rankWord
    console.log("ranked ingredients.length: " + ranked_dictionary.length )
    this.props.rankedIngs(ranked_dictionary,rank,rank_word)
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
