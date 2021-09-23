import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';



const RefineResults = props => {

  console.log("refining")

  var ten_pages = props.thisRoundResponseList
  console.log("TEN_PAGES.length: " + ten_pages.length)
  var top_length = ten_pages.length
  // if(ten_pages[0]["from"] === undefined){
  //   console.log("just ['from']. !!! " + ten_pages["from"])
  // }
  for(x in ten_pages){
    console.log(x + ". " + ten_pages[x]["from"])
  }

  // filter out recipes which contain ingredients other than those that the user has,
  //   or recipes that contain more ingredients thanm the user has:
  var user_ingredients = props.userIngredients
  var max_ingredients = props.maxIngredients
  var relevant_recipes = []
  var i
  var j
  var finished = false

  for(i=0;i<top_length;i++){
      console.log("i: " + i)
      var page = ten_pages[i]
      var recipes = page['hits']
      var length = recipes.length
      console.log("length: " + length)
      var break_out = false

      for(j=0;j<length;j++){
         if(break_out){
           break;
         }
         var not_finished = true
         try{
              if(not_finished){
                    var enough = true
                    var done = false
                    var recipe_ings = recipes[j]['recipe']['ingredients']
                    console.log("****Checking recipe: " + recipes[j]['recipe']['label'])

                    var ingreds_length = recipe_ings.length

                    // Breaks loop and skips the recipe if it contains more ingredients than the user has:
                    if(ingreds_length > user_ingredients.length){
                      console.log("USER DOESN'T HAVE ENOUGH INGREDIENTS")
                      var enough = false
                      if(j === (length-1)){
                        break_out = true
                        break;
                      }
                    }

                    // Compares if recipe has less ingredients than user:
                    if(ingreds_length < user_ingredients.length){
                      var count = 0
                      for(x in recipe_ings){
                        for(y in user_ingredients){
                          if(recipe_ings[x]['text'].includes(user_ingredients[y])){
                            console.log("got")
                            count += 1
                          }
                        }
                      }
                      if(count === ingreds_length){
                        console.log("RECIPE MATCH! for: " + recipes[j]['recipe']['label'])a
                        var entry = []
                        entry.push(recipes[j]['recipe']['label'])
                        entry.push(recipes[j]['recipe']['url'])
                        revelant_recipes.push(entry)
                        break_out = true
                        break;
                      }else{
                        console.log("NO MATCH")
                        break_out = true
                        break;
                      }
                    }

                    // Compares if user has exactly the same number of ingredients as the recipe:
                    if(enough){

                        var match = false
                        var count = -1

                        for(ing in user_ingredients){
                            count += 1
                            var last_index = false
                            if(count === (user_ingredients.length - 1)){
                              last_index = true
                            }

                            var count_two = -1

                            if(done){
                              console.log("Done!")
                              // console.log("not_finished?: " + not_finished)
                              // console.log("enough?: " + enough)
                              // console.log("match?: " + match)
                              break;
                            }

                            for(ingred in recipe_ings){
                                count_two += 1
                                var last_index_two = false
                                if(count_two === (recipe_ings.length - 1)){
                                  last_index_two = true
                                }

                                if( recipe_ings[ingred]['text'].includes(user_ingredients[ing]) && last_index ){
                                  console.log("***USER HAS ' " + recipe_ings[ingred]['text'] + " '." )
                                  // console.log("USER_ING: " + user_ingredients[ing])
                                  // console.log("RECIPE_INGRED: " + recipe_ings[ingred]['text'])
                                  match = true
                                }else if( recipe_ings[ingred]['text'].includes(user_ingredients[ing]) && !(last_index) ){
                                  console.log("***USER HAS ' " + recipe_ings[ingred]['text'] + " '." )
                                  // console.log("USER_ING: " + user_ingredients[ing])
                                  // console.log("RECIPE_INGRED: " + recipe_ings[ingred]['text'])
                                  break;
                                }else if( last_index_two ) {
                                  console.log("COULDN'T FIND USER INGREDIENT: " + user_ingredients[ing] + " IN RECIPE.")
                                  console.log("WHEN CHECKING FINAL RECIPE_INGRED: " + recipe_ings[ingred]['text'])
                                  done = true
                                  not_finished = false
                                  enough = false
                                  match = false
                                  break;
                                }else{
                                  // console.log("checking")
                                  // console.log("user's: " + user_ingredients[ing])
                                  // console.log("recipe's: " + recipe_ings[ingred]['text'])
                                }

                                if(match){
                                  // console.log("DIDN'T BREAK OUT OF FOR LOOP")
                                  console.log("!!!!!! INGREDIENTS MATCH for: " + recipes[j]['recipe']['label'])
                                  var entry = []
                                  entry.push(recipes[j]['recipe']['label'])
                                  entry.push(recipes[j]['recipe']['url'])
                                  revelant_recipes.push(entry)
                                }

                              }

                          }
                          enough = false
                      }
                }

          }catch(error){
              console.log(j + ": RefineResults error: " + error)
          }
          not_finished = false
      }

  }

  finished = true

  if(finished){
    console.log("------finishhhhhed-----")
    console.log("number of recipes that match: " + relevant_recipes.length)
    props.filteredResults(relevant_recipes)
  }

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
