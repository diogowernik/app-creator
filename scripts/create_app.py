"""Create an independent app from the versioned template."""

import argparse
import json
import re
import shutil
import subprocess
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def ignored_artifacts(_directory: str, names: list[str]) -> set[str]:
    return {
        name for name in names
        if name in {".git", ".venv", "node_modules", "__pycache__", ".ruff_cache", "media", "staticfiles"}
        or name.startswith(".next")
        or name.endswith((".sqlite3", ".pyc", ".tsbuildinfo"))
        or (name.startswith(".env") and not name.endswith(".example"))
    }


def create_app(slug: str, destination: Path, mode: str = "new") -> Path:
    if not re.fullmatch(r"[a-z][a-z0-9]*(?:-[a-z0-9]+)*", slug) or len(slug) > 64:
        raise ValueError("Nome inválido: use letras minúsculas, números e hífens, até 64 caracteres.")
    if slug in {"con", "prn", "aux", "nul"} or re.fullmatch(r"(?:com|lpt)[1-9]", slug):
        raise ValueError("Nome reservado pelo sistema operacional.")
    if mode not in {"new", "migration"}:
        raise ValueError("Modo inválido.")

    destination = destination.expanduser().resolve()
    destination.mkdir(parents=True, exist_ok=True)
    target = destination / slug
    # mkdir is the exclusive reservation: existing dirs, files and symlinks fail.
    target.mkdir()
    try:
        shutil.copytree(ROOT / "template", target, dirs_exist_ok=True, ignore=ignored_artifacts)
        if mode == "migration":
            shutil.copytree(ROOT / "migration-docs", target / "docs", dirs_exist_ok=True)
        replacements = {
            "__APP_SLUG__": slug,
            "__APP_NAME__": slug.replace("-", " ").title(),
            "__APP_DESCRIPTION__": f"Aplicação {slug}",
        }
        for path in target.rglob("*"):
            if path.is_file():
                content = path.read_text(encoding="utf-8")
                for token, value in replacements.items():
                    content = content.replace(token, value)
                path.write_text(content, encoding="utf-8")
        metadata = {
            "starter_version": (ROOT / "VERSION").read_text().strip(),
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "mode": mode,
        }
        (target / ".app-creator.json").write_text(
            json.dumps(metadata, indent=2) + "\n", encoding="utf-8"
        )
    except Exception:
        # Only remove the directory this invocation exclusively created.
        shutil.rmtree(target)
        raise
    return target


def prepare(target: Path) -> None:
    # setup.sh installs only manifests/locks. No shell interpolation of user input.
    subprocess.run(["bash", str(target / "scripts/setup.sh")], cwd=target, check=True)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("slug", help="Nome do app, por exemplo meu-app")
    parser.add_argument("--destination", type=Path, default=Path.cwd())
    parser.add_argument("--mode", choices=["new", "migration"], default="new")
    parser.add_argument("--prepare", action="store_true", help="Instalar dependências e migrar banco local")
    args = parser.parse_args()
    try:
        target = create_app(args.slug, args.destination, args.mode)
    except FileExistsError:
        parser.exit(1, "Destino existente: nenhum arquivo foi sobrescrito.\n")
    except (ValueError, OSError) as error:
        parser.exit(1, f"Não foi possível gerar: {error}\n")
    if args.prepare:
        try:
            prepare(target)
        except (OSError, subprocess.CalledProcessError):
            parser.exit(1, f"Preparação falhou. Código preservado em {target}; consulte o README.\n")
    print(f"Aplicação criada em {target}")
    print("Próximos passos: consulte o README; execute bash scripts/setup.sh se ainda não preparou.")


if __name__ == "__main__":
    main()
