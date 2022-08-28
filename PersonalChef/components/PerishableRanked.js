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
    if(this.state.finished === true && this.state.notFound === false){
      this.sendPerishablesKeywords()
    }
    if(this.state.ready){
      this.findMostPerishableKeywords()
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

       for(j=0;j<p_length;j++){                 // Outer loop iterates through perishable ingredients list.

            if(searching){
                var inner = true
            }else{
                break;
            }

            var perishable_ingredient = this.state.perishablesList[j]

            while(inner){

                  for(i=0;i<length;i++){                // Inner loop iterates through user's ingredients, looking for a match with current
                                                        //   perishable ingredient (from above loop).
                      var my_ingredient = ingredients[i]

                      if(my_ingredient === perishable_ingredient){
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
                                  break;
                            }
                            console.log("*******found match*********: " + my_ingredient)
                            console.log("*******found most perishable********: " + perishable_ingredient)

                      }else{
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
        console.log("A6")
        searching = false
     }

     if(not_found){
       console.log("ERROR: Couldn't find any of user's ingredients in perishables list") /////////////// CATCH THIS
       this.setState({
          ready: false,
          notFound: true,
          finished: true
        })
      }else{
        console.log("Found five most perishable")
        this.setState({
          finished: true
        })
       }
  }

// Function that sends the user's most perishable 5 ingredients back to < AlterKeywords />:
  sendPerishablesKeywords(){
    var new_perishable_keywords = this.state.fivePerishables
    console.log("five perishable keywords:")
    var perishable
    for(perishable in new_perishable_keywords){
      console.log(new_perishable_keywords[perishable])
    }
    this.props.perishableIngs(new_perishable_keywords)
    this.setState({
      finished: false
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
