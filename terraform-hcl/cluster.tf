# resource "azurerm_resource_group" "example" {
#   name     = var.resource_group_name
#   location = "francecentral"
# }

# resource "azurerm_kubernetes_cluster" "example" {
#   name                = "example-aks"
#   location            = azurerm_resource_group.example.location
#   resource_group_name = azurerm_resource_group.example.name
#   dns_prefix          = "exampleaks"

#   default_node_pool {
#     name       = "default"
#     node_count = 1
#     vm_size    = "Standard_D2_v2"
#   }

#   identity {
#     type = "SystemAssigned"
#   }

#   tags = {
#     Environment = "Dev"
#   }
# }

# output "kube_config" {
#   value = azurerm_kubernetes_cluster.example.kube_config_raw
#   sensitive = true
# }

module "aks_cluster" {
  source = "./modules/aks_cluster"
  cluster_name = "my-cluster"
  additional_nodegroups = {
    a = {
      min_count = 1
      max_count = 3
    }
    b = {
      min_count = 2
      max_count = 4
    }
  }
}

# output "kube_config" {
#   value = aks_cluster.kube_config_raw
#   sensitive = true
# }