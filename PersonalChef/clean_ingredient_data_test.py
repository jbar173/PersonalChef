import re
import get_common_ingredients


ingredients = get_common_ingredients.ingredients

# test_ingredients = [ '2 brioche burger buns', 'sunflower oil or vegetable oil, for frying', '200g raw peeled prawns',
# '1 spring onion , sliced',
# '½ egg white',
# '1 tbsp cornflour',
# '100g panko breadcrumbs',
# '¼ white cabbage , finely shredded',
# 'juice 1/2 lemon',
# '1 tbsp mayonnaise',
# '3 tbsp mayonnaise',
# '1 tbsp sriracha chilli sauce or sweet chilli sauce',
# '1 long red chilli, finely chopped',
# '1 tbsp lime juice',
# '2 garlic cloves, crushed',
# '1 tbsp peanut oil',
# '500g green prawns, peeled (tails intact), deveined',
# '100g dried rice vermicelli noodles',
# '1/2 medium green papaya, peeled, deseeded, grated (see note)',
# '1 eschalot, thinly sliced',
# '100g grape tomatoes, halved',
# '1 cup beansprouts',
# '1/2 cup fresh coriander leaves',
# '1/2 cup fresh mint leaves',
# '1/2 cup fresh Thai basil leaves',
# '2 tbsp Ayam fish sauce',
# '2 tbsp Ayam fish sauce',
# '1 tbsp brown sugar',
# '1/3 cup (80ml) extra virgin olive oil',
# '1 leek (white part only), chopped',
# '5 eschalots, chopped',
# '4 garlic cloves, thinly sliced',
# '1kg large green prawns, peeled (heads and tails intact), deveined',
# '1/3 cup (80ml) ouzo',
# '1/3 cup (95g) tomato paste',
# '250g Greek feta, crumbled',
# 'Basil leaves, chopped flat-leaf parsley leaves and crusty bread, to serve',
# '1 garlic bulb, cloves peeled',
# '5 long red chillies, seeds removed, roughly chopped',
# '200ml extra virgin olive oil',
# '16 extra large green prawns',
# '1 cup flat-leaf parsley leaves, finely chopped',
# '1 large bunch (about 500g) kale, leaves separated from stalks',
# 'Finely grated zest of 1 lemon',
# 'Juice of 1 lemon',
# '2 avocados, flesh scooped',
# '1/3 cup (80ml) buttermilk, 200ml',
# 'Juice of 1/2 lemon',
# ]


def clean_ingredients(ingredients):

    if ingredients == 0:
        print("Error - 0 ingredients passed in")
        return 0;

    ingredients_list = ingredients

    for ingredient in ingredients_list:
        length = len(ingredient)
        last_char = length - 1
        new_ingredient = ' ' + ingredient + ' '
        ind = ingredients_list.index(ingredient)
        ingredients_list.pop(ind)
        ingredients_list.insert(ind,new_ingredient)

    for ingredient in ingredients_list:
        new_ingredient = ingredient.lower()
        ind = ingredients_list.index(ingredient)
        ingredients_list.pop(ind)
        ingredients_list.insert(ind,new_ingredient)

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

    alt_codes = [ '☺', '☻', '♥', '♦', '♣', '♠', '•', '◘', '○', '◙', '♂', '♀', '♪', '♫', '☼', '►', '◄', '↕', '‼', '¶', '§', '▬', '↨',
    '↑', '↓', '→', '←', '∟', '↔', '▲', '▼', ]

    expression_one = '\d+[.0g,.0gs,.0grams,.0gram,.0oz,.0ozs,.0lb,.0lbs,.0kg,.0kgs,.0kilos,.0kilograms,.0cup,.0cups,.0tsp,.0tsps,.0teaspoon,.0teaspoons,.0tbsp,.0tbsps,.0tablespoon,.0tablespoons,.0ml,.0mls,.0ounce,.0ounces,.0pt,.0pts,.0qt,.0qts,.0fl,.0c,.0tbs,.0table,.0cm,.0cms,.0l,.0ls,.0inch,.0inches]'
    expression_two = '\d+[.g,.gs,.grams,.gram,.oz,.ozs,.lb,.lbs,.kg,.kgs,.kilos,.kilograms,.cup,.cups,.tsp,.tsps,.teaspoon,.teaspoons,.tbsp,.tbsps,.tablespoon,.tablespoons,.ml,.mls,.ounce,.ounces,.pt,.pts,.qt,.qts,.fl,.c,.tbs,.table,.cm,.cms,.l,.ls,.inch,.inches]'
    expression_three = '\d+[g,gs,grams,gram,oz,ozs,lb,lbs,kg,kgs,kilos,kilograms,cup,cups,tsp,tsps,teaspoon,teaspoons,tbsp,tbsps,tablespoon,tablespoons,ml,mls,ounce,ounces,pt,pts,qt,qts,fl,c,tbs,table,cm,cms,l,ls,inch,inches]'

    other = [' de-stalked ', ' seeds removed ', ' to taste ', ' sliced ', ' cleaned ', ' deshelled ', ' shell on ', ' shell off ',
    ' shell on or off ', ' to serve ', ' chopped ', ' defrosted ', ' julienne ', ' unripe ', ' unriped ', ' unripened ', ' serve ',
    ' premium ', ' grated zest ', ' quality ', ' optional ', ' finely ', ' roughly ', ' for garnish ', ' crushed ', ' buttered ', ' brushed ',
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
    ' heads ', ' lightly ', ' shells ', ' central ', ' original ', ' Balti ', ' Korma ', ' skin ', ' pink skin ',
    ' knife ', ' thawed ', ' thaw ', ' whites ', ' greens ', ' save ', ' goes ', ' well ', ' budget ', ' range ', ' long-stem ', ' bashed ',
    ' bash ', ' smash ', ' smashed ', ' de-frosted ', ' ready-made ', ' ready made ', ' pre-cooked ', ' precooked ', ' skins ', ' bias ',
    ' good-quality ', ',seeds ', ' tails ', ' note ', ' virgin ', ' white part ', ' green part ', ' green parts ', ' white parts ', ' bulb ',
    ' scooped ', ]

    brands = [ ' ayam ', ' patak ', " patak's ",  ]

    short = [' of ', ' x ', ' for ', ' each ', ' into ', ' if ', ' we ', ' you ', ' on ', ' but ', ' how ', ' it ', ' yes ', ' no ',
    ' they ', ' are ', ' at ', ' an ', ' to ', ' off ', ' I ', ' their ', ' with ', ' both ', ' g ',]

    emoji = '^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])'
    symbols = [ emoji, ]
    # add 'and' and 'a' to list?
    # squeezed if not after freshly, juice if before or after lime, lemon
    # replace eggwhite or egg white or egg yolk with egg
    # knock s off of tins, cans.
    punctuation = [',', '"', '.', '!', '?', '/', ':', ';', '+', '*', '(', ')', ]
    numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',]




    all_matches = []

    for ingr in ingredients_list:
        match_indexes = [(match.start(0), match.end(0)) for match in re.finditer(expression_three,ingr)]
        if len(match_indexes) > 0:
            all_matches.append(match_indexes)
        else:
            all_matches.append('pass')

    # print(f"all_matches: {all_matches}")

    if len(all_matches) > 0:
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


    all_matches = []

    for ingr in ingredients_list:
        match_indexes = [(match.start(0), match.end(0)) for match in re.finditer(expression_one,ingr)]
        if len(match_indexes) > 0:
            all_matches.append(match_indexes)
        else:
            all_matches.append('pass')

    if len(all_matches) > 0:
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

    all_matches = []

    for ingr in ingredients_list:
        match_indexes = [(match.start(0), match.end(0)) for match in re.finditer(expression_two,ingr)]
        if len(match_indexes) > 0:
            all_matches.append(match_indexes)
        else:
            all_matches.append('pass')

    if len(all_matches) > 0:
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



    new = []
    for item in ingredients_list:               # Checks each string item in ingredients_list
        for x in item:
            if x in numbers or x in punctuation:
                continue                     # Doesn't append character if found in 'punctuation' or 'numbers' list
            else:
                new.append(x)                     # Appends all other letters/spaces
        if ingredients_list.index(item) != (len(ingredients_list) -1):
            new.append('|')                       # no '|' separator added at the end of the ingredients_list
        i = ingredients_list.index(item)
        ingredients_list.pop(i)                   # Delete the item from ingredients_list now that all of its characters are valid
        ingredients_list.insert(i,new)            # insert 'new' item in its place

    ingredients_list = ingredients_list[0]        # Flatten the ingredients_list array
    ingredients_list = ''.join(ingredients_list)  # Join separated characters back into one string
    new_list = ingredients_list.split('|')        # Separates each ingredient back into individual strings

    for x in new_list:
        print(f"middle x: {x}")



# look for and delete all of the full words in the above lists:

    for word in quantities:
        for ingr in new_list:
            if word in ingr:
                length = len(word)
                first_section = ingr.index(word)  ## index at which word starts in the ingredient
                end_section = first_section+(length)  ## index at which the word ends +1
                ingr_altered = ingr[0:first_section] + ' ' + ingr[end_section:]
                i = new_list.index(ingr)
                new_list.pop(i)
                new_list.insert(i,ingr_altered)

    for word in number_words:
        for ingr in new_list:
            if word in ingr:
                length = len(word)
                first_section = ingr.index(word)  ## index at which word starts in the ingredient
                end_section = first_section+(length)  ## index at which the word ends +1
                ingr_altered = ingr[0:first_section] + ' ' + ingr[end_section:]
                i = new_list.index(ingr)
                new_list.pop(i)
                new_list.insert(i,ingr_altered)

    for word in fractions:
        for ingr in new_list:
            if word in ingr:
                length = len(word)
                first_section = ingr.index(word)  ## index at which word starts in the ingredient
                end_section = first_section+(length)  ## index at which the word ends +1
                ingr_altered = ingr[0:first_section] + ' ' + ingr[end_section:]
                i = new_list.index(ingr)
                new_list.pop(i)
                new_list.insert(i,ingr_altered)

    for word in other:
        for ingr in new_list:
            # print(f"ingr: '{ingr}'")
            if word in ingr:
                length = len(word)
                first_section = ingr.index(word)  ## index at which word starts in the ingredient
                end_section = first_section+(length)  ## index at which the word ends +1
                ingr_altered = ingr[0:first_section] + ' ' + ingr[end_section:]
                i = new_list.index(ingr)
                new_list.pop(i)
                new_list.insert(i,ingr_altered)

    for word in short:
        for ingr in new_list:
            if word in ingr:
                length = len(word)
                first_section = ingr.index(word)  ## index at which word starts in the ingredient
                end_section = first_section+(length)  ## index at which the word ends +1
                ingr_altered = ingr[0:first_section] + ' ' + ingr[end_section:]
                i = new_list.index(ingr)
                new_list.pop(i)
                new_list.insert(i,ingr_altered)

    for word in brands:
        for ingr in new_list:
            if word in ingr:
                length = len(word)
                first_section = ingr.index(word)  ## index at which word starts in the ingredient
                end_section = first_section+(length)  ## index at which the word ends +1
                ingr_altered = ingr[0:first_section] + ' ' + ingr[end_section:]
                i = new_list.index(ingr)
                new_list.pop(i)
                new_list.insert(i,ingr_altered)

    for word in alt_codes:
        for ingr in new_list:
            if word in ingr:
                length = len(word)
                first_section = ingr.index(word)  ## index at which word starts in the ingredient
                end_section = first_section+(length)  ## index at which the word ends +1
                ingr_altered = ingr[0:first_section] + ' ' + ingr[end_section:]
                i = new_list.index(ingr)
                new_list.pop(i)
                new_list.insert(i,ingr_altered)


    for x in new_list:
        print(f"final x: {x}")

# Gets rid of any spaces at beginning of ingredient:
    count = 0
    index = -1

    for ingredient in new_list:
        index += 1
        for char in ingredient:
            if char == ' ':
                count += 1
            else:
                break
        if count > 0:
            start = count
            new_ingredient = ingredient[start::]
            new_list.pop(index)
            new_list.insert(index, new_ingredient)
            count = 0

    for x in new_list:
        print(f"final final x: '{x}'")

# Gets rid of any spaces at end of ingredient:
    count = 0
    index = -1

    for ingredient in new_list:
        index += 1
        for char in ingredient[::-1]:
            if char == ' ':
                count += 1
            else:
                break
        if count > 0:
            length = len(ingredient)
            end = length - count
            to_slice = slice(0,end)
            new_ingredient = ingredient[to_slice]
            new_list.pop(index)
            new_list.insert(index, new_ingredient)
            count = 0

    for x in new_list:
        print(f"final X3 x: '{x}'")

    return new_list;

cleaned_ingredients = clean_ingredients(test_ingredients)

# if __name__ == "__main__":
#     cleaned_ingredients = clean_ingredients(test_ingredients)
