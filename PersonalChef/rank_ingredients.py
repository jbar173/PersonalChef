
# import clean_ingredient_data_test
import json
import os
from num2words import num2words

# ingredients = get_common_ingredients.collect_ingredients()
# cleaned_ingredients = get_common_ingredients.clean_ingredients(ingredients)

# cleaned_ingredients = ['eggs', 'eggs', 'eggs', 'eggs', 'bacon', 'orange', 'lemon', 'lime', 'apple', 'noodles', 'noodles', 'chips', 'steak', 'steak', 'salmon', 'haddock', 'white chocolate', 'skittles',]
# cleaned_ingredients = clean_ingredient_data_test.cleaned_ingredients
cleaned_ingredients = [
    "brioche burger buns","sunflower oil","vegetable oil", "peanut oil", "olive oil", "olive oil", "prawns", "prawns", "prawns", "prawns",
     "spring onions","spring onions","egg", "panko breadcrumbs","white cabbage","mayonnaise","mayonnaise","sweet chilli sauce","sriracha chilli sauce",
     "limes","garlic","garlic","garlic","dried rice vermicelli noodles","green papayas","grape tomatoes","beansprouts","fresh coriander leaves",
     "fresh mint leaves","fresh thai basil leaves","fish sauce","fish sauce","brown sugar","leeks","eschalots","eschalots","ouzo","tomato paste",
     "greek feta","basil leaves","red chillies","red chillies","flat-leaf parsley leaves","flat-leaf parsley leaves","kale leaves","lemons","lemons",
     "lemons","lemons","avocados","buttermilk","milk","cream","cream cheese","vanilla extract","cooking oil","cooking spray","plum tomatoes",
     "kidney beans","tinned apricots","salt","salt","salt","pepper","pepper","pepper","cinnamon","nutmeg","turmeric","beef","chicken","pork",
     "white cabbages","apples","peppers","tomatoes","carrots","haddock","seabass","cornflour","flour","sugar","pasta","baking powder","baking soda",
     "pecans","white chocolate","milk chocolate","dark chocolate","chocolate buttons","hundreds and thousands","chocolate sprinkles","milk chocolate drops",
     "white chocolate drops","dark chocolate drops","jelly tots","smarties","skittles","maltesers","mini eggs","mini eggs","mini eggs","mini eggs","mini eggs","mini eggs","mini eggs","mini eggs","mini eggs","mini eggs","mini eggs","mini eggs","mini eggs",
     ]


def count_ingredient_occurances(cleaned_ingredients):
    list = cleaned_ingredients
    already_found = {}
    length = len(list)
    found = False

    for item in list:
        for key in already_found.keys():
            if key == item:
                already_found[key] += 1
                found = True
                break
        if found == True:
            found = False
        else:
            already_found[item] = 0

    for x in already_found:
        print(f"{x}: {already_found[x]}")

    most_popular_ingredient = max(already_found,key=already_found.get)
    highest_rank = int(already_found[f'{most_popular_ingredient}'])

    print(f"most_popular_ingredient: {most_popular_ingredient}")
    print(f"highest rank: {highest_rank}")

    return (already_found, highest_rank)


def separate_lists_by_rank(already_found,highest_rank):

    dictionaries = []
    num = 0
    while num < (highest_rank + 1):
        rank = {}
        dictionaries.append(rank)
        num += 1

    for entry in already_found.keys():
        rank = int(already_found[entry])
        dictionary = dictionaries[rank]
        dictionary[entry] = rank

    return dictionaries


def convert_to_json(ingredients_py_dictionaries):
    i = -1
    for dictionary in ingredients_py_dictionaries:
        i += 1
        word = num2words(i)
        print(f"i: {word}")

        d = {"name": f"{word}",
             "children": [{"name": key, "count": value} for key,value in dictionary.items()]}
        j = json.dumps(d,indent=4)
        directory = os.getcwd()

        try:
            file_name = word
            f = open(f"{directory}\\components\\checklists\\json_ingredient_lists\\ranked_lists\\{file_name}.json", 'w+')
            f.write(j)
            f.close()
        except OSError as e:
            print(f"exception: {e}")

    # (already_found,highest_rank) = count_ingredient_occurances(cleaned_ingredients)
    # dictionaries = separate_lists_by_rank(already_found,highest_rank)
    # convert_to_json(dictionaries)

if __name__ == '__main__':
    (already_found,highest_rank) = count_ingredient_occurances(cleaned_ingredients)
    dictionaries = separate_lists_by_rank(already_found,highest_rank)
    convert_to_json(dictionaries)
