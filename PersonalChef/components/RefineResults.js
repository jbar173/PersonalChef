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
  var i
  var j
  var finished = false


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
             var recipe_ings = recipes[j]['recipe']['ingredients']
             var recipe_ings_length = recipe_ings.length
             var length_int = parseInt(recipe_ings_length)
             var last_index = length_int - 1

             var less = false
             var same = false
             var more = false

             if(recipe_ings_length < user_ings_length){
               less = true
             }else if(recipe_ings_length === user_ings_length){
               same = true
             }else{
               more = true
               console.log("Recipe has too many ingredients")
               console.log("Number of recipe ingredients: " + recipe_ings_length)
               console.log("I have " + user_ings_length + " ingredients")
             }

             var break_out = false

             if(less){

                   try{

                           var count = 0
                           var x
                           var y

                           for(x in recipe_ings){

                                 var index = -1
                                 var ingredient_lower = recipe_ings[x]['text'].toLowerCase()
                                 var false_count = 0

                                 if(break_out){
                                    break;
                                 }

                                 for(y in user_ingredients){

                                       index += 1
                                       var match = false
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
                                       var find = FindIngredient(include_words,ingredient_lower,is_key)
                                       var result = find[0]
                                       var original_was_found = find[1]
                                       var all_ingredients_found = find[2]
                                       // console.log("############### RESULT: " + result)


                                       if(result){
                                           console.log("RESULT!! (less)")
                                           console.log("Found: " )
                                           for(word in all_ingredients_found){
                                               console.log(all_ingredients_found[word])
                                           }
                                           console.log("Looking for keyword exceptions")
                                           if(is_key){
                                               var exception_check = FindExceptions(all_ingredients_found,ingredient_lower)
                                               var found = exception_check[0]
                                               console.log("EXCEPTION FOUND? " + found)
                                               var ingredients_with_exceptions = exception_check[1]
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
                                           }else{
                                             match = true
                                           }
                                        }

                                        if(result === false){
                                            false_count += 1
                                        }
                                        if(result === false && false_count === user_ings_length ){
                                            console.log("user doesn't have: " + ingredient_lower)
                                            console.log("NO MATCH")
                                            match = false
                                            break_out = true
                                            break;
                                        }

                                        if(match){
                                               count += 1
                                               if(count === recipe_ings_length){
                                                    console.log("MATCH FOUND!")
                                                    console.log("for: " + recipes[j]['recipe']['label'])
                                                    console.log("in less = true")
                                                    var entry = []
                                                    entry.push(recipes[j]['recipe']['label'])
                                                    entry.push(recipes[j]['recipe']['url'])
                                                    relevant_recipes.push(entry)
                                                    break_out = true
                                                    break;
                                               }else{
                                                    break;
                                               }
                                        }else if( match === false && index === last_index){
                                               console.log("NO MATCH")
                                               console.log("with: " + recipes[j]['recipe']['label'])
                                               console.log("in less = true")
                                               break_out = true
                                               break;
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

                                            var find = FindIngredient(include_words,ingredient_lower,is_key)
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
                                                     var exception_check = FindExceptions(all_ingredients_found,ingredient_lower)
                                                     var found = exception_check[0]
                                                     console.log("EXCEPTION FOUND? " + found)
                                                     var ingredients_with_exceptions = exception_check[1]
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
                                              }

                                              if(result === false){
                                                  false_count += 1
                                              }
                                              if(result === false && false_count === user_ings_length ){
                                                  console.log("user doesn't have: " + ingredient_lower)
                                                  console.log("NO MATCH")
                                                  match = false
                                                  done = true
                                                  break;
                                              }


                                              if(match){
                                                    console.log("***USER HAS ' " + ingredient_lower + " '." )
                                                    ingredient_count += 1
                                                    if(ingredient_count === user_ings_length){
                                                          console.log("INGREDIENTS MATCH for: " + recipes[j]['recipe']['label'])
                                                          console.log("in less = false")
                                                          var entry = []
                                                          entry.push(recipes[j]['recipe']['label'])
                                                          entry.push(recipes[j]['recipe']['url'])
                                                          relevant_recipes.push(entry)
                                                          done = true
                                                          break;
                                                    }else{
                                                          break;
                                                    }
                                               }else if( match === false && last_index_two ) {
                                                    console.log("NO MATCH")
                                                    console.log("with: " + recipes[j]['recipe']['label'])
                                                    console.log("in less = false")
                                                    done = true
                                                    break;
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
      console.log("number of recipes that match: " + relevant_recipes.length)
      for(x in relevant_recipes){
          console.log("relevant_recipes[x]: " + relevant_recipes[x])
          console.log("~~")
      }
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
