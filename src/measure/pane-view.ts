import { Measure, MeasureOptions } from "./measure";
import { MeasurePaneRenderer } from "./pane-renderer";
import {
  MeasureTwoPointDrawingPaneView,
  TwoPointDrawingPaneView,
} from "../drawing/pane-view";
import { Point } from "lightweight-charts";

export class BoxPaneView extends MeasureTwoPointDrawingPaneView {
  constructor(source: Measure) {
    super(source);
  }

  renderer() {
    return new MeasurePaneRenderer(
      this._p1,
      this._p2,
      this._source._options as MeasureOptions,
      this._source.hovered,
      this._source.points as (Point | null)[]
    );
  }
}
