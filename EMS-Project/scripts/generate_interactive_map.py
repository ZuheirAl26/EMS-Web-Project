from __future__ import annotations

import argparse
import json
import math
import re
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from pathlib import Path


SVG_NAMESPACE = "http://www.w3.org/2000/svg"
NUMBER_PATTERN = r"[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?"
PATH_TOKEN_PATTERN = re.compile(rf"[MLHVZ]|{NUMBER_PATTERN}")
TRANSFORM_PATTERN = re.compile(
    rf"matrix\(({NUMBER_PATTERN}),({NUMBER_PATTERN}),({NUMBER_PATTERN}),"
    rf"({NUMBER_PATTERN}),({NUMBER_PATTERN}),({NUMBER_PATTERN})\)"
)
BOOTH_ID_PATTERN = re.compile(
    r"^(?:SE_\d+|OD-\d+|\d+[A-Z]+-\d+(?:\.\d+)?)$",
    re.IGNORECASE,
)


@dataclass(frozen=True)
class BoothLabel:
    booth_id: str
    x: float
    y: float


@dataclass(frozen=True)
class ClosedPath:
    path_data: str
    minimum_x: float
    minimum_y: float
    maximum_x: float
    maximum_y: float

    @property
    def width(self) -> float:
        return self.maximum_x - self.minimum_x

    @property
    def height(self) -> float:
        return self.maximum_y - self.minimum_y

    @property
    def area(self) -> float:
        return self.width * self.height

    def contains(self, x: float, y: float, margin: float = 0.75) -> bool:
        return (
            self.minimum_x - margin <= x <= self.maximum_x + margin
            and self.minimum_y - margin <= y <= self.maximum_y + margin
        )


def local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def normalize_booth_id(value: str) -> str:
    normalized = re.sub(r"\s+", "", value).upper()
    normalized = re.sub(r"^SE_?(\d+)$", r"SE_\1", normalized)
    return normalized


def extract_booth_labels(original_svg: Path) -> list[BoothLabel]:
    root = ET.parse(original_svg).getroot()
    labels: dict[str, BoothLabel] = {}

    for element in root.iter():
        if local_name(element.tag) != "text":
            continue

        booth_id = normalize_booth_id("".join(element.itertext()).strip())
        if not BOOTH_ID_PATTERN.fullmatch(booth_id):
            continue

        transform = element.get("transform", "")
        match = TRANSFORM_PATTERN.fullmatch(transform.replace(" ", ""))
        if not match:
            continue

        _, _, _, _, translate_x, translate_y = map(float, match.groups())
        labels[booth_id] = BoothLabel(booth_id, translate_x, translate_y)

    return sorted(labels.values(), key=lambda label: label.booth_id)


def simple_path_bounds(path_data: str) -> ClosedPath | None:
    if "Z" not in path_data or re.search(r"[CQAST]", path_data):
        return None

    tokens = PATH_TOKEN_PATTERN.findall(path_data)
    points: list[tuple[float, float]] = []
    current_x = 0.0
    current_y = 0.0
    command = ""
    index = 0

    while index < len(tokens):
        token = tokens[index]
        if token in {"M", "L", "H", "V", "Z"}:
            command = token
            index += 1
            if command == "Z":
                continue

        if command in {"M", "L"}:
            if index + 1 >= len(tokens):
                return None
            current_x = float(tokens[index])
            current_y = float(tokens[index + 1])
            points.append((current_x, current_y))
            index += 2
            if command == "M":
                command = "L"
        elif command == "H":
            current_x = float(tokens[index])
            points.append((current_x, current_y))
            index += 1
        elif command == "V":
            current_y = float(tokens[index])
            points.append((current_x, current_y))
            index += 1
        else:
            return None

    if len(points) < 3:
        return None

    x_values = [point[0] for point in points]
    y_values = [point[1] for point in points]
    closed_path = ClosedPath(
        path_data=path_data,
        minimum_x=min(x_values),
        minimum_y=min(y_values),
        maximum_x=max(x_values),
        maximum_y=max(y_values),
    )

    if not (4 <= closed_path.width <= 180 and 4 <= closed_path.height <= 180):
        return None

    return closed_path


def extract_closed_paths(runtime_root: ET.Element) -> list[ClosedPath]:
    paths: list[ClosedPath] = []

    for element in runtime_root.iter():
        if local_name(element.tag) != "path":
            continue
        if element.get("data-runtime-category") != "booth_boundary":
            continue

        bounds = simple_path_bounds(element.get("d", ""))
        if bounds is not None:
            paths.append(bounds)

    return paths


def label_anchor(label: BoothLabel) -> tuple[float, float]:
    estimated_text_width = max(7.0, len(label.booth_id) * 1.15)
    return label.x + estimated_text_width / 2, label.y - 1.2


def match_labels_to_paths(
    labels: list[BoothLabel],
    paths: list[ClosedPath],
) -> tuple[dict[str, ClosedPath], list[str], list[str]]:
    matches: dict[str, ClosedPath] = {}
    unmatched: list[str] = []
    ambiguous: list[str] = []
    claimed_paths: dict[str, str] = {}

    for label in labels:
        anchor_x, anchor_y = label_anchor(label)
        candidates = sorted(
            (path for path in paths if path.contains(anchor_x, anchor_y)),
            key=lambda path: path.area,
        )
        if not candidates:
            unmatched.append(label.booth_id)
            continue

        selected = candidates[0]
        previous_booth = claimed_paths.get(selected.path_data)
        if previous_booth is not None:
            ambiguous.extend([previous_booth, label.booth_id])
            matches.pop(previous_booth, None)
            continue

        claimed_paths[selected.path_data] = label.booth_id
        matches[label.booth_id] = selected

    return matches, sorted(set(unmatched)), sorted(set(ambiguous))


def create_approximate_hitbox(
    label: BoothLabel,
    labels: list[BoothLabel],
) -> ClosedPath:
    anchor_x, anchor_y = label_anchor(label)
    nearest_distance = min(
        math.hypot(anchor_x - other_x, anchor_y - other_y)
        for other in labels
        if other.booth_id != label.booth_id
        for other_x, other_y in [label_anchor(other)]
    )
    radius = min(16.0, max(8.0, nearest_distance * 0.36))
    path_data = (
        f"M{anchor_x:.3f} {anchor_y - radius:.3f}"
        f"L{anchor_x + radius:.3f} {anchor_y:.3f}"
        f"L{anchor_x:.3f} {anchor_y + radius:.3f}"
        f"L{anchor_x - radius:.3f} {anchor_y:.3f}Z"
    )
    return ClosedPath(
        path_data=path_data,
        minimum_x=anchor_x - radius,
        minimum_y=anchor_y - radius,
        maximum_x=anchor_x + radius,
        maximum_y=anchor_y + radius,
    )


def write_interactive_svg(
    runtime_tree: ET.ElementTree,
    destination: Path,
    matches: dict[str, ClosedPath],
) -> None:
    root = runtime_tree.getroot()
    for child in list(root):
        if child.get("id") == "runtime-booth-hitboxes":
            root.remove(child)

    hitbox_group = ET.Element(
        f"{{{SVG_NAMESPACE}}}g",
        {
            "id": "runtime-booth-hitboxes",
            "data-runtime-category": "booth-hitboxes",
        },
    )

    for booth_id, path in sorted(matches.items()):
        ET.SubElement(
            hitbox_group,
            f"{{{SVG_NAMESPACE}}}path",
            {
                "id": booth_id,
                "d": path.path_data,
                "fill": "#ffffff",
                "stroke": "none",
                "data-booth-id": booth_id,
            },
        )

    root.insert(0, hitbox_group)
    ET.register_namespace("", SVG_NAMESPACE)
    runtime_tree.write(destination, encoding="utf-8", xml_declaration=False)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Transfer labeled booth hitboxes into the lightweight runtime SVG."
    )
    parser.add_argument("original_svg", type=Path)
    parser.add_argument("runtime_svg", type=Path)
    parser.add_argument("--output", type=Path)
    parser.add_argument("--response-json", type=Path)
    args = parser.parse_args()

    labels = extract_booth_labels(args.original_svg)
    runtime_tree = ET.parse(args.runtime_svg)
    paths = extract_closed_paths(runtime_tree.getroot())
    matches, unmatched, ambiguous = match_labels_to_paths(labels, paths)
    approximate_ids = sorted(set(unmatched + ambiguous))
    labels_by_id = {label.booth_id: label for label in labels}
    for booth_id in approximate_ids:
        matches[booth_id] = create_approximate_hitbox(
            labels_by_id[booth_id],
            labels,
        )

    print(f"labels={len(labels)}")
    print(f"candidate_paths={len(paths)}")
    print(f"matched={len(matches)}")
    print(f"exact={len(matches) - len(approximate_ids)}")
    print(f"approximate={len(approximate_ids)}")
    if approximate_ids:
        print("approximate_ids=" + ",".join(approximate_ids))

    missing_api_ids: list[str] = []
    if args.response_json is not None:
        response = json.loads(args.response_json.read_text(encoding="utf-8"))
        api_ids = {
            booth["svg_id"]
            for booth in response.get("data", [])
            if isinstance(booth.get("svg_id"), str)
        }
        missing_api_ids = sorted(api_ids - matches.keys())
        print(f"api_ids={len(api_ids)}")
        print(f"mapped_api_ids={len(api_ids) - len(missing_api_ids)}")
        if missing_api_ids:
            print("missing_api_ids=" + ",".join(missing_api_ids))

    if args.output is not None:
        write_interactive_svg(runtime_tree, args.output, matches)

    return 2 if missing_api_ids else 0


if __name__ == "__main__":
    raise SystemExit(main())
