import requests
import time
import re
# from .keys import (id,key)


##### Script to collect ingredients, in order to populate ranked ingredient lists in app:

def collect_ingredients():

## done : 'prawns','chicken','mince','salmon','pasta','rice','couscous','lentils','bread','lettuce','cheese','milk',
##          'peppers','tomatoes','eggs','potatoes','couscous','spinach','cabbage',
##          'beansprouts','salad leaves','chili pepper','beef joint','pork','quinoa','flour','sugar',
##           'bell pepper','satsuma','tangerine','yoghurt','creme fraiche','onion','fresh ginger',



    common_staples_to_search_with = []

    # staple = 'prawns'
    staple =
    responses = []

    api = f"https://api.edamam.com/api/recipes/v2?type=public&q={staple}&app_id=f70ab024&app_key=2e0223626b3cd85bbeedb8598d9bff50"
    try:
        print(f"api: {api}")
        # results = requests.get(api, verify=False)
        results = requests.get(api)
        # print(f"results: {results}")
        time.sleep(6)
    except:
        print("error calling api")
        return 0;

    response = results.json()                                     # Returns first page of responses
    responses.append(response)
    one_call = False
    count = response["count"]
    print(f"~~~COUNT: {count}")
    next_page = True

    if count > 20:                                                # Count = how many individual recipes are returned by search
        try:
            next = response['_links']['next']['href']
        except:
            print("1.Error getting next url")
            next_page = False
    else:
        next_page = False

    x = 0

    # while next_page:
    while next_page and x < 20:
        url = next
        # print(f"next url: {url}")
        call = requests.get(url)
        resp = call.json()
        page = True
        try:
            next = resp['_links']['next']['href']
        except:
            print("2.Error getting next url")
            page = False
        responses.append(resp)
        print(f"~~~~~len(responses): {len(responses)}")
        # print(f"responses[0]: {responses[0]}")
        x +=1
        time.sleep(6)
        if page == False:
            next_page = False

    ingredients_list = []
    i = 0

    for x in responses:
        hits = x['hits']
        for y in hits:
            i += 1
            # print(f"Recipe #{i} ({y['recipe']['label']}) ingredients:")
            ingredients = y['recipe']['ingredients']
            for z in ingredients:
                # print(z['text'])
                ingredients_list.append(z['text'])

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

    # for z in ingredients_list:
    #     print(f"'{z}'")
    #
    # print(f"count: {count}")

    return ingredients_list;

ingredients = collect_ingredients()

# ingredients = collect_ingredients()
# cleaned_ingredients = clean_ingredients(ingredients)


# if __name__ == "__main__":
#     ingredients = collect_ingredients()
