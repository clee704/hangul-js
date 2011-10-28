#! /usr/bin/env python
import glob, os, sys, subprocess, tempfile
import yaml

def main(argv):
    retval = 0
    manifest = yaml.load(open('manifest.yaml'))
    print 'Collecting files from {0}'.format(manifest['src_dir'])
    contents = combine(manifest['src_dir'], manifest['combine_order'])
    print 'Replacing @VERSION with {0}'.format(manifest['version'])
    contents = contents.replace('@VERSION', manifest['version'])
    temp = tempfile.NamedTemporaryFile(suffix='.js', delete=False)
    temp.write(contents)
    temp.close()
    dist_dir = manifest['dist_dir']
    if not os.path.isdir(dist_dir):
        print 'Creating a new directory at {0}'.format(dist_dir)
        os.mkdir(dist_dir)
    target_path = os.path.join(dist_dir, manifest['combine_name'])
    print 'Compressing with {0}'.format(manifest['yuicompressor'])
    if 0 == compress(manifest['yuicompressor'], temp.name, target_path):
        print 'Compressed data is written at {0}'.format(target_path)
    else:
        print 'Compression failed'
        retval = 1
    os.remove(temp.name)
    sys.exit(retval)

def combine(src_dir, combine_order):
    paths = []
    for p in (glob.glob(os.path.join(src_dir, fn)) for fn in combine_order):
        paths.extend(p)
    visited = set()
    contents = []
    for p in paths:
        if p in visited:
            continue
        visited.add(p)
        with open(p) as f:
            contents.append(f.read())
    return ''.join(contents)

def compress(yuicompressor, input, output):
    args = ['java', '-jar', yuicompressor, '-o', output, input]
    return subprocess.call(args)

if __name__ == '__main__':
    main(sys.argv)
