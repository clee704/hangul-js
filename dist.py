#! /usr/bin/env python
import glob, os, re, sys, subprocess, tempfile
import yaml

def main(argv):
    retval = 0
    manifest = yaml.load(open('manifest.yaml'))
    for target_name, input_files in manifest['targets'].iteritems():
        log('Target: {0}\n'.format(target_name))
        contents = combine(manifest['src_dir'], input_files)
        log('  * Replacing @VERSION with {0}\n'.format(manifest['version']))
        contents = contents.replace('@VERSION', manifest['version'])
        temp = tempfile.NamedTemporaryFile(suffix='.js', delete=False)
        temp.write(contents)
        temp.close()
        dist_dir = manifest['dist_dir']
        if not os.path.isdir(dist_dir):
            log('  * Creating a new directory at {0}\n'.format(dist_dir))
            os.mkdir(dist_dir)
        target_path = os.path.join(dist_dir, target_name)
        with open(target_path, 'w') as f:
            log('  * Writing uncompress data at {0}\n'.format(target_path))
            f.write(contents)
        target_path_min = re.sub('\.js$', '.min.js', target_path)
        retval = compress(manifest['yuicompressor'], temp.name, target_path_min)
        os.remove(temp.name)
        if retval:
            log('  * Compression failed\n')
            sys.exit(retval)
        else:
            log('  * Compressed data is written at {0}\n'.format(target_path_min))

def combine(src_dir, input_files):
    log('  * Collecting files from {0}\n'.format(src_dir))
    paths = []
    for p in (glob.glob(os.path.join(src_dir, x)) for x in flatten(input_files)):
        paths.extend(p)
    visited = set()
    contents = []
    for p in paths:
        if p in visited:
            continue
        visited.add(p)
        with open(p) as f:
            log('    - Reading {0}\n'.format(p))
            contents.append(f.read())
    header = ''
    #modules = [os.path.basename(p) for p in paths if re.search('hangul(\.[^.]+)*\.js$', p)]
    #if len(modules) > 1:
    #    header = '/*!\n{0}\n*/\n'.format(',\n'.join(modules))
    return header + ''.join(contents)

def flatten(x):
    if isinstance(x, list):
        return sum(map(flatten, x), [])
    else:
        return [x]

def compress(yuicompressor, input_path, output_path):
    args = ['java', '-jar', yuicompressor, '-o', output_path, input_path]
    return subprocess.call(args)

def log(message):
    sys.stdout.write(message)
    sys.stdout.flush()

if __name__ == '__main__':
    main(sys.argv)
