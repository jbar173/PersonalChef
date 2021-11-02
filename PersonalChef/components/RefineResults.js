import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import * as data from './keywordExceptions.json';
import { FindIngredient, FindExceptions } from './regexFunctions.js';



const RefineResults = props => {

  console.log("Refine Results function starting")

  var ten_pages = props.thisRoundResponseList
  console.log("TEN_PAGES.length: " + ten_pages.length)
  var top_length = ten_pages.length

  for(x in ten_pages){
    console.log(x + ". " + ten_pages[x]["from"])
  }

  var user_ingredients = props.userIngredients
  var user_ings_length = props.maxIngredients
  var exceptions_key = data.key
  var exceptions = data.ingredients

  var relevant_recipes = []
  var almost_list = []
  var i
  var j
  var finished = false
  var recipes_on_page = []


// filter out recipes which contain ingredients other than those that the user has:

  for(i=0;i<top_length;i++){

      console.log("i: " + i)
      var page = ten_pages[i]
      var recipes = page['hits']

      var length = recipes.length
      console.log("length: " + length)

      for(j=0;j<length;j++){

             var not_finished = true
             console.log("****Checking recipe: " + recipes[j]['recipe']['label'])
             var recipe_name = recipes[j]['recipe']['label']
             recipes_on_page.push(recipe_name)
             var recipe_ings = recipes[j]['recipe']['ingredients']
             var recipe_ings_length = recipe_ings.length
             var length_int = parseInt(recipe_ings_length)
             var last_index = length_int - 1

             var less = false
             var same = false
             var one_over = false
             var more = false

             if(recipe_ings_length < user_ings_length){
               less = true
             }else if(recipe_ings_length === user_ings_length){
               same = true
             }else if(recipe_ings_length === user_ings_length+1){
               one_over = true
             }else{
               more = true
               console.log("Recipe has too many ingredients")
               console.log("Number of recipe ingredients: " + recipe_ings_length)
               console.log("I have " + user_ings_length + " ingredients")
             }

             var break_out = false

             if(less){

                   try{

                           var match_count = 0
                           var x
                           var y
                           var not_found = []
                           var outer_ind = -1

                           for(x in recipe_ings){

                                 outer_ind += 1
                                 var final_index = false
                                 if(outer_ind === recipe_ings_length - 1){
                                   final_index = true
                                 }
                                 var index = -1
                                 var ingredient_lower = recipe_ings[x]['text'].toLowerCase()
                                 var false_count = 0

                                 if(break_out){
                                    break;
                                 }

                                 for(y in user_ingredients){

                                       index += 1
                                       var match = false
                                       var found_random = false
                                       var last_index = user_ingredients.length - 1

                                       var include_words = [ user_ingredients[y], ]
                                       var is_key = false
                                       var p
                                       var q

                                       for(p in exceptions){
                                           var name = exceptions[p]['name']
                                           if(name === user_ingredients[y]){
                                               is_key = true
                                               var include = exceptions[p]['include']
                                               for(q in include){
                                                   var word = include[q]['word']
                                                   include_words.push(word)
                                               }
                                           }
                                       }

                                       var extra_check = false
                                       if(extra_check === false){
                                           var ingredient = user_ingredients[y]
                                       }

                                       // console.log("LOOKING FOR RECIPE ING: " + ingredient_lower + " in USER ING: " + user_ingredients[y])
                                       var find = FindIngredient(include_words,ingredient_lower)
                                       var result = find[0]
                                       var original_was_found = find[1]
                                       var all_ingredients_found = find[2]
                                       // console.log("############### RESULT: " + result)

                                       if(result){      // Found recipe_ingredient in this user_ingredient, check for exceptions:
                                           console.log("RESULT!! (less)")
                                           console.log("Found: " )
                                           for(word in all_ingredients_found){
                                               console.log(all_ingredients_found[word])
                                           }
                                           console.log("Looking for keyword exceptions")
                                           if(is_key){
                                               var exception_check = FindExceptions(all_ingredients_found,ingredient_lower,recipe_name,'both')
                                               var found = exception_check[0]
                                               console.log("EXCEPTION FOUND? " + found)
                                               var ingredients_with_exceptions = exception_check[1]
                                               var found_random = exception_check[2]
                                               if(found){ // Ingredient found was not the user's ingredient (keyword exception found)
                                                    console.log( "NO MATCH FOR " + ingredient_lower )
                                                    console.log( "keyword exception(s) found for" )
                                                    for(word in ingredients_with_exceptions){
                                                        console.log(ingredients_with_exceptions[word])
                                                    }
                                                    result = false // Change result to false, trigger false_count + 1 below
                                                }else if(found_random){
                                                  // Found exception in recipe title/label - recipe is a no-match
                                                    match = false
                                                    break_out = true
                                                    break;
                                                }else{
                                                   match = true
                                                }
                                           }else{
                                               var exception_check = FindExceptions(all_ingredients_found,ingredient_lower,recipe_name,'random')
                                               var found_random = exception_check
                                               if(found_random){
                                                 // Found exception in recipe title/label - recipe is a no-match
                                                   match = false
                                                   break_out = true
                                                   break;
                                               }else{
                                                  match = true
                                               }
                                           }
                                        }

                                        if(result === false){ // Didn't find recipe_ingredient in this user_ingredient
                                            false_count += 1
                                        }

                                        if(false_count === user_ings_length){ // Couldn't find this recipe_ingredient in any of the user's ingredients
                                            not_found.push(ingredient_lower) // Recipe ingredient is added to not_found list.
                                            console.log("user doesn't have: " + ingredient_lower)
                                            // match = false (already false)
                                            // break_out = true
                                            // break;
                                        }

                                        if(match){
                                               match_count += 1
                                               if(match_count === recipe_ings_length){ // Found all of the recipe's ingredients within the user's ingredients, add recipe to relevant list.
                                                    console.log("MATCH FOUND!")
                                                    console.log("for: " + recipes[j]['recipe']['label'])
                                                    console.log("in less = true")
                                                    var entry = []
                                                    entry.push(recipes[j]['recipe']['label'])
                                                    entry.push(recipes[j]['recipe']['url'])
                                                    relevant_recipes.push(entry)
                                                    break_out = true
                                                    break;
                                               }else if(not_found.length === 1 && final_index){ // User has all the recipe's ingredients except 1, recipe added to almosts list.
                                                    // Add to almosts:
                                                    console.log("LESS: Pushing to almosts 1")
                                                    var entry = []
                                                    entry.push(recipes[j]['recipe']['label'])
                                                    entry.push(recipes[j]['recipe']['url'])
                                                    entry.push(not_found[0])
                                                    almost_list.push(entry)
                                                    break_out = true // Both loops broken out of, move on to next recipe
                                                    break;
                                               }else if(not_found.length > 1){ // User is missing more than 1 ingredient, recipe isn't relevant for user
                                                    console.log("NO MATCH")
                                                    console.log("with: " + recipes[j]['recipe']['label'])
                                                    console.log("in less = true")
                                                    break_out = true  // Both loops broken out of, move on to next recipe
                                                    break;
                                               }else{
                                                    console.log("Match FINAL condition 1") // This recipe_ingredient has been found in user's ingredients, however still more recipe_ingredients to search for.
                                                    break; // move onto next recipe_ingredient.
                                               }
                                         }else if(match === false && index === last_index){  // match is still false (the recipe_ingredient doesn't match with any of the user's ingredients)
                                               if(not_found.length > 1){  // If checking last ingredient in recipe, and user is missing more than one ingredient
                                                    console.log("**NO MATCH")
                                                    console.log("with: " + recipes[j]['recipe']['label'])
                                                    console.log("in less = true")
                                                    break_out = true  // User is missing more than one ingredient in the recipe, break out of both loops, go to next recipe
                                                    break;
                                               }else if(final_index && not_found.length === 1){ // If checking last ingredient in recipe, and user is only missing one ingredient
                                                    // add to almosts:
                                                    console.log("LESS: Pushing to almosts 2")
                                                    var entry = []
                                                    entry.push(recipes[j]['recipe']['label'])
                                                    entry.push(recipes[j]['recipe']['url'])
                                                    entry.push(not_found[0])
                                                    almost_list.push(entry)
                                                    break_out = true  // Both loops broken out of, move on to next recipe
                                                    break;
                                               }
                                         }else{   // match is still false but not yet finished checking all of the user's ingredients for the recipe ingredient (no need to break inner loop)
                                               // console.log("No Match FINAL condition 2")
                                         }

                                      }

                                }




                      }catch(error){

                            console.log(recipes[j]['label'] + ":(LESS) RefineResults error: " + error)

                      }

               }



              var done = false

              if(same){

                      try{

                            var count = -1
                            var ing
                            var ingred
                            var ingredient_count = 0
                            var not_found = []

                            for(ingred in recipe_ings){

                                    count += 1
                                    var last_index = false
                                    if(count === (recipe_ings_length - 1)){
                                        last_index = true
                                    }

                                    var count_two = -1
                                    var ingredient_lower = recipe_ings[ingred]['text'].toLowerCase()
                                    var false_count = 0

                                    if(done){
                                        console.log("Done!")
                                        break;
                                    }


                                    for(ing in user_ingredients){

                                            count_two += 1
                                            var last_index_two = false
                                            if(count_two === (user_ings_length - 1)){
                                                last_index_two = true
                                            }
                                            var match = false
                                            var found_random = false

                                            var include_words = [ user_ingredients[ing], ]
                                            var is_key = false
                                            var p
                                            var q

                                            for(p in exceptions){
                                                var name = exceptions[p]['name']
                                                if(name === user_ingredients[ing]){
                                                    is_key = true
                                                    var include = exceptions[p]['include']
                                                    for(q in include){
                                                        var word = include[q]['word']
                                                        include_words.push(word)
                                                    }
                                                }
                                            }

                                            var find = FindIngredient(include_words,ingredient_lower)
                                            var result = find[0]
                                            var original_was_found = find[1]
                                            var all_ingredients_found = find[2]
                                            // console.log("############### RESULT: " + result)

                                            if(result){
                                                console.log("RESULT!! (same)")
                                                console.log("Found: " )
                                                for(word in all_ingredients_found){
                                                    console.log(all_ingredients_found[word])
                                                }
                                                console.log("Looking for keyword exceptions")
                                                if(is_key){
                                                     var exception_check = FindExceptions(all_ingredients_found,ingredient_lower,recipe_name,'both')
                                                     var found = exception_check[0]
                                                     console.log("EXCEPTION FOUND? " + found)
                                                     var ingredients_with_exceptions = exception_check[1]
                                                     var found_random = exception_check[2]

                                                     if(found){
                                                          console.log( "NO MATCH FOR " + ingredient_lower )
                                                          console.log( "keyword exception(s) found for" )
                                                          for(word in ingredients_with_exceptions){
                                                              console.log(ingredients_with_exceptions[word])
                                                          }
                                                          result = false
                                                      }else if(found_random){
                                                        // Found exception in recipe title/label - recipe is a no-match
                                                          match = false
                                                          done = true
                                                          break;
                                                      }else{
                                                         match = true
                                                      }
                                                 }else{
                                                   var exception_check = FindExceptions(all_ingredients_found,ingredient_lower,recipe_name,'random')
                                                   var found_random = exception_check
                                                   if(found_random){
                                                     // Found exception in recipe title/label - recipe is a no-match
                                                       match = false
                                                       done = true
                                                       break;
                                                   }else{
                                                      match = true
                                                   }
                                                 }
                                            }

                                            if(result === false){
                                                  false_count += 1
                                            }
                                            if(result === false && false_count === user_ings_length ){
                                                  not_found.push(ingredient_lower)
                                                  console.log("user doesn't have: " + ingredient_lower)

                                            }


                                            if(match){
                                                  console.log("***USER HAS ' " + ingredient_lower + " '." )
                                                  ingredient_count += 1
                                                  if(ingredient_count === user_ings_length){ // User has all ingredients in the recipe, recipe is added to relevant_recipes
                                                        console.log("INGREDIENTS MATCH for: " + recipes[j]['recipe']['label'])
                                                        console.log("in less = false")
                                                        var entry = []
                                                        entry.push(recipes[j]['recipe']['label'])
                                                        entry.push(recipes[j]['recipe']['url'])
                                                        relevant_recipes.push(entry)
                                                        done = true  // Both loops broken out of, move on to next recipe
                                                        break;
                                                  }else if(last_index && not_found.length === 1){ // User has all ingredients except 1, recipe added to almosts
                                                        // Add to almosts:
                                                        var entry = []
                                                        entry.push(recipes[j]['recipe']['label'])
                                                        entry.push(recipes[j]['recipe']['url'])
                                                        entry.push(not_found[0])
                                                        almost_list.push(entry)
                                                        done = true // Both loops broken out of, move on to next recipe
                                                        break;
                                                  }else if(last_index && not_found.length > 1){ // User is missing more than 1 ingredient
                                                        console.log("NO MATCH")
                                                        console.log("with: " + recipes[j]['recipe']['label'])
                                                        console.log("in less = false")
                                                        done = true  // Both loops broken out of, move on to next recipe
                                                        break;
                                                  }
                                             }else if( match === false && last_index_two ) {
                                                  if(last_index && not_found.length > 1){  // If checking last ingredient in recipe, and user is missing more than one ingredient
                                                      console.log("**NO MATCH")
                                                      console.log("with: " + recipes[j]['recipe']['label'])
                                                      console.log("in less = false")
                                                      done = true  // User is missing more than one ingredient in the recipe, break out of both loops, go to next recipe
                                                      break;
                                                  }else if(last_index && not_found.length === 1){ // If checking last ingredient in recipe, and user is only missing one ingredient
                                                      // add to almosts:
                                                      var entry = []
                                                      entry.push(recipes[j]['recipe']['label'])
                                                      entry.push(recipes[j]['recipe']['url'])
                                                      entry.push(not_found[0])
                                                      almost_list.push(entry)
                                                      done = true  // Both loops broken out of, move on to next recipe
                                                      break;
                                                  }
                                             }

                                      }

                            }


                      }catch(error){
                            console.log(recipes[j]['label'] + ":(SAME) RefineResults error: " + error)
                      }

              }


      }

  }

  finished = true

  if(finished){
      console.log("------finished-----")
      for(x in recipes_on_page){
        console.log(x + ". " + recipes_on_page[x])
      }
      console.log("number of recipes that match: " + relevant_recipes.length)
      for(x in relevant_recipes){
          console.log("relevant_recipes[x]: " + relevant_recipes[x])
          console.log("~~")
      }
      for(x in almost_list){
          console.log("almost_list[x]: " + almost_list[x])
          console.log("~~")
      }
      for(x in ten_pages){
        console.log("COUNT!!!: " + ten_pages[x]["count"])
        console.log("from: " + ten_pages[x]["from"])
      }
      props.filteredResults(relevant_recipes,almost_list)
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
