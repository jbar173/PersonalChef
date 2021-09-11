import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';



const RefineResults = props => {

  console.log("refining")

  var response_list = props.thisRoundResponseList
  var length = response_list.length
  console.log("response_list.length: " + response_list.length)


  // filter out recipes which contain ingredients other than those that the user has:
  var user_ingredients = props.userIngredients
  var excess_ingredients = []
  var j
  for(j=0;j<length;j++){
    try{
        var recipe_ings = response_list[j]['recipe']['ingredients']
        console.log("recipe: " + response_list[j]['recipe']['label'])
        // apply code from python file to strip measurements/quantities/punctuation from each ingredient
        for(ing in recipe_ings){
          console.log("ingredient text: " + recipe_ings[ing]['text'])
          if( !(user_ingredients.includes(recipe_ings[ing]['text'])) ){
            excess_ingredients.push(recipe_ings[ing]['text'])
            break;
          }
        }
    }catch(error){
        console.log(j + ": ingredient count error: " + error)
        // response_list.splice(j,1)
    }
    if(excess_ingredients.length > 0){
      console.log("No ingredient match: " + response_list[j]['recipe']['label'])
      response_list.splice(j,1)
      j -= 1
      length -= 1
      console.log("Excess ingredient: " + excess_ingredients[0])
      excess_ingredients = []
    }else{
      console.log("ingredients match for: " + response_list[j]['recipe']['label'])
    }
  }



  props.filteredResults(response_list)

  return(
          <View>
              <Text></Text>
          </View>
        );

};



const styles = StyleSheet.create({
  greenButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'white',
    backgroundColor:'lightgreen',
  },
  mainTitle: {
    fontSize:28,
    marginBottom:20
  },
});


export { RefineResults };
