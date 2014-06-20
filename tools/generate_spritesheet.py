from PIL import Image
import sys
import os
from subprocess import call


def main(*args):
    img_path = 'img/'
    css_path = 'css/'
    actions = [x for x in os.listdir(img_path) if os.path.isdir(img_path+x)]
    spritesheet = []
    sheet_widths = []
    sheet_height = 0
    sprite_size = []
    for action in actions:
        action_path = img_path+action
        print action
        moves = os.listdir(action_path)
        moves.sort()
        spriterow = []
        spritewidths = []
        spriteheights = []
        for move in moves:
            print move
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
    for index, sprite_action in enumerate(spritesheet):
        offset_x = 0
        sprite_width, sprite_height = sprite_size[index]
        for sprite_move in sprite_action:
            spritesheet_image.paste(sprite_move, (offset_x, offset_y))
            offset_x += sprite_width
        keyframe_args = (actions[index], 0, offset_y, sprite_width * len(sprite_action), offset_y) + \
            tuple(actions[index] for x in range(0, 11)) + \
            (sprite_width, sprite_height, actions[index], len(sprite_action) * 0.5, len(sprite_action))
        offset_y += sprite_height
        keyframes = """

.%s-keyframes {
   from { background-position: -%dpx -%dpx; }
     to { background-position: -%dpx -%dpx; }
}
@-webkit-keyframes %s-action {
    .%s-keyframes;
}

@-moz-keyframes %s-action {
    .%s-keyframes;
}

@-ms-keyframes %s-action {
    .%s-keyframes;
}

@-o-keyframes %s-action {
    .%s-keyframes;
}

@keyframes %s-action {
    .%s-keyframes;
}

.%s {
    width: %dpx;
    height: %dpx;
    .animation( %s-action %ss steps(%d) infinite);
}
        """ % keyframe_args
        less += keyframes

    spritesheet_image.save(img_path + 'spritesheet.png', 'PNG')
    with open(css_path + 'spritesheet.less', 'w') as less_file:
        less_file.write(less)
    call(['lessc', css_path + 'style.less', css_path + 'style.css'])

main(*sys.argv[1:])