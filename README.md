# Description de l'API

Cette API est liée à une base de données MySQL, qui est composée d'une table avec toutes les marques, d'une table avec les produits liés à cette marque, et une table avec les caractéristiques techniques de ces produits. L'API a pour but de renvoyer les différentes informations sur les produits.

## Endpoints

### /api/brands

Renvoie toutes les marques.

Exemple de requête :

`GET /api/brands`

Exemple de réponse :

```json
 [
    {
        "id": 1,
        "name": "Amazon"
    },
    {
        "id": 2,
        "name": "Asus"
    },
    {
        "id": 3,
        "name": "Blackview"
    },
    {
        "id": 4,
        "name": "Cat"
    },    ...
]
```

## /api/devices/search?s={recherche}

Permet de chercher un produit en utilisant un terme de recherche. Renvoie tous les produits qui correspondent à la recherche.

Exemple de requête :

`GET /api/devices/search?s=Samsung%20G`

Exemple de réponse :

```json

[
    {
        "id": 6807,
        "title": "Samsung G3812B Galaxy S3 Slim",
        "brand_name": "Samsung",
        "img": "https://fdn2.gsmarena.com/vv/bigpic/Samsung-G3812B-Galaxy-S3-Slim.jpg",
        "description": "Samsung G3812B Galaxy S3 Slim Android smartphone. Announced Mar 2014. Features 4.52″  display, 5 MP primary camera, 2100 mAh battery, 8 GB storage, 1000 MB RAM.",
        "announced_date": "2014-02-28T23:00:00.000Z"
    },
    {
        "id": 7401,
        "title": "Samsung G810",
        "brand_name": "Samsung",
        "img": "https://fdn2.gsmarena.com/vv/bigpic/samsung-g810.jpg",
        "description": "Samsung G810 Symbian smartphone. Announced Feb 2008. Features 2.6″  display, TI OMAP 2430 chipset, 5 MP primary camera, 1200 mAh battery, 130 MB storage.",
        "announced_date": "2008-01-31T23:00:00.000Z"
    },    ...
]
```

## /api/devices/specs

Renvoie un message indiquant qu'il faut utiliser /api/devices/specs/[name] pour récupérer les caractéristiques d'un produit.

Exemple de requête :

`GET /api/devices/specs`

Exemple de réponse :

```json
{
  "message": "Pour récupérer les caractéristiques d'un produit, utilisez /devices/specs/[name]"
}
```

## /api/devices/specs/{nom_produit}

Renvoie toutes les caractéristiques d'un produit, en fonction de son nom.

Exemple de requête :

`GET /api/devices/specs/Samsung%20Galaxy%20S23%20Ultra`

Exemple de réponse :

```json
[
    {
        "category_name": "Network",
        "name": "Technology",
        "value": "GSM / CDMA / HSPA / EVDO / LTE / 5G"
    },
    {
        "category_name": "Network",
        "name": "2G bands",
        "value": "GSM 850 / 900 / 1800 / 1900 - SIM 1 & SIM 2 (Dual SIM model only)"
    },
    {
        "category_name": "Network",
        "name": " ",
        "value": "CDMA 800 / 1900 & TD-SCDMA"
    },
    {
        "category_name": "Network",
        "name": "3G bands",
        "value": "HSDPA 850 / 900 / 1700(AWS) / 1900 / 2100 "
    },    ...
]
```

## /api/devices

Renvoie tous les produits, avec la possibilité de filtrer les résultats en utilisant des paramètres de requête.

Exemple de requête :

`GET /api/devices?Marque=Asus&5G=Oui`

Exemple de réponse :

```json
[
    {
        "id": 2945,
        "brand_name": "Asus",
        "title": "Asus ROG Phone 6D Ultimate",
        "img": "https://fdn2.gsmarena.com/vv/bigpic/asus-rog-phone-6d-ultimate.jpg",
        "description": "Asus ROG Phone 6D Ultimate Android smartphone. Announced Sep 2022. Features 6.78″  display, Dimensity 9000+ chipset, 6000 mAh battery, 512 GB storage, 16 GB RAM, Corning Gorilla Glass Victus.",
        "announced_date": "2022-08-31T22:00:00.000Z"
    },
    {
        "id": 2946,
        "brand_name": "Asus",
        "title": "Asus ROG Phone 6D",
        "img": "https://fdn2.gsmarena.com/vv/bigpic/asus-rog-phone-6d.jpg",
        "description": "Asus ROG Phone 6D Android smartphone. Announced Sep 2022. Features 6.78″  display, Dimensity 9000+ chipset, 6000 mAh battery, 256 GB storage, 16 GB RAM, Corning Gorilla Glass Victus.",
        "announced_date": "2022-08-31T22:00:00.000Z"
    },    ...
]
```

## /api/filters

Renvoie toutes les caractéristiques avec les filtres, pour savoir ce qui est possible comme combinaison.

Exemple de requête :

`GET /api/filters`

Exemple de réponse :

```json
[
    {
        "name": "AddedData",
        "values": [
            {
                "name": "4G",
                "count": 3361
            },
            {
                "name": "5G",
                "count": 844
            },
            {
                "name": "Carte SD",
                "count": 4562
            },            ...
        ]
    }
]
```

## /api/filters/specs?{nom_filtrage}={valeur_filtrage}

Renvoie toutes les caractéristiques avec les filtres, pour savoir ce qui est possible comme combinaison. Vous pouvez utiliser les filtres suivants :

"4G", "5G", "Carte SD", "DAS", "Date", "Definition Ecran", "Nombre de capteurs (camera)", "Taille Batterie (en mAh)", "Marque", "Matériau Arrière", "Prix (en Euros)", "Poids (en g)", "Puissance de charge (en W)", "Rafraichissement Ecran (en Hz)", "RAM", "Ratio Ecran", "Nombre de capteurs (selfie)", "SoC", "Stockage", "Taille Ecran (en pouces)", "Technologie Ecran", "Type"

Exemple de requête :

`GET /api/filters/specs?Selfie%20Camera=Triple`

Exemple de réponse :

```json
{
    "4G": {
        "values": [
            {
                "value": "Oui",
                "count": 8
            }
        ]
    },
    "5G": {
        "values": [
            {
                "value": "Oui",
                "count": 4
            }
        ]
    },
    ...
}
```
