import csv
import os
import editdistance
import time
import editdistance



def get_closest_candidate(cand_lines, target_txt):
    line_num = 9999
    min_ed = 10000
    closest_cand = "NULL"
    gen_num = 9999
    for line in cand_lines:
        if not line.isspace() and line[0].isdigit():
            list_cand_line = line.split(" ", 2)

            cur_ed = editdistance.eval(str(list_cand_line[2]), str(target_txt))
            if cur_ed < min_ed:
                closest_cand = str(list_cand_line[2])
                min_ed = cur_ed
                gen_num = int(list_cand_line[0])
                line_num = int(list_cand_line[1])
    return closest_cand.strip(), gen_num, line_num

def get_target(target_lines):
    for line in target_lines:
        if not line.isspace():
            return line.strip()
    return 0

def create_results(input_path, output_dir):
    PATH = input_path + output_dir + "/"

    counter = 0

    with open(PATH + "candidates.csv", "w") as csvfile, open(PATH + "candidates.txt", "w") as txt_file:
        fieldnames = ['file', 'target', 'candidate']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for file in os.listdir(PATH + "target/"):
            if not os.path.isfile(PATH + "candidates/" + ''.join(file.split(".")[0:-1]) + ".txt"):
                continue

            with open(PATH + "target/" + file) as f1, open(PATH + "candidates/" + ''.join(file.split(".")[0:-1]) + ".txt") as f2:
                target_lines = f1.readlines()
                cand_lines = f2.readlines()
                target_txt = get_target(target_lines)
                cand_txt, gen_num, line_num = get_closest_candidate(cand_lines[2:], target_txt)

                if (not target_txt) or (not cand_txt):
                    continue

                writer.writerow({'file': file, 'target': target_txt, 'candidate': cand_txt})
                counter += 1
                txt_file.write(str(counter) + '\n')
                txt_file.write(file + '\n')
                txt_file.write(target_txt + '\n')
                txt_file.write(cand_txt + '\n')
                txt_file.write("-------------------------------------------------------------------------------------------------------------" + '\n')


def get_stats(input_path, output_dir, g_num=1, l_num=1):
    PATH = input_path + output_dir + "/"

    exact_match = 0
    match_without_white_space = 0
    under_5_ed = 0
    under_10_ed = 0

    for file in os.listdir(PATH + "target/"):
        if not os.path.isfile(PATH + "candidates/" + ''.join(file.split(".")[0:-1]) + ".txt"):
            continue

        with open(PATH + "target/" + file) as f1, open(
                PATH + "candidates/" + ''.join(file.split(".")[0:-1]) + ".txt") as f2:
            target_lines = f1.readlines()
            cand_lines = f2.readlines()
            target_txt = get_target(target_lines)
            cand_txt, gen_num, line_num = get_closest_candidate(cand_lines[2:], target_txt)

            if (not target_txt) or (not cand_txt):
                continue

            if gen_num <= g_num:
                if line_num <= l_num:
                    if target_txt == cand_txt:
                        exact_match += 1
                    if "".join(target_txt.split()) == "".join(cand_txt.split()):
                        match_without_white_space += 1
                    if editdistance.eval(target_txt, cand_txt) < 5:
                        under_5_ed += 1
                    if editdistance.eval(target_txt, cand_txt) < 10:
                        under_10_ed += 1

    return exact_match, match_without_white_space, under_5_ed, under_10_ed


def get_all_stats(input_path, output_dir):
    PATH = input_path + output_dir + "/"
    with open(PATH + "Matches.txt", "w") as file:
        line_num_list = [1, 5, 10, 1000]
        for i in range(1, 11):  #Generations
            for f in line_num_list:
                exact_match, match_without_white_space, under_5_ed, under_10_ed = get_stats(input_path, output_dir, i, f)
                file.write(str(i) + " ")
                file.write(str(f) + "\n")
                file.write('exact match: ' + str(exact_match) + "\n")
                file.write('match_without_white_space ' + str(match_without_white_space) + "\n")
                file.write('under_5_ed ' + str(under_5_ed) + "\n")
                file.write('under_10_ed ' + str(under_10_ed) + "\n")
