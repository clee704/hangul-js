#! /usr/bin/env python
import glob, os, sys, subprocess, tempfile
import yaml

def main(argv):
    manifest = yaml.load(open('manifest.yaml'))
    contents = combine(manifest['src_dir'], manifest['combine_order'])
    contents = contents.replace('@VERSION', manifest['version'])
    temp = tempfile.NamedTemporaryFile(suffix='.js', delete=False)
    temp.write(contents)
    temp.close()
    dist_dir = manifest['dist_dir']
    if not os.path.isdir(dist_dir):
        os.mkdir(dist_dir)
    target_path = os.path.join(dist_dir, manifest['combine_name'])
    compress(manifest['yuicompressor'], temp.name, target_path)
    os.remove(temp.name)

def combine(src_dir, combine_order):
    paths = []
    for p in (glob.glob(os.path.join(src_dir, fn)) for fn in combine_order):
        paths.extend(p)
    visited = set()
    contents = []
    for p in paths:
        if p in visited:
            continue
        if not os.path.isfile(p):
            print '{0} is not a file'.format(p)
            sys.exit(1)
        visited.add(p)
        contents.append(open(p).read())
    return ''.join(contents)

def compress(yuicompressor, input, output):
    args = ['java', '-jar', yuicompressor, '-o', output, input]
    subprocess.call(args)

if __name__ == '__main__':
    main(sys.argv)
