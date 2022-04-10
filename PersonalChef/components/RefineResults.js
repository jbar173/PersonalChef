import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { FindIngredient, FindExceptions, CheckRecipeIngredientLength } from './regexFunctions.js';

import * as kw_a from './KeywordExceptions/a.json';
import * as kw_b from './KeywordExceptions/b.json';
import * as kw_c from './KeywordExceptions/c.json';
import * as kw_d from './KeywordExceptions/d.json';
import * as kw_e from './KeywordExceptions/e.json';
import * as kw_f from './KeywordExceptions/f.json';
import * as kw_g from './KeywordExceptions/g.json';
import * as kw_h from './KeywordExceptions/h.json';
import * as kw_i from './KeywordExceptions/i.json';
import * as kw_j from './KeywordExceptions/j.json';
import * as kw_k from './KeywordExceptions/k.json';
import * as kw_l from './KeywordExceptions/l.json';
import * as kw_m from './KeywordExceptions/m.json';
import * as kw_n from './KeywordExceptions/n.json';
import * as kw_o from './KeywordExceptions/o.json';
import * as kw_p from './KeywordExceptions/p.json';
import * as kw_q from './KeywordExceptions/q.json';
import * as kw_r from './KeywordExceptions/r.json';
import * as kw_s from './KeywordExceptions/s.json';
import * as kw_t from './KeywordExceptions/t.json';
import * as kw_u from './KeywordExceptions/u.json';
import * as kw_v from './KeywordExceptions/v.json';
import * as kw_w from './KeywordExceptions/w.json';
import * as kw_x from './KeywordExceptions/x.json';
import * as kw_y from './KeywordExceptions/y.json';
import * as kw_z from './KeywordExceptions/z.json';





const keys = { "a": kw_a.ingredients,"b": kw_b.ingredients,'c': kw_c.ingredients,"d": kw_d.ingredients,"e": kw_e.ingredients,"f": kw_f.ingredients,"g": kw_g.ingredients,
               "h": kw_h.ingredients,"i": kw_i.ingredients,"j": kw_j.ingredients,"k": kw_k.ingredients,"l": kw_l.ingredients,"m": kw_m.ingredients,"n": kw_n.ingredients,
               "o": kw_o.ingredients,"p": kw_p.ingredients,"q": kw_q.ingredients,"r": kw_r.ingredients,"s": kw_s.ingredients,"t": kw_t.ingredients,"u": kw_u.ingredients,
               "v": kw_v.ingredients,"w": kw_w.ingredients,"x": kw_x.ingredients,"y": kw_y.ingredients,"z": kw_z.ingredients, }


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

  var relevant_recipes = []
  var almost_list = []
  var i
  var j
  var recipes_on_page = []
  var substitutes_dict = {}
  var contains_one_over = false


// filter out recipes that contain two or more ingredients other than those that the user has:

  for(i=0;i<top_length;i++){

      console.log("i: " + i)
      var page = ten_pages[i]
      var recipes = page['hits']

      var length = recipes.length
      console.log("length: " + length)

      for(j=0;j<length;j++){

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

             if(checked_length < user_ings_length){          // Recipe contains fewer ingredients than the user's pantry.
               less = true
             }else if(checked_length === user_ings_length){  // Recipe contains equal amount of ingredients as the user's pantry.
               same = true
             }else if(checked_length === plus_one){          // Recipe contains one ingredient more than the user's pantry.
               one_over = true
             }else{
               console.log("Recipe has too many ingredients")
             }



             var break_out = false

             if(less){

                   try{

                           var match_count = 0
                           var x
                           var y
                           var not_found = []
                           var outer_ind = -1

                           // Looks up and collects all ingredients to check against recipe ingredient, including 'include' words for each 'include' in user's original ingredient:
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
                                 var top_layer_count = 0

                                 for(y in user_ingredients){

                                       index += 1
                                       var match = false
                                       top_layer_count += 1
                                       // var found_random = false
                                       var last_index = user_ingredients.length - 1

                                       var include_words = []
                                       var substitution_by_index = []
                                       var i
                                       for(i=0;i<user_ingredients.length;i++){
                                         substitution_by_index.push(false)
                                       }

                                       if(top_layer_count === 1){
                                         var orig
                                         for(orig in user_ingredients){
                                           include_words.push(user_ingredients[orig])
                                         }
                                       }
                                       var original_ingredient = user_ingredients[y]

                                       // var include_words = [ user_ingredients[y], ]
                                       // var original_ingredient = include_words[0]
                                       // var substitution_by_index = [false,]

                                       var p
                                       var q
                                       var s
                                       var t

                                   // Finds 'include' words for user's ingredient in keywordExceptions:
                                       var first_letter = user_ingredients[y][0]
                                       var exceptions = keys[`${first_letter}`]

                                       loopOne:
                                         for(p in exceptions){    // Finds first set of 'include' words
                                             var name = exceptions[p]['name']
                                             if(name === user_ingredients[y]){
                                                 var include = exceptions[p]['include']
                                                 for(q in include){
                                                     var word = include[q]['word']
                                                     var sub = include[q]['substitution']
                                                     if(sub === false){
                                                       include_words.splice(0,0,word)
                                                       substitution_by_index.splice(0,0,sub)
                                                     }else{
                                                       include_words.push(word)
                                                       substitution_by_index.push(sub)
                                                     }

                                                     var f_letter_word = word[0]      // Finds second set of 'include' words: (searches for word that was pushed above),
                                                     var word_exceptions = keys[`${f_letter_word}`] // if found, adds each of its own 'include' words to include_words,
                                                     loopTwo:                      //  directly underneath original word.
                                                       for(s in word_exceptions){
                                                         var name_two = word_exceptions[s]['name']
                                                         if(name_two === word){
                                                           // console.log("Found:" + name_two + " in kw-exceptions")
                                                           var include_two = word_exceptions[s]['include']
                                                           for(t in include_two){
                                                             var word_two = include_two[t]['word']
                                                             if(sub){
                                                               var sub_two = true
                                                             }else{
                                                               var sub_two = include_two[t]['substitution']
                                                             }
                                                             // console.log("New include_word: " + word_two)
                                                             // console.log("Substitution?: " + sub_two)
                                                             include_words.push(word_two)
                                                             substitution_by_index.push(sub_two)
                                                           }
                                                           break loopTwo;
                                                         }
                                                       }
                                                 }
                                                 break loopOne;
                                             }
                                         }

                                       var extra_check = false
                                       if(extra_check === false){
                                           var ingredient = user_ingredients[y]
                                       }

                                       // console.log("LOOKING FOR RECIPE ING: " + ingredient_lower + " in USER ING: " + user_ingredients[y])
                                       console.log("~~~~~~~~~~~~~~~~~~ INCLUDE words length: " + include_words.length)
                                       console.log("ingredient_lower: " + ingredient_lower)
                                       var find = FindIngredient(include_words,ingredient_lower)
                                       var result = find[0]
                                       var original_was_found = find[1]     // true or false
                                       var all_ingredients_found = find[2]
                                       console.log("~~~~~~~~~~~all_ingredients_found.length: " + all_ingredients_found.length)
                                       var substitute_made = false
                                       var is_sub = 2
                                       if(result && original_was_found === false){
                                          substitute_made = true
                                          var abc
                                          for(abc in include_words){
                                            if(include_words[abc] === all_ingredients_found[1]){
                                              is_sub = substitution_by_index[abc]
                                            }
                                          }
                                       }

                                       if(result){                            // Found recipe_ingredient in this user_ingredient, check for exceptions:
                                           console.log("RESULT!! (less)")
                                           console.log("Found: " )
                                           var word
                                           for(word in all_ingredients_found){
                                               console.log(all_ingredients_found[word])
                                           }
                                           console.log("Looking for keyword exceptions")
                                           console.log("##########~~~~~~~ original_ingredient: " + original_ingredient)

                                           var exception_check = FindExceptions(all_ingredients_found,ingredient_lower,recipe_name,original_ingredient)
                                           var found_random = exception_check[2]
                                           if(found_random){              // Found exception in recipe title/label - recipe is a no-match
                                               result = false
                                               break_out = true
                                               break;
                                           }
                                           var found = exception_check[0]
                                           console.log("EXCEPTION FOUND? " + found)
                                           var ingredients_with_exceptions = exception_check[1]

                                           if(found){                     // Ingredient found was not the user's ingredient (keyword exception found)
                                                console.log( "NO MATCH FOR " + ingredient_lower )
                                                console.log( "keyword exception(s) found for" )
                                                for(word in ingredients_with_exceptions){
                                                    console.log(ingredients_with_exceptions[word])
                                                }
                                                substitute_made = false
                                                result = false            // Change result to false, trigger false_count + 1 below

                                            }else if(found_random){       // Found exception in recipe title/label - recipe is a no-match
                                                substitute_made = false
                                                match = false
                                                break_out = true
                                                break;
                                            }else{
                                                match = true              // No exception was found for ingredient - ingredient was a match
                                            }
                                        }

                                        if(result === false){                 // Didn't find recipe_ingredient in this user_ingredient
                                            false_count += 1
                                        }

                                        if(false_count === user_ings_length){ // Couldn't find this recipe_ingredient in any of the user's ingredients
                                            not_found.push(ingredient_lower)  // Recipe ingredient is added to not_found list.
                                            console.log("user doesn't have: " + ingredient_lower)
                                            console.log("not_found.length (less): " + not_found.length)
                                            if(not_found.length > 1){         // User is missing more than one of the recipe's ingredients
                                                console.log("*NO MATCH*")
                                                console.log("with: " + recipes[j]['recipe']['label'])
                                                console.log("in less = false")
                                                break_out = true              // Both loops broken out of, move on to next recipe
                                                break;
                                            }
                                        }

                                        if(match){                            // Recipe ingredient has been found (without triggering an exclude exception) amongst user's ingredients.
                                               match_count += 1
                                               if(substitute_made){           // Add the subtitute ingredient which was made for the original ingredient, if include exception was triggered.
                                                     var entry
                                                     var found_key = false
                                                     var last = all_ingredients_found.length - 1
                                                     console.log("~~~~##### is_sub? " + is_sub +  " #####~~~~")
                                                     for(entry of Object.entries(substitutes_dict)){
                                                         console.log("~~~~~~ ENTRY[0]: " + entry[0])
                                                         if(entry[0] === recipe_url){
                                                             found_key = true
                                                             var existing_array = substitutes_dict[recipe_url]
                                                             console.log("1. existing_array.length: " + existing_array.length)
                                                             var length = existing_array.length
                                                             var new_value = [ingredient_lower, user_ingredients[y], all_ingredients_found[last], is_sub ]
                                                             existing_array.push(new_value)
                                                             console.log("2. existing_array.length: " + existing_array.length)
                                                             delete substitutes_dict[recipe_url]
                                                             substitutes_dict[recipe_url] = existing_array
                                                             break;
                                                         }
                                                     }
                                                     if(found_key === false){
                                                       // create key
                                                        substitutes_dict[recipe_url] = [ [ingredient_lower, user_ingredients[y], all_ingredients_found[last], is_sub ] ]
                                                     }
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
                                    var top_layer_count = 0

                                    for(ing in user_ingredients){

                                            count_two += 1
                                            top_layer_count += 1
                                            var last_index_two = false
                                            if(count_two === (user_ings_length - 1)){
                                                last_index_two = true
                                            }
                                            var match = false
                                            // var found_random = false

                                            var include_words = []
                                            var substitution_by_index = []
                                            var i
                                            for(i=0;i<user_ingredients.length;i++){
                                              substitution_by_index.push(false)
                                            }

                                            if(top_layer_count === 1){
                                              var orig
                                              for(orig in user_ingredients){
                                                include_words.push(user_ingredients[orig])
                                              }
                                            }
                                            var original_ingredient = user_ingredients[ing]

                                            // var include_words = [ user_ingredients[ing], ]
                                            // var original_ingredient = include_words[0]
                                            // var substitution_by_index = [false,]
                                            // var is_key = false
                                            var p
                                            var q

                                        // Finds 'include' words for user's ingredient in keywordExceptions:
                                            var first_letter = user_ingredients[ing][0]
                                            var exceptions = keys[`${first_letter}`]

                                            loopThree:
                                              for(p in exceptions){
                                                  var name = exceptions[p]['name']
                                                  if(name === user_ingredients[ing]){
                                                      // is_key = true
                                                      var include = exceptions[p]['include']
                                                      for(q in include){
                                                          var word = include[q]['word']
                                                          var sub = include[q]['substitution']
                                                          if(sub === false){
                                                            include_words.splice(0,0,word)
                                                            substitution_by_index.splice(0,0,sub)
                                                          }else{
                                                            include_words.push(word)
                                                            substitution_by_index.push(sub)
                                                          }

                                                          // console.log("####~~~#####~~~### START OF TEST ###~~~#####~~~~####")
                                                          // console.log("Original ingredient is: " + name)
                                                          // console.log("Testing word: " + word)
                                                          // console.log("Is substitution?: " + sub)
                                                          var f_letter_word = word[0]      // Finds second set of 'include' words: (searches for word that was pushed above),
                                                          var word_exceptions = keys[`${f_letter_word}`] // if found, adds each of its own 'include' words to include_words,
                                                          loopFour:                     //  directly underneath original word.
                                                            for(s in word_exceptions){
                                                              var name_two = word_exceptions[s]['name']
                                                              if(name_two === word){
                                                                // console.log("Found:" + name_two + " in kw-exceptions")
                                                                var include_two = word_exceptions[s]['include']
                                                                for(t in include_two){
                                                                  var word_two = include_two[t]['word']
                                                                  if(sub){
                                                                    var sub_two = true
                                                                  }else{
                                                                    var sub_two = include_two[t]['substitution']
                                                                  }
                                                                  // console.log("New include_word: " + word_two)
                                                                  // console.log("Substitution?: " + sub_two)
                                                                  include_words.push(word_two)
                                                                  substitution_by_index.push(sub_two)
                                                                }
                                                                break loopFour;
                                                              }
                                                            }
                                                      }
                                                    break loopThree;
                                                  }
                                              }                       //////////////////////////////////////////////     Repeat this loop (so that search is 2x deep)    ///////////////////////////////////

                                            var find = FindIngredient(include_words,ingredient_lower)
                                            var result = find[0]
                                            var original_was_found = find[1]
                                            var all_ingredients_found = find[2]
                                            var substitute_made = false
                                            if(result && original_was_found === false){
                                               substitute_made = true
                                            }

                                            if(result){
                                                console.log("RESULT!! (same)")
                                                console.log("Found: " )
                                                for(word in all_ingredients_found){
                                                    console.log(all_ingredients_found[word])
                                                }
                                                console.log("Looking for keyword exceptions")

                                                 var exception_check = FindExceptions(all_ingredients_found,ingredient_lower,recipe_name,original_ingredient)
                                                 var found_random = exception_check[2]
                                                 if(found_random){        // Found exception in recipe title/label - whole recipe is a no-match
                                                     result = false
                                                     done = true
                                                     break;
                                                 }
                                                 var found = exception_check[0]
                                                 console.log("EXCEPTION FOUND? " + found)
                                                 var ingredients_with_exceptions = exception_check[1]
                                                 // var found_random = exception_check[2]

                                                 if(found){
                                                      console.log( "NO MATCH FOR " + ingredient_lower )
                                                      console.log( "keyword exception(s) found for" )
                                                      for(word in ingredients_with_exceptions){
                                                          console.log(ingredients_with_exceptions[word])
                                                      }
                                                      result = false
                                                  }else{
                                                     match = true
                                                  }
                                            }

                                            if(result === false){
                                                  false_count += 1
                                            }

                                            if(result === false && false_count === user_ings_length ){
                                                  not_found.push(ingredient_lower)
                                                  console.log("user doesn't have: " + ingredient_lower)
                                                  console.log("not_found.length (same): " + not_found.length)
                                                  if(not_found.length > 1){    // User is missing more than one of the recipe's ingredients
                                                      console.log("*NO MATCH*")
                                                      console.log("with: " + recipes[j]['recipe']['label'])
                                                      console.log("in less = false")
                                                      done = true              // Both loops broken out of, move on to next recipe
                                                      break;
                                                  }
                                            }


                                            if(match){
                                                  console.log("***USER HAS ' " + ingredient_lower + " '." )
                                                  ingredient_count += 1
                                                  if(substitute_made){
                                                        var entry
                                                        var found_key = false
                                                        var last = all_ingredients_found.length - 1
                                                        for(entry of Object.entries(substitutes_dict)){
                                                            console.log("~~~~~~ ENTRY[0]: " + entry[0])
                                                            if(entry[0] === recipe_url){
                                                                found_key = true
                                                                var existing_array = substitutes_dict[recipe_url]
                                                                console.log("1. existing_array.length: " + existing_array.length)
                                                                var length = existing_array.length
                                                                var new_value = [ingredient_lower, user_ingredients[y], all_ingredients_found[last], "test"]
                                                                existing_array.push(new_value)
                                                                console.log("2. existing_array.length: " + existing_array.length)
                                                                delete substitutes_dict[recipe_url]
                                                                substitutes_dict[recipe_url] = existing_array
                                                                break;
                                                            }
                                                        }
                                                        if(found_key === false){
                                                          // create key
                                                           substitutes_dict[recipe_url] = [ [ingredient_lower, user_ingredients[y], all_ingredients_found[last], "test"], ]
                                                        }

                                                  }
                                                  if(ingredient_count === user_ings_length){      // User has all ingredients in the recipe, recipe is added to relevant_recipes
                                                        console.log("INGREDIENTS MATCH for: " + recipes[j]['recipe']['label'])
                                                        console.log("in less = false")
                                                        var entry = []
                                                        entry.push(recipes[j]['recipe']['label'])
                                                        entry.push(recipes[j]['recipe']['url'])
                                                        relevant_recipes.push(entry)
                                                        done = true            // Both loops broken out of, move on to next recipe
                                                        break;
                                                  }else if(last_index && not_found.length === 1){ // User has all ingredients except 1, recipe added to almosts
                                                        var entry = []
                                                        entry.push(recipes[j]['recipe']['label'])
                                                        entry.push(recipes[j]['recipe']['url'])
                                                        entry.push(not_found[0])
                                                        almost_list.push(entry)
                                                        done = true            // Both loops broken out of, move on to next recipe
                                                        break;
                                                  }else if(last_index && not_found.length > 1){  // User is missing more than 1 ingredient
                                                        console.log("NO MATCH")
                                                        console.log("with: " + recipes[j]['recipe']['label'])
                                                        console.log("in less = false")
                                                        done = true            // Both loops broken out of, move on to next recipe
                                                        break;
                                                  }

                                             }else if( match === false && last_index_two ) {
                                                  if(last_index && not_found.length > 1){        // If checking last ingredient in recipe, and user is missing more than one ingredient
                                                      console.log("**NO MATCH")
                                                      console.log("with: " + recipes[j]['recipe']['label'])
                                                      console.log("in less = false")
                                                      done = true              // User is missing more than one ingredient in the recipe, break out of both loops, go to next recipe
                                                      break;
                                                  }else if(last_index && not_found.length === 1){ // If checking last ingredient in recipe, and user is only missing one ingredient, recipe added to almosts
                                                      var entry = []
                                                      entry.push(recipes[j]['recipe']['label'])
                                                      entry.push(recipes[j]['recipe']['url'])
                                                      entry.push(not_found[0])
                                                      almost_list.push(entry)
                                                      done = true              // Both loops broken out of, move on to next recipe
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
                            var top_layer_count = 0

                            for(ing in user_ingredients){

                                    count += 1
                                    top_layer_count += 1
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

                                    // var include_words = [ user_ingredients[ing], ]
                                    // var original_ingredient = include_words[0]
                                    // var substitution_by_index = [ false,]
                                    var include_words = []
                                    var substitution_by_index = []
                                    var i
                                    for(i=0;i<user_ingredients.length;i++){
                                      substitution_by_index.push(false)
                                    }

                                    if(top_layer_count === 1){
                                      var orig
                                      for(orig in user_ingredients){
                                        include_words.push(user_ingredients[orig])
                                      }
                                    }
                                    var original_ingredient = user_ingredients[ing]

                                    var p
                                    var q

                                // Finds 'include' words for user's ingredient in keywordExceptions:
                                    var first_letter = user_ingredients[ing][0]
                                    var exceptions = keys[`${first_letter}`]

                                    loopFive:
                                      for(p in exceptions){
                                          var name = exceptions[p]['name']
                                          if(name === user_ingredients[ing]){
                                              var include = exceptions[p]['include']
                                              for(q in include){
                                                  var word = include[q]['word']
                                                  var sub = include[q]['substitution']
                                                  if(sub === false){
                                                    include_words.splice(0,0,word)
                                                    substitution_by_index.splice(0,0,sub)
                                                  }else{
                                                    include_words.push(word)
                                                    substitution_by_index.push(sub)
                                                  }

                                                  var f_letter_word = word[0]      // Finds second set of 'include' words: (searches for word that was pushed above),
                                                  var word_exceptions = keys[`${f_letter_word}`] // if found, adds each of its own 'include' words to include_words,
                                                  loopSix:                       //  directly underneath original word.
                                                    for(s in word_exceptions){
                                                      var name_two = word_exceptions[s]['name']
                                                      if(name_two === word){
                                                        // console.log("Found:" + name_two + " in kw-exceptions")
                                                        var include_two = word_exceptions[s]['include']
                                                        for(t in include_two){
                                                          var word_two = include_two[t]['word']
                                                          if(sub){
                                                            var sub_two = true
                                                          }else{
                                                            var sub_two = include_two[t]['substitution']
                                                          }
                                                          // console.log("New include_word: " + word_two)
                                                          // console.log("Substitution?: " + sub_two)
                                                          include_words.push(word_two)
                                                          substitution_by_index.push(sub_two)
                                                        }
                                                        break loopSix;
                                                      }
                                                    }
                                              }
                                              break loopFive;
                                          }
                                      }                           //////////////////////////////////////////////     Repeat this loop (so that search is 2x deep)    ////////////////////////////////////////

                                    for(x in checked_ingredients){

                                            var ingredient_lower = checked_ingredients[x]
                                            count_two += 1
                                            var last_index_two = false
                                            if(count_two === (checked_length - 1)){
                                                last_index_two = true
                                            }
                                            var match = false
                                            // var found_random = false

                                            var find = FindIngredient(include_words,ingredient_lower)
                                            var result = find[0]
                                            var original_was_found = find[1]
                                            var all_ingredients_found = find[2]
                                            var substitute_made = false
                                            var only_check_one = false
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
                                                var exception_check = FindExceptions(all_ingredients_found,ingredient_lower,recipe_name,original_ingredient)
                                                var found_random = exception_check[2]
                                                if(found_random){        // Found exception in recipe title/label - whole recipe is a no-match
                                                   result = false
                                                   next_recipe = true
                                                   break;
                                                }
                                                var found = exception_check[0]
                                                console.log("EXCEPTION FOUND? " + found)

                                                if(found){
                                                    console.log( "NO MATCH FOR " + ingredient_lower )
                                                    console.log( "keyword exception(s) found for" )
                                                    result = false
                                                 }else{
                                                    match = true
                                                 }
                                            }

                                            if(result === false){
                                                false_count += 1
                                                console.log("Checked ingredient: " + checked_ingredients[x] + " doesn't match: " + user_ingredients[ing])
                                                console.log("false count now: " + false_count)
                                                console.log("checked_length: " + checked_length)
                                                if(false_count === checked_length){          // Couldn't find this user ingredient within any of the recipe ingredients - recipe is a no-match
                                                    next_recipe = true          // Both loops broken out of, move on to next recipe
                                                    console.log("Couldn't find " + user_ingredients[ing] + " in checked ingredients")
                                                    console.log("NO MATCH (in one_over)")
                                                    break;
                                                }
                                            }

                                            if(match){
                                                  console.log("***USER HAS ' " + ingredient_lower + " '." )
                                                  ingredient_count += 1
                                                  if(substitute_made){
                                                        var entry
                                                        var found_key = false
                                                        var last = all_ingredients_found.length - 1
                                                        for(entry of Object.entries(substitutes_dict)){
                                                            console.log("~~~~~~ ENTRY[0]: " + entry[0])
                                                            if(entry[0] === recipe_url){
                                                                found_key = true
                                                                var existing_array = substitutes_dict[recipe_url]
                                                                console.log("1. existing_array.length: " + existing_array.length)
                                                                var length = existing_array.length
                                                                var new_value = [ingredient_lower, user_ingredients[y], all_ingredients_found[last], "test"]
                                                                existing_array.push(new_value)
                                                                console.log("2. existing_array.length: " + existing_array.length)
                                                                delete substitutes_dict[recipe_url]
                                                                substitutes_dict[recipe_url] = existing_array
                                                                break;
                                                            }
                                                        }
                                                        if(found_key === false){
                                                          // create key
                                                          console.log("~~~~CREATING NEW KEY")
                                                          substitutes_dict[recipe_url] = [ [ingredient_lower, user_ingredients[y], all_ingredients_found[last], "test"], ]
                                                        }
                                                  }
                                                  if(ingredient_count === user_ings_length){     // All user ingredients have been found within the recipe.
                                                        console.log("INGREDIENTS MATCH for: " + recipes[j]['recipe']['label'])
                                                        console.log("in one_over")
                                                        var entry = []
                                                        entry.push(recipes[j]['recipe']['label'])
                                                        entry.push(recipes[j]['recipe']['url'])
                                                        entry.push(not_found[0])
                                                        almost_list.push(entry) // Add recipe to Almosts (as number of ingredients in the recipe is equal to the quantity of the user's ingredients + 1)
                                                        next_recipe = true      // Both loops broken out of, move on to next recipe
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
