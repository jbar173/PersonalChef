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

    for ingredient in ingredients_list:
        new_ingredient = ingredient.lower()
        ind = ingredients_list.index(ingredient)
        ingredients_list.pop(ind)
        ingredients_list.insert(ind,new_ingredient)

    # i=0
    # x=0
    # while i < 80:
    #     print(f"{x} initial: '{ingredients_list[x]}'")
    #     i += 1
    #     x += 1

    return ingredients_list;




def clean_ingredients(ingredients):

    if ingredients == [0, undefined, [], ]:
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
    ' eighth ', ' eighths ', '1/2', '1/3', '1/4', '1/5', '1/8', '¼', '½', '¾', ]

    expression_one = '\d+[.0g,.0gs,.0grams,.0gram,.0oz,.0ozs,.0lb,.0lbs,.0kg,.0kgs,.0kilos,.0kilograms,.0cup,.0cups,.0tsp,.0tsps,.0teaspoon,.0teaspoons,.0tbsp,.0tbsps,.0tablespoon,.0tablespoons,.0ml,.0mls,.0ounce,.0ounces,.0pt,.0pts,.0qt,.0qts,.0fl,.0c,.0tbs,.0table,.0cm,.0cms,.0l,.0ls,.0inch,.0inches]'
    expression_two = '\d+[.g,.gs,.grams,.gram,.oz,.ozs,.lb,.lbs,.kg,.kgs,.kilos,.kilograms,.cup,.cups,.tsp,.tsps,.teaspoon,.teaspoons,.tbsp,.tbsps,.tablespoon,.tablespoons,.ml,.mls,.ounce,.ounces,.pt,.pts,.qt,.qts,.fl,.c,.tbs,.table,.cm,.cms,.l,.ls,.inch,.inches]'
    expression_three = '\d+[g,gs,grams,gram,oz,ozs,lb,lbs,kg,kgs,kilos,kilograms,cup,cups,tsp,tsps,teaspoon,teaspoons,tbsp,tbsps,tablespoon,tablespoons,ml,mls,ounce,ounces,pt,pts,qt,qts,fl,c,tbs,table,cm,cms,l,ls,inch,inches]'

    other = [' de-stalked ', ' seeds removed ', ' to taste ', ' sliced ', ' cleaned ', ' deshelled ', ' shell on ', ' shell off ',
    ' shell on or off ', ' grated zest ', ' to serve ', ' chopped ', ' defrosted ', ' julienne ', ' unripe ', ' unriped ', ' unripened ', ' serve ',
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
    ' good-quality ', ' tails ', ' note ', ' virgin ', ' white part ', ' green part ', ' green parts ', ' white parts ', ' bulb ',
    ' scooped ', ]

    short = [' of ', ' x ', ' for ', ' each ', ' into ', ' if ', ' we ', ' you ', ' on ', ' but ', ' how ', ' it ', ' yes ', ' no ',
    ' they ', ' are ', ' at ', ' an ', ' to ', ' off ', ' I ', ' their ', ' with ', ' both ', ' g ', ' kg ', ]

    brands = [ ' ayam ', ' patak ', " patak's ",  ]

    alt_codes = [ '☺', '☻', '♥', '♦', '♣', '♠', '•', '◘', '○', '◙', '♂', '♀', '♪', '♫', '☼', '►', '◄', '↕', '‼', '¶', '§', '▬', '↨',
    '↑', '↓', '→', '←', '∟', '↔', '▲', '▼', ]

    emoji = '^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])'
    symbols = [ emoji, ]
    # add 'and' and 'a' to list?
    # squeezed if not after freshly, juice if before or after lime, lemon
    # replace eggwhite or egg white or egg yolk with egg
    # knock s off of tins, cans.
    punctuation = [',', '"', '.', '!', '?', '/', ':', ';', '+', '*', '(', ')', ]
    numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',]



# Following code finds any matching regex (from above values, ie. expression_one, expression_two, etc) within each ingredient:

    all_matches = []
    for ingr in ingredients_list:
        # Compiles a list of indexes at which each match in the individual ingredient starts and ends:
        match_indexes = [(match.start(0), match.end(0)) for match in re.finditer(expression_three,ingr)]
        # If match/matches found in the ingredient, append their indexes to all_matches, else append 'pass':
        if len(match_indexes)>0:
            all_matches.append(match_indexes)
        else:
            all_matches.append('pass')

    count = -1
    for element in all_matches:
        count += 1
        if element != 'pass':
            if len(element) == 1:
                match_ingredient = ingredients_list[count]      ## Finds the corresponding index for the ingredient to be altered (in ingredients_list)
                start = element[0][0]
                end = element[0][1] + 1
                new_ingredient = match_ingredient[0:start] + ' ' + match_ingredient[end:] ## creates a new string (with the match cut out (using 'start' and 'end' indexes from 'element'))
                ingredients_list.pop(count)                     ## Removes original ingredient from list
                ingredients_list.insert(count,new_ingredient)   ## inserts the new, altered ingredient in its place

            elif len(element) == 2:                             ## if two matches are found within the ingredient:
                match_ingredient = ingredients_list[count]

                start_one = element[0][0]
                end_one = element[0][1] + 1
                start_two = element[1][0]
                end_two = element[1][1] + 1

                second_element = match_ingredient[start_two:end_two] ## gets the exact string value of the second match
                element_length = len(second_element)                  ## gets the length of the second match
                new_ingredient = match_ingredient[0:start_one] + ' ' + match_ingredient[end_one:] ## Reconstructs string without first match element

                second_match = new_ingredient.index(second_element) ## Searches for the second match's index, using its string value (from above)
                second_match_end = second_match + element_length    ## Gets the second match element's index using its length
                newest_ingredient = new_ingredient[0:second_match] + ' ' + new_ingredient[second_match_end:] ## Reconstructs the string again, now without second match element

                ingredients_list.pop(count)                         ## Pops old ingredient from list
                ingredients_list.insert(count,newest_ingredient)    ## inserts new one in its place
        else:
            continue

    # As above ... :
    all_matches = []
    for ingr in ingredients_list:
        match_indexes = [(match.start(0), match.end(0)) for match in re.finditer(expression_one,ingr)]
        if len(match_indexes) == 1:
            all_matches.append(match_indexes)
        else:
            all_matches.append('pass')

    count = -1
    for element in all_matches:
        count += 1
        if element != 'pass':
            if len(element) == 1:
                match_ingredient = ingredients_list[count]
                start = element[0][0]
                end = element[0][1] + 1
                new_ingredient = match_ingredient[0:start] + ' ' + match_ingredient[end:]
                ingredients_list.pop(count)
                ingredients_list.insert(count,new_ingredient)
            elif len(element) == 2:
                match_ingredient = ingredients_list[count]

                start_one = element[0][0]
                end_one = element[0][1] + 1
                start_two = element[1][0]
                end_two = element[1][1] + 1

                second_element = match_ingredient[start_two:end_two]
                element_length= len(second_element)
                new_ingredient = match_ingredient[0:start_one] + ' ' + match_ingredient[end_one:]

                second_match = new_ingredient.index(second_element)
                second_match_end = second_match + element_length
                newest_ingredient = new_ingredient[0:second_match] + ' ' + new_ingredient[second_match_end:]

                ingredients_list.pop(count)
                ingredients_list.insert(count,newest_ingredient)
        else:
            continue

    # As above ... :
    all_matches = []
    for ingr in ingredients_list:
        match_indexes = [(match.start(0), match.end(0)) for match in re.finditer(expression_two,ingr)]
        if len(match_indexes)>0:
            all_matches.append(match_indexes)
        else:
            all_matches.append('pass')

    count = -1
    for element in all_matches:
        count += 1
        if element != 'pass':
            if len(element) == 1:
                match_ingredient = ingredients_list[count]
                start = element[0][0]
                end = element[0][1] + 1
                new_ingredient = match_ingredient[0:start] + ' ' + match_ingredient[end:]
                ingredients_list.pop(count)
                ingredients_list.insert(count,new_ingredient)
            elif len(element) == 2:
                match_ingredient = ingredients_list[count]

                start_one = element[0][0]
                end_one = element[0][1] + 1
                start_two = element[1][0]
                end_two = element[1][1] + 1

                second_element = match_ingredient[start_two:end_two]
                element_length= len(second_element)
                new_ingredient = match_ingredient[0:start_one] + ' ' + match_ingredient[end_one:]

                second_match = new_ingredient.index(second_element)
                second_match_end = second_match + element_length
                newest_ingredient = new_ingredient[0:second_match] + ' ' + new_ingredient[second_match_end:]

                ingredients_list.pop(count)
                ingredients_list.insert(count,newest_ingredient)
        else:
            continue

    for x in ingredients_list:
        print(f"first x: {x}")



# Following code erases numbers and punctuation from ingredients_list:

    new = []
    for item in ingredients_list:               # Checks each string item in ingredients_list
        for x in item:
            if x in numbers or x in punctuation:
                continue                        # Doesn't append character to new list if it's found in either the 'punctuation' or 'numbers' list
            else:
                new.append(x)                   # Appends all other letters/spaces
        if ingredients_list.index(item) != (len(ingredients_list) -1):
            new.append('|')                     # '|' separator added at the end of each ingredient in the new list
        i = ingredients_list.index(item)
        ingredients_list.pop(i)                 # Deletes the original item from ingredients_list
        ingredients_list.insert(i,new)          # inserts the altered ingredient characters in its place

    ingredients_list = ingredients_list[0]      # Flatten the ingredients_list array
    ingredients_list = ''.join(ingredients_list)# Join separated characters back into one string
    new_list = ingredients_list.split('|')      # Separates each ingredient back into individual strings

    for x in new_list:
        print(f"middle x: {x}")




# Following code looks for any of the words listed in the above lists, deletes them:

    for word in quantities:
        for ingr in new_list:
            if word in ingr:
                length = len(word)
                ## index at which word/phrase starts in the ingredient:
                first_section = ingr.index(word)
                ## index at which the word/phrase ends:
                end_section = first_section+(length)
                ## Creates a new string that doesn't include the word/phrase to be cut out:
                ingr_altered = ingr[0:first_section] + ' ' + ingr[end_section:]
                i = new_list.index(ingr)
                ## Deletes original ingredient string using its index:
                new_list.pop(i)
                ## Inserts new string in its place:
                new_list.insert(i,ingr_altered)

    for word in number_words:
        for ingr in new_list:
            if word in ingr:
                length = len(word)
                first_section = ingr.index(word)  ## as above
                end_section = first_section+(length)  ## as above
                ingr_altered = ingr[0:first_section] + ' ' + ingr[end_section:]
                i = new_list.index(ingr)
                new_list.pop(i)
                new_list.insert(i,ingr_altered)

    for word in fractions:
        for ingr in new_list:
            if word in ingr:
                length = len(word)
                first_section = ingr.index(word)  ## as above
                end_section = first_section+(length)  ## as above
                ingr_altered = ingr[0:first_section] + ' ' + ingr[end_section:]
                i = new_list.index(ingr)
                new_list.pop(i)
                new_list.insert(i,ingr_altered)

    for word in short:
        for ingr in new_list:
            if word in ingr:
                length = len(word)
                first_section = ingr.index(word)  ## as above
                end_section = first_section+(length)  ## as above
                ingr_altered = ingr[0:first_section] + ' ' + ingr[end_section:]
                i = new_list.index(ingr)
                new_list.pop(i)
                new_list.insert(i,ingr_altered)

    for word in other:
        for ingr in new_list:
            if word in ingr:
                length = len(word)
                first_section = ingr.index(word)  ## as above
                end_section = first_section+(length)  ## as above
                ingr_altered = ingr[0:first_section] + ' ' + ingr[end_section:]
                i = new_list.index(ingr)
                new_list.pop(i)
                new_list.insert(i,ingr_altered)

    for word in brands:
        for ingr in new_list:
            if word in ingr:
                length = len(word)
                first_section = ingr.index(word)  ## as above
                end_section = first_section+(length)  ## as above
                ingr_altered = ingr[0:first_section] + ' ' + ingr[end_section:]
                i = new_list.index(ingr)
                new_list.pop(i)
                new_list.insert(i,ingr_altered)

    for word in alt_codes:
        for ingr in new_list:
            if word in ingr:
                length = len(word)
                first_section = ingr.index(word)  ## as above
                end_section = first_section+(length)  ## as above
                ingr_altered = ingr[0:first_section] + ' ' + ingr[end_section:]
                i = new_list.index(ingr)
                new_list.pop(i)
                new_list.insert(i,ingr_altered)


###### TO DO:  if 'or' found, separate into two ingredients

    i=0
    x=0
    while i < 80:
        print(f"{x} final: '{new_list[x]}'")
        i += 1
        x += 1

    return new_list;


if __name__ == "__main__":
    ingredients = collect_ingredients()
    cleaned_ingredients = clean_ingredients(ingredients)
