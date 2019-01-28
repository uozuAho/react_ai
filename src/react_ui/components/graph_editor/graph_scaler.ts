import { GraphT } from 'src/ai_lib/structures/graphT';
import { Point2d } from 'src/ai_lib/structures/point2d';
import { IterUtils } from "../../../libs/array/iter_utils";
import { ScaleTranslateMatrix2d, IRect } from 'src/libs/matrix/scale_translate_matrix_2d';

export interface IBounds {
    x: number;
    y: number;
    width: number;
    height: number;
}

export class GraphScaler {
  public static rescaleToBounds(graph: GraphT<Point2d>, bounds: IBounds) {
    const nodes = graph.get_nodes();
    const nodeBounds = this.getNodeBounds(nodes);
    const affineMatrix = ScaleTranslateMatrix2d.fromRects(nodeBounds, bounds);
    for (const node of nodes) {
      const newCoords = affineMatrix.transform(node);
      node.x = newCoords.x;
      node.y = newCoords.y;
    }
  }

  private static getNodeBounds(nodes: Point2d[]): IBounds {
    const xvals = nodes.map(n => n.x);
    const yvals = nodes.map(n => n.y);

    const xmin = IterUtils.min(xvals);
    const xmax = IterUtils.max(xvals);
    const ymin = IterUtils.min(yvals);
    const ymax = IterUtils.max(yvals);

    return {
      x: xmin,
      y: ymin,
      width: xmax - xmin,
      height: ymax - ymin
    };
  }
}
