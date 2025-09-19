import argparse
import csv
import os
from pathlib import Path
from typing import Dict, List, Tuple

from PIL import Image


def read_colormap(class_csv_path: Path) -> Dict[Tuple[int, int, int], int]:
    colormap: Dict[Tuple[int, int, int], int] = {}
    with class_csv_path.open("r", newline="") as f:
        reader = csv.DictReader(f)
        for idx, row in enumerate(reader):
            r, g, b = int(row["r"]), int(row["g"]), int(row["b"])
            colormap[(r, g, b)] = idx
    return colormap


def validate_pairs(images_dir: Path, masks_dir: Path) -> List[str]:
    image_stems = {p.stem for p in images_dir.glob("*.jpg")}
    mask_stems = {p.stem for p in masks_dir.glob("*.png")}
    common = sorted(image_stems & mask_stems)
    missing_masks = sorted(image_stems - mask_stems)
    missing_images = sorted(mask_stems - image_stems)
    if missing_masks:
        print(f"Warning: {len(missing_masks)} images without masks (showing up to 10): {missing_masks[:10]}")
    if missing_images:
        print(f"Warning: {len(missing_images)} masks without images (showing up to 10): {missing_images[:10]}")
    return common


def ensure_same_size(image_path: Path, mask_path: Path) -> None:
    with Image.open(image_path) as img, Image.open(mask_path) as msk:
        if img.size != msk.size:
            raise ValueError(f"Size mismatch: {image_path.name} {img.size} vs {mask_path.name} {msk.size}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate and prepare Bhuvan dataset pairs")
    parser.add_argument("--root", type=str, default=str(Path(__file__).resolve().parents[1] / "data" / "bhuvan"), help="Path to data/bhuvan root")
    parser.add_argument("--class_csv", type=str, default="class_dict_seg.csv", help="Class CSV filename under root")
    parser.add_argument("--subset", type=str, choices=["train", "val"], default="train", help="Subset to validate")
    args = parser.parse_args()

    root = Path(args.root)
    class_csv_path = root / args.class_csv
    images_dir = root / f"{args.subset}_image"
    masks_dir = root / f"{args.subset}_mask"

    if not class_csv_path.exists():
        raise FileNotFoundError(f"Class map not found: {class_csv_path}")
    if not images_dir.exists() or not masks_dir.exists():
        raise FileNotFoundError(f"Missing subset dirs: {images_dir} or {masks_dir}")

    colormap = read_colormap(class_csv_path)
    print(f"Loaded {len(colormap)} classes from {class_csv_path.name}")

    stems = validate_pairs(images_dir, masks_dir)
    print(f"Found {len(stems)} paired samples in {args.subset}")

    for stem in stems:
        image_path = images_dir / f"{stem}.jpg"
        mask_path = masks_dir / f"{stem}.png"
        ensure_same_size(image_path, mask_path)

    print("Validation successful: all paired images and masks have matching sizes.")


if __name__ == "__main__":
    main()



