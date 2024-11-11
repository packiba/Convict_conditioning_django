import json
import os
from django.core.management.base import BaseCommand
from exercises.models import Exercise

class Command(BaseCommand):
    help = 'Imports exercises from all JSON files in a specified directory'

    def add_arguments(self, parser):
        parser.add_argument('json_dir', type=str, help="Path to the directory with JSON files")

    def handle(self, *args, **kwargs):
        json_dir_path = kwargs['json_dir']
        self.stdout.write(self.style.NOTICE(f"Starting import from directory: {json_dir_path}"))

        if not os.path.isdir(json_dir_path):
            self.stdout.write(self.style.ERROR("Provided path is not a directory"))
            return

        for filename in os.listdir(json_dir_path):
            if filename.endswith('.json'):
                file_path = os.path.join(json_dir_path, filename)
                self.stdout.write(self.style.NOTICE(f"Processing file: {filename}"))

                try:
                    with open(file_path, 'r', encoding='utf-8') as file:
                        data = json.load(file)
                        self.stdout.write(self.style.NOTICE(f"Loaded data from {filename}. Number of items: {len(data)}"))

                        for item in data:
                            exercise_data = item.get('exercise')
                            category_data = item.get('category')

                            if not exercise_data or not category_data:
                                self.stdout.write(self.style.ERROR(f"Missing 'exercise' or 'category' data in item from {filename}"))
                                continue

                            # Проверяем, есть ли уже запись с таким сочетанием exercise_id и category_id
                            exists = Exercise.objects.filter(
                                exercise_id=exercise_data['id'],
                                category_id=category_data['id']
                            ).exists()

                            if not exists:
                                # Создаём новую запись, если комбинация уникальна
                                Exercise.objects.create(
                                    exercise_id=exercise_data['id'],
                                    name=exercise_data['name'],
                                    category_id=category_data['id'],
                                    category_name=category_data['name'],
                                    level1=item.get('level1', []),
                                    level2=item.get('level2', []),
                                    level3=item.get('level3', []),
                                    anim_uri=item.get('anim-uri', ''),
                                    description=item.get('description', [])
                                )
                                self.stdout.write(self.style.SUCCESS(f"Created new exercise: {exercise_data['name']}"))
                            else:
                                self.stdout.write(self.style.WARNING(f"Exercise with ID {exercise_data['id']} and Category {category_data['id']} already exists, skipping..."))

                except json.JSONDecodeError as e:
                    self.stdout.write(self.style.ERROR(f"JSON decode error in {filename}: {e}"))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"Error processing {filename}: {e}"))

        self.stdout.write(self.style.SUCCESS("Import completed!"))
