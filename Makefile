pub.go: pub.sol
	abigen -sol $^ -pkg pub > $@
