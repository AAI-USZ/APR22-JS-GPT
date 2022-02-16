import os
from remove_comments import remove_comments

def preprocess(input_path, output_dir, comments):
    if comments:
        remove_comments(input_path)

    path = input_path + "gitter_commits_no_comment/"
    new_path = input_path + output_dir


    if not os.path.exists(new_path):
        os.makedirs(new_path)

    if not os.path.exists(new_path + "train/"):
        os.makedirs(new_path + "train/")

    if not os.path.exists(new_path + "input/"):
        os.makedirs(new_path + "input/")

    if not os.path.exists(new_path + "target/"):
        os.makedirs(new_path + "target/")

    for c, file in enumerate(os.listdir(path + "target/")):
        if c < 16863:
            with open(path + "input/" + file) as f1, open(path + "target/" + file) as f2, open(
                    new_path + "train/" + file, "w") as f3:
                counter = 0
                for x, y in zip(f1, f2):
                    if counter == 10:
                        break
                    if x.strip() == y.strip():
                        f3.write(x.strip() + "\n")
                    else:
                        counter = counter + 1
                        f3.write(y.strip() + "\n")

        else:
            with open(path + "input/" + file) as f1, open(path + "target/" + file) as f2, open(
                    new_path + "input/" + file, "w") as f3, open(new_path + "target/" + file, "w") as f4:
                counter = 0
                for x, y in zip(f1, f2):
                    if counter == 3:
                        break
                    if x.strip() == y.strip():
                        f3.write(x.strip() + "\n")
                    else:
                        counter = counter + 1
                        f4.write(y.strip() + "\n")
