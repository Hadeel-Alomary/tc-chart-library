import {ChartPanel, IPoint} from '../..';

export class DrawingsHelper {

    public static getExtendedLineEndPoint(point1: IPoint, point2: IPoint, chartPanel: ChartPanel): IPoint {
        let deltaX = point2.x - point1.x;
        let deltaY = point2.y - point1.y;

        let x = point2.x;
        let y = point2.y;

        let panelFrame = chartPanel.contentFrame;

        if (deltaX < 0) {
            x = panelFrame.left;
        } else if (deltaX > 0) {
            x = panelFrame.right;
        }

        if (deltaX == 0) {
            if (deltaY > 0) {
                y = panelFrame.bottom;
            } else {
                y = panelFrame.top;
            }
        } else {
            y = (x - point2.x) / deltaX * deltaY + point2.y;

            if (y < panelFrame.top || y > panelFrame.bottom) {

                if (y > panelFrame.bottom) {
                    y = panelFrame.bottom;
                } else if (y < panelFrame.top) {
                    y = panelFrame.top;
                }

                if (deltaY !== 0) {
                    x = (y - point2.y) / deltaY * deltaX + point2.x;
                }
            }
        }
        return {x: x, y: y};
    }
}
