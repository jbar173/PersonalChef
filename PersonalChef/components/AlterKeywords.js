import React from 'react';
import { StyleSheet, Text, View, Button, TouchableWithoutFeedback, Pressable, SafeAreaView, ScrollView } from 'react-native';
import { NativeRouter, Route, Link, Redirect } from "react-router-native";
import { RankedDictionary } from "./IngredientsRanked.js";
import toWords from 'number-to-words';




class AlterKeywords extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        getRanked: true,
        ready: false,
        passBack: false,
        rankedIngredients: {},
        ingredients: this.props.keywords,
        newKeywords: [],
        gotFive: false,
        rank: null,
        rankWord: '',
        notFound: false,
      }
      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentDidUpdate = this.componentDidUpdate.bind(this)
      this.getRankedIngredients = this.getRankedIngredients.bind(this)
      this.alterIngredients = this.alterIngredients.bind(this)
      this.sendAlteredListBack = this.sendAlteredListBack.bind(this)
    };

    componentDidMount(){
      console.log("Alter Keywords mounted")
      console.log("this.state.ingredients.length: " + this.state.ingredients.length)
    }

    componentDidUpdate(){
      console.log("alter keywords updated")
      console.log("this.state.ready: " + this.state.ready)
      console.log("this.state.rankedIngredients.length: " + this.state.rankedIngredients.length)
      // Triggers function to alter ingredient list, once rankedIngredients
      //   have been received from < RankedDictionary />:
      if(this.state.ready){
        console.log("Ready triggered")
        this.alterIngredients()
      }
      // Triggers function that gets the next ranked list from < RankedDictionary /> if no
      //  matches found within current rankedIngredients:
      if(this.state.notFound){
        var next_rank = this.state.rank
        var converter = require('number-to-words');
        var word = converter.toWords(next_rank)
        console.log("!!!!!!!!! word: " + word)
        this.setState({
          rankWord: word,
          getRanked: true,
          notFound: false
        })
      }
      // Triggers function that passes new list of keywords back to < ConfirmList />:
      if(this.state.passBack){
        this.sendAlteredListBack()
      }
    }

    // Takes in a dictionary of all ingredients, ranked and sorted, from <RankedDictionary /> :
    getRankedIngredients(ranked_dictionary,rank,rank_word){
      console.log("get ranked ingredients triggered")
      console.log("ranked_dictionary.length: " + ranked_dictionary.length)
      this.setState({
        rankedIngredients: ranked_dictionary,
        rank: rank,
        rankWord: rank_word,
        getRanked: false,
        ready: true
      })
    }

    // Searches for least popular ingredient in user's ingredient list,
    //  splices it from list, then triggers this.state.passBack:
    alterIngredients(){
      console.log("this.state.rankedIngredients[0].name: " + this.state.rankedIngredients[0].name)
      var i
      var j
      var length = this.state.ingredients.length
      var r_length = this.state.rankedIngredients.length - 1
      var ingredients = this.state.ingredients
      var searching = true
      var not_found = false

      while(searching){

        for(j=r_length;j>-1;j--){                 // Outer loop iterates through rankedIngredients from bottom (lowest rank) to top.

          if(searching){
            var inner = true
          }else{
            break;
          }

          var ranked_ingredient = this.state.rankedIngredients[j].name

          while(inner){

            for(i=0;i<length;i++){                // Inner loop iterates through user's ingredients, looking for a match with current
                                                  //   ranked ingredient (from above loop).
              var my_ingredient = ingredients[i]

              if(my_ingredient === ranked_ingredient){
                ingredients.splice(i,1)
                var new_keywords = this.state.newKeywords
                new_keywords.push(my_ingredient)
                this.setState({
                  newKeywords: new_keywords
                })
                if(new_keywords.length === 5){
                  this.setState({
                    gotFive: true
                  })
                  searching = false
                  inner = false
                  break;
                }
                console.log("*******found match*********: " + my_ingredient)
                console.log("*******found most popular********: " + ranked_ingredient)
              }else{
                // console.log("pass for:")
                // console.log("my ingredient: " + my_ingredient)
                // console.log("ranked_ingredient: " + ranked_ingredient)
                if(i === length - 1){
                  inner = false
                  break;
                }
              }
            }
          }
        }
        if(searching){
          not_found = true
        }
        searching = false
      }

      if(not_found){
        console.log("Get next rank of ingredients")
        var current = this.state.rank
        var next_rank = current -1
        var converter = require('number-to-words');
        var next_rank_word = converter.toWords(next_rank)
        this.setState({
          ready: false,
          notFound: true,
          rank: next_rank,
          rankWord: next_rank_word
        })
      }else{
        this.setState({
          newKeywords: new_keywords,
          ready: false,
          passBack: true,
          notFound: false,
        })
      }
    }

    // Sends new ingredients list back to < ConfirmList />:
    sendAlteredListBack(){
      var new_keywords = this.state.newKeywords
      console.log("new_keywords.length: " + new_keywords.length)
      this.props.alteredKeywords(new_keywords)
      this.setState({
        passBack: false
      })
    }


    render(){
        return(
                <View>
                      {this.state.getRanked &&
                        < RankedDictionary
                          rank = {this.state.rank}
                          rankWord = {this.state.rankWord}
                          rankedIngs = {this.getRankedIngredients}
                        />
                      }
                </View>
              );
        }

 };


export { AlterKeywords };
