from django.db import migrations, models


def add_audio_product(apps, schema_editor):
    Product = apps.get_model("store_api", "Product")
    Product.objects.get_or_create(
        name="AirPods Pro 2",
        defaults={
            "brand": "Apple",
            "category": "audio",
            "price": 24900,
            "image": "assets/apple_watch_ultra_2_1776504829716.png",
            "description": "Active noise cancellation. Immersive sound.",
            "is_featured": True,
        },
    )


class Migration(migrations.Migration):
    dependencies = [("store_api", "0002_more_catalog")]
    operations = [
        migrations.AlterField(
            model_name="product",
            name="category",
            field=models.CharField(choices=[("iphone", "Phones"), ("mac", "Computers"), ("watch", "Wearables"), ("audio", "Audio")], max_length=20),
        ),
        migrations.RunPython(add_audio_product, migrations.RunPython.noop),
    ]