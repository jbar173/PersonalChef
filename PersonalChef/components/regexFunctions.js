import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import * as data from './keywordExceptions.json';
import * as exclusions from './generalIngredientExclusions.json';
// import * as alphabetical_kw_files from '.KeywordExceptions/a.json';
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
               "v": kw_v.ingredients,"w": kw_w.ingredients,"x": kw_x.ingredients,"y": kw_y.ingredients,"z": kw_z.ingredients, };

const random_exclusions = exclusions.phrases
const ingredient_exclusions = exclusions.items
const fruit = exclusions.fruit
const herb = exclusions.herb
const soda = exclusions.soda
const meat = exclusions.meat
const oil = exclusions.oil

const types = [ "fruit", "herb", "soda", "meat", "oil", ]
const exc_list = [ fruit, herb, soda, meat, oil,  ]


// Checks that recipe items are ingredients rather than equipment/utensils:

const CheckRecipeIngredientLength = (recipe_ings) => {

      var exception_count = 0
      var l
      // Regexes for ingredient to match:
      var no_extra_letters = String.raw`[^a-z]`
      var ends_with_s = String.raw`[s]`
      var starts_or_ends_with = String.raw`\b`
      var new_ingredients = []

      for(l in recipe_ings){
          var ingredient_lower = recipe_ings[l]['text'].toLowerCase()
          var i
          var found_exception = false
          for(i in ingredient_exclusions){
                // matching word is in the middle of the string:
                var regex_one = new RegExp(`${no_extra_letters}${ingredient_exclusions[i]}${no_extra_letters}`)
                var regex_two = new RegExp(`${no_extra_letters}${ingredient_exclusions[i]}${ends_with_s}${no_extra_letters}`)
                // matching word is at the start of the string:
                var regex_three = new RegExp(`${starts_or_ends_with}${ingredient_exclusions[i]}${no_extra_letters}`)
                var regex_four = new RegExp(`${starts_or_ends_with}${ingredient_exclusions[i]}${ends_with_s}${no_extra_letters}`)
                // matching word is at the end of the string:
                var regex_five = new RegExp(`${no_extra_letters}${ingredient_exclusions[i]}${starts_or_ends_with}`)
                var regex_six = new RegExp(`${no_extra_letters}${ingredient_exclusions[i]}${ends_with_s}${starts_or_ends_with}`)
                // matching word is the only word in the string:
                var regex_seven = new RegExp(`${starts_or_ends_with}${ingredient_exclusions[i]}${starts_or_ends_with}`)
                var regex_eight = new RegExp(`${starts_or_ends_with}${ingredient_exclusions[i]}${ends_with_s}${starts_or_ends_with}`)

                if(regex_one.test(ingredient_lower) || regex_two.test(ingredient_lower) ||
                   regex_three.test(ingredient_lower) || regex_four.test(ingredient_lower) ||
                   regex_five.test(ingredient_lower) || regex_six.test(ingredient_lower) ||
                   regex_seven.test(ingredient_lower) || regex_eight.test(ingredient_lower)
                  ){
                     console.log("~~~~~~~~~~~FOUND ITEM EXCEPTION: " + ingredient_exclusions[i] + " in ingredient: " + ingredient_lower)
                     exception_count += 1
                     found_exception = true
                     break;
                   }
            }
          if(found_exception === false){
            new_ingredients.push(ingredient_lower)
          }
      }

      return [ exception_count, new_ingredients ];

};


// Searches for the user's ingredient within the recipe ingredient string:

const FindIngredient = (ingredients_to_search_for,ingredient_lower) => {

  // Regexes for ingredient to match:
    var no_extra_letters = String.raw`[^a-z]`
    var ends_with_s = String.raw`[s]`
    var starts_or_ends_with = String.raw`\b`

    var ingredients = ingredients_to_search_for
    var original = ingredients_to_search_for[0]
    var result = false
    var include_found = false

    var original_found = false
    var include_words_found = []
    var x

    for(x in ingredients){
        var ingredient = ingredients[x]
        // matching word is in the middle of the string:
        var regex_one = new RegExp(`${no_extra_letters}${ingredient}${no_extra_letters}`)
        var regex_two = new RegExp(`${no_extra_letters}${ingredient}${ends_with_s}${no_extra_letters}`)
        // matching word is at the start of the string:
        var regex_three = new RegExp(`${starts_or_ends_with}${ingredient}${no_extra_letters}`)
        var regex_four = new RegExp(`${starts_or_ends_with}${ingredient}${ends_with_s}${no_extra_letters}`)
        // matching word is at the end of the string:
        var regex_five = new RegExp(`${no_extra_letters}${ingredient}${starts_or_ends_with}`)
        var regex_six = new RegExp(`${no_extra_letters}${ingredient}${ends_with_s}${starts_or_ends_with}`)
        // matching word is the only word in the string:
        var regex_seven = new RegExp(`${starts_or_ends_with}${ingredient}${starts_or_ends_with}`)
        var regex_eight = new RegExp(`${starts_or_ends_with}${ingredient}${ends_with_s}${starts_or_ends_with}`)

        var regex_nine = false

        if(regex_one.test(ingredient_lower)){
          regex_nine = new RegExp(`not ${no_extra_letters}${ingredient}${no_extra_letters}`)
        }else if(regex_two.test(ingredient_lower)){
          regex_nine = new RegExp(`not ${no_extra_letters}${ingredient}${ends_with_s}${no_extra_letters}`)
        }else if(regex_five.test(ingredient_lower)){
          regex_nine = new RegExp(`not ${no_extra_letters}${ingredient}${starts_or_ends_with}`)
        }else if(regex_six.test(ingredient_lower)){
          regex_nine = new RegExp(`not ${no_extra_letters}${ingredient}${ends_with_s}${starts_or_ends_with}`)
        }

        var false_positive = false

        if(regex_nine !== false){
          if(regex_nine.test(ingredient_lower)){
            console.log("Ingredient '" + ingredient_lower + "' was a false positive")
            false_positive = true
          }
        }

        if(false_positive === false){
            if(regex_one.test(ingredient_lower) || regex_two.test(ingredient_lower) ||
               regex_three.test(ingredient_lower) || regex_four.test(ingredient_lower) ||
               regex_five.test(ingredient_lower) || regex_six.test(ingredient_lower) ||
               regex_seven.test(ingredient_lower) || regex_eight.test(ingredient_lower)
             ){
                console.log("found " + ingredient)
                console.log("in: " + ingredient_lower)
                if(ingredient === original){
                  console.log("FOUND ORIGINAL INGREDIENT ( " + ingredient + " ) for " + ingredient_lower)
                  console.log("ORIGINAL: " + original)
                  result = true
                  original_found = true
                  include_words_found.push(ingredient)
                  return [ result, original_found, include_words_found ];
                }else{
                  console.log("FOUND 'Include' INGREDIENT ( " + ingredient + " ) for " + ingredient_lower)
                  console.log("ORIGINAL: " + original)
                  include_words_found.push(ingredient)
                  result = true
                  include_words_found.push(ingredient)
                  return [ result, original_found, include_words_found ];
                }
             }
        }

      }

     if(include_words_found.length > 0){
       result = true
     }

    return [ result, original_found, include_words_found ];

};


// Checks whether the matching ingredient is an exception (a word listed under 'exclude' in keywordExceptions):

const FindExceptions = (ingredients,ingredient_lower,recipe_title,original_ingredient) => {

  // console.log("FindExceptions regex function starting")
  // Regexes for ingredient to match:
    var no_extra_letters = String.raw`[^a-z]`
    var ends_with_s = String.raw`[s]`
    var starts_or_ends_with = String.raw`\b`

    if(ingredients[0] !== original_ingredient){
      ingredients.push(original_ingredient)
    }

    var random_exception_found = false
    var ingredients_with_exceptions = []
    var l, m, n, c, w, x

    var exclusion_list = [ '"dog food"', ]

    for(x in random_exclusions){
      exclusion_list.push(random_exclusions[x])
    }

    // 'RANDOM' CHECK FIRST:
    if(ingredients[0] === '0'){     // checks the RECIPE TITLE to ensure it's valid (not for pets etc) before checking for exclusions

        for(w in exclusion_list){
            // matching word is in the middle of the string:
            var regex_one = new RegExp(`${no_extra_letters}${exclusion_list[w]}${no_extra_letters}`)
            var regex_two = new RegExp(`${no_extra_letters}${exclusion_list[w]}${ends_with_s}${no_extra_letters}`)
            // matching word is at the start of the string:
            var regex_three = new RegExp(`${starts_or_ends_with}${exclusion_list[w]}${no_extra_letters}`)
            var regex_four = new RegExp(`${starts_or_ends_with}${exclusion_list[w]}${ends_with_s}${no_extra_letters}`)
            // matching word is at the end of the string:
            var regex_five = new RegExp(`${no_extra_letters}${exclusion_list[w]}${starts_or_ends_with}`)
            var regex_six = new RegExp(`${no_extra_letters}${exclusion_list[w]}${ends_with_s}${starts_or_ends_with}`)
            // matching word is the only word in the string:
            var regex_seven = new RegExp(`${starts_or_ends_with}${exclusion_list[w]}${starts_or_ends_with}`)
            var regex_eight = new RegExp(`${starts_or_ends_with}${exclusion_list[w]}${ends_with_s}${starts_or_ends_with}`)

            var title_lower = recipe_title.toLowerCase()

            if(regex_one.test(title_lower) || regex_two.test(title_lower) ||
               regex_three.test(title_lower) || regex_four.test(title_lower) ||
               regex_five.test(title_lower) || regex_six.test(title_lower) ||
               regex_seven.test(title_lower) || regex_eight.test(title_lower)
              ){
                 console.log("FOUND RANDOM EXCLUSION in recipe label: " + title_lower)
                 random_exception_found = true
                 return [ true, ingredients_with_exceptions, true ];
             }
         }
    }

    // Looks up and checks 'EXCLUDE' section (in KeywordExceptions) for original ingredient and all of its 'includes' (listed in 'ingredients' parameter):
    var exception_found = false

    for(l in ingredients){
        var first_letter = ingredients[l][0]
        var exceptions = keys[`${first_letter}`]
        var next_ingredient = false
        var length = ingredients.length
        var count = 0

        for(m in exceptions){

            if(next_ingredient){
                break;
            }

            if(exceptions[m]["name"] === ingredients[l]){

                var exclude = exceptions[m]['exclude']
                var words = []
                var type
                for(type in types){
                  if(exceptions[m]["type"] === types[type]){
                    var excl = exc_list[type]
                    var ex
                    for(ex in excl){
                      words.push(excl[ex])
                    }
                    // words = exc_list[type]
                    console.log("********** IS " + types[type] + " ***************")
                    console.log(types[type] + " length: " + types[type].length)
                    console.log(exceptions[m]["type"] + " length: " + exc_list[type].length)
                    // for(word in words){
                    //   console.log("Added '" + types[type] + "' word: " + words[word])
                    // }
                  }
                }
                var no_error = true

                for(n in exclude){
                    try{
                      words.push(exclude[n]['word'])
                      // console.log("Added exclude word: " + exclude[n]['word'])
                    }catch(error){
                      console.log(exceptions[m]["name"] + ":(FindExceptions) regexFunctions error: " + error)
                      no_error = false
                    }
                }

                var words_count = -1

                if(no_error){

                    for(c in words){

                        words_count += 1
                        number = words_count+1

                        var ingredient = words[c]
                        var length_integer = parseInt(words.length)
                        var last_ind = length_integer-1

                        // matching word is in the middle of the string:
                        var regex_one = new RegExp(`${no_extra_letters}${ingredient}${no_extra_letters}`)
                        var regex_two = new RegExp(`${no_extra_letters}${ingredient}${ends_with_s}${no_extra_letters}`)
                        // matching word is at the start of the string:
                        var regex_three = new RegExp(`${starts_or_ends_with}${ingredient}${no_extra_letters}`)
                        var regex_four = new RegExp(`${starts_or_ends_with}${ingredient}${ends_with_s}${no_extra_letters}`)
                        // matching word is at the end of the string:
                        var regex_five = new RegExp(`${no_extra_letters}${ingredient}${starts_or_ends_with}`)
                        var regex_six = new RegExp(`${no_extra_letters}${ingredient}${ends_with_s}${starts_or_ends_with}`)
                        // matching word is the only word in the string:
                        var regex_seven = new RegExp(`${starts_or_ends_with}${ingredient}${starts_or_ends_with}`)
                        var regex_eight = new RegExp(`${starts_or_ends_with}${ingredient}${ends_with_s}${starts_or_ends_with}`)

                        if(regex_one.test(ingredient_lower) || regex_two.test(ingredient_lower) ||
                           regex_three.test(ingredient_lower) || regex_four.test(ingredient_lower) ||
                           regex_five.test(ingredient_lower) || regex_six.test(ingredient_lower) ||
                           regex_seven.test(ingredient_lower) || regex_eight.test(ingredient_lower)
                          ){
                              ingredients_with_exceptions.push(ingredient)
                              console.log("Ingredient was " + ingredient + ", not " + ingredients[l])
                              console.log("in " + ingredient_lower)
                              exception_found = true
                              return [ exception_found, ingredients_with_exceptions, random_exception_found, ];
                        }else if(exception_found === false && words_count === words.length-1){
                              next_ingredient = true
                              break;
                        }
                    }
                }else{
                    next_ingredient = true
                }

            }

        }

    }


   return [ exception_found, ingredients_with_exceptions, random_exception_found, ];

 };



export { FindIngredient, FindExceptions, CheckRecipeIngredientLength };
