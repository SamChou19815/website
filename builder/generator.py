from typing import List, Sequence, Tuple
from .workspace import get_dependency_chain


def _get_paths(dependency_chain: Sequence[str]) -> str:
    return "\n".join([f"      - '{dependency}/**'" for dependency in dependency_chain])


def _get_build_commands(dependency_chain: Sequence[str]) -> str:
    commands: List[str] = []
    for dependency in dependency_chain[:-1]:
        commands.append(f"      - name: Build dependency {dependency}".ljust(6))
        commands.append(f"        run: yarn workspace {dependency} build".ljust(6))
    workspace = dependency_chain[-1]
    commands.append(f"      - name: Build {workspace}".ljust(6))
    commands.append(f"        run: yarn workspace {workspace} build".ljust(6))
    return "\n".join(commands)


def _generate_frontend_ci_workflow(workspace: str) -> Tuple[str, str]:
    dependency_chain = get_dependency_chain(workspace=workspace)
    yml_filename = f"generated-ci-{workspace}.yml"
    yml_content = f"""# @generated

on:
  pull_request:
    paths:
      - .github/workflows/ci-{workspace}.yml
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

{_get_build_commands(dependency_chain=dependency_chain)}
"""

    return yml_filename, yml_content


def _generate_frontend_cd_workflow(workspace: str) -> Tuple[str, str]:
    dependency_chain = get_dependency_chain(workspace=workspace)
    yml_filename = f"generated-cd-{workspace}.yml"
    yml_content = f"""# @generated

on:
  push:
    branches:
      - master
    paths:
      - .github/workflows/cd-{workspace}.yml
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

{_get_build_commands(dependency_chain=dependency_chain)}

      - name: Deploy {workspace}
        env:
          FIREBASE_TOKEN: ${{{{ secrets.FIREBASE_TOKEN }}}}
        run: |
          ./node_modules/.bin/firebase deploy \\
          --token=$FIREBASE_TOKEN --non-interactive --only hosting:{workspace}
"""

    return yml_filename, yml_content


def generate_workflows() -> Sequence[Tuple[str, str]]:
    return [
        # CI
        _generate_frontend_ci_workflow(workspace="blog"),
        _generate_frontend_ci_workflow(workspace="main-site-frontend"),
        _generate_frontend_ci_workflow(workspace="sam-highlighter"),
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
