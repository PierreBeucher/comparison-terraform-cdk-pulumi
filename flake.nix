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
            nodejs-slim
            nodePackages.npm
            azure-cli
            
            terraform
            nodePackages.cdktf-cli        
            pulumi
            pulumiPackages.pulumi-azure-native
            pulumiPackages.pulumi-language-nodejs

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