from django.db import migrations


def update_burgundy_variant(apps, schema_editor):
    Product = apps.get_model("store_api", "Product")
    Product.objects.filter(name="iPhone 18 Pro Max").update(
        name="iPhone 18 Pro Max Burgundy",
        description="A deep new finish with A20 Pro power and a next-generation camera system.",
    )


class Migration(migrations.Migration):
    dependencies = [("store_api", "0008_add_iphone_18_pro")]
    operations = [migrations.RunPython(update_burgundy_variant, migrations.RunPython.noop)]
