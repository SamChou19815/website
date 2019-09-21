from typing import List, Sequence, Tuple
from .git import get_depth
from .workspace import get_dependency_chain
from .configuration import Project, get_projects


def _get_path_filters(path: str) -> Sequence[str]:
    depth = get_depth(path=path)
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


def _get_create_status_commands(workflow_name: str) -> str:
    return f"""
      - name: Create Success Status
        uses: actions/github-script@0.2.0
        with:
          github-token: ${{{{ secrets.DEPLOY_GH_PAGE_TOKEN }}}}
          script: |
            github.repos.createStatus({{
              owner: 'SamChou19815',
              repo: 'website',
              sha: '${{{{github.sha}}}}',
              state: 'success',
              context: 'github-actions: {workflow_name}',
              description: 'Passed CI Tests!',
            }});
"""


def _get_ci_workspace_build_upload_step(project: Project) -> str:
    workspace = project.workspace
    return f"""
      - name: Build {workspace}
        if: always()
        run: |
          python -m builder.builder build-if-affected \\
            --base-ref ${{{{ github.base_ref }}}} \\
            --head-ref ${{{{ github.head_ref }}}} \\
            --workspace {workspace}
      - name: Collect {workspace} Built Static Assets
        run: cp -R {project.build_output} build/{workspace}
"""


def _generate_frontend_ci_workflow() -> Tuple[str, str]:
    yml_filename = f"generated-ci.yml"
    yml_content = f"""# @generated

name: CI
on: pull_request

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: Set up Python
        uses: actions/setup-python@v1
        with:
          python-version: '3.7'
      - name: Set up Node
        uses: actions/setup-node@v1
      - name: Yarn Install
        run: yarn install
      - name: Prepare Built Assets Collector
        run: mkdir build
{"".join(
        [
            _get_ci_workspace_build_upload_step(project=project)
            for project in get_projects()
        ]
    )}
      - name: Upload Built Static Asserts
        uses: actions/upload-artifact@master
        with:
          name: built-assets
          path: build
{_get_create_status_commands("CI")}
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
{_get_create_status_commands(job_name)}
"""

    return yml_filename, yml_content


def generate_workflows() -> Sequence[Tuple[str, str]]:
    return [
        # CI
        _generate_frontend_ci_workflow(),
        # CD
        _generate_frontend_cd_workflow(workspace="blog"),
        _generate_frontend_cd_workflow(workspace="main-site-frontend"),
        _generate_frontend_cd_workflow(workspace="samlang-demo-frontend"),
        _generate_frontend_cd_workflow(workspace="samlang-docs"),
        _generate_frontend_cd_workflow(workspace="ten-web-frontend"),
    ]
