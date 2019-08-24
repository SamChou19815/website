import argparse
import os
import sys

from .workspace import validate_dependency_chain
from .generator import generate_workflows


def _validate_dependencies(arguments: argparse.Namespace) -> bool:
    try:
        validate_dependency_chain()
        return True
    except Exception as exception:
        print(f"ERROR: {str(exception)}")
        return False


def _generate_workflows(arguments: argparse.Namespace) -> bool:
    try:
        output_directory = arguments.output_directory
        for yml_file, yml_file_content in generate_workflows():
            with open(os.path.join(output_directory, yml_file), "w") as output_file:
                output_file.write(yml_file_content)
        return True
    except Exception as exception:
        print(f"ERROR: {str(exception)}")
        return False


def main() -> bool:
    parser = argparse.ArgumentParser(
        description="website packages builder", allow_abbrev=False
    )
    parsed_commands = parser.add_subparsers(
        metavar="{validate-dependencies, generate-workflows}"
    )

    parsed_commands.add_parser(name="validate-dependencies").set_defaults(
        command=_validate_dependencies
    )
    generate_workflows_parser = parsed_commands.add_parser(name="generate-workflows")
    generate_workflows_parser.set_defaults(command=_generate_workflows)
    generate_workflows_parser.add_argument(
        "--output-directory", default=".github/workflows"
    )

    arguments = parser.parse_args()

    if not hasattr(arguments, "command"):
        print("Command is not specified!")
        return False

    return arguments.command(arguments=arguments)


if __name__ == "__main__":
    sys.exit(0 if main() else 1)
