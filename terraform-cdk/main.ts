import { Construct } from "constructs";
import { App, TerraformOutput, TerraformStack } from "cdktf";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { KubernetesCluster } from "@cdktf/provider-azurerm/lib/kubernetes-cluster";
import { AksCluster } from "./resources/cluster"

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AzurermProvider(this, "azProvider", {
      features: {}
    })

    const rg = new ResourceGroup(this, "rg", {
      name: "AKS-test",
      location: "francecentral"
    })

    const cluster = new KubernetesCluster(this, "cluster", {
      name: "test-cluster",
      location: rg.location,
      resourceGroupName: rg.name,
      dnsPrefix: "testdnsprefix",
      defaultNodePool: {
        name: "defaultpool",
        vmSize: "Standard_A2_v2",
        nodeCount: 2,
      },
      identity: {
        type:  "SystemAssigned"
      }
    })

    new TerraformOutput(this, "kubeconfig", {
      value: cluster.kubeConfigRaw,
      sensitive: true
    })

    // const cluster = new AksCluster(this, "example-cluster", {
    //   clusterName: "example",
    //   resourceGroup: {
    //     location: "francecentral",
    //     name: "sauermann-integration"
    //   },
    //   additionalNodePools: [
    //     {
    //       name: "foo",
    //       size: 1
    //     },
    //     {
    //       name: "bar",
    //       size: 2
    //     }
    //   ]
    // })
  }
}


const app = new App();
new MyStack(app, "test-azure");
app.synth();
