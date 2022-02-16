import os
import editdistance
import time
import torch
from transformers import GPT2LMHeadModel,  GPT2Tokenizer, GPT2Config, GPT2LMHeadModel
from GPT_generate import generate


def predict(input_path, output_dir, gpu):
    PATH = input_path + output_dir + "/"
    os.environ["CUDA_VISIBLE_DEVICES"] = gpu

    GEN_PER_CAND = 10-2

    device = torch.device("cuda")
    tokenizer = GPT2Tokenizer.from_pretrained(os.getcwd() + "/train/model_save", bos_token='<|startoftext|>', eos_token='<|endoftext|>', pad_token='<|pad|>') #gpt2-medium
    configuration = GPT2Config.from_pretrained(os.getcwd() + "/train/model_save", output_hidden_states=False)
    model = GPT2LMHeadModel.from_pretrained(os.getcwd() + "/train/model_save", config=configuration)

    model.resize_token_embeddings(len(tokenizer))
    model = model.to(device)

    if not os.path.exists(PATH+"candidates/"):
        os.makedirs(PATH+"candidates/")


    start = time.time()
    for c_file, file in enumerate(os.listdir(PATH + "input/")):
        print("File number: ", c_file, ", File name: ", file)
        with open (PATH + "input/" + file) as input_file, open (PATH + "target/" + file) as target_file:
            input_txt = input_file.read()
            target_txt = target_file.readlines()
            input_txt_encoded = tokenizer.encode(input_txt)[-900:-1]
            input_txt_decoded = tokenizer.decode(input_txt_encoded)

            if len(input_txt_decoded) < 10:
                continue

            output_text = generate(model, tokenizer, input_txt_decoded)

            candidates = set()
            candidates_list = []

            for line in target_txt:
                if (not line.isspace()) and line != "":
                    target_text = line
                    break


            f = 0
            for c, line in enumerate(output_text):
                if (not line.isspace()) and line != "":
                    f += 1
                    if line not in candidates:
                        candidates.add(line)
                        candidates_list.append([line, 0, f])
                        #print(c, ". candidate: ", line)

            i = 0
            while (not (target_text in candidates)) and (i <= GEN_PER_CAND):
                i += 1
                print(i)

                output_text = generate(model, tokenizer, input_txt_decoded)

                f = 0
                for c, line in enumerate(output_text):
                    if (not line.isspace()) and line != "":
                        f += 1
                        if line not in candidates:
                            candidates.add(line)
                            candidates_list.append([line, i, f])
                            #print(c, ". candidate: ", line)


            min_ed = 1000
            closest_cand = "NULL"

            for cand, gen_num, line_num in candidates_list:
                cur_ed = editdistance.eval(str(cand), str(target_text))
                if cur_ed < min_ed:
                    min_ed = cur_ed
                    closest_cand = [cand, gen_num, line_num]

            with open(PATH + "candidates/" + ''.join(file.split(".")[0:-1]) + ".txt", "w") as file:
                file.write("Min editdistance: " + str("%.2f" % min_ed) + "\n")
                file.write("Closest candidate: " + str(closest_cand[1]) + " " + str(closest_cand[2]) + " "+ str(closest_cand[0]) + "\n")

                for cand, gen_num, line_num in candidates_list:
                    file.write(str(gen_num) + " " + str(line_num) + " " + str(cand) + "\n")

            end_sub = time.time()
            print((end_sub-start)/3600, ", hour passed")
            print(c_file, "/", len(os.listdir(PATH + "input/")))
            with open(PATH + "log.txt", "w") as file:
                file.write(str(c_file) + "/" + str(len(os.listdir(PATH + "input/"))))
                file.write("\nHours passed: " + str("%.2f" % ((time.time()-start)/3600)))
    end = time.time()
    print((end-start)/3600, ", hour passed")
