from dataclasses import dataclass
from typing import Sequence


@dataclass
class Project:
    workspace: str


def get_projects() -> Sequence[Project]:
    return [
        Project(workspace="blog"),
        Project(workspace="samlang"),
        Project(workspace="samlang-demo"),
        Project(workspace="ten"),
        Project(workspace="www"),
    ]
