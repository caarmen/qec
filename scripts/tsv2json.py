"""
Reads a tsv file `input.tsv` in the below format and outputs `output.json`
in the format of the questions database.

Each question needs at least:
* A question text.
* 1 to 4 correct answers.
* 3 to 5 wrong answers.

The columns in the file must be as follows:
- Category (not used yet)
- Question (required)
- Correct1 (required)
- Correct2
- Correct3
- Correct4
- Wrong1 (required)
- Wrong2 (required)
- Wrong3 (required)
- Wrong4
- Wrong5

Copy the `output.json` file to `src/data/questions.js` to use it in the quiz.
"""
import csv
import json

def convert_tsv_to_json(input_file, output_file):
    questions_list = []

    with open(input_file, mode='r', encoding='utf-8') as f:
        # Using DictReader to access columns by their header names
        reader = csv.DictReader(f, delimiter='\t')
        
        for row in reader:
            # Helper to extract and clean non-empty values for answers
            def get_answers(prefix, count):
                answers = []
                for i in range(1, count + 1):
                    val = row.get(f'{prefix}{i}', '').strip()
                    if val:
                        answers.append(val)
                return answers

            question_data = {
                "question": row['Question'].strip(),
                "theme": row['Category'].strip(),
                "correctAnswers": get_answers('Correct', 4),
                "wrongAnswers": get_answers('Wrong', 5)
            }
            questions_list.append(question_data)

    # Wrap in the "questions" root object
    final_data = {"questions": questions_list}

    with open(output_file, mode='w', encoding='utf-8') as f:
        json.dump(final_data, f, indent=2, ensure_ascii=False)

    print(f"Successfully converted {len(questions_list)} questions to {output_file}")

# Usage
convert_tsv_to_json('input.tsv', 'output.json')
