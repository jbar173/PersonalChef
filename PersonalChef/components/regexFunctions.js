import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import * as data from './keywordExceptions.json';
import * as exclusions from './checklists/json_ingredient_lists/exclude.json';


// Searches for the user's ingredient within the recipe ingredient string:

const FindIngredient = (ingredients_to_search_for,ingredient_lower,is_key) => {

  // Regexes for ingredient to match:
    var no_extra_letters = String.raw`[^a-z]`
    var ends_with_s = String.raw`[s]`
    var starts_or_ends_with = String.raw`\b`

    var ingredients = ingredients_to_search_for
    var original = ingredients_to_search_for[0]
    var result = false
    var exceptions = data.ingredients
    var m
    var l

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

        if(regex_one.test(ingredient_lower) || regex_two.test(ingredient_lower) ||
           regex_three.test(ingredient_lower) || regex_four.test(ingredient_lower) ||
           regex_five.test(ingredient_lower) || regex_six.test(ingredient_lower) ||
           regex_seven.test(ingredient_lower) || regex_eight.test(ingredient_lower)
         ){
            console.log("found " + ingredient)
            console.log("in: " + ingredient_lower)
            if(x === 0){
              original_found = true
              include_words_found.push(ingredient)
            }else{
              include_words_found.push(ingredient)
            }
         }
      }

     if(include_words_found.length > 0){
       result = true
     }

    return [result,original_found,include_words_found];

};


// Checks whether the matching ingredient is an exception (a word listed under 'exclude' in keywordExceptions):

const FindExceptions = (ingredients,ingredient_lower,recipe_title) => {

  // console.log("FindExceptions regex function starting")
  // Regexes for ingredient to match:
    var no_extra_letters = String.raw`[^a-z]`
    var ends_with_s = String.raw`[s]`
    var starts_or_ends_with = String.raw`\b`

    var result = false
    var exceptions = data.ingredients

    var random_exclusions = exclusions.phrases
    var exception_found = false
    var random_exception_found = false
    var ingredients_with_exceptions = []
    var l, m, n, c

    var exclusion_list = [ '"dog food"', ]
    for(x in random_exclusions){
      // console.log("random_exclusions[x]: " + random_exclusions[x])
      exclusion_list.push(random_exclusions[x])
    }

    for(l in ingredients){
        var next_ingredient = false
        var length = ingredients.length
        var words = []

        if(l === '0'){
            var w
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
                     break;
                 }
             }

        }

        for(m in exceptions){

            if(next_ingredient){
                break;
            }

            if(exceptions[m]["name"] === ingredients[l]){
                var exclude = exceptions[m]['exclude']

                for(n in exclude){
                    words.push(exclude[n]['word'])
                }
                var words_count = -1

                for(c in words){

                    words_count += 1
                    var ingredient = words[c]
                    var length_integer = parseInt(words.length)
                    var last_ind = length_integer-1
                    console.log("checking exception ingredient: " + ingredient)
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
                          next_ingredient = true
                          break;
                    }else if(exception_found === false && words_count === words.length){
                          next_ingredient = true
                          break;
                    }

                }

            }

        }

    }

    if(ingredients.length > ingredients_with_exceptions.length){
        exception_found = false
    }

   return [exception_found,ingredients_with_exceptions,random_exception_found];

 };



export { FindIngredient, FindExceptions };
