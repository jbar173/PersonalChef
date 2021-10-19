import re
import get_common_ingredients


ingredients = get_common_ingredients.ingredients


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

    quantities = [' oz ', ' ozs ', ' lb ', ' lbs ', ' gram ', ' grams ', ' kg ', ' kgs ', ' skewer ', ' skewers ',
    ' kilo ', ' kilos ', ' kilograms ', ' cup ', ' cups ', ' tsp ', ' tsps ', ' teaspoon ', ' teaspoons ',
    ' tbsp ', ' tbsps ', ' tablespoon ', ' tablespoons ', ' dessert spoon ', ' dessert spoons ', ' -inch ',
    ' ladle ', ' ladles ', ' ml ', ' mls ', ' millilitre ', ' millilitres ', ' milliliters ', ' inch-thick ',
    ' milliliter ', ' litre ', ' litres ', ' liter ', ' liters ', ' pints ', ' pint ', ' spoon ', ' strands ',
    ' spoons ', ' knob ', ' knobs ', ' slice ', ' slices ', ' jug ', ' jugs ', ' gallon ', ' gallons ', ' shakes ',
    ' ounce ', ' ounces ', ' pound ', ' pounds ', ' quart ', ' quarts ', ' large ', ' small ', ' medium ', ' pkg ',
    ' pt ', ' pts ', ' qt ', ' qts ', ' fl ', ' c ', ' stick ', ' sticks ', ' pinch ', ' pinches ', ' dash ',
    ' dashes ', ' drop ', ' drops ', ' wineglass ', ' pottle ', ' pottles ', ' cubes ', ' cube ', ' pouch ',
    ' pouches ', ' pod ', ' pods ', ' bunch ', ' bunches ', ' handful ', ' tbs ', ' chunk ', ' chunks ', ' heap ',
    ' heaps ', ' spears ', ' spear ', ' handfuls ', ' cm ', ' cms ', 'cm ', 'cms ', ' thumbs ', ' thumb-sized ',
    ' thumb ', ' ribbon ', ' ribbons ', ' pack ', ' packet ', ' bag ', ' bags ', ' shake ', ' dollop ', ' thumb-size ',
    ' dollops ', ' good ', ' decent ', ' l ', ' bulb ', ' bulbs ', ' sachet ', ' sachets ', ' few ', ' stalk ',
    ' stalks ', ' lengths ', ' length ', ' clove ', ' cloves ', ' sprig ', ' sprigs ', ' rounded ', ' strand ',
    ' wineglasses ', ' wine glass ', ' wine glasses ', ' glass ', ' glasses ', ' wedge ', ' wedges ', ' floret ',
    ' florets ', ' punnet ', ' punnets ', ' cob ', ' cobs ', ' inch ', ' inches ', ' pieces ', ' piece ', ' table ',
     ' frond ', ' fronds ', ' nest ', ' nests ', ' jar ', ' jars ', ' hearts ', ' heart ', ' moons ', ' moon ',
     ' splash ', ' splashes ', 'tsp ', 'tbsp ', ' carton ', ' shot ', ' tub ', ' lump ', ' larger ', ' little ',
     ' in a bowl of water ', ' in a bowl water ', ' in a bowl ', ' bowl ', ' shaved ', ' peeler ', ' idaho ', ' lardon ',
     ' lardons ', ' rasher ', ' rashers ', ' segments ', ' segment ', ' heaped ', ' bottle ', ' pack ', ' packs ',
     ' packed ', ' loaf ', ' loaves ', ' baton ', ' batons ', ' sprinkling ', ' block ', ' blocks ', ' some ', ' bite-size ',
     ' bite-sized ', ' bite sized ', ' bite ', ' mug ', ' twist ', ' centimeter ', ' centimeters ', ' centimetre ', ' bite size ',
     ' centimetres ', ' [lb] ', ' dusting ', ' shreds ', ' finger-length ', ' finger length ', ' tbp ', ' finger ', ' sprinkle ',
     ' log ', ' logs ', ' percent ', ' exactly ', ]

    number_words = [' one ', ' two ', ' three ', ' four ', ' five ', ' six ', ' seven ', ' eight ', ' nine ', ' ten ',
    ' twenty ', ' thirty ', ' forty ', ' fifty ', ' sixty ', ' seventy ', ' eighty ', ' ninety ', ' one hundred ', ]

    fractions = [' whole ', ' half ', ' halves ', ' third ', ' thirds ', ' quarter ', ' quarters ', ' fifth ', ' fifths ',
    ' eighth ', ' eighths ', '1/2', '1/3', '1/4', '1/5', '1/8', '¼', '½', '¾', ]

    alt_codes = [ '☺', '☻', '♥', '♦', '♣', '♠', '•', '◘', '○', '◙', '♂', '♀', '♪', '♫', '☼', '►', '◄', '↕', '‼', '¶', '§', '▬', '↨',
    '↑', '↓', '→', '←', '∟', '↔', '▲', '▼', '-inch-thick', '-pound ', '-pounds ', '-percent ', '-oz ', '-ozs ', '-ounce ', '-ounces ',
    '-inch ', '-inches ', '-lb ', '-lbs ', ]

    other = [' de-stalked ', ' seeds removed ', ' seeds in ', ' to taste ', ' sliced ', ' cleaned ', ' deshelled ', ' shell on ', ' shell off ',
    ' shell on or off ', ' to serve ', ' chopped ', ' defrosted ', ' julienne ', ' unripe ', ' unriped ', ' unripened ', ' serve ', " poor-man's ",
    ' premium ', ' grated zest ', ' quality ', ' optional ', ' finely ', ' roughly ', ' for garnish ', ' crushed ', ' buttered ', ' brushed ',
    ' garnish ', ' brush ', ' brushing ', ' extra ', ' plus ', ' zest ', ' zest and juice ', ' juice of ', ' juiced ', ' squeeze ', ' italian-style ',
    ' grate ', ' raw ', ' peeled ', ',peeled ', ' peel ', ' made up to ', ' made ', ' remove ', ' removed ', ' unshelled ', ' preferably ', ' broiler ',
    " don't ", ' like ', ' too ', ' hot ', ' cold ', ' do ', ' dislike ', ' spicy ', ' ones ', ' seed ', ' prefer ', ' steaming ', ' total ',
    ' pits ', ' pit ', ' pitted ', ' sliced ', ' chop ', ' defrost ', ' shelled ', ' shell ', ' crush ', ' more ', ' zested ', ' deseeded ',
    ' frying ', ' leaves and stalks ', ' frozen ', ' cooked ', ' cut ', ' skinless ', ' boneless ', ' bones in ', ' skin on ', ' softened ',
    ' beaten ', ' beat ', ' snip ', ' snipped ', ' mash ', ' mashed ', ' halved ', ' diagonally ', ' lengthways ', ' lengthway ', ' soften ',
    ' reduced-fat ', ' reduced fat ', ' full-fat ', ' full fat ', ' extra-light ', ' extra light ', ' reduced-sugar ', ' reduced sugar ',
    ' very ', ' healthy ', ' freeze ', ' de-seeded ', ' into ', ' d iced ', ' dice ', ' generous ', ' portion ', ' vegetarian ', ' thai bird ',
    ' version ', ' cored ', ' core ', ' cores ', ' couple ', ' picked ', ' keep ', ' shred ', ' shredded ', ' thinly ', ' thin ', ' toppings ',
    ' heads ', ' tail ', ' left ', ' deveined ', ' make ', ' substitutes ', ' substitute ', ' depending ', ' same ', ' thing ', ' washed ',
    ' wash ', ' patted ', ' pat ', ' dry ', ' table ', ' omit ', ' omitted ', ' using ', ' used ', ' use ', ' very ', ' quite ', ' try ', ' left over ',
    ' find ', ' really ', ' slightly ', ' butterfly ', ' butterflied ', ' see ', ' tip ', ' below ', ' above ', ' left ', ' right ', ' stewed ',
    ' from ', ' angle ', ' sustainable ', ' sources ', ' organic ', ' vegan ', ' cracked ', ' crack ', ' (shrimp) ', ' (prawns) ', ' taco-size ',
    ' soft ', ' podded ', ' light ', ' ripe ', ' ripened ', ' quartered ', ' tops ', ' reserved ', ' leafy ', ' kernels ', ' tastes ',
    ' taste ', ' tast ', ' season ', ' seasoned ', ' according ', ' drained ', ' drain ', ' straight-to-wok ', ' straight to wok ', ' separate ',
    ' separated ', ' seperate ', ' seperated ', ' julienned ', ' torn ', ' tear ', ' big ', ' size ', ' sized ', ' about ', ' approx ', ' approximately ',
    ' around ', ' rustic ', ' broken ', ' crumbled ', ' break ', ' trim ', ' trimmed ', ' lengthwise ', ' coarse ', ' coarsely ', ' intact ',
    ' shallow-frying ', ' shallow frying ', ' grill ', ' head-on ', ' tail-on ', ' free-range ', ' free range ', ' free ', ' low ', ' pounded out ',
    ' low-salt ', ' such as ', ' such ', ' eg ', ' blanched ', ' blanch ', ' woody ', ' santa barbara ', ' low-sodium ', ' thin-stemmed ',
    ' stemmed ', ' stem ', ' stems ', ' shapes ', ' half-fat ', ' half fat ', ' variety ', ' long ', ' day-old ', ' medium sized ', ' undrained ',
    ' skin-on ', ' skin-off ', ' skin off ', ' pulled apart ', ' pulled off ', ' divided ', ' divide ', ' room temperature ', ' topping ',
    ' temperature ', ' split ', ' scrape ', ' scraped ', ' hour ', ' minutes ', ' minute ', ' mins ', ' min ', ' maximum ', ' max ', ' indian ',
    ' minimum ', ' package ', ' packaging ', ' packaged ', ' only ', ' african ', ' boiling ', ' boiled ', ' available ', ' from ', ' additional ',
    ' middle ', ' eastern ', ' stores ', ' fleshy ', ' flesh ', ' store ', ' supermarket ', ' supermarkets ', ' grilled ', ' seeded ', ' large-diced ',
    ' heads ', ' lightly ', ' shells ', ' central ', ' original ', ' Balti ', ' Korma ', ' skin ', ' pink skin ', ' open ', ' medium-size ',
    ' knife ', ' thawed ', ' thaw ', ' whites ', ' greens ', ' save ', ' goes ', ' well ', ' budget ', ' range ', ' long-stem ', ' bashed ',
    ' bash ', ' smash ', ' smashed ', ' de-frosted ', ' ready-made ', ' ready made ', ' pre-cooked ', ' precooked ', ' skins ', ' bias ', ' basic ',
    ' good-quality ', ',seeds ', ' tails ', ' note ', ' virgin ', ' white part ', ' green part ', ' green parts ', ' white parts ', ' bulb ', " 'goes with' ",
    ' scooped ', ' hoods ', ' scored ', ' your favourite ', ' your favorite ', ' brewed ', ' optionally ', ' all purpose ', ' bones ', ' undyed ',
    ' unfrozen ', ' squeezing ', ' beard ', ' beards ', ' icelandic ', 'cleaned ', ' clean ', ' scrubbed ', ' medium-sized ', ' or a mix ', ' or a mixture',
    ' as needed ', ' kosher ', ' halal ', ' other white fish ', ' or other white fish ', ' or other firm white fish ', ' other white fish ', ' california ',
    ' overnight ', ' down the back ', ' back ', ' tentacles ', ' tubes ', ' spreading ', ' reduced-salt ', ' reduced salt ', ' vegetables ', " cook's ", ' cooks ',
    ' low-fat ', ' low fat ', ' leaving root ', ' pot ', ' hard-boiled ', ' hard boiled ', ' pea-sized ', ' pea sized ', ' best ', ' freshly ', ' prepared ',
    ' drizzling ', ' without juice ', ' dipping ', ' the other ', ' thickly ', ' adobo ', ' sustainably ', ' fished ', ' credit card ', ' credit-card ', ' cook ',
    ' rectangle ', ' rectangles ', ' square ', ' squares ', ' chilled ', ' grilling ', ' rge ', ' skinned ', ' tips and techniques ', ' tips ', ' bone-in ',
    ' atlantic ', ' north ', ' origional ', ' and some ', ' rigs ', ' gluten-free ', ' gluten free ', ' down the ', ' goes with ', ' extra-large ', ' extra large ',
    ' nonfat ', ' non fat ', ' non-fat ', '-ounce ', ' bruised ', ' matchstick ', ' matchsticks ', ' warmed ', ' greasing ', ' fat-free ', ' fat free ',
    ' virtually ', ' sheets ', ' sheet ', ' toasted ', 'free-range ', ' glb ', ' peeled and de-veined ', ' de-veined ', ' steamed ', ' serving ', ' source ', ' just ',
    ' freezing ', " can't be ", ' as the ', ' not standard ', ' standard ', ' the bigger the better ', ' calls ', ' kglb ', ' instructions ', ' crunchy ',
    ' slitted ', ' slit ', ' as per ', ' store bought ', ' store-bought ', ' bought ', ' granulated ', ' bottled ', ' desired ', ' wedged ', ' apart ', ' tough ',
    ' simmer ', ' loosely ' , ' tightly ', ' finger bowl ', ' necessary ', ' fingers ', ' servings ', ' romano ', ' uncooked ', ' school ', ' backs open ', ' gr ',
    ' deep-frying ', ' deep frying ', ' choose either or ', ' choose ', ' either ', ' rinsed in water ', ' shell-on ', ' heat ', ' heated ', ' fl ', ' grated ', ' oz ',
    ' stoned ', ' stone ', ' on the vine ', ' can be ', ' works best ', ' count ', ' drizzle ', ' unpeeled ', ' vein ', ' veins ', ' the other half ', ' rinsed ',
    ' inner leaves ', ' outer leaves ', ' roots and leaves ', ' separately ', ' is great here ', ' crusty ', ' quick-cook ', ' quick cook ', ' diced ', ' dice ',
    ' cubed ', ' cubes ', ' crosswise ', ' garnishing ', ' self-rising ', ' self-raising ', ' tender ', ' juicy ', ' wheat-free ', ' wheat free ', ' diagonal ',
    ' tube ', ' pulp ', ' soaked in water ', ' soaked in a little water ', ' soaked ', ' spanish ', ' italian ', ' headless ', ' follow ', ' follows ', ' firmly ',
    ' recipe ', ' recipes ', ' directions ', ' easy-cook ', ' easy cook ', ' bottom part ', ' asian ', ' individual ', ' ready-cooked ', ' ready cooked ', ' supremed ',
    ' cherry or plum ', ' shells-on ', ' shells on ', ' diamond crystal ', ' along spine ', ' rough ', ' \u0091\u0092 ', ' birdseye ', ' squeezed ', ' potato peeler ',
    ' will work ', ' just fine ', ' and one ', ' instant ', ' kneading ', ' the flat side ', ' half-and-half ', ' oiling the grates ', ' through the root ', ' melted ',
    ' casing ', ' discarded ', ' segmented ', ' strip ', ' strips ', ' yield ', ' kerala ', ' part ', ' green inner part ', ' inner part ', ' authentic ', ' the rest ',
    ' food ', ' rolling pin ', ' pin bones ', ' round ', ' soak in water ', ' soak ', ' smell ', ' putting ', ' thick coins ', ' the trimmings ', ' trimmings ',
    ' destoned ', ' semimoist ', ' mandoline ', ' recommended ', ' unseasoned ', ' twists ', ' thicker ', ' need ', ' soaking ', ' coconut scraper ', ' alternative ',
    ' alternatives ', ' chunky ', ' straight ', ' in water ', ' light green parts ', ' light-green parts ', ' grinding ', ' grind ', ' and the rest ', ' stir ',
    ' stirred ', ' buy ', ' straggly ', ' ends ', ' bigger ', ' per ', ' desire ', ' combine ', ' combination ', ' metric ', ' imperial ', " bird's eye ", ' left-over ',
    ' birds eye ', ' birds-eye ', " bird's-eye ", ' dust ', ' grocers ', ' stir-fry ', ' stri fry ', ' mixed with water ', ' ready-rolled ', ' ready-rolled ',
    ' debearded ', ' debeard ', ' put the ', ' all once ', ' all at once ', ' gradually ', ' water the dough ', ' kept warm ', ' kept ', ' wholes ', ' mixed with ',
    ' form a smooth paste ', ' forms a smooth paste ', ' not sure ', ' weighing ', ' weight ', ' weigh ', ' fried ', ' baking ', 'bakes ', ' bake ', ' parchment ',
    ' tray ', ' along ', ' works ', ' brand ', ' ready ', ' goz ', ' sprinkled ', ' put in water ', ' in water ', ' fronds ', ' tops ', ' medium-grain ', ' medium grain ',
    ' dough ', ' cut off ', ' g lb]', ' basmati ', ' pilau ', ' omlette ', ' omlettes ', ' semi-skimmed ', ' all purposewholemeal ', 'all-purpose ', ' no-salt-added ',
    ' alcohol-free ', ' alcohol free ', ' less-sodium ', ' twenty-four ', ' reduced-sodium ', ' reduced sodium ', ' broiler-fryer ', ' slivered ', ' no salt added ',
    ' less-fat ', ' no-boil ', ' boil ', ' garnishes ', ' nonstick ', ' non-stick ', ' sifted ', ' sift ', ' best-quality ', ' commercial ', ' homemade ', ' home-made ',
    ' cooking ', ' lowfat ', ' substituted ', ' indulgent ', ' feeling ', ' eggwash ', ' maybe ', ' rapid ', ' scalded ', ' point ', ' hardboiled ', ' al dente ',
    ' cancadian ', ' love ', ' minus ', ' tepmperature ', ' room ', ' box grater ', ' grater ', ' horizontally ', ' waffle iron ', ' everything ', ' high smoke point ',
    ' low smoke point ', ' smoke point ', ' soapy ', ' bouquet ', ' british english ', ' in half ', ' everyday value ', ' value ', ' the top ', ' flour the work surface ',
    ' flour the surface ', ' flour the table ', ' over the top ', ' buttering ', ' dishes ', ' dish ', ' plates ', ' plate ', ]

    brands = [ ' ayam ', ' patak ', " patak's ", " waitrose ", " blue dragon ", " king edward ", " maris piper ", ' tessa ', ' kallo ', ' granny smith ', ' tilda ', ' maldon ',
    " sharwood's ", ' sharwoods ', ' old bay ', ' bonne maman ', ' jack daniels ', " jack daniel's ", ' amoy ', ' thai-food-onlinecouk ', ' amazoncom ', ' maharaja ', ' maharajah ',
    " lingham's ", ' linghams ', ' dodoni ', ' burford browns ', ' burford brown ', ' campbells ', " campbell's ", ' knudsen ', ' maesri ', ' liptons ', " lipton's ", ' swanson ',
    " kellogg's ", ' kelloggs ', ' pepperidge farms ', " pepperidge farm's ", " arnold ", " velveeta ", " kite hill ", " shelburne farms ",  ]

    short = [' of ', ' x ', ' for ', ' each ', ' into ', ' if ', ' we ', ' you ', ' on ', ' but ', ' how ', ' it ', ' yes ', ' no ',
    ' they ', ' are ', ' at ', ' an ', ' to ', ' off ', ' I ', ' their ', ' with ', ' both ', ' g ', ' any ', ' your ', ' what ', ]

    emoji = '^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])'
    # \u00bd\,
    symbols = [ emoji, ]
    # add 'and' and 'a' to list?
    # squeezed if not after freshly, juice if before or after lime, lemon
    # replace eggwhite or egg white or egg yolk with egg
    # knock s off of tins, cans.
    punctuation = [',', '"', '.', '!', '?', '/', ':', ';', '+', '*', '(', ')','%', '(r)', '$',  ]
    numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',]

    # expression_one = '\d+[.0g,.0gs,.0grams,.0gram,.0oz,.0ozs,.0lb,.0lbs,.0kg,.0kgs,.0kilos,.0kilograms,.0cup,.0cups,.0tsp,.0tsps,.0teaspoon,.0teaspoons,.0tbsp,.0tbsps,.0tablespoon,.0tablespoons,.0ml,.0mls,.0ounce,.0ounces,.0pt,.0pts,.0qt,.0qts,.0fl,.0c,.0tbs,.0table,.0cm,.0cms,.0l,.0ls,.0inch,.0inches]'
    expression_two = '\d+[.g,.gs,.grams,.gram,.oz,.ozs,.lb,.lbs,.kg,.kgs,.kilos,.kilograms,.cup,.cups,.tsp,.tsps,.teaspoon,.teaspoons,.tbsp,.tbsps,.tablespoon,.tablespoons,.ml,.mls,.ounce,.ounces,.pt,.pts,.qt,.qts,.fl,.c,.tbs,.table,.cm,.cms,.l,.ls,.inch,.inches]'
    expression_three = '\d+[g,gs,grams,gram,oz,ozs,lb,lbs,kg,kgs,kilos,kilograms,cup,cups,tsp,tsps,teaspoon,teaspoons,tbsp,tbsps,tablespoon,tablespoons,ml,mls,ounce,ounces,pt,pts,qt,qts,fl,c,tbs,table,cm,cms,l,ls,inch,inches]'


    all_matches = []

    for ingr in ingredients_list:
        match_indexes = [(match.start(0), match.end(0)) for match in re.finditer(expression_three,ingr)]
        # match_list = [match for match in re.findall(expression_three,ingr)]
        if len(match_indexes) > 0:
            all_matches.append(match_indexes)                 # either match...
            # print(f"matches found: {match_list}")
            # print(f"inside ingredient: {ingr}")
            # print(f"indexes of these matches: {match_indexes}")
        else:
            all_matches.append('pass')                        # ... or pass is placed in the matches list, in the place of each ingredient.

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
                    end_one = element[0][1]
                    start_two = element[1][0]
                    end_two = element[1][1]

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

    # for x in new_list:
    #     print(f"middle x: {x}")



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

    # for x in new_list:
    #     print(f"final final x: '{x}'")

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

cleaned_ingredients = clean_ingredients(ingredients)

# if __name__ == "__main__":
#     cleaned_ingredients = clean_ingredients(test_ingredients)
