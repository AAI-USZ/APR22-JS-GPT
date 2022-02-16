import os
import re

def comment_remover(text):
    def replacer(match):
        s = match.group(0)
        if s.startswith('/'):
            return " " # note: a space and not an empty string
        else:
            return s
    pattern = re.compile(
        r'//.*?$|/\*.*?\*/|\'(?:\\.|[^\\\'])*\'|"(?:\\.|[^\\"])*"',
        re.DOTALL | re.MULTILINE
    )
    return re.sub(pattern, replacer, text)


def remove_comments(input_path):
    path = input_path + "gitter_commits/"
    new_path = input_path + "gitter_commits_no_comment/"

    if not os.path.exists(new_path):
        os.makedirs(new_path)
    if not os.path.exists(new_path + "input/"):
        os.makedirs(new_path + "input/")
    if not os.path.exists(new_path + "target/"):
        os.makedirs(new_path + "target/")

    for file in os.listdir(path + "fixed/"):
        with open(path + "buggy/" + file) as f1, open(path + "fixed/" + file) as f2, open(
                new_path + "input/" + file, "w") as f3, open(new_path + "target/" + file, "w") as f4:
            f1_string = f1.read()
            f2_string = f2.read()
            f3.write(comment_remover(f1_string))
            f4.write(comment_remover(f2_string))

