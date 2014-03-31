
EXE = Netjs/bin/Debug/Netjs.exe

$(EXE): Netjs
	xbuild

test: sample.js sample.html

sample.js: sample.ts
	tsc -t ES5 mscorlib.ts sample.ts --out sample.js

sample.ts: sample.dll
	netjs sample.dll

sample.dll: sample.cs
	mcs -target:library sample.cs -out:sample.dll	

netjs.sh: Makefile $(EXE)
	echo exec mono $(CURDIR)/$(EXE) \"\$$\@\" > netjs.sh
	chmod +x netjs.sh

install: netjs.sh
	ln -s -f $(CURDIR)/netjs.sh /usr/bin/netjs
	echo Installed as /usr/bin/netjs

uninstall:
	rm -f /usr/bin/netjs
	rm -f netjs.sh

