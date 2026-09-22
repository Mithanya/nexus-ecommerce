from django.db import migrations


def update_airpods_image(apps, schema_editor):
    Product = apps.get_model("store_api", "Product")
    Product.objects.filter(name="AirPods Pro 2").update(
        image="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=85"
    )


class Migration(migrations.Migration):
    dependencies = [("store_api", "0003_add_audio_department")]
    operations = [migrations.RunPython(update_airpods_image, migrations.RunPython.noop)]