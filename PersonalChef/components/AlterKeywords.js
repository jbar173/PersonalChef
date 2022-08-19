import React from 'react';
import { StyleSheet, Text, View, Button, TouchableWithoutFeedback, Pressable, SafeAreaView, ScrollView } from 'react-native';
import { NativeRouter, Route, Link, Redirect } from "react-router-native";
import { RankedDictionary } from "./PopularRanked.js";
import { PerishableRankedDictionary } from "./PerishableRanked.js";


class AlterKeywords extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        searchMethod: this.props.searchMethod,
        getRanked: false,
        getMostPerishable: false,
        fiveIngreds: false,
        ready: false,
        // perishableReady: false,
        // pass: false,
        set: false,
        passBack: false,
        backendRanks: [],
        rankedIngredients: {},
        ingredients: this.props.keywords,
        originalLength: null,
        newKeywords: [],
        gotFive: false,
        rank: null,
        notFound: false,
        timerOn: false,
        error: false,
      }
      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentDidUpdate = this.componentDidUpdate.bind(this)
      this.componentWillUnmount = this.componentWillUnmount.bind(this)
      this.getRankedIngredients = this.getRankedIngredients.bind(this)
      this.alterIngredients = this.alterIngredients.bind(this)
      this.getPerishableIngredients = this.getPerishableIngredients.bind(this)
      this.sendAlteredListBack = this.sendAlteredListBack.bind(this)
      this.setStates = this.setStates.bind(this)
      this.twoSecondTimeout = this.twoSecondTimeout.bind(this)
    };

  componentDidMount(){
    console.log("AlterKeywords mounted")
    console.log("this.state.ingredients.length: " + this.state.ingredients.length)
    console.log("~~~~did mount this.state.searchMethod: " + this.state.searchMethod)
    var length = this.state.ingredients.length
    console.log("initial keywords length: " + length)
    if(this.state.searchMethod === 'frequently used'){
      this.setState({
        getRanked: true,
        originalLength: length,
      })
    }else if(this.state.searchMethod === 'most perishable'){
      this.setState({
        getMostPerishable: true,
        originalLength: length,
        set: true
      })
    }else{
      this.setState({
        fiveIngreds: true,
        originalLength: length,
      })
    }
  }

  componentWillUnmount(){
    console.log("AlterKeywords unmounting")
    this.setState({
      getRanked: false,
      getMostPerishable: false,
    })
  }

  componentDidUpdate(){
    console.log("AlterKeywords updated")
    console.log("### this.state.notFound: " + this.state.notFound)
    console.log("~~~~alter this.state.searchMethod: " + this.state.searchMethod)
    console.log("### this.state.newKeywords.length: " + this.state.newKeywords.length)
    console.log("~~~~~~~~~~~~~~~~getMostPerishable: " + this.state.getMostPerishable)

    // FOR RANKED:
    // Triggers function to alter ingredient list, once rankedIngredients
    //   have been received from < RankedDictionary />:
    if(this.state.ready){
        console.log("Ready triggered")
        this.alterIngredients()
        // console.log("ready triggered 2")
    }
    // Triggers function that gets the next ranked list from < RankedDictionary /> if no
    //  matches found within current rankedIngredients:
    if(this.state.set){
        this.setStates()
    }
    if(this.state.searchMethod === 'frequently used'){
      if(this.state.notFound && this.state.timerOn === false || this.state.passBack && this.state.timerOn === false){
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~passBack == true~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
          this.twoSecondTimeout()
      }
    }

    // FOR PERISHABLE:
    //

    // if(this.state.perishableReady){
    //     console.log("Ready triggered")
    //     this.alterIngredients()
    //     // console.log("ready triggered 2")
    // }



    // FOR BOTH RANKED AND PERISHABLE:
    // Triggers function that passes new list of keywords back to < ConfirmList />:
    if(this.state.gotFive){
        console.log("Passing back to ApiCalls")
        this.sendAlteredListBack()
    }
  }

  twoSecondTimeout(){
    console.log("2 second timeout started")
    var comp = this
    this.setState({
      timerOn: true
    })
    setTimeout(function(){
        console.log("2 second timeout finished")
        if(comp.state.notFound){
          comp.setState({
            set: true,
            notFound: false,
            timerOn: false
          })
        }
        else{
          comp.setState({
            gotFive: true,
            passBack: false,
            timerOn: false
          })
        }
      }, 2000)
  }

  setStates(){
    console.log("*********setStates function")
    if(this.state.searchMethod === 'frequently used'){
      this.setState({
        getRanked: true,
        set: false
      })
    }else if(this.state.searchMethod === 'most perishable'){
      this.setState({
        getMostPerishable: true,
        set: false
      })
    }else{
      console.log("User's choice five ingredients state")
    }
  }

// Takes in a dictionary of all ingredients, ranked and sorted, from <RankedDictionary /> :
  getRankedIngredients(backend_ranks,ranked_dictionary,rank){
    console.log("get ranked ingredients triggered")
    console.log("ranked_dictionary.length: " + ranked_dictionary.length)

    this.setState({
      backendRanks: backend_ranks,
      rankedIngredients: ranked_dictionary,
      rank: rank,
      getRanked: false,
      ready: true
    })
    console.log("Alter a")
  }

// Searches for least popular ingredient in user's ingredient list,
//  splices it from list, then triggers this.state.passBack:
  alterIngredients(){
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
            console.log("Looking for: " + ranked_ingredient)

            while(inner){

                  for(i=0;i<length;i++){                // Inner loop iterates through user's ingredients, looking for a match with current
                                                        //   ranked ingredient (from above loop).
                      var my_ingredient = ingredients[i]
                      // console.log("A2")

                      if(my_ingredient === ranked_ingredient){
                            // console.log("A3")
                            ingredients.splice(i,1)
                            var new_keywords = this.state.newKeywords
                            new_keywords.push(my_ingredient)
                            this.setState({
                              newKeywords: new_keywords
                            })
                            if(new_keywords.length === 5 || new_keywords.length === this.state.originalLength){
                                  console.log("Length is short enough!!!!!")
                                  searching = false
                                  inner = false
                                  break;
                            }
                            console.log("*******found match*********: " + my_ingredient)
                            console.log("*******found most popular********: " + ranked_ingredient)

                      }else{
                            // console.log("A4")
                            if(i === length - 1){
                                  inner = false
                                  break;
                            }
                      }

                   }

            }

        }

        if(searching){
            console.log("A5")
            not_found = true
        }
        console.log("A6")
        searching = false
     }

     if(not_found){
       console.log("Not found")
       console.log("Get next rank of ingredients")
       this.setState({
          ready: false,
          notFound: true,
        })
        // console.log("/////////////////////")
      }else{
        console.log("Found a match")
        this.setState({
          newKeywords: new_keywords,
          ready: false,
          passBack: true,
          notFound: false,
        })
       }

  }

//
  getPerishableIngredients(new_perishable_keywords){
    console.log("Getting perishable list")
    //
    //
    //
    console.log("Perishable keywords length:" + new_perishable_keywords.length)
    this.setState({
      newKeywords: new_perishable_keywords,
      getMostPerishable: false,
      gotFive: true
    })
    // this.setState({
    //   newKeywords: new_perishable_keywords,
    //   getMostPerishable: false,
    //   gotFive: true
    // })
  }

 // Sends new ingredients list back to < ApiCalls />:
  sendAlteredListBack(){
    console.log("sendAlteredListBack triggered")
    var status = true
    if(this.state.error){
        console.log("A7 error")
        status = false
    }
    var new_keywords = this.state.newKeywords
    console.log("new_keywords.length: " + new_keywords.length)
    this.props.alteredKeywords(new_keywords,status)
    this.setState({
      gotFive: false
    })
  }


  render(){
      console.log("AlterKeywords rendered")
      return(
              <View>
                    {this.state.getRanked &&
                      < RankedDictionary
                        rank = {this.state.rank}
                        backendRanks = {this.state.backendRanks}
                        rankedIngs = {this.getRankedIngredients}
                      />
                    }
                    {this.state.getMostPerishable &&
                      < PerishableRankedDictionary
                        ingredients = {this.state.ingredients}
                        perishableIngs = {this.getPerishableIngredients}
                      />
                    }
              </View>
            );
    }

 };


export { AlterKeywords };
