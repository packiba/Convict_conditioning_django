# Generated by Django 5.1.2 on 2024-10-30 14:52

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Exercise',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('exercise_id', models.IntegerField()),
                ('name', models.CharField(max_length=255)),
                ('category_id', models.IntegerField()),
                ('category_name', models.CharField(max_length=255)),
                ('level1', models.JSONField(default=list)),
                ('level2', models.JSONField(default=list)),
                ('level3', models.JSONField(default=list)),
                ('anim_uri', models.URLField(max_length=255)),
                ('description', models.JSONField(default=list)),
            ],
        ),
    ]
