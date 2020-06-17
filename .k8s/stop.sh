#!/bin/bash

# Convenience script to undeploy everything

microk8s kubectl delete svc/chord-fe-svc
microk8s kubectl delete deploy/chord-fe-deploy
watch microk8s kubectl get all
