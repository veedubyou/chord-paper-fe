#!/bin/bash

# Convenience script to undeploy everything

microk8s kubectl delete svc/chord-fe
microk8s kubectl delete deploy/chord-fe
watch microk8s kubectl get all
