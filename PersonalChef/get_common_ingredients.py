import requests
# from .keys import (id,key)


def collect_ingredients():

    to_search = ['chicken','mince','salmon','pasta','lettuce','cheese','milk','rice','peppers','tomatoes','eggs']

    staple = 'prawns'
    responses = []
    recipe_links = []
    recipes = []
    ingredients_list = []
    # app_id = id
    # app_key = key

    y = x
    api = f"https://api.edamam.com/api/recipes/v2?type=public&q=${y}&app_id=f70ab024&app_key=1bc57900faadcf33ca18df72b930788e&field=label"
    results = requests.get(api)
    response = results.json()
    responses.append(response)

    for x in responses:
        print(f"x['count']: {x['count']}")
        recipe = x['hits']
        for y in recipe:
            link = y['_links']['self']['href']
            recipe_links.append(link)

    for x in recipe_links:
        url = f"{x}"
        y = requests.get(url)
        result = y.json()
        recipes.append(result)

    i = 0
    for x in recipes:
        i += 1
        print(f"i: {i}")

        try:
            b = x['recipe']
            print(f"b['label']: {b['label']}")
            y = b['ingredients']
            for z in y:
                a = z['text']
                ingredient = a
                ingredients_list.append(ingredient)
                print(f"{ingredient}")
        except KeyError as error:
            continue

    print(f"0: {ingredients_list[0]}")
    print(f"50: {ingredients_list[50]}\n")


    return final;



if __name__ == "__main__":
    collect_ingredients()
