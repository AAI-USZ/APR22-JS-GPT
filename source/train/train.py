import torch
import os
import datetime
import time
import random
from train.utils import GPTDataset, set_random_seed, get_loaders, plot_loss, print_model_params, save_model
from train.early_stopping import EarlyStopping
from transformers import GPT2LMHeadModel, GPT2Tokenizer, GPT2Config, GPT2LMHeadModel
from transformers import AdamW, get_linear_schedule_with_warmup


def format_time(elapsed):
    return str(datetime.timedelta(seconds=int(round((elapsed)))))


def train(gpu, batch_size, max_epochs, early_stop_patience, lr_rate, warmup_steps, epsilon):
    TXT_PATH = os.getcwd() + "/train/train.txt"
    RANDOM_SEED = 42

    torch.manual_seed(RANDOM_SEED)

    os.environ["CUDA_VISIBLE_DEVICES"] = gpu

    BATCH_SIZE = batch_size
    epochs = max_epochs
    early_stopping_patience = early_stop_patience
    learning_rate = lr_rate
    warmup_steps = warmup_steps
    epsilon = epsilon
    sample_every = 100
    output_dir = './train/model_save/'

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    tokenizer = GPT2Tokenizer.from_pretrained('gpt2', bos_token='<|startoftext|>', eos_token='<|endoftext|>', pad_token='<|pad|>') #gpt2-medium
    dataset = GPTDataset(TXT_PATH, tokenizer, max_length=768)
    train_dataloader, validation_dataloader = get_loaders(dataset, BATCH_SIZE)

    configuration = GPT2Config.from_pretrained('gpt2', output_hidden_states=False)
    model = GPT2LMHeadModel.from_pretrained("gpt2", config=configuration)
    model.resize_token_embeddings(len(tokenizer))

    device = torch.device("cuda")
    model.cuda()

    set_random_seed(RANDOM_SEED)


    optimizer = AdamW(model.parameters(), lr=learning_rate, eps=epsilon)

    total_steps = len(train_dataloader) * epochs
    scheduler = get_linear_schedule_with_warmup(optimizer, num_warmup_steps=warmup_steps, num_training_steps=total_steps)


    total_t0 = time.time()
    training_stats = []
    model = model.to(device)

    early_stopping = EarlyStopping(patience=early_stopping_patience, verbose=True)
    for epoch_i in range(0, epochs):

        # ========================================
        #               Training
        # ========================================

        print("")
        print('======== Epoch {:} / {:} ========'.format(epoch_i + 1, epochs))
        print('Training...')

        t0 = time.time()

        total_train_loss = 0

        model.train()

        for step, batch in enumerate(train_dataloader):

            b_input_ids = batch[0].to(device)
            b_labels = batch[0].to(device)
            b_masks = batch[1].to(device)

            model.zero_grad()

            outputs = model(b_input_ids, labels=b_labels, attention_mask=b_masks, token_type_ids=None)

            loss = outputs[0]

            batch_loss = loss.item()
            total_train_loss += batch_loss

            # Get sample every x batches.
            if step % sample_every == 0 and not step == 0:

                elapsed = format_time(time.time() - t0)
                print('  Batch {:>5,}  of  {:>5,}. Loss: {:>5,}.   Elapsed: {:}.'.format(step, len(train_dataloader),
                                                                                         batch_loss, elapsed))

                model.eval()

                sample_outputs = model.generate(
                    bos_token_id=random.randint(1, 30000),
                    do_sample=True,
                    top_k=50,
                    max_length=200,
                    top_p=0.95,
                    num_return_sequences=1
                )
                '''for i, sample_output in enumerate(sample_outputs):
                    print("{}: {}".format(i, tokenizer.decode(sample_output, skip_special_tokens=True)))'''

                model.train()

            loss.backward()
            optimizer.step()
            scheduler.step()

        # Calculate the average loss over all of the batches.
        avg_train_loss = total_train_loss / len(train_dataloader)

        # Measure how long this epoch took.
        training_time = format_time(time.time() - t0)

        print("")
        print("  Average training loss: {0:.2f}".format(avg_train_loss))
        print("  Training epoch took: {:}".format(training_time))

        # ========================================
        #               Validation
        # ========================================

        print("")
        print("Running Validation...")

        t0 = time.time()

        model.eval()

        total_eval_loss = 0
        nb_eval_steps = 0

        # Evaluate data for one epoch
        for batch in validation_dataloader:
            b_input_ids = batch[0].to(device)
            b_labels = batch[0].to(device)
            b_masks = batch[1].to(device)

            with torch.no_grad():
                outputs = model(b_input_ids,
                                #                            token_type_ids=None,
                                attention_mask=b_masks,
                                labels=b_labels)

                loss = outputs[0]

            batch_loss = loss.item()
            total_eval_loss += batch_loss

        avg_val_loss = total_eval_loss / len(validation_dataloader)
        validation_time = format_time(time.time() - t0)

        print("  Validation Loss: {0:.2f}".format(avg_val_loss))
        print("  Validation took: {:}".format(validation_time))

        early_stopping(avg_val_loss, model)

        if early_stopping.early_stop:
            print("Early stopping")
            break

        # Record all statistics from this epoch.
        training_stats.append(
            {
                'epoch': epoch_i + 1,
                'Training Loss': avg_train_loss,
                'Valid. Loss': avg_val_loss,
                'Training Time': training_time,
                'Validation Time': validation_time
            }
        )

    print("")
    print("Training complete!")
    print("Total training took {:} (h:mm:ss)".format(format_time(time.time() - total_t0)))


    plot_loss(training_stats)
    print_model_params(model)
    save_model(model, tokenizer, output_dir)



