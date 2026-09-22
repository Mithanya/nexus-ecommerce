from django.db import migrations


def add_iphone_18_pro(apps, schema_editor):
    Product = apps.get_model("store_api", "Product")
    Product.objects.get_or_create(
        name="iPhone 18 Pro",
        defaults={
            "brand": "Apple",
            "category": "iphone",
            "price": 314900,
            "image": "assets/iphone_15_pro_max_1776504783590.png",
            "description": "A20 Pro power, 48MP variable-aperture camera, and up to 120Hz ProMotion.",
            "is_featured": True,
        },
    )


class Migration(migrations.Migration):
    dependencies = [("store_api", "0007_add_iphone_18")]
    operations = [migrations.RunPython(add_iphone_18_pro, migrations.RunPython.noop)]