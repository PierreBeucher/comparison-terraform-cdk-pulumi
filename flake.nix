{
  description = "IaC demo";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }: 
    flake-utils.lib.eachDefaultSystem (system:
      let  
        pkgs = import nixpkgs { 
          system = system; 
          config.allowUnfree = true;
        };
                
        deployPackages = with pkgs; [
            terraform
            azure-cli
            gnumake
            nodejs-slim
            nodePackages.npm
            nodePackages.cdktf-cli
        ];
      in {
        devShells = {
          default = pkgs.mkShell {
            packages = deployPackages;

            shellHook = ''
              
            '';
          };
        };
      }
    );
}