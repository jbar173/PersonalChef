import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';



const RefineResults = props => {

  console.log("refining")

  var ten_pages = props.thisRoundResponseList
  console.log("TEN_PAGES.length: " + ten_pages.length)
  var top_length = ten_pages.length

  for(x in ten_pages){
    console.log(x + ". " + ten_pages[x]["from"])
  }

  // filter out recipes which contain ingredients other than those that the user has:

  var user_ingredients = props.userIngredients
  var user_ings_length = props.maxIngredients

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


      for(j=0;j<length;j++){

             var not_finished = true
             console.log("****Checking recipe: " + recipes[j]['recipe']['label'])
             var recipe_ings = recipes[j]['recipe']['ingredients']
             var recipe_ings_length = recipe_ings.length
             var length_int = parseInt(recipe_ings_length)
             var last_index = length_int - 1

             var less

             if(recipe_ings_length < user_ings_length){
               less = true
             }else{
               less = false
             }

             var got_all = false


             if(less){

                   try{

                           var count = 0
                           var x
                           var y


                           for(x in recipe_ings){
                               var index = -1
                               var ingredient_lower = recipe_ings[x]['text'].toLowerCase()

                               if(got_all){
                                 break;
                               }

                               for(y in user_ingredients){
                                   index += 1
                                   var found = false

                                   var no_extra_letters = String.raw`[^a-z]`
                                   var ends_with_s = String.raw`[s]`
                                   var starts_or_ends_with = String.raw`\b`
                                   // matching word is in the middle of the string:
                                   var regex_one = new RegExp(`${no_extra_letters}${user_ingredients[y]}${no_extra_letters}`)
                                   var regex_two = new RegExp(`${no_extra_letters}${user_ingredients[y]}${ends_with_s}${no_extra_letters}`)
                                   // matching word is at the start of the string:
                                   var regex_three = new RegExp(`${starts_or_ends_with}${user_ingredients[y]}${no_extra_letters}`)
                                   var regex_four = new RegExp(`${starts_or_ends_with}${user_ingredients[y]}${ends_with_s}${no_extra_letters}`)
                                   //matching word is at the end of the string:
                                   var regex_five = new RegExp(`${no_extra_letters}${user_ingredients[y]}${starts_or_ends_with}`)
                                   var regex_six = new RegExp(`${no_extra_letters}${user_ingredients[y]}${ends_with_s}${starts_or_ends_with}`)



                                   if(regex_one.test(ingredient_lower) || regex_two.test(ingredient_lower)){
                                     found = true
                                     // console.log("****")
                                     // console.log("FOUND either: ")
                                     // console.log("regex_one: " + regex_one)
                                     // console.log("or: ")
                                     // console.log("regex_two: " + regex_two)
                                     // console.log("inside: ")
                                     // console.log(ingredient_lower)
                                     // console.log("within: " +  recipes[j]['recipe']['label'])
                                     // console.log("at: " + recipes[j]['recipe']['url'])
                                     // console.log("i: " + i)
                                     // console.log("~~~~")
                                   }else if(regex_three.test(ingredient_lower) || regex_four.test(ingredient_lower)){
                                     found = true
                                     // console.log("****")
                                     // console.log("FOUND either: ")
                                     // console.log("regex_three: " + regex_three)
                                     // console.log("or: ")
                                     // console.log("regex_four: " + regex_four)
                                     // console.log("inside: ")
                                     // console.log(ingredient_lower)
                                     // console.log("within: " +  recipes[j]['recipe']['label'])
                                     // console.log("at: " + recipes[j]['recipe']['url'])
                                     // console.log("i: " + i)
                                   }else if(regex_five.test(ingredient_lower) || regex_six.test(ingredient_lower)){
                                     found = true
                                     // console.log("****")
                                     // console.log("FOUND either: ")
                                     // console.log("regex_five: " + regex_five)
                                     // console.log("or: ")
                                     // console.log("regex_six: " + regex_six)
                                     // console.log("inside: ")
                                     // console.log(ingredient_lower)
                                     // console.log("within: " +  recipes[j]['recipe']['label'])
                                     // console.log("at: " + recipes[j]['recipe']['url'])
                                     // console.log("i: " + i)
                                   }else{
                                     // console.log("****")
                                     // console.log("no regexes found inside: ")
                                     // console.log(ingredient_lower)
                                     // console.log("in: " +  recipes[j]['recipe']['label'])
                                     // console.log("at: " + recipes[j]['recipe']['url'])
                                     // console.log("i: " + i)
                                   }

                                   if(found){
                                       count += 1
                                       if(count === recipe_ings_length){
                                          console.log("MATCH FOUND!")
                                          console.log("for: " + recipes[j]['recipe']['label'])
                                          console.log("in less = true")
                                          // console.log("ingredient: " + ingredient_lower)
                                          var entry = []
                                          entry.push(recipes[j]['recipe']['label'])
                                          entry.push(recipes[j]['recipe']['url'])
                                          relevant_recipes.push(entry)
                                          got_all= true
                                          break;
                                       }else{
                                         // console.log("count: " + count)
                                         // console.log("ingredient: " + ingredient_lower)
                                         // console.log("recipe ingredients length: " + recipe_ings_length)
                                         break;
                                       }
                                    }else if( found === false && index === last_index){
                                       console.log("NO MATCH")
                                       console.log("with: " + recipes[j]['recipe']['label'])
                                       console.log("in less = true")
                                       // console.log("don't have: " + ingredient_lower)
                                       got_all= true
                                       break;
                                    }else{
                                       // console.log(".")
                                    }
                                }
                            }


                      }catch(error){

                            console.log(recipes[j]['label'] + ":(LESS) RefineResults error: " + error)

                      }

               }


              var done = false

              if(less === false){

                      try{
                            var match = false
                            var count = -1
                            var ing
                            var ingred
                            var ingredient_count = 0

                            for(ing in user_ingredients){
                                    count += 1
                                    var last_index = false
                                    if(count === (user_ings_length - 1)){
                                      last_index = true
                                    }

                                    var count_two = -1

                                    if(done){
                                      console.log("Done!")
                                      break;
                                    }

                                    for(ingred in recipe_ings){
                                            var ingredient_lower = recipe_ings[ingred]['text'].toLowerCase()
                                            count_two += 1
                                            var last_index_two = false
                                            if(count_two === (recipe_ings_length - 1)){
                                              last_index_two = true
                                            }
                                            var found = false

                                            var no_extra_letters = String.raw`[^a-z]`
                                            var ends_with_s = String.raw`[s]`
                                            var starts_or_ends_with = String.raw`\b`
                                            // matching word is in the middle of the string:
                                            var regex_one = new RegExp(`${no_extra_letters}${user_ingredients[ing]}${no_extra_letters}`)
                                            var regex_two = new RegExp(`${no_extra_letters}${user_ingredients[ing]}${ends_with_s}${no_extra_letters}`)
                                            // matching word is at the start of the string:
                                            var regex_three = new RegExp(`${starts_or_ends_with}${user_ingredients[ing]}${no_extra_letters}`)
                                            var regex_four = new RegExp(`${starts_or_ends_with}${user_ingredients[ing]}${ends_with_s}${no_extra_letters}`)
                                            //matching word is at the end of the string:
                                            var regex_five = new RegExp(`${no_extra_letters}${user_ingredients[ing]}${starts_or_ends_with}`)
                                            var regex_six = new RegExp(`${no_extra_letters}${user_ingredients[ing]}${ends_with_s}${starts_or_ends_with}`)

                                            if(regex_one.test(ingredient_lower) || regex_two.test(ingredient_lower)){
                                                found = true
                                                // console.log("____________")
                                                // console.log("FOUND either: ")
                                                // console.log("regex_one: " + regex_one)
                                                // console.log("or: ")
                                                // console.log("regex_two: " + regex_two)
                                                // console.log("inside: ")
                                                // console.log(ingredient_lower)
                                                // console.log("within: " +  recipes[j]['recipe']['label'])
                                                // console.log("at: " + recipes[j]['recipe']['url'])
                                                // console.log("i: " + i)
                                                // console.log("____________")
                                            }else if(regex_three.test(ingredient_lower) || regex_four.test(ingredient_lower)){
                                                found = true
                                                // console.log("____________")
                                                // console.log("FOUND either: ")
                                                // console.log("regex_three: " + regex_three)
                                                // console.log("or: ")
                                                // console.log("regex_four: " + regex_four)
                                                // console.log("inside: ")
                                                // console.log(ingredient_lower)
                                                // console.log("within: " +  recipes[j]['recipe']['label'])
                                                // console.log("at: " + recipes[j]['recipe']['url'])
                                                // console.log("i: " + i)
                                                // console.log("____________")
                                            }else if(regex_five.test(ingredient_lower) || regex_six.test(ingredient_lower)){
                                                found = true
                                                // console.log("_____________")
                                                // console.log("FOUND either: ")
                                                // console.log("regex_five: " + regex_five)
                                                // console.log("or: ")
                                                // console.log("regex_six: " + regex_six)
                                                // console.log("inside: ")
                                                // console.log(ingredient_lower)
                                                // console.log("within: " +  recipes[j]['recipe']['label'])
                                                // console.log("at: " + recipes[j]['recipe']['url'])
                                                // console.log("i: " + i)
                                                // console.log("_____________")
                                             }else{
                                                // console.log("_____________")
                                                // console.log("no regexes found inside: ")
                                                // console.log(ingredient_lower)
                                                // console.log("in: " +  recipes[j]['recipe']['label'])
                                                // console.log("at: " + recipes[j]['recipe']['url'])
                                                // console.log("i: " + i)
                                                // console.log("_____________")
                                             }


                                            if(found){
                                                  console.log("***USER HAS ' " + ingredient_lower + " '." )
                                                  ingredient_count += 1
                                                  if(ingredient_count === user_ings_length){
                                                        done = true
                                                        not_finished = false
                                                        // console.log(" ingredient_count: " + ingredient_count)
                                                        // console.log(" user ingredients length: " + user_ings_length)
                                                        console.log("INGREDIENTS MATCH for: " + recipes[j]['recipe']['label'])
                                                        console.log("in less = false")
                                                        var entry = []
                                                        entry.push(recipes[j]['recipe']['label'])
                                                        entry.push(recipes[j]['recipe']['url'])
                                                        relevant_recipes.push(entry)
                                                        break;
                                                  }else{
                                                    break;
                                                  }
                                             }else if( found === false && last_index_two ) {
                                                  console.log("NO MATCH")
                                                  console.log("with: " + recipes[j]['recipe']['label'])
                                                  console.log("in less = false")
                                                  // console.log("COULDN'T FIND USER INGREDIENT: " + user_ingredients[ing] + " IN RECIPE.")
                                                  // console.log("WHEN CHECKING FINAL RECIPE_INGRED: " + ingredient_lower)
                                                  // console.log(" user ingredients length: " + user_ings_length)
                                                  // console.log("ingredient_count: " + ingredient_count)
                                                  done = true
                                                  break;
                                             }else{
                                                  // console.log("still checking for user's ingredient")
                                             }

                                      }

                               }

                        }catch(error){

                              console.log(recipes[j]['label'] + ":(SAME) RefineResults error: " + error)
                        }

              }


       }


  }



              // Compares if user has exactly the same number of ingredients as the recipe:

                  // var match = false
                  // var count = -1
                  // var ing
                  // var ingred
                  // var ingredient_count = 0

//                   for(ing in user_ingredients){
//                           count += 1
//                           var last_index = false
//                           if(count === (user_ings_length - 1)){
//                             last_index = true
//                           }
//
//                           var count_two = -1
//
//                           if(done){
//                             console.log("Done!")
//                             break;
//                           }
//
//                           for(ingred in recipe_ings){
//                                   var ingredient_lower = recipe_ings[ingred]['text'].toLowerCase()
//                                   count_two += 1
//                                   var last_index_two = false
//                                   if(count_two === (recipe_ings_length - 1)){
//                                     last_index_two = true
//                                   }
//
//                                   if( ingredient_lower.includes(user_ingredients[ing]) ){
//                                         console.log("***USER HAS ' " + ingredient_lower + " '." )
//                                         ingredient_count += 1
//                                         if(ingredient_count === user_ings_length){
//                                             done = true
//                                             not_finished = false
//                                             // break_out = true
//                                             console.log("!!!!!! INGREDIENTS MATCH for: " + recipes[j]['recipe']['label'])
//                                             var entry = []
//                                             entry.push(recipes[j]['recipe']['label'])
//                                             entry.push(recipes[j]['recipe']['url'])
//                                             relevant_recipes.push(entry)
//                                             break;
//                                         }else{
//                                           break;
//                                         }
//                                   }else if( !(ingredient_lower.includes(user_ingredients[ing])) && last_index_two ) {
//                                         console.log("NO MATCH")
//                                         console.log("COULDN'T FIND USER INGREDIENT: " + user_ingredients[ing] + " IN RECIPE.")
//                                         console.log("WHEN CHECKING FINAL RECIPE_INGRED: " + ingredient_lower)
//                                         done = true
//                                         // not_finished = false
//
//                                         break;
//
//                                    }else{
//                                         console.log("still checking for user's ingredient")
//                                    }
//
//                             }
//
//                     }
//
//           // }
//
//     // }catch(error){
//     //     console.log(j + ": RefineResults error: " + error)
//     // }
//     not_finished = false
// }


         // var not_finished = true

         // try{

              // if(not_finished){

                    // var enough = true
                    // var done = false
                    // var recipe_ings = recipes[j]['recipe']['ingredients']
                    // console.log("****Checking recipe: " + recipes[j]['recipe']['label'])

                    // var ingreds_length = recipe_ings.length

                  // Compares ingredients if the recipe has fewer ingredients than the user does:
                    // if(ingreds_length < user_ingredients.length){
                    //       console.log("number of ingredients in recipe: " + ingreds_length)
                    //       var count = 0
                    //       var x
                    //       var y
                    //       var got_all = true
                    //
                    //       for(x in recipe_ings){
                    //           var index = -1
                    //           var ingredient_lower = recipe_ings[x]['text'].toLowerCase()
                    //           if(got_all === false){
                    //             break;
                    //           }
                    //           if(got_all){
                    //                 for(y in user_ingredients){
                    //                   index += 1
                    //                   if(ingredient_lower.includes(user_ingredients[y])){
                    //                         console.log("got: ")
                    //                         console.log(ingredient_lower)
                    //                         console.log("match is with user ingredient: " + user_ingredients[y])
                    //                         count += 1
                    //                         if(count === ingreds_length){
                    //                             console.log("RECIPE MATCH! for: " + recipes[j]['recipe']['label'])
                    //                             var entry = []
                    //                             entry.push(recipes[j]['recipe']['label'])
                    //                             entry.push(recipes[j]['recipe']['url'])
                    //                             relevant_recipes.push(entry)
                    //                             not_finished = false
                    //                             got_all = false
                    //                             break;
                    //                         }
                    //                         break;
                    //                   }
                    //                   else if(index === (user_ingredients.length-1)){
                    //                         console.log("don't have: " + ingredient_lower)
                    //                         got_all = false
                    //                         break;
                    //                   }else{
                    //                         console.log(".")
                    //                   }
                    //                 }
                    //            }else{
                    //                    break;
                    //            }
                    //       }
                    //       console.log("count: " + count)
                    //
                    //   }




  finished = true

  if(finished){
    console.log("------finishhhhhed-----")
    console.log("number of recipes that match: " + relevant_recipes.length)
    for(x in relevant_recipes){
      console.log("relevant_recipes[x]: " + relevant_recipes[x])
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
