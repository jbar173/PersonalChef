import React from 'react';
import { StyleSheet, Text, Pressable, View, SafeAreaView, ScrollView } from 'react-native';


class PerishableRankedDictionary extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        initialData: {
          "ingredients": [],
          "ingredientCount": 0,
        },
        // rank: this.props.rank,
        // backendRanks: this.props.backendRanks,
        rankedIngredients: {},
        finished: true,
        error: false,
        triggerSendBack: false,
      }
      this.componentDidMount = this.componentDidMount.bind(this)
      // this.componentDidUpdate = this.componentDidUpdate.bind(this)
      // this.componentWillUnmount = this.componentWillUnmount.bind(this)
      // this.sendIngredientsDict = this.sendIngredientsDict.bind(this)
   };

// Gets location for relevant rank list from directory, gets the list from that location,
//   assigns to rankedIngredients:
componentDidMount(){
    console.log("Ranked dictionary mounted")

    if(this.state.rank === null){
          var ranks = Object.keys(ranked_files)
          var word = ranks.pop()
          console.log("FIRST RANK: " + word)

          var converter = require('words-to-numbers');
          var number = converter.wordsToNumbers(word)
          console.log("NUMBER: " + number)
          this.setState({
            rank: number,
            backendRanks: ranks
          })
          var ingrs_list = ranked_files[`${word}`]
          console.log("1.ingrs_list: " + ingrs_list)

    }else{
          try{
              var ranks = this.state.backendRanks
              var new_rank = ranks.pop()
              console.log("NEW RANK: " + new_rank)
              var ingrs_list = ranked_files[`${new_rank}`]
              console.log("2.ingrs_list: " + ingrs_list)
              console.log("this.state.backendRanks.length is 0?: " + this.state.backendRanks.length === 0)
         }catch(error){
              console.log("Error getting next rank: " + error.message)
              console.log("this.state.backendRanks.length is 0?: " + this.state.backendRanks.length === 0)
              this.setState({
                finished: false,
                error: true
              })
         }
    }

    var list = ingrs_list.children
    console.log("list.length: " + list.length)
    // console.log("list[0]['name']: " + list[0]['name'])
    console.log("~~~~~~~~~~~~~~~~~~")

////////////////////////////////////// SET STATE (BELOW) FAILS/NEVER HAPPENS - so CdidUpdate never triggered again *** fix
    this.setState({
      rankedIngredients: list,
      finished: false,
    })
    console.log("END of didMount")
  }
//
//   componentDidUpdate(){
//     console.log("Ranked dictionary updated")
// // Triggers function that sends ranked dictionary to < AlterKeywords />:
//     // if(this.state.finished === false && this.state.error === false && this.state.triggerSendBack === false){
//     //   this.setState({
//     //     triggerSendBack: true,
//     //   })
//     // }
//     // if(this.state.triggerSendBack){
//     //   this.sendIngredientsDict()
//     // }
//     if(this.state.finished === false && this.state.error === false){
//       this.sendIngredientsDict()
//     }
//   }
//
//   componentWillUnmount(){
//     console.log("Ranked dictionary unmounted")
//   }
//
// // Function that sends rankedIngredients back to < AlterKeywords />:
//   sendIngredientsDict(){
//     console.log("R2")
//     var ranked_dictionary = this.state.rankedIngredients
//     var rank = this.state.rank
//     var backend_ranks = this.state.backendRanks
//     console.log("ranked ingredients.length: " + ranked_dictionary.length )
//     // console.log("this.state.rankedIngredients[0].name: " + this.state.rankedIngredients[0].name)
//     this.props.rankedIngs(backend_ranks,ranked_dictionary,rank)
//     this.setState({
//       finished: true,
//       triggerSendBack: false
//     })
//     console.log("R23")
//   }


 render(){
   console.log("Ranked dictionary rendered")
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



export { PerishableRankedDictionary };
