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

    api = f"https://api.edamam.com/api/recipes/v2?type=public&q={staple}&app_id=2e0223626b3cd85bbeedb8598d9bff50&field=label"
    try:
        results = requests.get(api, verify=False)
    except:
        print("error calling api")
        return 0;
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
        while len(responses) < 2:
            x = 1
            while x < 10:
                url = next
                print(f"{x+1} next url: {url}")
                call = requests.get(url, verify=False)
                resp = call.json()
                next = resp['_links']['next']['href']
                responses.append(resp)                             # Gets 10 pages (10 api hits), sleeps for a minute before
                x += 1
                                                                   # calling the next 10 (max api hits/min = 10)
            print(f"starting sleep #{x}")
            time.sleep(60)
            print(f"finished sleep #{x}")

    print(f"len(responses): {len(responses)}")
    # print(f"responses[3]['hits'][0]['recipe']['label']: {responses[2]['hits'][0]['recipe']['label']}")
    # print(f"responses[9]['hits'][0]['recipe']['label']: {responses[9]['hits'][0]['recipe']['label']}")

    recipe_links = []
    for x in responses:                                            # Gets each individual recipe's link from main response,
        recipe = x['hits']                                         # stores in recipe_links list.
        for y in recipe:
            link = y['_links']['self']['href']
            recipe_links.append(link)
    # print(f"len(recipe_links): {len(recipe_links)}")
    # print(f"recipe_links[5]: {recipe_links[5]}")


    length = len(recipe_links)
    max_rounds = length/10
    recipe_round = 0
    individual_recipes = []
    # print(f"recipe link count: {length}")
    # print(f"max_rounds: {max_rounds}")
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
            z = requests.get(url, verify=False)
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
                # print(f"{a}")
        except KeyError as error:                                 # Gets ingredients from each recipe, stores
            continue                                              # in ingredients_list


    # print(f"0: {ingredients_list[0]}")
    # print(f"50: {ingredients_list[50]}\n")

    for ingredient in ingredients_list:
        length = len(ingredient)
        last_char = length - 1
        new_ingredient = ingredient + ' '
        ind = ingredients_list.index(ingredient)
        ingredients_list.pop(ind)
        ingredients_list.insert(ind,new_ingredient)

    for word in ingredient:
        word.lower()

    i=0
    x=0
    while i < 80:
        print(f"{x} initial: '{ingredients_list[x]}'")
        i += 1
        x += 1

    return ingredients_list;




def clean_ingredients(ingredients):

    if ingredients == 0:
        print("Error - 0 ingredients passed in")
        return 0;

    ingredients_list = ingredients

    quantities = [' oz ', ' ozs ', ' lb ', ' lbs ', ' gram ', ' grams ', ' kg ', ' kgs ',
    ' kilo ', ' kilos ', ' kilograms ', ' cup ', ' cups ', ' tsp ', ' tsps ', ' teaspoon ', ' teaspoons ',
    ' tbsp ', ' tbsps ', ' tablespoon ', ' tablespoons ', ' dessert spoon ', ' dessert spoons ',
    ' ladle ', ' ladles ', ' ml ', ' mls ', ' millilitre ', ' millilitres ', ' milliliters ',
    ' milliliter ', ' litre ', ' litres ', ' liter ', ' liters ', ' pints ', ' pint ', ' spoon ',
    ' spoons ', ' knob ', ' knobs ', ' slice ', ' slices ', ' jug ', ' jugs ', ' gallon ', ' gallons '
    ' ounce ', ' ounces ', ' pound ', ' pounds ', ' quart ', ' quarts ', ' large ', ' small ', ' medium ',
    ' pt ', ' pts ', ' qt ', ' qts ', ' fl ', ' c ', ' stick ', ' sticks ', ' pinch ', ' pinches ', ' dash ',
    ' dashes ', ' drop ', ' drops ', ' wineglass ', ' pottle ', ' pottles ', ' cubes ', ' cube ', ' pouch ',
    ' pouches ', ' pod ', ' pods ', ' bunch ', ' bunches ', ' handful ', ' tbs ', ' chunk ', ' chunks ', ' heap ',
    ' heaps ', ' spears ', ' spear ', ' handfuls ', ' cm ', ' cms ', ' thumb ', ' thumbs ', ' thumb-sized ',
    ' ribbon ', ' ribbons ', ' pack ', ' packet ', ' bag ', ' bags ', ' shake ', ' dollop ',
    ' dollops ', ' good ', ' decent ', ' l ', ' bulb ', ' bulbs ', ' sachet ', ' sachets ', ' few ', ' stalk ',
    ' stalks ', ' lengths ', ' length ', ' clove ', ' cloves ', ' sprig ', ' sprigs ', ' rounded ',
    ' wineglasses ', ' wine glass ', ' wine glasses ', ' glass ', ' glasses ', ' wedge ', ' wedges ', ' floret ',
    ' florets ', ' punnet ', ' punnets ', ' cob ', ' cobs ', ' inch ', ' inches ', ' pieces ', ' piece ', ' table ',
     ' frond ', ' fronds ', ' nest ', ' nests ', ' jar ', ' jars ', ' hearts ', ' heart ', ' moons ', ' moon ',
     ' splash ', ' splashes ', 'tsp ', 'tbsp ', ]

    number_words = [' one ', ' two ', ' three ', ' four ', ' five ', ' six ', ' seven ', ' eight ', ' nine ', ' ten ',
    ' twenty ', ' thirty ', ' forty ', ' fifty ', ' sixty ', ' seventy ', ' eighty ', ' ninety ', ' one hundred ', ]

    fractions = [' whole ', ' half ', ' halves ', ' third ', ' thirds ', ' quarter ', ' quarters ', ' fifth ', ' fifths ',
    ' eighth ', ' eighths ', '1/2', '1/3', '1/4', '1/5', '1/8',]

    expression_one = '\d+[.0g,.0gs,.0grams,.0gram,.0oz,.0ozs,.0lb,.0lbs,.0kg,.0kgs,.0kilos,.0kilograms,.0cup,.0cups,.0tsp,.0tsps,.0teaspoon,.0teaspoons,.0tbsp,.0tbsps,.0tablespoon,.0tablespoons,.0ml,.0mls,.0ounce,.0ounces,.0pt,.0pts,.0qt,.0qts,.0fl,.0c,.0tbs,.0table,.0cm,.0cms,.0l,.0ls,.0inch,.0inches]'
    expression_two = '\d+[.g,.gs,.grams,.gram,.oz,.ozs,.lb,.lbs,.kg,.kgs,.kilos,.kilograms,.cup,.cups,.tsp,.tsps,.teaspoon,.teaspoons,.tbsp,.tbsps,.tablespoon,.tablespoons,.ml,.mls,.ounce,.ounces,.pt,.pts,.qt,.qts,.fl,.c,.tbs,.table,.cm,.cms,.l,.ls,.inch,.inches]'
    expression_three = '\d+[g,gs,grams,gram,oz,ozs,lb,lbs,kg,kgs,kilos,kilograms,cup,cups,tsp,tsps,teaspoon,teaspoons,tbsp,tbsps,tablespoon,tablespoons,ml,mls,ounce,ounces,pt,pts,qt,qts,fl,c,tbs,table,cm,cms,l,ls,inch,inches]'

    other = [' de-stalked ', ' to taste ', ' sliced ', ' cleaned ', ' deshelled ', ' shell on ', ' shell off ',
    ' shell on or off ', ' to serve ', ' chopped ', ' defrosted ', ' julienne ', ' unripe ', ' unriped ', ' unripened ', ' serve ',
    ' premium ', ' quality ', ' optional ', ' finely ', ' roughly ', ' for garnish ', ' crushed ', ' buttered ', ' brushed ',
    ' garnish ', ' brush ', ' brushing ', ' extra ', ' plus ', ' zest ', ' zest and juice ', ' juice of ', ' juiced ', ' squeeze ',
    ' grate ', ' raw ', ' peeled ', ' peel ', ' made up to ', ' made ', ' remove ', ' removed ', ' unshelled ', ' preferably ',
    " don't ", ' like ', ' too ', ' hot ', ' cold ', ' do ', ' dislike ', ' spicy ', ' ones ', ' seed ', ' prefer ',
    ' pits ', ' pit ', ' pitted ', ' sliced ', ' chop ', ' defrost ', ' shelled ', ' shell ', ' crush ', ' more ', ' zested ', ' deseeded ',
    ' frying ', ' leaves and stalks ', ' frozen ', ' cooked ', ' cut ', ' skinless ', ' boneless ', ' bones in ', ' skin on ',
    ' beaten ', ' beat ', ' snip ', ' snipped ', ' mash ', ' mashed ', ' halved ', ' diagonally ', ' lengthways ', ' lengthway ',
    ' reduced-fat ', ' reduced fat ', ' full-fat ', ' full fat ', ' extra-light ', ' extra light ', ' reduced-sugar ', ' reduced sugar ',
    ' very ', ' healthy ', ' freeze ', ' de-seeded ', ' into ', ' d iced ', ' dice ', ' generous ', ' portion ', ' vegetarian ',
    ' version ', ' cored ', ' core ', ' cores ', ' couple ', ' picked ', ' keep ', ' shred ', ' shredded ', ' thinly ', ' thin ',
    ' heads ', ' tail ', ' left ', ' deveined ', ' make ', ' substitutes ', ' substitute ', ' depending ', ' same ', ' thing ', ' washed ',
    ' wash ', ' patted ', ' pat ', ' dry ', ' table ', ' omit ', ' omitted ', ' using ', ' used ', ' use ', ' very ', ' quite ', ' try ',
    ' find ', ' really ', ' slightly ', ' butterfly ', ' butterflied ', ' see ', ' tip ', ' below ', ' above ', ' left ', ' right ',
    ' from ', ' angle ', ' sustainable ', ' sources ', ' organic ', ' vegan ', ' cracked ', ' crack ', ' (shrimp) ', ' (prawns) ',
    ' soft ', ' podded ', ' light ', ' ripe ', ' ripened ', ' quartered ', ' tops ', ' reserved ', ' leafy ', ' kernels ', ' tastes ',
    ' taste ', ' season ', ' seasoned ', ' according ', ' drained ', ' drain ', ' straight-to-wok ', ' straight to wok ',
    ' separate ', ' separated ', ' julienned ', ' torn ', ' tear ', ' big ', ' size ', ' sized ', ' about ', ' approx ', ' approximately ',
    ' around ', ' rustic ', ' broken ', ' crumbled ', ' break ', ' trim ', ' trimmed ', ' lengthwise ', ' coarse ', ' coarsely ', ' intact ',
    ' shallow-frying ', ' shallow frying ', ' grill ', ' head-on ', ' tail-on ', ' free-range ', ' free range ', ' free ', ' low ',
    ' low-salt ', ' such as ', ' such ', ' eg ', ' blanched ', ' blanch ', ' woody ', ' santa barbara ', ' low-sodium ', ' thin-stemmed ',
    ' stemmed ', ' stem ', ' stems ', ' shapes ', ' half-fat ', ' half fat ', ' North Atlantic ', ' variety ', ' long ', ' day-old ',
    ' skin-on ', ' skin-off ', ' skin off ', ' pulled apart ', ' pulled off ', ' divided ', ' divide ', ' room temperature ',
    ' temperature ', ' split ', ' scrape ', ' scraped ', ' hour ', ' minutes ', ' minute ', ' mins ', ' min ', ' maximum ', ' max ',
    ' minimum ', ' package ', ' packaging ', ' packaged ', ' only ', ' african ', ' boiling ', ' boiled ', ' available ', ' from ',
    ' middle ', ' eastern ', ' stores ', ' fleshy ', ' flesh ', ' store ', ' supermarket ', ' supermarkets ', ' grilled ', ' seeded ',
    ' heads ', ' lightly ', ' shells ', ' central ', " Patak's ", ' original ', ' Balti ', ' Korma ', ' skin ', ' pink skin ',
    ' knife ', ' thawed ', ' thaw ', ' whites ', ' greens ', ' save ', ' goes ', ' well ', ' budget ', ' range ', ' long-stem ', ' bashed ',
    ' bash ', ' smash ', ' smashed ', ' de-frosted ', ' ready-made ', ' ready made ', ' pre-cooked ', ' precooked ', ' skins ', ' bias ',
    ' good-quality ', ]

    short = [' of ', ' x ', ' for ', ' each ', ' into ', ' if ', ' we ', ' you ', ' on ', ' but ', ' how ', ' it ', ' yes ', ' no ',
    ' they ', ' are ', ' at ', ' an ', ' to ', ' off ', ' I ', ' their ', ' with ', ' both ',]

    emoji = '^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])'
    symbols = [ emoji, ]
    # add 'and' and 'a' to list?
    # squeezed if not after freshly, juice if before or after lime, lemon
    # replace eggwhite or egg white or egg yolk with egg
    # knock s off of tins, cans.

    all_matches = []

    for ingr in ingredients_list:
        match = re.search(expression_one,ingr)
        # print(f"match: '{match}'")

        match_indexes = [(match.start(0), match.end(0)) for match in re.finditer(expression_one,ingr)]
        if len(match_indexes)>0:
            # print(f"1 ingr: {ingr}")
            first_start = match_indexes[0][0]
            first_end = match_indexes[0][1] + 1
            # print(f"1 ingr[first_start:first_end]: {ingr[first_start:first_end]}")
            all_matches.append(match_indexes)
        else:
            all_matches.append('pass')

    if len(all_matches) > 0:
        for element in all_matches:
            if element != 'pass':
                x = all_matches.index(element)
                match_ingredient = ingredients_list[x]
                start = element[0][0]
                end = element[0][1] + 1
                new_ingredient = match_ingredient[0:start] + ' ' + match_ingredient[end:]
                # print(f"1. new_ingredient: '{new_ingredient}' ")
                ingredients_list.pop(x)
                ingredients_list.insert(x,new_ingredient)


    all_matches = []

    for ingr in ingredients_list:
        match_indexes = [(match.start(0), match.end(0)) for match in re.finditer(expression_two,ingr)]
        if len(match_indexes)>0:
            # print(f"2 ingr: {ingr}")
            first_start = match_indexes[0][0]
            first_end = match_indexes[0][1] + 1
            # print(f"2 ingr[first_start:first_end]: {ingr[first_start:first_end]}")
            all_matches.append(match_indexes)
        else:
            all_matches.append('pass')

    if len(all_matches) > 0:
        for element in all_matches:
            if element != 'pass':
                x = all_matches.index(element)
                match_ingredient = ingredients_list[x]
                start = element[0][0]
                end = element[0][1] + 1
                new_ingredient = match_ingredient[0:start] + ' ' + match_ingredient[end:]
                # print(f"2. new_ingredient: '{new_ingredient}' ")
                ingredients_list.pop(x)
                ingredients_list.insert(x,new_ingredient)


    # look for above words/regex expressions first, delete them:

    for word in quantities:
        for ingr in ingredients_list:
            if word in ingr:
                length = len(word)
                first_section = ingr.index(word)  ## index at which word starts in the ingredient
                end_section = first_section+(length)  ## index at which the word ends +1
                ingr_altered = ingr[0:first_section] + ' ' + ingr[end_section:]
                i = ingredients_list.index(ingr)
                ingredients_list.pop(i)
                ingredients_list.insert(i,ingr_altered)

    for word in number_words:
        for ingr in ingredients_list:
            if word in ingr:
                length = len(word)
                first_section = ingr.index(word)  ## index at which word starts in the ingredient
                end_section = first_section+(length)  ## index at which the word ends +1
                ingr_altered = ingr[0:first_section] + ' ' + ingr[end_section:]
                i = ingredients_list.index(ingr)
                ingredients_list.pop(i)
                ingredients_list.insert(i,ingr_altered)

    for word in fractions:
        for ingr in ingredients_list:
            if word in ingr:
                length = len(word)
                first_section = ingr.index(word)  ## index at which word starts in the ingredient
                end_section = first_section+(length)  ## index at which the word ends +1
                ingr_altered = ingr[0:first_section] + ' ' + ingr[end_section:]
                i = ingredients_list.index(ingr)
                ingredients_list.pop(i)
                ingredients_list.insert(i,ingr_altered)

    for word in short:
        for ingr in ingredients_list:
            # print(f"ingr: '{ingr}'")
            if word in ingr:
                length = len(word)
                first_section = ingr.index(word)  ## index at which word starts in the ingredient
                end_section = first_section+(length)  ## index at which the word ends +1
                ingr_altered = ingr[0:first_section] + ' ' + ingr[end_section:]
                i = ingredients_list.index(ingr)
                ingredients_list.pop(i)
                ingredients_list.insert(i,ingr_altered)

    for word in other:
        for ingr in ingredients_list:
            if word in ingr:
                length = len(word)
                first_section = ingr.index(word)  ## index at which word starts in the ingredient
                end_section = first_section+(length)  ## index at which the word ends +1
                ingr_altered = ingr[0:first_section] + ' ' + ingr[end_section:]
                i = ingredients_list.index(ingr)
                ingredients_list.pop(i)
                ingredients_list.insert(i,ingr_altered)


    # for x in ingredients_list:
    #     print(f"initial x: {x}")

    punctuation = [',', '"', '.', '!', '?', '/', ':', ';', '+', '*', '(', ')', ]
    numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',]

    # # Delete the above characters from ingredients_list:
    # new = []
    # for item in ingredients_list:               # Checks each string item in ingredients_list
    #     # print(f"checking final list ingredient {item}")
    #     for x in item:
    #         if x in numbers or x in punctuation:
    #             continue                     # Doesn't append character if found in 'punctuation' or 'numbers' list
    #         else:
    #             new.append(x)                     # Appends all other letters/spaces
    #     if ingredients_list.index(item) != (len(ingredients_list) -1):
    #         # print(f"index: {ingredients_list.index(item)}")
    #         # print(f"item: {item}")
    #         new.append('|')                       # no '|' separator added at the end of the ingredients_list
    #     i = ingredients_list.index(item)
    #     ingredients_list.pop(i)                   # Delete the item from ingredients_list now that all of its characters are valid
    #     ingredients_list.insert(i,new)            # insert 'new' item in its place
    #
    # ingredients_list = ingredients_list[0]        # Flatten the ingredients_list array
    # ingredients_list = ''.join(ingredients_list)  # Join separated characters back into one string
    # new_list = ingredients_list.split('|')        # Separates each ingredient back into individual strings

    # for x in new_list:
    #     print(f"middle x: {x}")

    # for item in new_list:
    #     length = len(item)
    #     if item[0] == ' ':
    #         new_item = item[1:]                   # checks for space at start of string, if so then
    #         i = new_list.index(item)              #  creates new string without the space, replaces
    #         new_list.pop(i)                       #  original string in the list with new string.
    #         new_list.insert(i,new_item)
    #     # else:
    #     #     print("ok")
    #
    # for item in new_list:
    #     last_char = len(item)-1
    #     upto = last_char-1
    #     if len(item) not in [0,] and item[last_char] == ' ':
    #         new_item = item[0:upto]                 # checks for space at start of string, if so then
    #         i = new_list.index(item)              #  creates new string without the space, replaces
    #         new_list.pop(i)                       #  original string in the list with new string.
    #         new_list.insert(i,new_item)


    # if 'or' found, separate into two ingredients

    # i=0
    # x=20
    # while i < 60:
    #     print(f"{x} final: '{new_list[x]}'")
    #     i += 1
    #     x += 1

    i=0
    x=0
    while i < 80:
        print(f"{x} final: '{ingredients_list[x]}'")
        i += 1
        x += 1

    # for x in new_list:
    #     print(f"final x: {x}")

    cleaned_ingredients = []

    return cleaned_ingredients;


if __name__ == "__main__":
    ingredients = collect_ingredients()
    cleaned_ingredients = clean_ingredients(ingredients)
