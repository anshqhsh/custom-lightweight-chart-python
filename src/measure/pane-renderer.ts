import { ViewPoint } from "../drawing/pane-view";
import { CanvasRenderingTarget2D } from "fancy-canvas";
import { MesureExtendTwoPointDrawingPaneRenderer } from "../drawing/pane-renderer";
import { MeasureOptions } from "./measure";
import { setLineStyle } from "../helpers/canvas-rendering";
import { Point } from "lightweight-charts";

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

      if (!scaled) return;

      ctx.lineWidth = this._options.width;
      ctx.strokeStyle = this._options.subLineColor;
      setLineStyle(ctx, this._options.lineStyle);
      ctx.fillStyle = this._options.fillColor;

      const mainX = Math.min(scaled.x1, scaled.x2);
      const mainY = Math.min(scaled.y1, scaled.y2);
      const width = Math.abs(scaled.x1 - scaled.x2);
      const height = Math.abs(scaled.y1 - scaled.y2);

      // Draw the box
      ctx.strokeRect(mainX, mainY, width, height);
      ctx.fillRect(mainX, mainY, width, height);

      // Calculate the difference in X and Y
      //   const priceDifference = Math.abs(scaled.y1 - scaled.y2);
      //   const priceRatio = (scaled.y1 - scaled.y2) / scaled.y2;
      //   const timeDifference = Math.abs(scaled.x1 - scaled.x2);
      //   const percentageDifference = (
      //     (priceDifference / scaled.y1) *
      //     100
      //   ).toFixed(2);
      const priceDifference = points[1].price - points[0].price;
      const priceRatio = ((priceDifference / points[0].price) * 100).toFixed(2);
      const timeDifference = points[1].time - points[0].time;

      // Draw circles at the corners when hovered
      if (!this._hovered) return;

      // this._drawEndCircle(scope, mainX, mainY);
      // this._drawEndCircle(scope, mainX + width, mainY);
      // this._drawEndCircle(scope, mainX + width, mainY + height);
      // this._drawEndCircle(scope, mainX, mainY + height);

      target.useMediaCoordinateSpace(({ context: ctx, mediaSize }) => {
        ctx.font = "12px Arial"; // 폰트 설정
        ctx.fillStyle = "white";

        const text = "";
        const textMetrics = ctx.measureText(text);
        let textX = mediaSize.width / 2 - textMetrics.width / 2;
        let textY = mediaSize.height / 2;
        ctx.textAlign = "center"; // 텍스트가 중심에 맞추어 그려지도록 설정
        ctx.textBaseline = "middle"; // 텍스트의 세로 기준을 중앙으로 설정
        ctx.fillText(`${convertSecondsToTime(timeDifference)}`, textX, textY);

        // const textX =this._p1.x
        // const textY = this._p1.y
        textY -= 15; // 다음 텍스트 위치 조정
        ctx.fillText(
          `${priceDifference.toFixed(2)}(${priceRatio}%), ${Math.ceil(
            priceDifference
          )}`,
          textX,
          textY
        );
        textY -= 15; // 다음 텍스트 위치 조정
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
