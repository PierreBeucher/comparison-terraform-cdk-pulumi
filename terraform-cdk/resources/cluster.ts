import { Construct } from "constructs";
import { TerraformOutput, TerraformStack } from "cdktf";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { KubernetesCluster } from "@cdktf/provider-azurerm/lib/kubernetes-cluster";
import { KubernetesClusterNodePool } from "@cdktf/provider-azurerm/lib/kubernetes-cluster-node-pool";

export interface AksClusterArgs {
    clusterName: string,
    resourceGroup: {
        name: string
        location: string
    }
    defaultNodePool?: {
        size: number
    }
    additionalNodePools?: {
        name: string
        size: number
    }[]
}

export class AksCluster extends Construct {
    constructor(scope: Construct, id: string, options: AksClusterArgs) {
      super(scope, id);
  
      const rg = new ResourceGroup(this, "rg", {
        name: "AKS-test",
        location: "francecentral"
      })
  
      const cluster = new KubernetesCluster(this, "cluster", {
        name: options.clusterName,
        location: rg.location,
        resourceGroupName: rg.name,
        dnsPrefix: "exampletest",
        defaultNodePool: {
          name: "defaultpool",
          vmSize: "Standard_A2_v2",
          nodeCount: options.defaultNodePool?.size || 1,
        },
        identity: {
          type:  "SystemAssigned"
        }
      })

      for (const npConfig of options.additionalNodePools || []){
        
        const nodepool = new KubernetesClusterNodePool(this, `nodepool-${npConfig.name}`, {
            kubernetesClusterId: cluster.id,
            name: npConfig.name,
            vmSize: "Standard_D2_v2"
        })

        new TerraformOutput(this, `nodepool-output-${npConfig.name}`, {
            value: nodepool.friendlyUniqueId,
          })

      }
      
      new TerraformOutput(this, "kubeconfig", {
        value: cluster.kubeConfigRaw,
        sensitive: true
      })
    }
  }
  