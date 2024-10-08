import { LineStyle } from "lightweight-charts";


export interface DrawingOptions {
    lineColor: string;
    lineStyle: LineStyle
    width: number;
    subLineColor: string;
}

export const defaultOptions: DrawingOptions = {
    lineColor: '#1E80F0',
    lineStyle: LineStyle.Solid,
    width: 4,
    subLineColor: 'rgba(10, 128, 240, 0.2)',
};
