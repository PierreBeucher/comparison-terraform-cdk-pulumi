import * as pulumi from "@pulumi/pulumi";
import * as az from "@pulumi/azure";
import { AksClusterComponent } from "./components/cluster"

const config = new pulumi.Config()
const rgName = config.require("resourceGroupName")
const clusterName = config.require("clusterName")
const location = config.get("location") || "francecentral"

const resourceGroup = new az.core.ResourceGroup("resourceGroup", {
    name: rgName,
    location: location
});

const cluster = new az.containerservice.KubernetesCluster("managedCluster", {
    name: clusterName,
    location: resourceGroup.location,
    resourceGroupName: resourceGroup.name,
    dnsPrefix: "testdnsprefix",
    defaultNodePool: {
        name: "default",
        nodeCount: 1,
        vmSize: "Standard_D2_v2",
    },
    identity: {
      type:  "SystemAssigned"
    }
});

export const kubeconfig = cluster.kubeConfigRaw

// const cluster = new AksClusterComponent("aks-cluster", {
//     location: location,
//     clusterName: clusterName,
//     resourceGroupName: rgName,
//     nodepools: [
//         {
//             name: "foo",
//             size: 2
//         }, {
//             name: "bar",
//             size: 2
//         }
//     ]
// })

// export const kubeconfig = cluster.kubeconfig