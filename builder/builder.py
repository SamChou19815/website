import argparse
import os
import sys

from .workspace import validate_dependency_chain
from .generator import generate_workflows


def _generate_workflows() -> None:
    for yml_file, yml_file_content in generate_workflows():
        with open(os.path.join(".github/workflows", yml_file), "w") as output_file:
            output_file.write(yml_file_content)


def main() -> bool:
    parser = argparse.ArgumentParser(
        description="website packages builder", allow_abbrev=False
    )
    parsed_commands = parser.add_subparsers(
        metavar="{validate-dependencies, generate-workflows}"
    )

    parsed_commands.add_parser(name="validate-dependencies").set_defaults(
        command=validate_dependency_chain
    )
    parsed_commands.add_parser(name="generate-workflows").set_defaults(
        command=_generate_workflows
    )

    arguments = parser.parse_args()

    if not hasattr(arguments, "command"):
        print("Command is not specified!")
        return False

    try:
        arguments.command()
        return True
    except Exception as exception:
        print(f"ERROR: {str(exception)}")
        return False


if __name__ == "__main__":
    sys.exit(0 if main() else 1)
