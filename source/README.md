Example run:
1. python3 main.py --task preprocess --input_path /srv/nfs-data/mlajko/APR_2022_github/APR_Data/ --experiment_dir APR_exp_dir/ --remove_comments True --gpu 0
2. python3 main.py --task train --input_path /srv/nfs-data/mlajko/APR_2022_github/APR_Data/ --experiment_dir APR_exp_dir/ --remove_comments True --gpu 0
3. python3 main.py --task predict --input_path /srv/nfs-data/mlajko/APR_2022_github/APR_Data/ --experiment_dir APR_exp_dir/ --remove_comments True --gpu 0
4. python3 main.py --task results --input_path /srv/nfs-data/mlajko/APR_2022_github/APR_Data/ --experiment_dir APR_exp_dir/ --remove_comments True --gpu 0


--input_path: APR_Data (this folder contains the gitter_commits folder which is the raw data)
--experiment_dir will be created in APR_Data

For additional parameters check argument_parser.py
