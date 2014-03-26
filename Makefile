
EXE = Netjs/bin/Debug/Netjs.exe

$(EXE): Netjs
	xbuild

netjs.sh: Makefile $(EXE)
	echo exec mono $(CURDIR)/$(EXE) \"\$$\@\" > netjs.sh
	chmod +x netjs.sh

install: netjs.sh
	ln -s -f $(CURDIR)/netjs.sh /usr/bin/netjs
	echo Installed as /usr/bin/netjs

uninstall:
	rm -f /usr/bin/netjs
	rm -f netjs.sh

