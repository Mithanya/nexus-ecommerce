from django.db import migrations, models


def remove_audio_products(apps, schema_editor):
    Product = apps.get_model("store_api", "Product")
    Product.objects.filter(category="audio").delete()


class Migration(migrations.Migration):
    dependencies = [("store_api", "0005_orders")]
    operations = [
        migrations.AlterField(
            model_name="product",
            name="category",
            field=models.CharField(choices=[("iphone", "Phones"), ("mac", "Computers"), ("watch", "Wearables")], max_length=20),
        ),
        migrations.RunPython(remove_audio_products, migrations.RunPython.noop),
    ]