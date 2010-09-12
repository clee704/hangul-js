#! /usr/bin/env python
import re, sys
from subprocess import Popen, PIPE

# Just typing 'ant' is sufficient if you are not bothered by ant's printing
# many lines when tests failed.

def main(argv):
    return_code = run_test(len(argv) > 1 and argv[1] == '-v')
    sys.exit(return_code)

def run_test(verbose=False):
    p = Popen(['ant'], stdout=PIPE, stderr=PIPE)
    while True:
        line = p.stdout.readline()
        if not line:
            break
        print line.decode('UTF-8'),
    print_error(p.stderr.read(), verbose)
    p.wait()
    return p.returncode

def print_error(msg, verbose):
    if verbose:
        print msg,
        return
    switch = False
    # remove the long long traceback message
    for line in msg.split('\n')[:-1]:
        if switch and re.match('^javax.script.ScriptException|\tat', line):
            continue
        print line
        switch = line == 'BUILD FAILED'

if __name__ == '__main__':
    main(sys.argv)
