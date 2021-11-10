import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import * as data from './keywordExceptions.json';
import { FindIngredient, FindExceptions, CheckRecipeIngredientLength } from './regexFunctions.js';



const RefineResults = props => {

  console.log("Refine Results function starting")

  var ten_pages = props.thisRoundResponseList
  console.log("TEN_PAGES.length: " + ten_pages.length)
  var top_length = ten_pages.length

  var x
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
  var substitutes_dict = {}
  var contains_one_over = false


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
             var recipe_url = recipes[j]['recipe']['url']
             recipes_on_page.push(recipe_name)
             var recipe_ings = recipes[j]['recipe']['ingredients']

             var less = false
             var same = false
             var one_over = false

             var exception_count = CheckRecipeIngredientLength(recipe_ings)
             var checked_ingredients = exception_count[1]
             var checked_length = checked_ingredients.length
             var length_int = parseInt(checked_length)
             var last_index = length_int - 1
             var plus_one = user_ings_length + 1

             if(checked_length < user_ings_length){
               less = true
             }else if(checked_length === user_ings_length){
               same = true
             }else if(checked_length === plus_one){
               one_over = true
             }else{
               console.log("Recipe has too many ingredients")
               console.log("Number of recipe ingredients: " + checked_length)
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

                           for(x in checked_ingredients){

                                 outer_ind += 1
                                 var final_index = false
                                 if(outer_ind === checked_length - 1){
                                   final_index = true
                                 }
                                 var index = -1
                                 var ingredient_lower = checked_ingredients[x]
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
                                       var substitute_made = false
                                       if(result && original_was_found === false){
                                          substitute_made = true
                                       }

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
                                                    substitute_made = false
                                                    result = false // Change result to false, trigger false_count + 1 below
                                                }else if(found_random){
                                                  // Found exception in recipe title/label - recipe is a no-match
                                                    substitute_made = false
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
                                                   substitute_made = false
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
                                            console.log("not_found.length (less): " + not_found.length)
                                            if(not_found.length > 1){
                                                console.log("*NO MATCH*")
                                                console.log("with: " + recipes[j]['recipe']['label'])
                                                console.log("in less = false")
                                                break_out = true  // Both loops broken out of, move on to next recipe
                                                break;
                                            }
                                        }

                                        if(match){
                                               match_count += 1
                                               if(substitute_made){
                                                 console.log("ADDING " + recipe_url + ", VALUE: recipe ingredient = " + ingredient_lower + ", user ingredient: " + user_ingredients[y] + ", can be used as substitute. Found: "  + all_ingredients_found[0] + " in its include list");
                                                 substitutes_dict[recipe_url] = [ingredient_lower, user_ingredients[y], all_ingredients_found[0]]
                                               }
                                               if(match_count === checked_length){ // Found all of the recipe's ingredients within the user's ingredients, add recipe to relevant list.
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
                                                    console.log("ALMOST MATCH (less)!")
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
                                                    console.log("ALMOST MATCH! (less)")
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
                            var x
                            var ingredient_count = 0
                            var not_found = []

                            for(x in checked_ingredients){

                                    count += 1
                                    var last_index = false
                                    if(count === (checked_length - 1)){
                                        last_index = true
                                    }

                                    var count_two = -1
                                    var ingredient_lower = checked_ingredients[x]
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
                                            var substitute_made = false
                                            if(result && original_was_found === false){
                                               substitute_made = true
                                            }
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
                                                          substitute_made = false
                                                          result = false
                                                      }else if(found_random){
                                                        // Found exception in recipe title/label - recipe is a no-match
                                                          substitute_made = false
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
                                                       substitute_made = false
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
                                                  console.log("not_found.length (same): " + not_found.length)
                                                  if(not_found.length > 1){
                                                      console.log("*NO MATCH*")
                                                      console.log("with: " + recipes[j]['recipe']['label'])
                                                      console.log("in less = false")
                                                      done = true  // Both loops broken out of, move on to next recipe
                                                      break;
                                                  }
                                            }


                                            if(match){
                                                  console.log("***USER HAS ' " + ingredient_lower + " '." )
                                                  ingredient_count += 1
                                                  if(substitute_made){
                                                    console.log("ADDING " + recipe_url + ", VALUE: recipe ingredient = " + ingredient_lower + ", user ingredient: " + user_ingredients[ing] + ", can be used as substitute. Found: "  + all_ingredients_found[0] + " in its include list")
                                                    substitutes_dict[recipe_url] = [ingredient_lower, user_ingredients[ing], all_ingredients_found[0]]
                                                  }
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


              var next_recipe = false

              if(one_over){

                      contains_one_over = true

                      try{

                            var count = -1
                            var ing
                            var x
                            var ingredient_count = 0

                            for(ing in user_ingredients){

                                    count += 1
                                    var last_index = false
                                    if(count === (user_ings_length-1)){
                                        last_index = true
                                    }

                                    var count_two = -1

                                    if(next_recipe){
                                        console.log("Finished")
                                        break;
                                    }
                                    var false_count = 0

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

                                    for(x in checked_ingredients){

                                            var ingredient_lower = checked_ingredients[x]
                                            count_two += 1
                                            var last_index_two = false
                                            if(count_two === (checked_length - 1)){
                                                last_index_two = true
                                            }
                                            var match = false
                                            var found_random = false

                                            var find = FindIngredient(include_words,ingredient_lower)
                                            var result = find[0]
                                            var original_was_found = find[1]
                                            var all_ingredients_found = find[2]
                                            var substitute_made = false
                                            if(result && original_was_found === false){
                                               substitute_made = true
                                            }

                                            if(result){
                                                console.log("RESULT!! (one over)")
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
                                                          result = false
                                                          break;
                                                      }else{
                                                          match = true
                                                      }
                                                 }else{
                                                       var exception_check = FindExceptions(all_ingredients_found,ingredient_lower,recipe_name,'random')
                                                       var found_random = exception_check
                                                       if(found_random){
                                                         // Found exception in recipe title/label - recipe is a no-match
                                                           result = false
                                                           break;
                                                       }else{
                                                           match = true
                                                       }
                                                 }
                                            }

                                            if(result === false){
                                                false_count += 1
                                                console.log("Checked ingredient: " + checked_ingredients[x] + " doesn't match: " + user_ingredients[ing])
                                                console.log("false count now: " + false_count)
                                                console.log("checked_length: " + checked_length)
                                                if(false_count === checked_length){
                                                    next_recipe = true // Both loops broken out of, move on to next recipe
                                                    console.log("Couldn't find " + user_ingredients[ing] + " in checked ingredients")
                                                    console.log("NO MATCH (in one_over)")
                                                    break;
                                                }
                                            }

                                            if(match){
                                                  console.log("***USER HAS ' " + ingredient_lower + " '." )
                                                  ingredient_count += 1
                                                  if(substitute_made){
                                                    console.log("ADDING " + recipe_url + ", VALUE: recipe ingredient = " + ingredient_lower + ", user ingredient: " + user_ingredients[ing] + ", can be used as substitute. Found: "  + all_ingredients_found[0] + " in its include list")
                                                    substitutes_dict[recipe_url] = [ingredient_lower, user_ingredients[ing], all_ingredients_found[0]]
                                                  }
                                                  if(ingredient_count === user_ings_length){ // User has all ingredients in the recipe, recipe is added to relevant_recipes
                                                        console.log("INGREDIENTS MATCH for: " + recipes[j]['recipe']['label'])
                                                        console.log("in one_over")
                                                        // Add to almosts:
                                                        var entry = []
                                                        entry.push(recipes[j]['recipe']['label'])
                                                        entry.push(recipes[j]['recipe']['url'])
                                                        entry.push(not_found[0])
                                                        almost_list.push(entry)
                                                        next_recipe = true // Both loops broken out of, move on to next recipe
                                                        break;
                                                  }
                                                  break;
                                            }

                                      }

                           }


                      }catch(error){
                            console.log(recipes[j]['label'] + ":(ONE OVER) RefineResults error: " + error)
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
      if(contains_one_over){
        console.log("~~~~~CONTAINS ONE OVER")
      }
      props.filteredResults(relevant_recipes,almost_list,substitutes_dict)
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
