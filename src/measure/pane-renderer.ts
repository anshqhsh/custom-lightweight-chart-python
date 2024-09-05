import { ViewPoint } from "../drawing/pane-view";
import { CanvasRenderingTarget2D } from "fancy-canvas";
import { MesureExtendTwoPointDrawingPaneRenderer } from "../drawing/pane-renderer";
import { MeasureOptions } from "./measure";
import { setLineStyle } from "../helpers/canvas-rendering";
import { Point } from '../drawing/data-source';



export class MeasurePaneRenderer extends MesureExtendTwoPointDrawingPaneRenderer {
  declare _options: MeasureOptions;
  declare _points: (Point | null)[];
  constructor(
    p1: ViewPoint,
    p2: ViewPoint,
    options: MeasureOptions,
    showCircles: boolean,
    points: (Point | null)[]
  ) {
    super(p1, p2, options, showCircles, points);
  }

  draw(target: CanvasRenderingTarget2D) {
    
    target.useBitmapCoordinateSpace((scope) => {
      const ctx = scope.context;

      const scaled = this._getScaledCoordinates(scope);
      const points = this._points;

      if (!scaled || !points[0] || !points[1] || !points[0].time || !points[1].price) return; // null 체크 추가

      ctx.lineWidth = this._options.width;
      ctx.strokeStyle = this._options.subLineColor;
      setLineStyle(ctx, this._options.lineStyle);
      ctx.fillStyle = this._options.subLineColor;
      

      const mainX = Math.min(scaled.x1, scaled.x2);
      const mainY = Math.min(scaled.y1, scaled.y2);
      const width = Math.abs(scaled.x1 - scaled.x2);
      const height = Math.abs(scaled.y1 - scaled.y2);

      // Draw the box
      ctx.strokeRect(mainX, mainY, width, height);
      ctx.fillRect(mainX, mainY, width, height);


      const price1 = points[0].price ?? 0; 
      const price2 = points[1].price ?? 0;
      const time1 = points[0].time ?? 0;
      const time2 = points[1].time ?? 0;

      const priceDifference = price2 - price1;
      const priceRatio = ((priceDifference / price1) * 100).toFixed(2);
      const timeDifference = Number(time2) - Number(time1);
      // Draw circles at the corners when hovered
      // if (!this._hovered) return;
      target.useMediaCoordinateSpace(({ context: ctx, mediaSize }) => {
        ctx.font = "10px Arial"; // 폰트 설정
        ctx.fillStyle = "white";

        const priceDifferenceText = `${priceDifference.toFixed(2)}(${priceRatio}%), ${Math.ceil(priceDifference)}`;
        const timeDifferenceText = `${convertSecondsToTime(timeDifference)}`;

        // Measure the text width and height to determine the size of the background box
        const priceTextMetrics = ctx.measureText(priceDifferenceText);
        const timeTextMetrics = ctx.measureText(timeDifferenceText);
        
        const padding = 12; // Padding around the text inside the box
        const boxWidth = Math.max(priceTextMetrics.width, timeTextMetrics.width) + padding * 2;
        const boxHeight = 34; // Set height considering both lines of text with padding
        const borderRadius = 6;
        
        let textX = 0;
        let textY = 0;

        // p1과 p2의 null 체크 추가
        if (this._p1.x && this._p2.x && this._p1.y && this._p2.y) {
          textX = (this._p1.x + this._p2.x) / 2;
          textY = (this._p2.y) - 24
        }
        // Draw the background box behind the text
        ctx.fillStyle = this._options.lineColor; // Background color with some transparency
        // drawRoundedRect(ctx, textX - boxWidth / 2, textY - boxHeight / 2, boxWidth, boxHeight, borderRadius);
        ctx.fillRect(textX - boxWidth / 2, textY - boxHeight / 2, boxWidth, boxHeight);

        // Draw the time difference text
        ctx.fillStyle = "white"; // Text color
        ctx.textAlign = "center"; // 텍스트가 중심에 맞추어 그려지도록 설정
        ctx.textBaseline = "middle"; // 텍스트의 세로 기준을 중앙으로 설정
        
        // Draw the price difference text
        ctx.fillText(priceDifferenceText, textX, textY  - 8); // Draw price text below the time text
        ctx.fillText(timeDifferenceText, textX, textY +8); // Draw time text at the top line
      });
    });
  }
}

function convertSecondsToTime(totalSeconds: number) {
  // 전체 초에서 시간 계산
  const hours = Math.floor(totalSeconds / 3600);
  // 남은 초에서 분 계산
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  return `${hours}h ${minutes}m`;
}


// Function to draw a rounded rectangle
// function drawRoundedRect(ctx, x, y, width, height, radius) {
//   ctx.beginPath();
//   ctx.moveTo(x + radius, y);
//   ctx.lineTo(x + width - radius, y);
//   ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
//   ctx.lineTo(x + width, y + height - radius);
//   ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
//   ctx.lineTo(x + radius, y + height);
//   ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
//   ctx.lineTo(x, y + radius);
//   ctx.quadraticCurveTo(x, y, x + radius, y);
//   ctx.closePath();
//   ctx.fill();
// }