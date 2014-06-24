from PIL import Image
import sys
import os
from local import *
# import re

# ANIMATE_ONCE_PATTERN = re.compile('.+\-(before|after)$')


def main(*args):
    actions = [x for x in os.listdir(IMG_PATH) if os.path.isdir(IMG_PATH+x)]
    spritesheet = []
    sheet_widths = []
    sheet_height = 0
    sprite_size = []
    for action in actions:
        action_path = IMG_PATH+action
        print action
        moves = os.listdir(action_path)
        moves.sort()
        spriterow = []
        spritewidths = []
        spriteheights = []
        for move in moves:
            move_path = action_path+'/'+move
            image = Image.open(move_path)
            spriterow.append(image)
            width, height = image.size
            spritewidths.append(width)
            spriteheights.append(height)
        spritesheet.append(spriterow)
        sheet_widths.append(len(spritewidths) * max(spritewidths))
        sheet_height += max(spriteheights)
        sprite_size.append((max(spritewidths), max(spriteheights)))
    sheet_width = max(sheet_widths)
    # print '%d, %d' % (sheet_width, sheet_height)
    spritesheet_image = Image.new('RGBA', (sheet_width, sheet_height))
    offset_y = 0
    less = """
.animation(@parameters) {
  -webkit-animation: @parameters;
  -moz-animation: @parameters;
  -o-animation: @parameters;
  -ms-animation: @parameters;
  animation: @parameters;
}
"""
    # print "', '".join(actions)
    for index, sprite_action in enumerate(spritesheet):
        offset_x = 0
        sprite_width, sprite_height = sprite_size[index]
        for sprite_move in sprite_action:
            spritesheet_image.paste(sprite_move, (offset_x, offset_y))
            offset_x += sprite_width
        animation_loop = 'normal'  # if ANIMATE_ONCE_PATTERN.match(actions[index]) else 'infinite'
        offset_y += sprite_height
        keyframes = """

.%(move)s-keyframes {
   from { background-position: -%(offset_from_x)dpx -%(offset_y)dpx; }
     to { background-position: -%(offset_to_x)dpx -%(offset_y)dpx; }
}
@-webkit-keyframes %(move)s-action {
    .%(move)s-keyframes;
}

@-moz-keyframes %(move)s-action {
    .%(move)s-keyframes;
}

@-ms-keyframes %(move)s-action {
    .%(move)s-keyframes;
}

@-o-keyframes %(move)s-action {
    .%(move)s-keyframes;
}

@keyframes %(move)s-action {
    .%(move)s-keyframes;
}

.%(move)s {
    width: %(width)dpx;
    height: %(height)dpx;
    .animation(%(move)s-action %(seconds)fs steps(%(steps)d) %(loop)s forwards);
}
        """ % {
            'move': actions[index],
            'offset_from_x': 0,
            'offset_to_x': sprite_width * len(sprite_action),
            'offset_y': offset_y,
            'width': sprite_width,
            'height': sprite_height,
            'seconds': len(sprite_action) * 0.5,
            'steps': len(sprite_action),
            'loop': animation_loop,
        }
        less += keyframes

    spritesheet_image.save(CSS_PATH + 'img/spritesheet.png', 'PNG')
    with open(CSS_PATH + 'spritesheet.less', 'w') as less_file:
        less_file.write(less)

main(*sys.argv[1:])