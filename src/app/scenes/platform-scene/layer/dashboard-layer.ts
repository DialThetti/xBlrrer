import { FeatherEngine, RenderContext } from '@dialthetti/feather-engine-core';
import { drawRect, Font } from '@dialthetti/feather-engine-graphics';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';
import PlatformerLevel from '@extension/platformer/level/platformer-level';
import { Killable } from '@game/entities/traits';
import { RenderLayer } from 'src/app/core/rendering';

export default class DashboardLayer implements RenderLayer {
  rad = 1;

  constructor(private font: Font, private level: PlatformerLevel, private player: PlatformerEntity) {}

  draw(context: RenderContext): void {
    drawRect(context, 0, 23 * this.level.tilesize, FeatherEngine.screenSize.width, 5 * this.level.tilesize, 'black', {
      filled: true,
    });
    drawRect(context, 0, 23 * this.level.tilesize, FeatherEngine.screenSize.width, 5 * this.level.tilesize, 'white', {
      filled: false,
    });
    this.drawLives(context);
    this.drawMinimap(context);
  }
  drawLives(context: RenderContext): void {
    this.font.print('HP', context, 4, 4 + 16 * 23);
    for (let hp = 0; hp < this.player.getTrait(Killable).hp; hp++) {
      this.font.draw('o', context, 16 + 16 * hp, 16 * 24);
    }
    for (let hp = this.player.getTrait(Killable).hp; hp < this.player.getTrait(Killable).maxHP; hp++) {
      this.font.draw('.', context, 16 + 16 * hp, 16 * 24);
    }
  }
  drawMinimap(context: RenderContext): void {
    const posX = Math.floor((this.level.miniMap.width * this.player.pos.x) / (this.level.width * this.level.tilesize));
    const posY = Math.floor(
      (this.level.miniMap.height * this.player.pos.y) / (this.level.height * this.level.tilesize)
    );
    for (let x = posX - this.rad; x <= posX + this.rad; x++) {
      for (let y = posY - this.rad; y <= posY + this.rad; y++) {
        if (x < 0 || y < 0 || y >= this.level.miniMap.rooms.length || x >= this.level.miniMap.rooms[y].length) {
          continue;
        }
        const room = this.level.miniMap.rooms[y][x];
        const drawPos = {
          x: (x - posX + 2) * 16 + 512 - 16 * 5,
          y: (y - posY + 2) * 16 + 448 - 16 * 5,
        };
        if (!room.not) {
          drawRect(context, drawPos.x + 3, drawPos.y + 3, 10, 10, 'grey', { filled: true });
          if (room.topOpen) {
            drawRect(context, drawPos.x + 6, drawPos.y, 4, 3, 'grey', { filled: true });
          }
          if (room.bottomOpen) {
            drawRect(context, drawPos.x + 6, drawPos.y + 16 - 3, 4, 3, 'grey', { filled: true });
          }
          if (room.leftOpen) {
            drawRect(context, drawPos.x, drawPos.y + 6, 3, 4, 'grey', { filled: true });
          }
          if (room.rightOpen) {
            drawRect(context, drawPos.x + 16 - 3, drawPos.y + 6, 3, 4, 'grey', { filled: true });
          }
        }

        drawRect(context, 512 - 16 - 16 - 16 + 6, 400 + 6, 4, 4, 'lime', { filled: true });
      }
    }
  }
  withZero(count: number, length: number): string {
    return count.toFixed().toString().padStart(length, '0');
  }
}
