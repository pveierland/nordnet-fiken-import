{
  description = "Nordnet Fiken import — local development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    { nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          packages = [ pkgs.bun ];

          shellHook = ''
            echo "bun $(bun --version) ready — run 'bun install' then 'bun dev' (http://localhost:5173)"
          '';
        };

        apps.default = {
          type = "app";
          program = toString (
            pkgs.writeShellScript "nordnet-fiken-import-dev" ''
              export PATH="${pkgs.bun}/bin:$PATH"
              bun install
              exec bun dev
            ''
          );
        };
      }
    );
}
