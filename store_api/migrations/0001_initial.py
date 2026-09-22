from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [
        migrations.CreateModel(
            name="Product",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=120)),
                ("brand", models.CharField(max_length=60)),
                ("category", models.CharField(choices=[("iphone", "Phones"), ("mac", "Computers"), ("watch", "Wearables")], max_length=20)),
                ("price", models.PositiveIntegerField()),
                ("image", models.CharField(max_length=255)),
                ("description", models.TextField(blank=True)),
                ("is_featured", models.BooleanField(default=True)),
            ],
            options={"ordering": ["id"]},
        ),
    ]
