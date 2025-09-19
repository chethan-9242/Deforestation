## Bhuvan Land Cover Integration

### Folder structure
```
Deforestation/
  Deforestation/
    data/
      bhuvan/
        train_image/
        train_mask/
        val_image/
        val_mask/
        class_dict_seg.csv
    src/
      prepare_bhuvan.py
  requirements.txt
  notebooks/
```

### Setup
1. Install dependencies:
```
pip install -r requirements.txt
```
2. Place Bhuvan images and masks into the matching folders.

### Validate pairs
```
python Deforestation/src/prepare_bhuvan.py --subset train
python Deforestation/src/prepare_bhuvan.py --subset val
```

### Notes
- Masks should be color-encoded per `class_dict_seg.csv`.
- Ensure filenames match between images (.jpg) and masks (.png).


