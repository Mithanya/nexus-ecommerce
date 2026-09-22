from django.db import migrations


def add_iphone_18(apps, schema_editor):
    Product = apps.get_model("store_api", "Product")
    Product.objects.get_or_create(
        name="iPhone 18 Pro Max",
        defaults={
            "brand": "Apple",
            "category": "iphone",
            "price": 159900,
            "image": "assets/iphone_15_pro_max_1776504783590.png",
            "description": "The next generation of iPhone Pro.",
            "is_featured": True,
        },
    )


class Migration(migrations.Migration):
    dependencies = [("store_api", "0006_remove_audio")]
    operations = [migrations.RunPython(add_iphone_18, migrations.RunPython.noop)]