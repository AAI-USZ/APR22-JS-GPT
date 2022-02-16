# Towards JavaScript program repair with Generative Pre-trained Transformer (GPT-2)

This repository contains open science data used in the paper 

> M. Lajkó, V. Csuvik and L. Vidacs,  **Towards JavaScript program repair with Generative Pre-trained Transformer (GPT-2)**

submitted at the 3rd International Workshop on Automated Program Repair (APR 2022).

The repository contains 3 folders:
 - source : contains the plain code, in source/README there is a descripton about how to run the code (running the code will create addition files, checkpoints etc. in source)
 - APR_Data: Contains the dataset (gitter_commits), running the code described above will create a no comment version of this dataset and all experiment directories will be created in this folder (the experiment directory's name can be given to the code as a parameter: example experiment dir can be found below)
 - paper_exp_dir: This is the experiment directory which is the base of the paper submitted.

In each directory we provide a README file that describes the structure of the folder in question.

- APR22-JS-GPT/paper_exp_dir/candidates.txt: Examples in Qualitative evaluation section can be found here
- APR22-JS-GPT/paper_exp_dir/Matches.txt: Base of Table 1 in Quantitative evaluation


The code was designed to work for all kind of programming languages, although we made experiments for javascript only.


#Note: APR_Data containing the dataset is not yet committed (trying)
