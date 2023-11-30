output "kube_config_raw" {
  value = azurerm_kubernetes_cluster.cluster.kube_config_raw
  sensitive = true
}