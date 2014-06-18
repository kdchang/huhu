from PIL import Image
import sys
import os


def main(*args):
    path = args[0]
    actions = os.listdir(path)
    spritesheet = []
    sheet_widths = []
    sheet_height = 0
    sprite_size = []
    for action in actions:
        action_path = path+action
        if os.path.isdir(action_path):
            print action
            moves = os.listdir(action_path)
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
    print '%d, %d' % (sheet_width, sheet_height)
    spritesheet_image = Image.new('RGBA', (sheet_width, sheet_height))
    offset_y = 0
    for index, sprite_action in enumerate(spritesheet):
        offset_x = 0
        sprite_width, sprite_height = sprite_size[index]
        for sprite_move in sprite_action:
            spritesheet_image.paste(sprite_move, (offset_x, offset_y))
            offset_x += sprite_width
        offset_y += sprite_height

    spritesheet_image.save(path + 'spritesheet.png', 'PNG')

main(*sys.argv[1:])