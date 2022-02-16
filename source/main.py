from preprocess import preprocess
from create_train_txt import create_train_txt
from train.train import train
from predict import predict
from candidates import create_results, get_all_stats
from argument_parser import arg_parser


if __name__ == "__main__":
    param_dict = arg_parser()

    if param_dict["task"] == "preprocess":
        print("Preprocessing...")
        preprocess(param_dict["input_path"], param_dict["experiment_dir"], param_dict["remove_comments"])

    elif param_dict["task"] == "train":
        print("Training...")
        create_train_txt(param_dict["input_path"], param_dict["experiment_dir"])
        train(param_dict["gpu"], param_dict["batch_size"], param_dict["max_epochs"], param_dict["early_stop_patience"],
              param_dict["lr_rate"], param_dict["warmup_steps"], param_dict["epsilon"])

    elif param_dict["task"] == "predict":
        print("Creating candidates...")
        predict(param_dict["input_path"], param_dict["experiment_dir"], param_dict["gpu"])

    elif param_dict["task"] == "results":
        print("Creating result.txt and getting stats...")
        create_results(param_dict["input_path"], param_dict["experiment_dir"])
        get_all_stats(param_dict["input_path"], param_dict["experiment_dir"])