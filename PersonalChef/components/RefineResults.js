import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import * as data from './keywordExceptions.json';



const RefineResults = props => {

  console.log("refining")

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

// Regexes for ingredient matching:
  var no_extra_letters = String.raw`[^a-z]`
  var ends_with_s = String.raw`[s]`
  var starts_or_ends_with = String.raw`\b`


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
                                   var extra_check = false
                                   if(extra_check === false){
                                     var ingredient = user_ingredients[y]
                                   }
                                   // matching word is in the middle of the string:
                                   var regex_one = new RegExp(`${no_extra_letters}${ingredient}${no_extra_letters}`)
                                   var regex_two = new RegExp(`${no_extra_letters}${ingredient}${ends_with_s}${no_extra_letters}`)
                                   // matching word is at the start of the string:
                                   var regex_three = new RegExp(`${starts_or_ends_with}${ingredient}${no_extra_letters}`)
                                   var regex_four = new RegExp(`${starts_or_ends_with}${ingredient}${ends_with_s}${no_extra_letters}`)
                                   //matching word is at the end of the string:
                                   var regex_five = new RegExp(`${no_extra_letters}${ingredient}${starts_or_ends_with}`)
                                   var regex_six = new RegExp(`${no_extra_letters}${ingredient}${ends_with_s}${starts_or_ends_with}`)

                                   if(regex_one.test(ingredient_lower) || regex_two.test(ingredient_lower)){
                                       found = true
                                       console.log("found " + ingredient)
                                       var words = []
                                       if(exceptions_key.includes(user_ingredients[y])){
                                         extra_check = true
                                       }
                                       console.log("EXTRA CHECK FOR " + user_ingredients[y] + "?????: " + extra_check)
                                       if(extra_check){
                                           console.log("EXTRA CHECK 1")
                                           for(a in exceptions){
                                             var name = exceptions[a]['name']
                                             if(name === user_ingredients[y]){
                                               var check_for = exceptions[a]['check_for']
                                               for(b in check_for){
                                                 var word = check_for[b]['word']
                                                 words.push(word)
                                               }
                                             }
                                           }
                                           var words_count = -1
                                           for(c in words){
                                               words_count += 1
                                               ingredient = words[c]
                                               length_integer = parseInt(words.length)
                                               last_ind = length_integer-1
                                               console.log("checking exception ingredient: " + ingredient)
                                               var regex_one = new RegExp(`${no_extra_letters}${ingredient}${no_extra_letters}`)
                                               var regex_two = new RegExp(`${no_extra_letters}${ingredient}${ends_with_s}${no_extra_letters}`)
                                               var regex_three = new RegExp(`${starts_or_ends_with}${ingredient}${no_extra_letters}`)
                                               var regex_four = new RegExp(`${starts_or_ends_with}${ingredient}${ends_with_s}${no_extra_letters}`)
                                               var regex_five = new RegExp(`${no_extra_letters}${ingredient}${starts_or_ends_with}`)
                                               var regex_six = new RegExp(`${no_extra_letters}${ingredient}${ends_with_s}${starts_or_ends_with}`)
                                               if(regex_one.test(ingredient_lower) || regex_two.test(ingredient_lower)){
                                                   found = false
                                                   console.log("R1 ingredient was " + ingredient + ", not " + user_ingredients[y])
                                                   console.log("in " + ingredient_lower)
                                                   extra_check = false
                                                   break;
                                               }else if(regex_three.test(ingredient_lower) || regex_four.test(ingredient_lower)){
                                                   found = false
                                                   console.log("R3 ingredient was " + ingredient + ", not " + user_ingredients[y])
                                                   console.log("in " + ingredient_lower)
                                                   extra_check = false
                                                   break;
                                               }else if(regex_five.test(ingredient_lower) || regex_six.test(ingredient_lower)){
                                                   found = false
                                                   console.log("R5 ingredient was " + ingredient + ", not " + user_ingredients[y])
                                                   console.log("in " + ingredient_lower)
                                                   extra_check = false
                                                   break;
                                               }else if(found === true && words_count === words.length){
                                                   extra_check = false
                                                   break;
                                               }else{
                                                   console.log("match was correct as: " + user_ingredients[y])
                                                   console.log("in: " + ingredient_lower)
                                               }
                                            }
                                         }
                                   }else if(regex_three.test(ingredient_lower) || regex_four.test(ingredient_lower)){
                                         found = true
                                         console.log("found " + ingredient)
                                         if(exceptions_key.includes(user_ingredients[y])){
                                           extra_check = true
                                         }
                                         console.log("EXTRA CHECK FOR " + user_ingredients[y] + "?????: " + extra_check)
                                         if(extra_check){
                                           console.log("EXTRA CHECK 2")
                                           for(a in exceptions){
                                               var name = exceptions[a]['name']
                                               if(name === user_ingredients[y]){
                                                 var check_for = exceptions[a]['check_for']
                                                 for(b in check_for){
                                                   var word = check_for[b]['word']
                                                   words.push(word)
                                                 }
                                               }
                                           }
                                           var words_count = -1
                                           for(c in words){
                                               words_count += 1
                                               length_integer = parseInt(words.length)
                                               last_ind = length_integer-1
                                               ingredient = words[c]
                                               console.log("checking exception ingredient: " + ingredient)
                                               var regex_one = new RegExp(`${no_extra_letters}${ingredient}${no_extra_letters}`)
                                               var regex_two = new RegExp(`${no_extra_letters}${ingredient}${ends_with_s}${no_extra_letters}`)
                                               var regex_three = new RegExp(`${starts_or_ends_with}${ingredient}${no_extra_letters}`)
                                               var regex_four = new RegExp(`${starts_or_ends_with}${ingredient}${ends_with_s}${no_extra_letters}`)
                                               var regex_five = new RegExp(`${no_extra_letters}${ingredient}${starts_or_ends_with}`)
                                               var regex_six = new RegExp(`${no_extra_letters}${ingredient}${ends_with_s}${starts_or_ends_with}`)
                                               if(regex_one.test(ingredient_lower) || regex_two.test(ingredient_lower)){
                                                   found = false
                                                   console.log("ingredient was " + ingredient + ", not " + user_ingredients[y])
                                                   console.log("in " + ingredient_lower)
                                               }else if(regex_three.test(ingredient_lower) || regex_four.test(ingredient_lower)){
                                                   found = false
                                                   console.log("ingredient was " + ingredient + ", not " + user_ingredients[y])
                                                   console.log("in " + ingredient_lower)
                                               }else if(regex_five.test(ingredient_lower) || regex_six.test(ingredient_lower)){
                                                   found = false
                                                   console.log("ingredient was " + ingredient + ", not " + user_ingredients[y])
                                                   console.log("in " + ingredient_lower)
                                               }else if(found === true && words_count === words.length){
                                                   extra_check = false
                                                   break;
                                               }else{
                                                   console.log("match was correct as: " + user_ingredients[y])
                                                   console.log("in: " + ingredient_lower)
                                               }
                                             }
                                           }
                                   }else if(regex_five.test(ingredient_lower) || regex_six.test(ingredient_lower)){
                                         found = true
                                         console.log("found " + ingredient)
                                         if(exceptions_key.includes(user_ingredients[y])){
                                           extra_check = true
                                         }
                                         console.log("EXTRA CHECK FOR " + user_ingredients[y] + "?????: " + extra_check)
                                         if(extra_check){
                                           console.log("EXTRA CHECK 3")
                                           for(a in exceptions){
                                               var name = exceptions[a]['name']
                                               if(name === user_ingredients[y]){
                                                 var check_for = exceptions[a]['check_for']
                                                 for(b in check_for){
                                                   var word = check_for[b]['word']
                                                   words.push(word)
                                                 }
                                               }
                                           }
                                           var words_count = -1
                                           for(c in words){
                                               words_count += 1
                                               length_integer = parseInt(words.length)
                                               last_ind = length_integer-1
                                               ingredient = words[c]
                                               console.log("checking exception ingredient: " + ingredient)
                                               var regex_one = new RegExp(`${no_extra_letters}${ingredient}${no_extra_letters}`)
                                               var regex_two = new RegExp(`${no_extra_letters}${ingredient}${ends_with_s}${no_extra_letters}`)
                                               var regex_three = new RegExp(`${starts_or_ends_with}${ingredient}${no_extra_letters}`)
                                               var regex_four = new RegExp(`${starts_or_ends_with}${ingredient}${ends_with_s}${no_extra_letters}`)
                                               var regex_five = new RegExp(`${no_extra_letters}${ingredient}${starts_or_ends_with}`)
                                               var regex_six = new RegExp(`${no_extra_letters}${ingredient}${ends_with_s}${starts_or_ends_with}`)
                                               if(regex_one.test(ingredient_lower) || regex_two.test(ingredient_lower)){
                                                   found = false
                                                   console.log("ingredient was " + ingredient + ", not " + user_ingredients[y])
                                                   console.log("in " + ingredient_lower)
                                               }else if(regex_three.test(ingredient_lower) || regex_four.test(ingredient_lower)){
                                                   found = false
                                                   console.log("ingredient was " + ingredient + ", not " + user_ingredients[y])
                                                   console.log("in " + ingredient_lower)
                                               }else if(regex_five.test(ingredient_lower) || regex_six.test(ingredient_lower)){
                                                   found = false
                                                   console.log("ingredient was " + ingredient + ", not " + user_ingredients[y])
                                                   console.log("in " + ingredient_lower)
                                               }else if(found === true && words_count === words.length){
                                                   extra_check = false
                                                   break;
                                               }else{
                                                   console.log("match was correct as: " + user_ingredients[y])
                                                   console.log("in: " + ingredient_lower)
                                               }
                                             }
                                           }
                                   }else{
                                     console.log(ingredient + " regex not found in " + ingredient_lower)
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
                                          break;
                                       }
                                    }else if( found === false && index === last_index){
                                         console.log("NO MATCH")
                                         console.log("with: " + recipes[j]['recipe']['label'])
                                         console.log("in less = true")
                                         got_all= true
                                         break;
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

                                            var extra_check = false
                                            var found = false
                                            if(extra_check === false){
                                              var ingredient = user_ingredients[ing]
                                            }
                                            // matching word is in the middle of the string:
                                            var regex_one = new RegExp(`${no_extra_letters}${ingredient}${no_extra_letters}`)
                                            var regex_two = new RegExp(`${no_extra_letters}${ingredient}${ends_with_s}${no_extra_letters}`)
                                            // matching word is at the start of the string:
                                            var regex_three = new RegExp(`${starts_or_ends_with}${ingredient}${no_extra_letters}`)
                                            var regex_four = new RegExp(`${starts_or_ends_with}${ingredient}${ends_with_s}${no_extra_letters}`)
                                            //matching word is at the end of the string:
                                            var regex_five = new RegExp(`${no_extra_letters}${ingredient}${starts_or_ends_with}`)
                                            var regex_six = new RegExp(`${no_extra_letters}${ingredient}${ends_with_s}${starts_or_ends_with}`)

                                            if(regex_one.test(ingredient_lower) || regex_two.test(ingredient_lower)){
                                                    found = true
                                                    console.log("found " + ingredient)
                                                    var words = []
                                                    if(exceptions_key.includes(user_ingredients[ing])){
                                                      extra_check = true
                                                    }
                                                    console.log("EXTRA CHECK FOR " + user_ingredients[ing] + "?????: " + extra_check)
                                                    if(extra_check){
                                                        console.log("EXTRA CHECK 2.1")
                                                        for(a in exceptions){
                                                            var name = exceptions[a]['name']
                                                            if(name === user_ingredients[ing]){
                                                              var check_for = exceptions[a]['check_for']
                                                              for(b in check_for){
                                                                var word = check_for[b]['word']
                                                                words.push(word)
                                                              }
                                                            }
                                                        }
                                                        var words_count = -1
                                                        for(c in words){
                                                            words_count += 1
                                                            ingredient = words[c]
                                                            length_integer = parseInt(words.length)
                                                            last_ind = length_integer-1
                                                            console.log("checking exception ingredient: " + ingredient)
                                                            var regex_one = new RegExp(`${no_extra_letters}${ingredient}${no_extra_letters}`)
                                                            var regex_two = new RegExp(`${no_extra_letters}${ingredient}${ends_with_s}${no_extra_letters}`)
                                                            var regex_three = new RegExp(`${starts_or_ends_with}${ingredient}${no_extra_letters}`)
                                                            var regex_four = new RegExp(`${starts_or_ends_with}${ingredient}${ends_with_s}${no_extra_letters}`)
                                                            var regex_five = new RegExp(`${no_extra_letters}${ingredient}${starts_or_ends_with}`)
                                                            var regex_six = new RegExp(`${no_extra_letters}${ingredient}${ends_with_s}${starts_or_ends_with}`)
                                                            if(regex_one.test(ingredient_lower) || regex_two.test(ingredient_lower)){
                                                                found = false
                                                                console.log("R1 ingredient was " + ingredient + ", not " + user_ingredients[ing])
                                                                console.log("in " + ingredient_lower)
                                                                extra_check = false
                                                                break;
                                                            }else if(regex_three.test(ingredient_lower) || regex_four.test(ingredient_lower)){
                                                                found = false
                                                                console.log("R3 ingredient was " + ingredient + ", not " + user_ingredients[ing])
                                                                console.log("in " + ingredient_lower)
                                                                extra_check = false
                                                                break;
                                                            }else if(regex_five.test(ingredient_lower) || regex_six.test(ingredient_lower)){
                                                                found = false
                                                                console.log("R5 ingredient was " + ingredient + ", not " + user_ingredients[ing])
                                                                console.log("in " + ingredient_lower)
                                                                extra_check = false
                                                                break;
                                                            }else if(found === true && words_count === words.length){
                                                                extra_check = false
                                                                break;
                                                            }else{
                                                                console.log("match was correct as: " + user_ingredients[ing])
                                                                console.log("in: " + ingredient_lower)
                                                            }
                                                         }
                                                      }

                                             }else if(regex_three.test(ingredient_lower) || regex_four.test(ingredient_lower)){
                                                      found = true
                                                      console.log("found " + ingredient)
                                                      var words = []
                                                      if(exceptions_key.includes(user_ingredients[ing])){
                                                        extra_check = true
                                                      }
                                                      console.log("EXTRA CHECK FOR " + user_ingredients[ing] + "?????: " + extra_check)
                                                      if(extra_check){
                                                          console.log("EXTRA CHECK 2.2")
                                                          for(a in exceptions){
                                                              var name = exceptions[a]['name']
                                                              if(name === user_ingredients[ing]){
                                                                var check_for = exceptions[a]['check_for']
                                                                for(b in check_for){
                                                                  var word = check_for[b]['word']
                                                                  words.push(word)
                                                                }
                                                              }
                                                          }
                                                          var words_count = -1
                                                          for(c in words){
                                                              words_count += 1
                                                              ingredient = words[c]
                                                              length_integer = parseInt(words.length)
                                                              last_ind = length_integer-1
                                                              console.log("checking exception ingredient: " + ingredient)
                                                              var regex_one = new RegExp(`${no_extra_letters}${ingredient}${no_extra_letters}`)
                                                              var regex_two = new RegExp(`${no_extra_letters}${ingredient}${ends_with_s}${no_extra_letters}`)
                                                              var regex_three = new RegExp(`${starts_or_ends_with}${ingredient}${no_extra_letters}`)
                                                              var regex_four = new RegExp(`${starts_or_ends_with}${ingredient}${ends_with_s}${no_extra_letters}`)
                                                              var regex_five = new RegExp(`${no_extra_letters}${ingredient}${starts_or_ends_with}`)
                                                              var regex_six = new RegExp(`${no_extra_letters}${ingredient}${ends_with_s}${starts_or_ends_with}`)
                                                              if(regex_one.test(ingredient_lower) || regex_two.test(ingredient_lower)){
                                                                  found = false
                                                                  console.log("R1 ingredient was " + ingredient + ", not " + user_ingredients[ing])
                                                                  console.log("in " + ingredient_lower)
                                                                  extra_check = false
                                                                  break;
                                                              }else if(regex_three.test(ingredient_lower) || regex_four.test(ingredient_lower)){
                                                                  found = false
                                                                  console.log("R3 ingredient was " + ingredient + ", not " + user_ingredients[ing])
                                                                  console.log("in " + ingredient_lower)
                                                                  extra_check = false
                                                                  break;
                                                              }else if(regex_five.test(ingredient_lower) || regex_six.test(ingredient_lower)){
                                                                  found = false
                                                                  console.log("R5 ingredient was " + ingredient + ", not " + user_ingredients[ing])
                                                                  console.log("in " + ingredient_lower)
                                                                  extra_check = false
                                                                  break;
                                                              }else if(found === true && words_count === words.length){
                                                                  extra_check = false
                                                                  break;
                                                              }else{
                                                                  console.log("match was correct as: " + user_ingredients[ing])
                                                                  console.log("in: " + ingredient_lower)
                                                              }
                                                           }
                                                        }

                                              }else if(regex_five.test(ingredient_lower) || regex_six.test(ingredient_lower)){
                                                      found = true
                                                      console.log("found " + ingredient)
                                                      var words = []
                                                      if(exceptions_key.includes(user_ingredients[ing])){
                                                        extra_check = true
                                                      }
                                                      console.log("EXTRA CHECK FOR " + user_ingredients[ing] + "?????: " + extra_check)
                                                      if(extra_check){
                                                          console.log("EXTRA CHECK 2.3")
                                                          for(a in exceptions){
                                                              var name = exceptions[a]['name']
                                                              if(name === user_ingredients[ing]){
                                                                var check_for = exceptions[a]['check_for']
                                                                for(b in check_for){
                                                                  var word = check_for[b]['word']
                                                                  words.push(word)
                                                                }
                                                              }
                                                          }
                                                          var words_count = -1
                                                          for(c in words){
                                                              words_count += 1
                                                              ingredient = words[c]
                                                              length_integer = parseInt(words.length)
                                                              last_ind = length_integer-1
                                                              console.log("checking exception ingredient: " + ingredient)
                                                              var regex_one = new RegExp(`${no_extra_letters}${ingredient}${no_extra_letters}`)
                                                              var regex_two = new RegExp(`${no_extra_letters}${ingredient}${ends_with_s}${no_extra_letters}`)
                                                              var regex_three = new RegExp(`${starts_or_ends_with}${ingredient}${no_extra_letters}`)
                                                              var regex_four = new RegExp(`${starts_or_ends_with}${ingredient}${ends_with_s}${no_extra_letters}`)
                                                              var regex_five = new RegExp(`${no_extra_letters}${ingredient}${starts_or_ends_with}`)
                                                              var regex_six = new RegExp(`${no_extra_letters}${ingredient}${ends_with_s}${starts_or_ends_with}`)
                                                              if(regex_one.test(ingredient_lower) || regex_two.test(ingredient_lower)){
                                                                  found = false
                                                                  console.log("R1 ingredient was " + ingredient + ", not " + user_ingredients[ing])
                                                                  console.log("in " + ingredient_lower)
                                                                  extra_check = false
                                                                  break;
                                                              }else if(regex_three.test(ingredient_lower) || regex_four.test(ingredient_lower)){
                                                                  found = false
                                                                  console.log("R3 ingredient was " + ingredient + ", not " + user_ingredients[ing])
                                                                  console.log("in " + ingredient_lower)
                                                                  extra_check = false
                                                                  break;
                                                              }else if(regex_five.test(ingredient_lower) || regex_six.test(ingredient_lower)){
                                                                  found = false
                                                                  console.log("R5 ingredient was " + ingredient + ", not " + user_ingredients[ing])
                                                                  console.log("in " + ingredient_lower)
                                                                  extra_check = false
                                                                  break;
                                                              }else if(found === true && words_count === words.length){
                                                                  extra_check = false
                                                                  break;
                                                              }else{
                                                                  console.log("match was correct as: " + user_ingredients[ing])
                                                                  console.log("in: " + ingredient_lower)
                                                              }
                                                           }
                                                        }

                                              else{

                                              }

                                            if(found){
                                                  console.log("***USER HAS ' " + ingredient_lower + " '." )
                                                  ingredient_count += 1
                                                  if(ingredient_count === user_ings_length){
                                                        done = true
                                                        not_finished = false
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
                                                  done = true
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
