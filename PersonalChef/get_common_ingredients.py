import requests
import time
import re
# from .keys import (id,key)


##### Script to collect ingredients, in order to populate app ingredient lists.
###   Will also be used to rank inrgedient popularity which will be used for
###    functionality in the app (at AlterKeywords.js via IngredientsRanked.js).

def collect_ingredients():

    common_staples_to_search_with = ['chicken','mince','salmon','pasta','lettuce','cheese','milk','rice','peppers','tomatoes','eggs']

    staple = 'prawns'
    responses = []
    # app_id = id
    # app_key = key

    api = f"https://api.edamam.com/api/recipes/v2?type=public&q=${staple}&app_id=f70ab024&app_key=1bc57900faadcf33ca18df72b930788e&field=label"
    results = requests.get(api)
    response = results.json()                                     # Returns first page of responses
    responses.append(response)
    one_call = False
    count = response['count']                                     # Count = how many individual recipes are returned by search
    if count > 20:
        list_pages = count/20                                     # How many pages need to be called (20 recipes per page)
        next = response['_links']['next']['href']
    else:
        one_call = True

    if one_call == False:
        # while len(responses) < list_pages:
        while len(responses) < 9:
            x = 1
            while x < 10:
                url = next
                # print(f"{x+1} next url: {url}")
                call = requests.get(url)
                resp = call.json()
                next = resp['_links']['next']['href']
                responses.append(resp)                             # Gets 10 pages (10 api hits), sleeps for a minute before
                x += 1
                                                                   # calling the next 10 (max api hits/min = 10)
            print(f"starting sleep #{x}")
            time.sleep(60)
            print(f"finished sleep #{x}")

    print(f"len(responses): {len(responses)}")
    print(f"responses[3]['hits'][0]['recipe']['label']: {responses[2]['hits'][0]['recipe']['label']}")
    print(f"responses[9]['hits'][0]['recipe']['label']: {responses[9]['hits'][0]['recipe']['label']}")

    recipe_links = []
    for x in responses:                                            # Gets each individual recipe's link from main response,
        recipe = x['hits']                                         # stores in recipe_links list.
        for y in recipe:
            link = y['_links']['self']['href']
            recipe_links.append(link)
    print(f"len(recipe_links): {len(recipe_links)}")
    print(f"recipe_links[5]: {recipe_links[5]}")


    length = len(recipe_links)
    max_rounds = length/10
    recipe_round = 0
    individual_recipes = []
    print(f"recipe link count: {length}")
    print(f"max_rounds: {max_rounds}")
    x=1
    while x < max_rounds:
        first_index = recipe_round
        # print(f"first_index: {first_index}")
        second_index = recipe_round+10
        # print(f"second_index: {second_index}")
        this_slice = slice(first_index,second_index)
        this_round = recipe_links[this_slice]
        for y in this_round:
            url = f"{y}"
            print(f"url: {url}")
            z = requests.get(url)
            result = z.json()
            individual_recipes.append(result)
        x += 1
        recipe_round = second_index                              # Gets 10 individual recipes (10 api hits),
        print("second sleep started")
        time.sleep(60)                                           # sleeps for a minute before calling the next 10
        print("second sleep ended")

    ingredients_list = []
    for x in individual_recipes:
        try:
            # print(f"x['recipe']['label']: {x['recipe']['label']}")
            ings = x['recipe']['ingredients']
            for z in ings:
                a = z['text']
                ingredients_list.append(a)
                print(f"{a}")
        except KeyError as error:                                 # Gets ingredients from each recipe, stores
            continue                                              # in ingredients_list


    # print(f"0: {ingredients_list[0]}")
    # print(f"50: {ingredients_list[50]}\n")

    for ingredient in ingredients_list:
        for word in ingredient:
            word.lower()

    return ingredients_list;




def clean_ingredients(ingredients):

    ingredients_list = ingredients

    quantities = ['oz ', 'ozs ', 'lb ', 'lbs ', 'g ', 'gs ', 'gram ', 'grams ', 'kg ', 'kgs ',
    'kilo ', 'kilos ', 'kilograms ', 'cup ', 'cups ', 'tsp ', 'tsps ', 'teaspoon ', 'teaspoons ',
    'tbsp ', 'tbsps ', 'tablespoon ', 'tablespooons ', 'dessert spoon ', 'dessert spoons ',
    'ladle ', 'ladles ', 'ml ', 'mls ', 'millilitre ', 'millilitres ', 'milliliters ',
    'milliliter ', 'litre ', 'litres ', 'liter ', 'liters ', 'pints ', 'pint ', 'spoon ',
    'spoons ', 'knob ', 'knobs ', 'slice ', 'slices ', 'jug ', 'jugs ', 'gallon ', 'gallons '
    'ounce ', 'ounces ', 'pound ', 'pounds ', 'quart ', 'quarts ', 'large ', 'small ', 'medium ',
    'pt ', 'pts ', 'qt ', 'qts ', 'fl ', 'c ', 'stick ', 'sticks ', 'pinch ', 'pinches ', 'dash ',
    'dashes ', 'drop ', 'drops ', 'wineglass ', 'pottle ', 'pottles ', 'cubes ', 'cube ', ]
    number_words = ['one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ']
    fractions = ['half ', 'halves ', 'third ', 'thirds ', 'quarter ', 'quarters ', 'fifth ', 'fifths ',
    'eighth ', 'eighths ', ]                                                                                   # them, then split the string into chars
    other = ['of ', ]

    # look for above words first, delete them:
    for word in quantities:
        for ingr in ingredients_list:
            if word in ingr:
                length = len(word)
                first_section = ingr.index(word)  ## index at which word starts in the ingredient
                end_section = first_section+(length)  ## index at which the word ends +1
                ingr_altered = ingr[0:first_section] + ingr[end_section:]
                i = ingredients_list.index(ingr)
                ingredients_list.pop(i)
                ingredients_list.insert(i,ingr_altered)

    for word in number_words:
        for ingr in ingredients_list:
            if word in ingr:
                length = len(word)
                first_section = ingr.index(word)  ## index at which word starts in the ingredient
                end_section = first_section+(length)  ## index at which the word ends +1
                ingr_altered = ingr[0:first_section] + ingr[end_section:]
                i = ingredients_list.index(ingr)
                ingredients_list.pop(i)
                ingredients_list.insert(i,ingr_altered)

    for word in fractions:
        for ingr in ingredients_list:
            if word in ingr:
                length = len(word)
                first_section = ingr.index(word)  ## index at which word starts in the ingredient
                end_section = first_section+(length)  ## index at which the word ends +1
                ingr_altered = ingr[0:first_section] + ingr[end_section:]
                i = ingredients_list.index(ingr)
                ingredients_list.pop(i)
                ingredients_list.insert(i,ingr_altered)

    for word in other:
        for ingr in ingredients_list:
            if word in ingr:
                length = len(word)
                first_section = ingr.index(word)  ## index at which word starts in the ingredient
                end_section = first_section+(length)  ## index at which the word ends +1
                ingr_altered = ingr[0:first_section] + ingr[end_section:]
                i = ingredients_list.index(ingr)
                ingredients_list.pop(i)
                ingredients_list.insert(i,ingr_altered)

    # for x in ingredients_list:
    #     print(f"initial x: {x}")

    punctuation = [ " ' ", ' , ', ' " ', ' . ', ' ! ', ' ? ', ' / ', ' : ', ' ; ', ' + ', ' * ', ]
    numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',]

    # Delete the above characters from ingredients_list:
    new = []
    for item in ingredients_list:               # Checks each string item in ingredients_list
        # print(f"checking final list ingredient {item}")
        for x in item:
            if x in numbers or x in punctuation:
                print("pass")                     # Doesn't append character if found in 'punctuation' or 'numbers' list
            else:
                new.append(x)                     # Appends all other letters/spaces
        if ingredients_list.index(item) != (len(ingredients_list) -1):
            print(f"index: {ingredients_list.index(item)}")
            print(f"item: {item}")
            new.append('|')                       # no '|' separator added at the end of the ingredients_list
        i = ingredients_list.index(item)
        ingredients_list.pop(i)                   # Delete the item from ingredients_list now that all of its characters are valid
        ingredients_list.insert(i,new)            # insert 'new' item in its place

    ingredients_list = ingredients_list[0]        # Flatten the ingredients_list array
    ingredients_list = ''.join(ingredients_list)  # Join separated characters back into one string
    new_list = ingredients_list.split('|')        # Separates each ingredient back into individual strings

    # for x in new_list:
    #     print(f"middle x: {x}")

    for item in new_list:
        length = len(item)
        if item[0] == ' ':
            new_item = item[1:]                   # checks for space at start of string, if so then
            i = new_list.index(item)              #  creates new string without the space, replaces
            new_list.pop(i)                       #  original string in the list with new string.
            new_list.insert(i,new_item)
        else:
            print("ok")

    for item in new_list:
        last_char = len(item)-1
        if item[last_char] == ' ':
            new_item = item[0:-2]                 # checks for space at start of string, if so then
            i = new_list.index(item)              #  creates new string without the space, replaces
            new_list.pop(i)                       #  original string in the list with new string.
            new_list.insert(i,new_item)
        else:
            print("ok 2")

    for x in new_list:
        print(f"final x: {x}")

    cleaned_ingredients = []

    return cleaned_ingredients;


if __name__ == "__main__":
    ingredients = collect_ingredients()
    cleaned_ingredients = clean_ingredients(ingredients)
