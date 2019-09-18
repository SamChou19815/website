import os
import subprocess
from typing import List, Sequence, Tuple
from .workspace import get_dependency_chain


def _get_depth(path: str, depth: int = 0) -> int:
    if not os.path.isdir(path):
        return depth
    try:
        subprocess.check_output(
            ["git", "ls-files", "--error-unmatch", path], stderr=subprocess.DEVNULL
        )
    except Exception:
        # Do not consider gitignored files.
        return depth
    max_depth = depth
    for entry in os.listdir(path):
        full_path = os.path.join(path, entry)
        max_depth = max(max_depth, _get_depth(full_path, depth + 1))
    return max_depth


def _get_path_filters(path: str) -> Sequence[str]:
    depth = _get_depth(path=path)
    filters: List[str] = []
    for i in range(depth):
        nested_wildcard = "/*" * (i + 1)
        filters.append(f"      - '{path}{nested_wildcard}'")
    return filters


def _get_paths(dependency_chain: Sequence[str]) -> str:
    all_paths: List[str] = []
    for dependency in dependency_chain:
        all_paths.extend(_get_path_filters(path=dependency))
    return "\n".join(all_paths)


def _get_build_commands(workspace: str) -> str:
    commands: List[str] = []
    commands.append(f"      - name: Build {workspace}")
    commands.append(f"        run: yarn workspace {workspace} build")
    if workspace == "main-site-frontend":
        commands.append(f"      - name: Install react-snap")
        commands.append(f"        run: yarn add react-snap --dev -W")
        commands.append(f"      - name: Run react-snap")
        commands.append(f"        run: yarn workspace main-site-frontend ci-postbuild")
    return "\n".join(commands)


_CREATE_STATUS_STEP: str = """
      - name: Create Success Status
        uses: actions/github-script@0.2.0
        with:
          github-token: ${{ github.token }}
          script: |
            github.repos.createStatus({
              owner: 'SamChou19815',
              repo: 'website',
              sha: context.sha,
              state: 'success',
            });
"""


def _generate_frontend_ci_workflow(workspace: str) -> Tuple[str, str]:
    dependency_chain = get_dependency_chain(workspace=workspace)
    job_name = f"ci-{workspace}"
    yml_filename = f"generated-{job_name}.yml"
    yml_content = f"""# @generated

name: {job_name}
on:
  pull_request:
    paths:
      - .github/workflows/{yml_filename}
      - package.json
      - 'configuration/**'
{_get_paths(dependency_chain=dependency_chain)}

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: Set up Node
        uses: actions/setup-node@v1
      - name: Yarn Install
        run: yarn install

{_get_build_commands(workspace=workspace)}
{_CREATE_STATUS_STEP}
"""

    return yml_filename, yml_content


def _generate_frontend_cd_workflow(workspace: str) -> Tuple[str, str]:
    dependency_chain = get_dependency_chain(workspace=workspace)
    job_name = f"cd-{workspace}"
    yml_filename = f"generated-{job_name}.yml"
    yml_content = f"""# @generated

name: {job_name}
on:
  push:
    branches:
      - master
    paths:
      - .github/workflows/{yml_filename}
      - package.json
      - 'configuration/**'
{_get_paths(dependency_chain=dependency_chain)}

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: Set up Node
        uses: actions/setup-node@v1
      - name: Yarn Install
        run: yarn install

{_get_build_commands(workspace=workspace)}

      - name: Install Firebase Tools
        run: yarn add --dev firebase-tools -W
      - name: Deploy {workspace}
        env:
          FIREBASE_TOKEN: ${{{{ secrets.FIREBASE_TOKEN }}}}
        run: |
          ./node_modules/.bin/firebase deploy \\
          --token=$FIREBASE_TOKEN --non-interactive --only hosting:{workspace}
{_CREATE_STATUS_STEP}
"""

    return yml_filename, yml_content


def generate_workflows() -> Sequence[Tuple[str, str]]:
    return [
        # CI
        _generate_frontend_ci_workflow(workspace="blog"),
        _generate_frontend_ci_workflow(workspace="main-site-frontend"),
        _generate_frontend_ci_workflow(workspace="sam-react-common"),
        _generate_frontend_ci_workflow(workspace="samlang-demo-frontend"),
        _generate_frontend_ci_workflow(workspace="samlang-docs"),
        _generate_frontend_ci_workflow(workspace="ten-web-frontend"),
        # CD
        _generate_frontend_cd_workflow(workspace="blog"),
        _generate_frontend_cd_workflow(workspace="main-site-frontend"),
        _generate_frontend_cd_workflow(workspace="samlang-demo-frontend"),
        _generate_frontend_cd_workflow(workspace="samlang-docs"),
        _generate_frontend_cd_workflow(workspace="ten-web-frontend"),
    ]
