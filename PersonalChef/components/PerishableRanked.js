import React from 'react';
import { StyleSheet, Text, Pressable, View, SafeAreaView, ScrollView } from 'react-native';
import * as perishable_list from './checklists/json_ingredient_lists/most_perishable.json';


class PerishableRankedDictionary extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        initialData: {
          "ingredients": [],
          "ingredientCount": 0,
        },
        ingredients: this.props.ingredients,
        originalLength: null,
        perishablesList: [],
        fivePerishables: [],
        ready: false,
        finished: false,
        notFound: false,
        passBack: false,
        // error: false,
        // triggerSendBack: false,
      }
      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentDidUpdate = this.componentDidUpdate.bind(this)
      this.componentWillUnmount = this.componentWillUnmount.bind(this)
      this.findMostPerishableKeywords = this.findMostPerishableKeywords.bind(this)
      this.sendPerishablesKeywords = this.sendPerishablesKeywords.bind(this)
   };


  componentDidMount(){
    console.log("PERISHABLE dictionary mounted")
    var perishables = perishable_list.ingredients
    var length = this.state.ingredients.length
    this.setState({
      perishablesList: perishables,
      originalLength: length,
      ready: true
    })
    console.log("END of perishables didMount")
  }

  componentDidUpdate(){
    console.log("Perishable dictionary updated")
    console.log("# THIS.STATE.PERISHABLESLIST.LENGTH: " + this.state.perishablesList.length)
// Triggers function that sends ranked dictionary to < AlterKeywords />:
    // if(this.state.finished === false && this.state.error === false && this.state.triggerSendBack === false){
    //   this.setState({
    //     triggerSendBack: true,
    //   })
    // }
    // if(this.state.triggerSendBack){
    //   this.sendIngredientsDict()
    // }

    // if(this.state.finished === true && this.state.error === false){
    if(this.state.finished === true && this.state.notFound === false){
      this.sendPerishablesKeywords()
    }
    if(this.state.ready){
      this.findMostPerishableKeywords()
        // this.setState({
        //   // fivePerishables: ["fruit and veg", "cheese", "meat", "fish", "the rest",],
        //   finished: true,
        //   ready: false
        // })
    }
  }

  componentWillUnmount(){
    console.log("Perishable dictionary unmounted")
  }

  findMostPerishableKeywords(){
    var i
    var j
    var length = this.state.ingredients.length
    var p_length = this.state.perishablesList.length - 1
    var ingredients = this.state.ingredients
    var searching = true
    var not_found = false

    while(searching){

       for(j=0;j<p_length;j++){                 // Outer loop iterates through rankedIngredients from bottom (lowest rank) to top.

            if(searching){
                var inner = true
            }else{
                break;
            }

            var perishable_ingredient = this.state.perishablesList[j]
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~# Looking for: " + perishable_ingredient)

            while(inner){

                  for(i=0;i<length;i++){                // Inner loop iterates through user's ingredients, looking for a match with current
                                                        //   ranked ingredient (from above loop).
                      var my_ingredient = ingredients[i]
                      // console.log("A2")

                      if(my_ingredient === perishable_ingredient){
                            // console.log("A3")
                            ingredients.splice(i,1)
                            var new_keywords = this.state.fivePerishables
                            new_keywords.push(my_ingredient)
                            this.setState({
                              fivePerishables: new_keywords,
                              ready: false
                            })
                            if(new_keywords.length === 5 || new_keywords.length === this.state.originalLength){
                                  console.log("Length is short enough!!!!!")
                                  searching = false
                                  inner = false
                                  // this.setState({
                                  //   finished: true,
                                  //   ready: false
                                  // })
                                  break;
                            }
                            console.log("*******found match*********: " + my_ingredient)
                            console.log("*******found most perishable********: " + perishable_ingredient)

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
       console.log("ERROR: Couldn't find user's ingredients in perishables list")
       this.setState({
          ready: false,
          notFound: true,
          finished: true
        })
        // console.log("/////////////////////")
      }else{
        console.log("Found five most perishable")
        this.setState({
          passBack: true,
          finished: true
        })
       }
  }

// Function that sends rankedIngredients back to < AlterKeywords />:
  sendPerishablesKeywords(){
    // console.log("R2")
    var new_perishable_keywords = this.state.fivePerishables
    console.log("five perishable keywords:")
    var perishable
    for(perishable in new_perishable_keywords){
      console.log(new_perishable_keywords[perishable])
    }
    this.props.perishableIngs(new_perishable_keywords)
    // var ranked_dictionary = this.state.rankedIngredients
    // var rank = this.state.rank
    // var backend_ranks = this.state.backendRanks
    // console.log("ranked ingredients.length: " + ranked_dictionary.length )
    // console.log("this.state.rankedIngredients[0].name: " + this.state.rankedIngredients[0].name)
    // this.props.rankedIngs(backend_ranks,ranked_dictionary,rank)
    this.setState({
      finished: false,
      // triggerSendBack: false
    })
    console.log("R23")
  }


 render(){
   console.log("Perishable dictionary rendered")
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
