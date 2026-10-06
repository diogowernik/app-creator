import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from scripts.create_app import ROOT, create_app


class GeneratorTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.destination = Path(self.directory.name)

    def test_creates_independent_app_with_dotfiles_and_replaced_identifiers(self):
        app = create_app("test-app", self.destination)
        self.assertTrue((app / ".gitignore").exists())
        self.assertTrue((app / ".github/workflows/ci.yml").exists())
        self.assertEqual(json.loads((app / "web/package.json").read_text())["name"], "test-app-web")
        for path in app.rglob("*"):
            if path.is_file():
                content = path.read_text()
                self.assertNotIn("__APP_", content, str(path))
                self.assertNotIn(str(ROOT), content, str(path))
        self.assertEqual(json.loads((app / ".app-creator.json").read_text())["mode"], "new")
        self.assertFalse((app / "api/.env").exists())
        self.assertFalse((app / ".git").exists())

    def test_never_overwrites_existing_directory_file_or_symlink(self):
        app = self.destination / "existing"
        app.mkdir()
        marker = app / "keep.txt"
        marker.write_text("original")
        with self.assertRaises(FileExistsError):
            create_app("existing", self.destination)
        self.assertEqual(marker.read_text(), "original")
        (self.destination / "occupied-file").write_text("original")
        with self.assertRaises(FileExistsError):
            create_app("occupied-file", self.destination)
        (self.destination / "occupied-link").symlink_to(self.destination / "missing")
        with self.assertRaises(FileExistsError):
            create_app("occupied-link", self.destination)

    def test_rejects_unsafe_names_before_writing(self):
        for name in ["../escape", "/absolute", "Uppercase", "app space", "app;command", "-app", "con", "a" * 65]:
            with self.subTest(name=name), self.assertRaises(ValueError):
                create_app(name, self.destination)
        self.assertEqual(list(self.destination.iterdir()), [])

    def test_migration_only_adds_documentation(self):
        app = create_app("migration-app", self.destination, "migration")
        self.assertTrue((app / "docs/migration-checklist.md").exists())
        self.assertEqual(json.loads((app / ".app-creator.json").read_text())["mode"], "migration")

    def test_failed_copy_removes_only_its_own_new_destination(self):
        (self.destination / "keep").mkdir()
        with patch("scripts.create_app.shutil.copytree", side_effect=OSError("copy failed")):
            with self.assertRaises(OSError):
                create_app("failed-app", self.destination)
        self.assertFalse((self.destination / "failed-app").exists())
        self.assertTrue((self.destination / "keep").exists())

    def test_excludes_secrets_and_installed_artifacts(self):
        fake_root = self.destination / "source"
        template = fake_root / "template"
        template.mkdir(parents=True)
        (fake_root / "VERSION").write_text("0.1.0")
        for name in [".env", ".env.local", "db.sqlite3", "compiled.pyc"]:
            (template / name).write_text("must not copy")
        (template / ".env.example").write_text("EXAMPLE=1")
        with patch("scripts.create_app.ROOT", fake_root):
            app = create_app("filtered-app", self.destination)
        self.assertEqual({p.name for p in app.iterdir()}, {".env.example", ".app-creator.json"})
