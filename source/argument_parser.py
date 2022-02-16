import argparse

def arg_parser():
    parser = argparse.ArgumentParser(description="GPT-2 for code repair")

    parser.add_argument('--task', required=True, choices=["preprocess", "train", "predict", "results"], help="")
    parser.add_argument('--input_path', help="Input data folder path, containing gitter_commits")
    parser.add_argument('--experiment_dir', help="Directory of preprocessed data, candidates and closest match candidates.txt")
    parser.add_argument('--remove_comments', default=False, type=bool)
    parser.add_argument('--gpu', default="3")
    parser.add_argument('--batch_size', default=7, type=int)
    parser.add_argument('--max_epochs', default=100, type=int)
    parser.add_argument('--early_stop_patience', default=3, type=int)

    parser.add_argument('--lr_rate', default=5e-4, type=float)
    parser.add_argument('--warmup_steps', default=1e2, type=float)
    parser.add_argument('--epsilon', default=1e-8, type=float)
    args = parser.parse_args()

    param_dict = {}

    param_dict["task"] = args.task
    param_dict["input_path"] = args.input_path
    param_dict["experiment_dir"] = args.experiment_dir
    param_dict["remove_comments"] = args.remove_comments
    param_dict["gpu"] = args.gpu
    param_dict["batch_size"] = args.batch_size
    param_dict["max_epochs"] = args.max_epochs
    param_dict["early_stop_patience"] = args.early_stop_patience
    param_dict["lr_rate"] = args.lr_rate
    param_dict["warmup_steps"] = args.warmup_steps
    param_dict["epsilon"] = args.epsilon

    return param_dict