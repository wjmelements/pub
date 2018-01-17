dapp/index.html:Makefile grafiti/client
	cd grafiti && meteor-build-client ../dapp --path "/"
swarm:
	swarm --recursive --defaultpath dapp/index.html up dapp/
