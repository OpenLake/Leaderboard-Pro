# Generated by Django 3.2.5 on 2021-07-20 07:30

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CodeforcesUsers',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=64)),
                ('max_rating', models.PositiveIntegerField(default=0)),
                ('rating', models.PositiveIntegerField(default=0)),
                ('last_activity', models.PositiveIntegerField(default=253402300800.0)),
                ('last_updated', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
