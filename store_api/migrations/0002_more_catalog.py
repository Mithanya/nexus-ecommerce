from django.db import migrations


def add_catalog_products(apps, schema_editor):
    Product = apps.get_model("store_api", "Product")
    products = [
        ("Mac mini", "Apple", "mac", 59900, "assets/macbook_pro_16_1776504808261.png", "Small footprint. Serious performance."),
        ("iPad Pro", "Apple", "mac", 99900, "assets/macbook_pro_16_1776504808261.png", "Thin, powerful, and ready for anything."),
        ("Apple Watch Series 10", "Apple", "watch", 46900, "assets/apple_watch_ultra_2_1776504829716.png", "Thinner. Smarter. Brighter."),
    ]
    for name, brand, category, price, image, description in products:
        Product.objects.get_or_create(
            name=name,
            defaults={
                "brand": brand,
                "category": category,
                "price": price,
                "image": image,
                "description": description,
                "is_featured": True,
            },
        )


class Migration(migrations.Migration):
    dependencies = [("store_api", "0001_initial")]
    operations = [migrations.RunPython(add_catalog_products, migrations.RunPython.noop)]