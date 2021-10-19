import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import * as data from './keywordExceptions.json';


// Searches for the user's ingredient within the recipe ingredient string:

const FindIngredient = (ingredients_to_search_for,ingredient_lower,is_key) => {

    // console.log("FindIngredient regex function starting")

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

    // console.log("INGREDIENTS.LENGTH: " + ingredients.length)
    // console.log("~~~~ Searching for ingredients: ~~~~")

    // for(x in ingredients){
    //   console.log(ingredients[x])
    // }

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

        if(regex_one.test(ingredient_lower) || regex_two.test(ingredient_lower)){
            console.log("found " + ingredient)
            console.log("in: " + ingredient_lower)
            if(x === 0){
              original_found = true
              include_words_found.push(ingredient)
            }else{
              include_words_found.push(ingredient)
            }
        }else if(regex_three.test(ingredient_lower) || regex_four.test(ingredient_lower)){
            console.log("found " + ingredient)
            console.log("in: " + ingredient_lower)
            if(x === 0){
              original_found = true
              include_words_found.push(ingredient)
            }else{
              include_words_found.push(ingredient)
            }
        }else if(regex_five.test(ingredient_lower) || regex_six.test(ingredient_lower)){
            console.log("found " + ingredient)
            console.log("in: " + ingredient_lower)
            if(x === 0){
              original_found = true
              include_words_found.push(ingredient)
            }else{
              include_words_found.push(ingredient)
            }
        }else{
            // console.log("couldn't find 'ingredient': " + ingredient)
            // console.log("in: " + ingredient_lower)
        }
     }

     if(include_words_found.length > 0){
       result = true
     }

    return [result,original_found,include_words_found];

};


// Checks whether the matching ingredient is an exception (a word listed under 'exclude' in keywordExceptions):

const FindExceptions = (ingredients,ingredient_lower) => {


    // console.log("FindExceptions regex function starting")
  // Regexes for ingredient to match:
    var no_extra_letters = String.raw`[^a-z]`
    var ends_with_s = String.raw`[s]`
    var starts_or_ends_with = String.raw`\b`

    var result = false
    var exceptions = data.ingredients
    var exception_found = false
    var ingredients_with_exceptions = []
    var l, m, n, c

    for(l in ingredients){
        var next_ingredient = false
        var words = []

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

                    if(regex_one.test(ingredient_lower) || regex_two.test(ingredient_lower)){
                          // if(ingredients.length > 1){
                              ingredients_with_exceptions.push(ingredient)
                          // }
                          console.log("R1 ingredient was " + ingredient + ", not " + ingredients[l])
                          console.log("in " + ingredient_lower)
                          exception_found = true
                          next_ingredient = true
                          break;
                    }else if(regex_three.test(ingredient_lower) || regex_four.test(ingredient_lower)){
                          // if(ingredients.length > 1){
                              ingredients_with_exceptions.push(ingredient)
                          // }
                          console.log("R3 ingredient was " + ingredient + ", not " + ingredients[l])
                          console.log("in " + ingredient_lower)
                          exception_found = true
                          next_ingredient = true
                          break;
                    }else if(regex_five.test(ingredient_lower) || regex_six.test(ingredient_lower)){
                          // if(ingredients.length > 1){
                              ingredients_with_exceptions.push(ingredient)
                          // }
                          console.log("R5 ingredient was " + ingredient + ", not " + ingredients[l])
                          console.log("in " + ingredient_lower)
                          exception_found = true
                          next_ingredient = true
                          break;
                    }else if(exception_found === false && words_count === words.length){
                          next_ingredient = true
                          break;
                    }else{
                          // console.log("match was correct as: " + ingredients[l])
                          // console.log("in: " + ingredient_lower)
                    }

                }

            }

        }

    }

    if(ingredients.length > ingredients_with_exceptions.length){
        exception_found = false
    }

   return [exception_found,ingredients_with_exceptions];

 };




export { FindIngredient, FindExceptions };
