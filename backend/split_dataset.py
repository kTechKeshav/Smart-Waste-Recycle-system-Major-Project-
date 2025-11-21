import os
import shutil
import random
from pathlib import Path

def split_dataset(data_raw_dir='data_raw', output_dir='data', train_ratio=0.7, val_ratio=0.15, test_ratio=0.15):
    """
    Split dataset from data_raw/<class>/ into train/val/test splits.
    
    Args:
        data_raw_dir: Source directory containing class folders
        output_dir: Output directory where train/val/test will be created
        train_ratio: Proportion for training set (default: 0.7)
        val_ratio: Proportion for validation set (default: 0.15)
        test_ratio: Proportion for test set (default: 0.15)
    """
    # Verify ratios sum to 1.0
    assert abs(train_ratio + val_ratio + test_ratio - 1.0) < 1e-6, "Ratios must sum to 1.0"
    
    data_raw_path = Path(data_raw_dir)
    output_path = Path(output_dir)
    
    # Define class folders
    classes = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']
    
    # Create output directories
    splits = ['train', 'val', 'test']
    for split in splits:
        for class_name in classes:
            (output_path / split / class_name).mkdir(parents=True, exist_ok=True)
    
    # Statistics
    stats = {split: {class_name: 0 for class_name in classes} for split in splits}
    
    # Process each class
    for class_name in classes:
        class_dir = data_raw_path / class_name
        
        if not class_dir.exists():
            print(f"Warning: {class_dir} does not exist. Skipping...")
            continue
        
        # Get all image files
        image_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.gif']
        image_files = []
        for ext in image_extensions:
            image_files.extend(list(class_dir.glob(f'*{ext}')))
            image_files.extend(list(class_dir.glob(f'*{ext.upper()}')))
        
        if not image_files:
            print(f"Warning: No images found in {class_dir}. Skipping...")
            continue
        
        # Randomize file order
        random.shuffle(image_files)
        
        # Calculate split indices
        total = len(image_files)
        train_end = int(total * train_ratio)
        val_end = train_end + int(total * val_ratio)
        
        # Split files
        train_files = image_files[:train_end]
        val_files = image_files[train_end:val_end]
        test_files = image_files[val_end:]
        
        # Copy files to respective directories
        print(f"\nProcessing {class_name}: {total} images")
        
        for file in train_files:
            dest = output_path / 'train' / class_name / file.name
            shutil.copy2(file, dest)
            stats['train'][class_name] += 1
        
        for file in val_files:
            dest = output_path / 'val' / class_name / file.name
            shutil.copy2(file, dest)
            stats['val'][class_name] += 1
        
        for file in test_files:
            dest = output_path / 'test' / class_name / file.name
            shutil.copy2(file, dest)
            stats['test'][class_name] += 1
    
    # Print statistics
    print("\n" + "="*60)
    print("DATASET SPLIT STATISTICS")
    print("="*60)
    
    for split in splits:
        print(f"\n{split.upper()}:")
        total_split = 0
        for class_name in classes:
            count = stats[split][class_name]
            total_split += count
            print(f"  {class_name:12s}: {count:4d} images")
        print(f"  {'Total':12s}: {total_split:4d} images")
    
    print("\n" + "="*60)
    print("Split complete!")

if __name__ == '__main__':
    # Set random seed for reproducibility (optional)
    random.seed(42)
    
    split_dataset()

