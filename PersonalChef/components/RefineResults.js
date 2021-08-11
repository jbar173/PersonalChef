import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';



const RefineResults = props => {

  console.log("refining")

  var response_list = props.thisRoundResponseList
  var length = response_list.length
  var filtered_results = []
  console.log("response_list.length: " + response_list.length)

 // filter out dishes that take too long to make:
  var max_time = props.maxTime
  var i
  for(i=0;i<length;i++){
    try{
      var recipe_time = response_list[i]['recipe']['totalTime']
      if(recipe_time > max_time || recipe_time == '0'){
          response_list.splice(i,1);
          length = response_list.length
          i--;
          console.log("not enough time")
        }
    }catch(error){
        console.log(i + ": times error: " + error);
        response_list.splice(i,1)
    }
  }

  // filter out recipes which contain more ingredients than user has:

    // var length = response_list.length
    // var max_ingredients = props.maxIngredients
    // var j
    // for(j=0;j<length;j++){
    //   try{
    //       var recipe_ings = response_list[j]['recipe']['ingredients']
    //       var ingredient_list_length = recipe_ings.length
    //       if(ingredient_list_length > max_ingredients){
    //         response_list.splice(j,1)
    //         length = response_list.length
    //         j--;
    //         console.log("not enough ingredients")
    //       }
    //   }catch(error){
    //       console.log(j + ": ingredient count error: " + error)
    //       response_list.splice(j,1)
    //   }
    // }
    //
    // console.log("*** response_list.length: " + response_list.length)



  // filter out recipes which contain ingredients other than those that the user has:
    var length = response_list.length
    var user_ingredients = props.userIngredients
    var excess_ingredients = []
    var j
    for(j=0;j<length;j++){
      try{
          var recipe_ings = response_list[j]['recipe']['ingredients']
          // apply code from python file to strip measurements/quantities/punctuation from each ingredient
          for(ing in recipe_ings){
            if( !(user_ingredients.includes(recipe_ings[ing])) ){
              excess_ingredients.push(recipes_ings[ing])
              break;
            }
          }
      }catch(error){
          console.log(j + ": ingredient count error: " + error)
          // response_list.splice(j,1)
      }
      if(excess_ingredients.length > 0)
        response_list.splice(j,1)
        console.log("Excess ingredient: " + excess_ingredients[0])
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
