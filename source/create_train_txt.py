import os
from transformers import GPT2Tokenizer

def create_train_txt(input_path, output_dir):
    tokenizer = GPT2Tokenizer.from_pretrained("gpt2")

    path = input_path + output_dir + "/train/"

    if os.path.exists(os.getcwd() + "/train/train.txt"):
        os.remove(os.getcwd() + "/train/train.txt")

    for c, file in enumerate(os.listdir(path)):
         with open(path + file) as f:
            file_string = f.read()
            # decoded_tokens = tokenizer.decode(json_data)
            file_string_encoded = tokenizer.encode(file_string)[-2040:-1]
            file_string_decoded = tokenizer.decode(file_string_encoded)

            with open(os.getcwd() + "/train/train.txt", "a") as f:
                f.write(repr(file_string_decoded))
                f.write("\n")
