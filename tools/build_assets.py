import sys
import os
from subprocess import call
from local import *
import re

TEMPLATE_PATTERN = re.compile('.+\.tpl\..+')


def main(*args):
    templates = [BASE_PATH + x for x in os.listdir(BASE_PATH)
                 if TEMPLATE_PATTERN.match(x) and os.path.isfile(BASE_PATH + x)]
    templates += [CSS_PATH + x for x in os.listdir(CSS_PATH)
                  if TEMPLATE_PATTERN.match(x) and os.path.isfile(CSS_PATH + x)]
    templates += [JS_PATH + x for x in os.listdir(JS_PATH)
                  if TEMPLATE_PATTERN.match(x) and os.path.isfile(JS_PATH + x)]
    for template in templates:
        with open(template, 'r') as template_file:
            output = template_file.read() % {'base_url': BASE_URL}
            with open(template.replace('.tpl', ''), 'w') as output_file:
                output_file.write(output)
    call(['lessc', CSS_PATH + 'myhuhu.less', CSS_PATH + 'myhuhu.less.css'])

main(*sys.argv[1:])