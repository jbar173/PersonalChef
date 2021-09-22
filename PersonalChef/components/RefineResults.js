import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';



const RefineResults = props => {

  console.log("refining")

  var ten_pages = props.thisRoundResponseList
  console.log("TEN_PAGES.length: " + ten_pages.length)
  var top_length = ten_pages.length
  var relevant_recipes = []
  var max_ingredients = props.maxIngredients
  var not_enough_ingredients = false

  // filter out recipes which contain ingredients other than those that the user has:
  var user_ingredients = props.userIngredients
  var excess_ingredients = []
  var i
  var j

  for(i=0;i<top_length;i++){

      var page = ten_pages[i]
      var recipes = page['hits']
      var length = recipes.length
      console.log("length: " + length)

      for(j=0;j<length;j++){

       try{

            var recipe_ings = recipes[j]['recipe']['ingredients']
            console.log("Checking recipe: " + recipes[j]['recipe']['label'])

            var count = 0

            for(ing in recipe_ings){
                count += 1
                console.log("ingredient text: " + recipe_ings[ing]['text'])

                if( !(user_ingredients.includes(recipe_ings[ing]['text'])) ){
                  console.log("user doesn't have ' " + recipe_ings[ing]['text'] + " '." )
                  // excess_ingredients.push(recipe_ings[ing]['text'])
                  break;
                }else if(count > user_ingredients.length){
                  console.log("user doesn't have enough ingredients")
                  break;
                }

                console.log("DIDN'T BREAK OUT OF FOR LOOP")
                console.log("ingredients match for: " + response_list[j]['recipe']['label'])
                var entry = []
                entry.push(recipes[j]['recipe']['label'])
                entry.push(recipes[j]['recipe']['url'])
                revelant_recipes.push(entry)
            }

        }catch(error){
            console.log(j + ": RefineResults error: " + error)
        }

      }

  }


  props.filteredResults(relevant_recipes)

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
