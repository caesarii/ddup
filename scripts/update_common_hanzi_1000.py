#!/usr/bin/env python3
import csv
import json
from datetime import UTC, datetime
from pathlib import Path
from urllib.request import urlopen

SOURCE_URL = "https://raw.githubusercontent.com/ruddfawcett/hanziDB.csv/master/hanzi_db.csv"
OUTPUT_PATH = Path(__file__).resolve().parents[1] / "src" / "data" / "commonHanzi1000.json"


def main() -> None:
    raw = urlopen(SOURCE_URL, timeout=30).read().decode("utf-8")
    rows = csv.DictReader(raw.splitlines())
    items = []

    for row in rows:
        char = (row.get("character") or "").strip()
        if len(char) != 1:
            continue
        items.append(
            {
                "rank": int(row["frequency_rank"]),
                "character": char,
                "pinyin": row.get("pinyin", ""),
                "definition": row.get("definition", ""),
            }
        )
        if len(items) >= 1000:
            break

    payload = {
        "name": "common-hanzi-1000",
        "description": "Top 1000 common simplified Chinese characters by frequency rank",
        "source": SOURCE_URL,
        "generatedAt": datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "count": len(items),
        "items": items,
        "characters": [item["character"] for item in items],
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Generated {payload['count']} characters -> {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
