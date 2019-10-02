import argparse
import os
import sys

from .workspace import validate_dependency_chain
from .configuration import create_yarn_workspace_project
from .generator import generate_workflows
from .git import get_changed_paths, get_changed_paths_last_commit
from .diff import is_affected
from .runner import build_workspace, deploy_workspace


def _validate_dependencies(arguments: argparse.Namespace) -> None:
    validate_dependency_chain()


def _generate_workflows(arguments: argparse.Namespace) -> None:
    output_directory = arguments.output_directory
    for yml_file, yml_file_content in generate_workflows():
        with open(os.path.join(output_directory, yml_file), "w") as output_file:
            output_file.write(yml_file_content)


def _build_if_affected(arguments: argparse.Namespace) -> None:
    project = create_yarn_workspace_project(workspace=arguments.workspace)
    changed_paths = get_changed_paths(
        base_ref=arguments.base_ref, head_ref=arguments.head_ref
    )
    affected = is_affected(changed_paths=changed_paths, project=project)

    build_workspace(project=project, affected=affected)


def _deploy_if_affected(arguments: argparse.Namespace) -> None:
    project = create_yarn_workspace_project(workspace=arguments.workspace)
    affected = is_affected(
        changed_paths=get_changed_paths_last_commit(), project=project
    )

    deploy_workspace(project=project, affected=affected)


def main() -> bool:
    parser = argparse.ArgumentParser(
        description="website packages builder", allow_abbrev=False
    )
    parsed_commands = parser.add_subparsers(
        metavar="{validate-dependencies, generate-workflows, build-if-affected}"
    )

    parsed_commands.add_parser(name="validate-dependencies").set_defaults(
        command=_validate_dependencies
    )
    generate_workflows_parser = parsed_commands.add_parser(name="generate-workflows")
    generate_workflows_parser.set_defaults(command=_generate_workflows)
    generate_workflows_parser.add_argument(
        "--output-directory", default=".github/workflows"
    )

    build_if_affected_parser = parsed_commands.add_parser(name="build-if-affected")
    build_if_affected_parser.set_defaults(command=_build_if_affected)
    build_if_affected_parser.add_argument("--base-ref", required=True)
    build_if_affected_parser.add_argument("--head-ref", required=True)
    build_if_affected_parser.add_argument("--workspace", required=True)

    deploy_if_affected_parser = parsed_commands.add_parser(name="deploy-if-affected")
    deploy_if_affected_parser.set_defaults(command=_deploy_if_affected)
    deploy_if_affected_parser.add_argument("--workspace", required=True)

    arguments = parser.parse_args()

    if not hasattr(arguments, "command"):
        print("Command is not specified!")
        return False

    try:
        arguments.command(arguments=arguments)
        return True
    except Exception as exception:
        print(f"ERROR: {str(exception)}")
        return False


if __name__ == "__main__":
    sys.exit(0 if main() else 1)
