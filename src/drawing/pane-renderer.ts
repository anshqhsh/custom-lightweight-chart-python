import { ISeriesPrimitivePaneRenderer} from "lightweight-charts";
import { ViewPoint } from "./pane-view";
import { DrawingOptions } from "./options";
import { BitmapCoordinatesRenderingScope, CanvasRenderingTarget2D } from "fancy-canvas";
import { Point } from './data-source';

export abstract class DrawingPaneRenderer implements ISeriesPrimitivePaneRenderer {
    _options: DrawingOptions;

    constructor(options: DrawingOptions) {
        this._options = options;
    }

    abstract draw(target: CanvasRenderingTarget2D): void;

}

export abstract class TwoPointDrawingPaneRenderer extends DrawingPaneRenderer {
    _p1: ViewPoint;
    _p2: ViewPoint;
    protected _hovered: boolean;

    constructor(p1: ViewPoint, p2: ViewPoint, options: DrawingOptions, hovered: boolean) {
        super(options);
        this._p1 = p1;
        this._p2 = p2;
        this._hovered = hovered;
    }

    abstract draw(target: CanvasRenderingTarget2D): void;

    _getScaledCoordinates(scope: BitmapCoordinatesRenderingScope) {
        if (this._p1.x === null || this._p1.y === null ||
            this._p2.x === null || this._p2.y === null) return null;
        return {
            x1: Math.round(this._p1.x * scope.horizontalPixelRatio),
            y1: Math.round(this._p1.y * scope.verticalPixelRatio),
            x2: Math.round(this._p2.x * scope.horizontalPixelRatio),
            y2: Math.round(this._p2.y * scope.verticalPixelRatio),
        }
    }

    // _drawTextLabel(scope: BitmapCoordinatesRenderingScope, text: string, x: number, y: number, left: boolean) {
    //  scope.context.font = '24px Arial';
    //  scope.context.beginPath();
    //  const offset = 5 * scope.horizontalPixelRatio;
    //  const textWidth = scope.context.measureText(text);
    //  const leftAdjustment = left ? textWidth.width + offset * 4 : 0;
    //  scope.context.fillStyle = this._options.labelBackgroundColor;
    //  scope.context.roundRect(x + offset - leftAdjustment, y - 24, textWidth.width + offset * 2,  24 + offset, 5);
    //  scope.context.fill();
    //  scope.context.beginPath();
    //  scope.context.fillStyle = this._options.labelTextColor;
    //  scope.context.fillText(text, x + offset * 2 - leftAdjustment, y);
    // }

    _drawEndCircle(scope: BitmapCoordinatesRenderingScope, x: number, y: number) {
        const radius = 9
        scope.context.fillStyle = '#000';
        scope.context.beginPath();
        scope.context.arc(x, y, radius, 0, 2 * Math.PI);
        scope.context.stroke();
        scope.context.fill();
        // scope.context.strokeStyle = this._options.lineColor;
    }
}

export abstract class MeasureDrawingPaneRenderer implements ISeriesPrimitivePaneRenderer {
    _options: DrawingOptions;
    constructor(options: DrawingOptions) {
        this._options = options;
    }
    abstract draw(target: CanvasRenderingTarget2D): void;
}

export abstract class MesureExtendTwoPointDrawingPaneRenderer extends TwoPointDrawingPaneRenderer {
    _points: (Point | null)[];
    constructor(p1: ViewPoint, p2: ViewPoint, options: DrawingOptions, hovered: boolean, points: (Point | null)[]) {
        // 부모 클래스의 생성자를 호출하여 기본 설정을 초기화합니다.
        super(p1, p2, options, hovered);
        this._points = points;
    }
    // 필요한 경우 draw 메서드를 추가적으로 구현합니다.
    abstract draw(target: CanvasRenderingTarget2D): void;
    // 필요한 추가적인 메서드나 옵션은 여기에 작성합니다.
    // 예: points 관련 추가 로직 등
}
