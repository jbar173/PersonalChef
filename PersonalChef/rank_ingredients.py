# import get_common_ingredients
import clean_ingredient_data_test
import json
import os

# ingredients = get_common_ingredients.collect_ingredients()
# cleaned_ingredients = get_common_ingredients.clean_ingredients(ingredients)

# cleaned_ingredients = ['eggs', 'eggs', 'eggs', 'eggs', 'bacon', 'orange', 'lemon', 'lime', 'apple', 'noodles', 'noodles', 'chips', 'steak', 'steak', 'salmon', 'haddock', 'white chocolate', 'skittles',]
cleaned_ingredients = clean_ingredient_data_test.cleaned_ingredients

def count_ingredient_occurances(cleaned_ingredients):
    list = cleaned_ingredients
    already_found = {}
    length = len(list)
    found = False

    for item in list:
        for key in already_found.keys():
            if key == item:
                already_found[key] = int(already_found[key])
                already_found[key] += 1
                already_found[key] = str(already_found[key])
                found = True
                break
        if found == True:
            # print("found")
            found = False
            # list.pop(item)
        else:
            already_found[item] = '1'

    for x in already_found:
        print(f"{x}: {already_found[x]}")

    return already_found


def convert_to_json(ingredients_py_dictionary):
    d = {"name": "all_ingredients",
         "children": [{"name": key, "count": value} for key,value in ingredients_py_dictionary.items()]}
    j = json.dumps(d,indent=4)
    directory = os.getcwd()

    try:
        f = open(f"{directory}\\components\\checklists\\json_ingredient_lists\\all.json", 'w+')
        f.write(j)
        # print(f"j only: {j}")
        # print(f"type(j): {type(j)}")
        # print(f"type(f): {type(f)}")
        print(f"f: {f}, j: {j}")
        f.close()
    except OSError as e:
        print(f"exception: {e}")

    return j

# ranked_dict = count_ingredient_occurances(cleaned_ingredients)
# ingredients_json = convert_to_json(ranked_dict)


# ranked_dict = count_ingredient_occurances(cleaned_ingredients)
# ingredients_json = convert_to_json(ranked_dict)



if __name__ == '__main__':

    ranked_dict = count_ingredient_occurances(cleaned_ingredients)
    ingredients_json = convert_to_json(ranked_dict)
