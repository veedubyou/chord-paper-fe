#!/bin/bash

# Convenience script to undeploy everything

kubectl delete svc/chord-fe
kubectl delete deploy/chord-fe
watch kubectl get all
