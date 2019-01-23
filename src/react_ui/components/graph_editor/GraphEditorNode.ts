import * as SVG from 'svg.js';

/** Node used by graph editor. All public coordinates are SVG. */
export class GraphEditorNode {

    public constructor(private _svgNode: SVG.Circle) {}

    /** Get the x coordinate of the center of the node */
    public x(): number { return this._svgNode.cx(); }

    /** Get the y coordinate of the center of the node */
    public y(): number { return this._svgNode.cy(); }

    /** Add an event handler */
    public on(event: string, cb: (e: MouseEvent) => void) {
        this._svgNode.on(event, cb);
    }

    /** Center the node on the given coords */
    public setPos(x: number, y: number) {
        this._svgNode.center(x, y);
    }

    public setHighlighted(isHighlighted: boolean) {
        if (isHighlighted) {
            this._svgNode.addClass("highlight");
        } else {
            this._svgNode.removeClass("highlight");
        }
    }

    public setColor(color: string) {
        this._svgNode.fill(color);
    }
}
